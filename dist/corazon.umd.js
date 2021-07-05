!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e||self).performance={})}(this,function(e){var t,n;!function(e){e[e.URGENT=2]="URGENT",e[e.IDLE=1]="IDLE"}(t||(t={})),function(e){e.PAINT="paint",e.FIRST_INPUT="first-input",e.LARGEST_CONTENTFUL_PAINT="largest-contentful-paint",e.RESOURCE="resource",e.LONGTASK="longtask",e.LAYOUT_SHIFT="layout-shift",e.ELEMENT="element",e.FIRST_PAINT="first-paint",e.FIRST_CONTENTFUL_PAINT="first-contentful-paint"}(n||(n={}));var r=window,o=document,i=window.performance,a=window.navigator,c={reportData:null,maxMeasureTime:15e3,isResourceTiming:!1,captureError:!1},s={isHidden:!1},u={FP:0,FCP:0,FID:0,LCP:0,CLS:0,TBT:0,RD:Object.create(null)},l=function(){function e(e){if(this.reportUrl=void 0,!e)throw new Error("上报地址不能为空");this.reportUrl=e}return e.prototype.sendToAnalytics=function(e,n){if(e===t.URGENT)if(fetch)fetch(this.reportUrl,{body:n,method:"POST",keepalive:!0}).catch(function(e){});else{var r=new XMLHttpRequest;r.open("POST",this.reportUrl,!0),r.setRequestHeader("Content-Type","application/json"),r.send(n),r.onerror=function(e){},r=null}else if(e===t.IDLE)if(a.sendBeacon)a.sendBeacon(this.reportUrl,n);else{var o=new Image;o.src=this.reportUrl+"?body="+n,o.onload=function(){o=null},o.onerror=function(e){}}},e}(),f=function(){return i&&!!i.getEntriesByType&&!!i.now&&!!i.mark},d=function(e){r&&Reflect.has(r,"requestidlecallback")?requestIdleCallback(e,{timeout:3e3}):e()},T=function(e,t,n){e=parseFloat(e.toFixed(2)),c.maxMeasureTime&&e<=c.maxMeasureTime||e>=0&&d(function(){s.isHidden&&!t.endsWith("Final")||!c.analyticsTracker||c.analyticsTracker({measureName:t,data:e,navigatorInformation:y(),vitalsScore:g(t,e)})})},m=function(e,t){d(function(){s.isHidden&&!e.endsWith("Final")||!c.analyticsTracker||c.analyticsTracker({measureName:e,data:t,navigatorInformation:y(),vitalsScore:null})})},p=function(){var e;return null!=(e=null==a?void 0:a.deviceMemory)?e:0},v=function(){var e;return null!=(e=a.hardwareConcurrency)?e:0},y=function(){return a?{deviceMemory:v(),hardwareConcurrency:p(),isLowEndDevice:!!(v()&&v()<4)||!!(p()&&p()<4),isLowEndExperience:(t=a&&(null==a||null==(e=a.connection)?void 0:e.effectiveType),!!t&&"4g"!==t)}:{};var e,t},E=[1e3,2500],h={FP:E,FCP:E,LCP:[2500,4e3],FID:[100,300],CLS:[.1,.25],TBT5S:[300,600]},g=function(e,t){return h[e]?t<=h[e][0]?"good":t>=h[e][1]?"poor":"needsImprovement":null},S=function(){function e(){if(!r||!r.addEventListener)throw new Error("不支持错误捕获!")}var n=e.prototype;return n.globalError=function(){r.onerror=function(e,n,r,o,i){var a,s=JSON.stringify({message:e,source:n,lineno:r,colno:o});return null==(a=c.reportData)||a.sendToAnalytics(t.IDLE,s),!0}},n.networkError=function(){r.addEventListener("error",function(e){var n;if(e.target!==r){var o=e.target,i=JSON.stringify({url:o.src,tag:o.tagName,message:"资源加载错误"});null==(n=c.reportData)||n.sendToAnalytics(t.IDLE,i)}},!0)},n.promiseError=function(){r.addEventListener("unhandledrejection",function(e){var n,r=JSON.stringify({message:e.reason});null==(n=c.reportData)||n.sendToAnalytics(t.IDLE,r)})},n.run=function(){this.globalError(),this.networkError(),this.promiseError()},e}();function I(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function L(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return I(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?I(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var w=Object.create(null),F=function(e,t){try{var n=new PerformanceObserver(function(e){t(e.getEntries())});return n.observe({type:e,buffered:!0}),n}catch(e){return null}},N=function(e){w[e]&&w[e].disconnect(),Reflect.deleteProperty(w,e)},b=function(e){e.forEach(function(e){e.name===n.FIRST_PAINT?(T(e.startTime,"FP"),u.FP=e.startTime):e.name===n.FIRST_CONTENTFUL_PAINT&&(T(e.startTime,"FCP"),u.FCP=e.startTime,F(n.LONGTASK,C),N(0))})},C=function(e){e.forEach(function(e){if(!("self"!==e.name||e.startTime<u.FCP)){var t=e.duration-50;t&&(u.TBT+=t)}})},P=function(e){var t=e.pop();t&&(T(t.processingStart-t.startTime,"FID"),u.FID=t.processingStart-t.startTime),N(1),u.TBT=0,setTimeout(function(){T(u.TBT,"TBT5S")},5e3)},R=function(e){var t=e.pop();t&&(u.LCP=t.renderTime,T(t.renderTime,"LCP"))},A=function(e){var t=new Map,n=u.RD;e.forEach(function(e){if(n[e.name]=e,t.has(e.initiatorType)){var r=t.get(e.initiatorType);t.set(e.initiatorType,r+e.decodedBodySize)}else t.set(e.initiatorType,e.decodedBodySize)});for(var r,o=Object.create(null),i=L(t);!(r=i()).done;){var a=r.value,c=a[0],s=a[1];n[c]=s,o[c]=s}m("Resource",o)},O=0,U=0,k=[],D=function(e){for(var t,n=L(e);!(t=n()).done;){var r=t.value;r.hadRecentInput||(U&&r.startTime-k[k.length-1].startTime<1e3&&r.startTime-k[0].startTime<5e3?(U+=r.value,k.push(r)):(U=r.value,k=[r]),U>O&&(u.CLS=O=U,T(u.CLS,"CLS")))}},_=function(e){if(this.v="1.0.0",function(e){if(!e.logUrl)throw new Error("上报地址未填写");if(c.reportData=new l(e.logUrl),e.analyticsTracker&&"function"!=typeof e.analyticsTracker)throw new Error("跟踪方法有误");c.analyticsTracker=e.analyticsTracker?e.analyticsTracker:function(e){console.log(e)},c.isResourceTiming=e.isResourceTiming,c.captureError=e.captureError,c.maxMeasureTime=e.maxMeasureTime}(e),e.captureError){var t=new S;t&&t.run()}var u;f()&&(r&&r.PerformanceObserver&&(w[0]=F(n.PAINT,b),w[1]=F(n.FIRST_INPUT,P),w[2]=F(n.LARGEST_CONTENTFUL_PAINT,R),c.isResourceTiming&&F(n.RESOURCE,A),w[3]=F(n.LAYOUT_SHIFT,D)),void 0!==typeof o.hidden&&o.addEventListener("visibilitychange",function(){o.hidden&&(w[2]&&N(2),w[3]&&N(3),w[4]&&N(4),s.isHidden=o.hidden)}),f()&&(u=function(){var e=i.getEntriesByType("navigation")[0];if(e){var t=e.responseStart,n=e.responseEnd;m("网站指标",{totalTime:n-e.requestStart,downloadTime:n-t,timeToFirstByte:t-e.requestStart,dnsLookupTime:e.domainLookupEnd-e.domainLookupStart||0,tcpTime:e.connectEnd-e.connectStart||0,whiteTime:t-e.startTime||0,domTime:e.domContentLoadedEventEnd-e.startTime||0,loadTime:e.loadEventEnd-e.startTime||0,parseDOMTime:e.domComplete-e.domInteractive||0})}},"complete"===document.readyState?setTimeout(u,0):addEventListener("pageshow",u)),function(){if(a&&Reflect.has(a,"connection")){var e=a.connection;m("网络信息",{effectiveType:e.effectiveType,rtt:e.rtt,saveData:e.saveData,downlink:e.downlink})}}())};e.Corazon=_,e.default=_});
//# sourceMappingURL=corazon.umd.js.map