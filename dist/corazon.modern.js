var e,t;!function(e){e[e.URGENT=2]="URGENT",e[e.IDLE=1]="IDLE"}(e||(e={})),function(e){e.PAINT="paint",e.FIRST_INPUT="first-input",e.LARGEST_CONTENTFUL_PAINT="largest-contentful-paint",e.RESOURCE="resource",e.LONGTASK="longtask",e.LAYOUT_SHIFT="layout-shift",e.ELEMENT="element",e.FIRST_PAINT="first-paint",e.FIRST_CONTENTFUL_PAINT="first-contentful-paint"}(t||(t={}));const r=window,n=document,o=window.performance,i=window.navigator,a={reportData:null,isResourceTiming:!1,captureError:!1,isPerformance:!1},s={isHidden:!1},c={FP:0,FCP:0,FID:0,LCP:0,CLS:0,TBT:0,RD:Object.create(null)};class l{constructor(e){if(this.reportUrl=void 0,!e)throw new Error("上报地址不能为空");this.reportUrl=e}sendToAnalytics(t,r){if(t===e.URGENT)if(fetch)fetch(this.reportUrl,{body:r,method:"POST",keepalive:!0}).catch(e=>{});else{let e=new XMLHttpRequest;e.open("POST",this.reportUrl,!0),e.setRequestHeader("Content-Type","application/json"),e.send(r),e.onerror=function(e){},e=null}else if(t===e.IDLE)if(i.sendBeacon)i.sendBeacon(this.reportUrl,r);else{let e=new Image;e.src=`${this.reportUrl}?body=${r}`,e.onload=function(){e=null},e.onerror=function(e){}}}}const d=()=>o&&!!o.getEntriesByType&&!!o.now&&!!o.mark,T=e=>{r&&Reflect.has(r,"requestidlecallback")?requestIdleCallback(e,{timeout:3e3}):e()},u=(e,t,r)=>{(e=parseFloat(e.toFixed(2)))>=0&&T(()=>{s.isHidden&&!t.endsWith("Final")||!a.analyticsTracker||a.analyticsTracker({measureName:t,data:e,navigatorInformation:v(),vitalsScore:h(t,e)})})},m=(e,t)=>{T(()=>{s.isHidden&&!e.endsWith("Final")||!a.analyticsTracker||a.analyticsTracker({measureName:e,data:t,navigatorInformation:v(),vitalsScore:null})})},p=()=>{var e;return null!=(e=null==i?void 0:i.deviceMemory)?e:0},f=()=>{var e;return null!=(e=null==i?void 0:i.hardwareConcurrency)?e:0},E=()=>{var e;let t=i&&(null==i||null==(e=i.connection)?void 0:e.effectiveType);return!!t&&"4g"!==t},v=()=>i?{deviceMemory:f(),hardwareConcurrency:p(),isLowEndDevice:!!(f()&&f()<4)||!!(p()&&p()<4),isLowEndExperience:E()}:{},y=[1e3,2500],g={FP:y,FCP:y,LCP:[2500,4e3],FID:[100,300],CLS:[.1,.25],TBT5S:[300,600]},h=(e,t)=>g[e]?t<=g[e][0]?"good":t>=g[e][1]?"poor":"needsImprovement":null;class L{constructor(){if(!r||!r.addEventListener)throw new Error("不支持错误捕获!")}globalError(){r.onerror=function(t,r,n,o,i){var s;let c=JSON.stringify({message:t,source:r,lineno:n,colno:o});return null==(s=a.reportData)||s.sendToAnalytics(e.IDLE,c),!0}}networkError(){r.addEventListener("error",function(t){var n;if(t.target===r)return;let o=t.target,i=JSON.stringify({url:o.src,tag:o.tagName,message:"资源加载错误"});null==(n=a.reportData)||n.sendToAnalytics(e.IDLE,i)},!0)}promiseError(){r.addEventListener("unhandledrejection",function(t){var r;let n=JSON.stringify({message:t.reason});null==(r=a.reportData)||r.sendToAnalytics(e.IDLE,n)})}run(){this.globalError(),this.networkError(),this.promiseError()}}const S=Object.create(null),I=(e,t)=>{try{const r=new PerformanceObserver(e=>{t(e.getEntries())});return r.observe({type:e,buffered:!0}),r}catch(e){return e}},w=e=>{S[e]&&S[e].disconnect(),Reflect.deleteProperty(S,e)},N=e=>{e.forEach(e=>{e.name===t.FIRST_PAINT?(u(e.startTime,"FP"),c.FP=e.startTime):e.name===t.FIRST_CONTENTFUL_PAINT&&(u(e.startTime,"FCP"),c.FCP=e.startTime,I(t.LONGTASK,P),w(0))})},P=e=>{e.forEach(e=>{if("self"!==e.name||e.startTime<c.FCP)return;let t=e.duration-50;t&&(c.TBT+=t)})},F=e=>{let t=e.pop();t&&(u(t.processingStart-t.startTime,"FID"),c.FID=t.processingStart-t.startTime),w(1),c.TBT=0,setTimeout(()=>{u(c.TBT,"TBT5S")},5e3)},R=e=>{let t=e.pop();t&&(c.LCP=t.renderTime,u(t.renderTime,"LCP"))},C=e=>{let t=new Map,r=c.RD;e.forEach(e=>{if(r[e.name]=e,t.has(e.initiatorType)){let r=t.get(e.initiatorType);t.set(e.initiatorType,r+e.decodedBodySize)}else t.set(e.initiatorType,e.decodedBodySize)});let n=Object.create(null);for(let[e,o]of t)r[e]=o,n[e]=o;m("Resource",n)};let k=0,D=0,O=[];const U=e=>{for(let t of e)if(!t.hadRecentInput){const e=O[0],r=O[O.length-1];D&&t.startTime-r.startTime<1e3&&t.startTime-e.startTime<5e3?(D+=t.value,O.push(t)):(D=t.value,O=[t]),D>k&&(k=D,c.CLS=k,u(c.CLS,"CLS"))}};class A{constructor(e){if(this.v="1.0.0",(e=>{if(!e.logUrl)throw new Error("上报地址未填写");if(a.reportData=new l(e.logUrl),e.analyticsTracker&&"function"!=typeof e.analyticsTracker)throw new Error("跟踪方法有误");a.analyticsTracker=e.analyticsTracker?e.analyticsTracker:function(e){console.log(e)},a.isResourceTiming=e.isResourceTiming||!1,a.isResourceTiming=e.isPerformance||!1,a.captureError=e.captureError||!1})(e),e.captureError){const e=new L;e&&e.run()}var c;d()&&e.isPerformance&&(r&&r.PerformanceObserver&&(S[0]=I(t.PAINT,N),S[1]=I(t.FIRST_INPUT,F),S[2]=I(t.LARGEST_CONTENTFUL_PAINT,R),a.isResourceTiming&&I(t.RESOURCE,C),S[3]=I(t.LAYOUT_SHIFT,U)),void 0!==typeof n.hidden&&n.addEventListener("visibilitychange",()=>{n.hidden&&(S[2]&&w(2),S[3]&&w(3),S[4]&&w(4),s.isHidden=n.hidden)}),d()&&(c=()=>{let e=o.getEntriesByType("navigation")[0];e&&m("Navigation指标",{requestTotalTime:e.responseEnd-e.requestStart,downloadTime:e.responseEnd-e.responseStart,timeToFirstByte:e.responseStart-e.startTime||0,dnsLookupTime:e.domainLookupEnd-e.domainLookupStart,tcpTime:e.connectEnd-e.connectStart,domTime:e.domContentLoadedEventEnd-e.domContentLoadedEventStart,loadTime:e.loadEventEnd-e.startTime||0,parseDOMTime:e.domComplete-e.domInteractive||0})},"complete"===document.readyState?setTimeout(c,0):addEventListener("pageshow",c)),(()=>{if(i&&Reflect.has(i,"connection")){let{effectiveType:e,rtt:t,saveData:r,downlink:n}=i.connection;m("网络信息",{effectiveType:e,rtt:t,saveData:r,downlink:n})}})())}}export{A as Corazon,A as default};
//# sourceMappingURL=corazon.modern.js.map
