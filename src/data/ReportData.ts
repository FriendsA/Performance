import { IReportData, Priority } from "../types";
import { WN } from '../constant/index';

class ReportData implements IReportData {
    private reportUrl: string;
    constructor(url: string) {
        if (!url) {
            throw new Error("上报地址不能为空");
        }
        this.reportUrl = url;
    }

    sendToAnalytics(level: Priority, body: string) {
        if (level === Priority.URGENT) {
            if (!!fetch) {
                fetch(this.reportUrl, { body, method: 'POST', keepalive: true }).catch(reason=>{
                    // 上报出错
                });
            } else {
                let xhr: XMLHttpRequest | null = new XMLHttpRequest();
                xhr.open('POST', this.reportUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(body);
                xhr.onerror = function (e) {
                    // 上报出错
                }
                xhr = null;
            }
        } else if (level === Priority.IDLE) {
            if (!!WN.sendBeacon) {
                WN.sendBeacon(this.reportUrl, body);
            } else {
                let img: HTMLImageElement | null = new Image();
                img.src = `${this.reportUrl}?body=${body}`;
                img.onload = function () {
                    img = null;
                }
                img.onerror = function (e) {
                    // 上报出错
                }
            }
        }
    }
}

export default ReportData;