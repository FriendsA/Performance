import { PerformanceConfig, ObserveType, INavigatorInfo, IVitalsScore } from "../types";
import ReportData from "../data/ReportData";
import { WP, W, WN, store, visible } from '../constant/index';

export const validateOptions = (options: PerformanceConfig) => {
    if (!options.logUrl) {
        throw new Error("上报地址未填写");
    }

    store.reportData = new ReportData(options.logUrl);

    if (options.analyticsTracker && typeof options.analyticsTracker !== "function") {
        throw new Error("跟踪方法有误");
    }

    if (!options.analyticsTracker) {
        // TODO: 参数类型补充
        store.analyticsTracker = function (options: unknown) {
            console.log(options);
        }
    } else {
        store.analyticsTracker = options.analyticsTracker;
    }

    store.isResourceTiming = options.isResourceTiming || false;
    store.isResourceTiming = options.isPerformance || false;
    store.captureError = options.captureError || false;
}

export const isPerformanceSupporte = () => {
    return WP && !!WP.getEntriesByType && !!WP.now && !!WP.mark;
}

// 是否支持 PerformanceObserver
export const isPerformanceObserverSupporte = () => {
    return W && !!W.PerformanceObserver
}

/**  
 * 尝试使用requestIdleCallback
 */
const useIdleHandle = (fn: () => any) => {
    if (W && Reflect.has(W, "requestidlecallback")) {
        requestIdleCallback(fn, { timeout: 3000 })
    } else {
        fn();
    }
}

/**
 * 自定义方法处理指标结论
 * @param duration 指标时间
 * @param measureName 指标名称
 */
export const LogConsole = (duration: number, measureName: string, customProperties?: object) => {
    duration = parseFloat(duration.toFixed(2));
    if (duration >= 0) {
        useIdleHandle(() => {
            if (visible.isHidden && !measureName.endsWith("Final") || !store.analyticsTracker) {
                return;
            }
            store.analyticsTracker({ measureName, data: duration, navigatorInformation: getNavigatorInfo(), vitalsScore: getVitalsScore(measureName, duration) });
        })
    }
}

export const LogObjectData = (measureName: string, customProperties?: object) => {
    useIdleHandle(() => {
        if (visible.isHidden && !measureName.endsWith("Final") || !store.analyticsTracker) {
            return;
        }
        store.analyticsTracker({ measureName, data: customProperties, navigatorInformation: getNavigatorInfo(), vitalsScore: null });
    })
}

/**
 * 内存多大
 */
const getDM = () => (WN as any)?.deviceMemory ?? 0;
/**
 * 处理器多少核
 */
const getHC = () => (WN as any)?.hardwareConcurrency ?? 0;

/**
 * 是否为低性能设备
 */
const getIsLowEndDevice = () => {
    if (getHC() && getHC() < 4) {
        return true;
    }
    if (getDM() && getDM() < 4) {
        return true;
    }
    return false;
}

/**
 * 网速是否差
 */
const getIsLowEndExperience = () => {
    let net = WN && (WN as any)?.connection?.effectiveType;
    return net ? net !== "4g" : false;
}

const getNavigatorInfo = (): INavigatorInfo => {
    if (WN) {
        return {
            deviceMemory: getHC(),
            hardwareConcurrency: getDM(),
            isLowEndDevice: getIsLowEndDevice(),
            isLowEndExperience: getIsLowEndExperience(),
        }
    }
    return {};
}

// chorme 指标分数
const fcpScore = [1000, 2500];
const lcpScore = [2500, 4000];
const fidcore = [100, 300];
const clsScore = [0.1, 0.25];
const tbtScore = [300, 600];

const webVitalsScore: Record<string, number[]> = {
    FP: fcpScore,
    FCP: fcpScore,
    LCP: lcpScore,
    FID: fidcore,
    CLS: clsScore,
    TBT5S: tbtScore,
};

const getVitalsScore = (measureName: string, value: number): IVitalsScore => {
    if (!webVitalsScore[measureName]) {
        return null;
    }
    if (value <= webVitalsScore[measureName][0]) {
        return "good";
    }
    return value >= webVitalsScore[measureName][1] ? "poor" : "needsImprovement";
}

const afterLoad = (callback: () => void) => {
    if (document.readyState === 'complete') {
        setTimeout(callback, 0);
    } else {
        addEventListener('pageshow', callback);
    }
}

export const getNavigationTiming = () => {
    if (!isPerformanceSupporte()) {
        return;
    }

    afterLoad(() => {
        let pnt = WP.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (!pnt) {
            return;
        }
        let data = {
            requestTotalTime: pnt.responseEnd - pnt.requestStart,
            downloadTime: pnt.responseEnd - pnt.responseStart,
            timeToFirstByte: pnt.responseStart - pnt.startTime || 0,
            dnsLookupTime: pnt.domainLookupEnd - pnt.domainLookupStart,
            tcpTime: pnt.connectEnd - pnt.connectStart,
            domTime: pnt.domContentLoadedEventEnd - pnt.domContentLoadedEventStart,
            loadTime: pnt.loadEventEnd - pnt.startTime || 0,
            parseDOMTime: pnt.domComplete - pnt.domInteractive || 0,
        }
        LogObjectData("Navigation指标", data);
    })
}

export const getNetworkInformation = () => {
    if (WN && Reflect.has(WN, 'connection')) {
        let { effectiveType, rtt, saveData, downlink } = (WN as any)['connection'];
        LogObjectData("网络信息", { effectiveType, rtt, saveData, downlink })
    }
}