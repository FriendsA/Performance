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
        /** 不支持性能监控API 或 不监控 */
        if (!isPerformanceSupporte() || !options.isPerformance) {
            return;
        }
        /** observe的指标 */
        if (isPerformanceObserverSupporte()) {
            execPerformance();
        }
        /** 标签页隐藏注销监听 */
        if (typeof D.hidden !== undefined) {
            D.addEventListener('visibilitychange', () => {
                if (D.hidden) {
                    removeObserver();
                    visible.isHidden = D.hidden;
                }
            })
        }
        /** 获取 navigation指标 */
        getNavigationTiming();
        /** 获取 网络信息 */
        getNetworkInformation();
    }
}

export default Corazon;
