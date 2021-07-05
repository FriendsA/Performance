import { W } from '../constant/index';
import { store } from '../constant/index';
import { Priority } from '../types/index';

class ErrorTrack {
    constructor() {
        // TODO 穿参数分类控制
        if (!W || !W.addEventListener) {
            throw new Error("不支持错误捕获!");
        }
    }

    private globalError() {
        W.onerror = function (message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error) {
            let body = JSON.stringify({ message, source, lineno, colno })
            store.reportData?.sendToAnalytics(Priority.IDLE, body);
            return true;
        }
    }

    private networkError() {
        W.addEventListener("error", function (e: ErrorEvent) {
            if ((e.target as any) === W) {
                return;
            }
            let ele = (e.target as HTMLImageElement | HTMLScriptElement);
            let body = JSON.stringify({ url: ele.src, tag: ele.tagName, message: "资源加载错误" });
            store.reportData?.sendToAnalytics(Priority.IDLE, body);
        }, true)
    }

    private promiseError() {
        W.addEventListener("unhandledrejection", function (e: PromiseRejectionEvent) {
            let body = JSON.stringify({ message: e.reason });
            store.reportData?.sendToAnalytics(Priority.IDLE, body);
        })
    }

    run() {
        this.globalError();
        this.networkError();
        this.promiseError();
    }
}

export default ErrorTrack;