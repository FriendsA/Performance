import ReportData from "../data/ReportData";
/**
 * options 配置对象
 */
export interface PerformanceConfig {
    logUrl: string;
    analyticsTracker?: (data: IAnalyticsTrackerOptions) => void;
    isResourceTiming?: boolean;
    captureError?: boolean;
    isPerformance?: boolean;
}
export interface PerformanceStore {
    reportData: ReportData | null;
    isPerformance?: boolean;
    analyticsTracker?: (data: IAnalyticsTrackerOptions) => void;
    isResourceTiming?: boolean;
    captureError?: boolean;
}
/**
 * 优先级
 */
export declare enum Priority {
    URGENT = 2,
    IDLE = 1
}
export interface IReportData {
    sendToAnalytics(level: Priority, body: string): void;
}
/**
 * 性能指标参数
 */
export declare type IPerformanceObserverType = 'first-input' | 'largest-contentful-paint' | 'layout-shift' | 'longtask' | 'measure' | 'navigation' | 'paint' | 'element' | 'resource' | 'longtask';
export declare enum ObserveType {
    PAINT = "paint",
    FIRST_INPUT = "first-input",
    LARGEST_CONTENTFUL_PAINT = "largest-contentful-paint",
    RESOURCE = "resource",
    LONGTASK = "longtask",
    LAYOUT_SHIFT = "layout-shift",
    ELEMENT = "element",
    FIRST_PAINT = "first-paint",
    FIRST_CONTENTFUL_PAINT = "first-contentful-paint"
}
export interface INavigatorInfo {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    isLowEndDevice?: boolean;
    isLowEndExperience?: boolean;
    serviceWorkerStatus?: 'controlled' | 'supported' | 'unsupported';
}
export declare type IVitalsScore = 'good' | 'needsImprovement' | 'poor' | null;
export interface IAnalyticsTrackerOptions {
    measureName: string;
    data: any;
    navigatorInformation: INavigatorInfo;
    vitalsScore: IVitalsScore;
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
//# sourceMappingURL=index.d.ts.map