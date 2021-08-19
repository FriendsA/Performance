import { PerformanceStore } from "../types";

export const W = window;
export const D = document;
export const WP = window.performance;
export const WN = window.navigator;

// 全局的参数数据
export const store: PerformanceStore = {
    reportData: null,
    isResourceTiming: false,
    captureError: false,
    isPerformance: false,
}

// 标签栏是否隐藏
export const visible = {
    isHidden: false,
}

// 全局的指标数据
export const RData = {
    FP: 0, // First Paint
    FCP: 0, // First Contentful Paint
    FID: 0, // First input delay
    LCP: 0, 
    CLS: 0,
    TBT:0, // Total Block Time
    RD: Object.create(null),// resouce data
}