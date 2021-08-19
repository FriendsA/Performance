# Corazon #

一个集错误监控上报、web性能指标收集的库

## 错误监控

1. 监听onerror、error捕获一般错误和网络资源请求错误,监听unhandledrejection异步请求未处理的错误。
2. 从`fetch`、`xhr`、`sendBeacon`、`img`中选择可用的方式上报。
## web性能指标

### 监控指标
1. [first paint (FP)](https://developer.mozilla.org/en-US/docs/Glossary/First_paint)
2. [first contentful paint (FCP)](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)
3. [first input delay (FID)](https://developer.mozilla.org/en-US/docs/Glossary/First_input_delay)
4. [largest contentful paint (LCP)](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint)
5. [cumulative layout shift (CLS)](https://web.dev/cls/)
6. source (网络请求资源)

### navigation 指标

* timeToFirstByte
* downloadTime
* dnsLookupTime
* tcpTime
* domTime
* loadTime
* parseDOMTime

### 网络指标和硬件情况（不完全可信）

客户端网络情况和硬件情况
## 使用方法 ##

```js
import Corazon from "corazon";

let p = new Corazon({
  logUrl:"", // 错误上报地址,
  analyticsTracker:(data)=>{}, //自定义监控数据处理 默认打印到控制台
  isResourceTiming:true, // 是否开启资源监控,
  captureError:true, // 是否开启错误上报,
  isPerformance:true, // 是否开启性能指标监控
})

```

### Options

|     参数名称     |   类型   |              使用说明               |
| :--------------: | :------: | :---------------------------------: |
|      logUrl      |  String  |         错误上报地址   必填         |
| analyticsTracker | Function | 自定义监控数据处理 默认打印到控制台 |
| isResourceTiming | Boolean  |     是否开启资源监控 默认false      |
|   captureError   | Boolean  |     是否开启错误上报 默认false      |
|  isPerformance   | Boolean  |   是否开启性能指标监控 默认false    |