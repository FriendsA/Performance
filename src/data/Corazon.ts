import { PerformanceConfig } from "../types/index";
import { validateOptions, isPerformanceSupporte, isPerformanceObserverSupporte, getNavigationTiming, getNetworkInformation } from '../tools/index';
import ErrorTrack from './ErrorTrack';
import { execPerformance, removeObserver } from './performance';
import { D, visible } from "../constant";

class Corazon {
    private v = '1.0.0';
    constructor(options: PerformanceConfig) {
        validateOptions(options);
        if (options.captureError) {
            const errorTrack = new ErrorTrack();
            errorTrack && errorTrack.run();
        }
        if (!isPerformanceSupporte()) {
            // 不支持性能监控API
            return;
        }
        if (isPerformanceObserverSupporte()) {
            execPerformance();
        }
        //标签页隐藏注销监听
        if (typeof D.hidden !== undefined) {
            D.addEventListener('visibilitychange', () => {
                if (D.hidden) {
                    removeObserver();
                    visible.isHidden = D.hidden;
                }
            })
        }
        // 获取 navigation Timing 网络加载时间,白屏时间，DNS解析等指标
        getNavigationTiming();
        // 获取 网络信息
        getNetworkInformation();
    }
}

export default Corazon;
