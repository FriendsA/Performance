import ReportData from "../data/ReportData";

/**
 * options 配置对象
 */
export interface PerformanceConfig {
    logUrl: string; // 上报地址
    analyticsTracker?: (data: IAnalyticsTrackerOptions) => void; // 自定义报告指标的方法
    isResourceTiming?: boolean; // 是否追踪资源加载数据
    captureError?: boolean; // 是否开启错误跟踪
    maxMeasureTime?: number; // 自定义捕获的最大指标时间
}

export interface PerformanceStore {

    reportData: ReportData | null,
    maxMeasureTime?: number; // 默认15000
    analyticsTracker?: (data: IAnalyticsTrackerOptions) => void; //追踪可以执行的方法
    isResourceTiming?: boolean; // 是否追踪资源加载数据
    captureError?: boolean; // 是否开启错误跟踪
}

/**
 * 优先级
 */
export enum Priority {
    URGENT = 2,
    IDLE = 1,
}

export interface IReportData {
    sendToAnalytics(level: Priority, body: string): void,
}

/**
 * 性能指标参数
 */
export type IPerformanceObserverType = 'first-input' | 'largest-contentful-paint' | 'layout-shift' | 'longtask' | 'measure' | 'navigation' | 'paint' | 'element' | 'resource' | 'longtask';


export enum ObserveType {
    PAINT = 'paint',
    FIRST_INPUT = 'first-input',
    LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint',
    RESOURCE = 'resource',
    LONGTASK = 'longtask',
    LAYOUT_SHIFT = 'layout-shift',
    ELEMENT = 'element',

    FIRST_PAINT = 'first-paint',
    FIRST_CONTENTFUL_PAINT = 'first-contentful-paint',
}

export interface INavigatorInfo {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    isLowEndDevice?: boolean;
    isLowEndExperience?: boolean;
    serviceWorkerStatus?: 'controlled' | 'supported' | 'unsupported';
}

export type IVitalsScore = 'good' | 'needsImprovement' | 'poor' | null;

export interface IAnalyticsTrackerOptions {
    measureName: string;
    data: any;  // TODO
    navigatorInformation: INavigatorInfo,
    vitalsScore: IVitalsScore,
}

export interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: DOMHighResTimeStamp;
    processingEnd: DOMHighResTimeStamp;
    target?: Node;
}

export interface LargestContentfulPaint extends PerformanceEntry {
    renderTime: DOMHighResTimeStamp;
}

export interface CumulativeLayoutShift extends PerformanceEntry {
    hadRecentInput: boolean;
    value: number;
}