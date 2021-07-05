# 性能监控&错误上报 #

## 使用方法 ##

```js
import Performance from "performance";

let p = new Performance({
  logUrl:"" // 错误上报地址,
  analyticsTracker:(data)=>{}, //自定义监控数据处理 默认打印到控制台
  isResourceTiming:true // 是否开启资源监控,
  captureError:true // 是否开启错误上报,
  maxMeasureTime:1500
})
console.log(p.v);

```

### Options

|     参数名称     |   类型   |              使用说明               |
| :--------------: | :------: | :---------------------------------: |
|      logUrl      |  String  |            错误上报地址             |
| analyticsTracker | Function | 自定义监控数据处理 默认打印到控制台 |
| isResourceTiming | Boolean  |     是否开启资源监控 默认false      |
|   captureError   | Boolean  |     是否开启错误上报 默认false      |