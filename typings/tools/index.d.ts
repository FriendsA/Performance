import { PerformanceConfig } from "../types";
export declare const validateOptions: (options: PerformanceConfig) => void;
export declare const isPerformanceSupporte: () => boolean;
export declare const isPerformanceObserverSupporte: () => boolean;
/**
 * 自定义方法处理指标结论
 * @param duration 指标时间
 * @param measureName 指标名称
 */
export declare const LogConsole: (duration: number, measureName: string, customProperties?: object | undefined) => void;
export declare const LogObjectData: (measureName: string, customProperties?: object | undefined) => void;
export declare const getNavigationTiming: () => void;
export declare const getNetworkInformation: () => void;
//# sourceMappingURL=index.d.ts.map