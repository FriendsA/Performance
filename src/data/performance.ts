import { LogConsole, LogObjectData } from "../tools";
import { CumulativeLayoutShift, IPerformanceObserverType, LargestContentfulPaint, PerformanceEventTiming } from "../types";
import { ObserveType } from '../types/index';
import { RData, store } from '../constant/index';

export const performObserverList = Object.create(null);

const observeHandle = (eventType: IPerformanceObserverType, callback: (performanceEntries: any[]) => void): PerformanceObserver | null => {
    try {
        const perforObserver = new PerformanceObserver((entryList) => {
            callback(entryList.getEntries());
        })
        // buffered: A flag to indicate whether buffered entries should be queued into observer's buffer.
        perforObserver.observe({ type: eventType, buffered: true }); 
        return perforObserver;
    } catch (e) {
        // 报错
        return e;
    }
}

const disObserveHandle = (index: number) => {
    if (performObserverList[index]) {
        performObserverList[index].disconnect();
    }
    Reflect.deleteProperty(performObserverList, index);
}

const paintCallback = (performanceEntries: PerformanceEntry[]) => {
    performanceEntries.forEach((p) => {
        if (p.name === ObserveType.FIRST_PAINT) {
            LogConsole(p.startTime, "FP");
            RData.FP = p.startTime;
        } else if (p.name === ObserveType.FIRST_CONTENTFUL_PAINT) {
            LogConsole(p.startTime, "FCP");
            RData.FCP = p.startTime;
            // 监听长任务，计算阻塞时常
            observeHandle(ObserveType.LONGTASK, longTastCallback);
            disObserveHandle(0);
        }
    })
}

const longTastCallback = (performanceEntries: PerformanceEntry[]) => {
    performanceEntries.forEach(p => {
        // 非本浏览器上下文或首绘内容之前的不统计 https://w3c.github.io/longtasks/
        if (p.name !== "self" || p.startTime < RData.FCP) {
            return;
        }
        let tbt = p.duration - 50;
        if (tbt) {
            RData.TBT += tbt;
        }
    })
}

const firstInputCallback = (performanceEventTiming: PerformanceEventTiming[]) => {
    let last = performanceEventTiming.pop();
    if (last) {
        LogConsole(last.processingStart - last.startTime, "FID");
        RData.FID = last.processingStart - last.startTime;
    }
    disObserveHandle(1);
    // 计算FID后5s的TBT
    RData.TBT = 0;
    setTimeout(() => {
        LogConsole(RData.TBT, "TBT5S");
    }, 5000);
}

const lastContentfulPaintCallback = (entryList: LargestContentfulPaint[]) => {
    let entry = entryList.pop();
    if (entry) {
        RData.LCP = entry.renderTime;
        LogConsole(entry.renderTime, "LCP");
    }
}

const resourceCallback = (performanceResources: PerformanceResourceTiming[]) => {
    let map = new Map();
    let total = RData.RD;
    performanceResources.forEach(r => {
        total[r.name] = r;
        if (map.has(r.initiatorType)) {
            let n = map.get(r.initiatorType);
            map.set(r.initiatorType, n + r.decodedBodySize);
        } else {
            map.set(r.initiatorType, r.decodedBodySize);
        }
    })
    let once = Object.create(null);
    for (let [key, value] of map) {
        total[key] = value;
        once[key] = value;
    }
    LogObjectData("Resource", once)
}

let clsValue = 0;
let clsEntries: CumulativeLayoutShift[] = [];
let sessionValue = 0;
let sessionEntries: CumulativeLayoutShift[] = [];
const layoutshiftCallback = (performanceEntries: CumulativeLayoutShift[]) => {
    for (let p of performanceEntries) {
        if (!p.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
            if (sessionValue &&
                p.startTime - lastSessionEntry.startTime < 1000 &&
                p.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += p.value;
                sessionEntries.push(p);
            } else {
                sessionValue = p.value;
                sessionEntries = [p];
            }
            if (sessionValue > clsValue) {
                clsValue = sessionValue;
                clsEntries = sessionEntries;
                RData.CLS = clsValue;
                LogConsole(RData.CLS,"CLS");
            }
        }
    }
}

//获取性能指标
export const execPerformance = () => {
    performObserverList[0] = observeHandle(ObserveType.PAINT, paintCallback);
    performObserverList[1] = observeHandle(ObserveType.FIRST_INPUT, firstInputCallback);
    performObserverList[2] = observeHandle(ObserveType.LARGEST_CONTENTFUL_PAINT, lastContentfulPaintCallback);
    if (store.isResourceTiming) {
        observeHandle(ObserveType.RESOURCE, resourceCallback);
    }
    performObserverList[3] = observeHandle(ObserveType.LAYOUT_SHIFT, layoutshiftCallback);
}

export const removeObserver = () => {
    if (performObserverList[2]) {
        // LogConsole(0, "LCPFINAL");
        disObserveHandle(2);
    }
    if (performObserverList[3]) {
        // LogConsole(0, "CLSFINAL");
        disObserveHandle(3);
    }
    if (performObserverList[4]) {
        // LogConsole(0, "TBTFINAL");
        disObserveHandle(4);
    }
}