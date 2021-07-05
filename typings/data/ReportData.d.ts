import { IReportData, Priority } from "../types";
declare class ReportData implements IReportData {
    private reportUrl;
    constructor(url: string);
    sendToAnalytics(level: Priority, body: string): void;
}
export default ReportData;
//# sourceMappingURL=ReportData.d.ts.map