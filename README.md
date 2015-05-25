# progress.js

一款小巧的伪进度条插件，会在页面顶部伪装一个进度条，就好像 [YouTube](https://www.youtube.com/) 正在使用的那种。<br>
支持 IE6-8 等老式浏览器。

## Usage

将 [progress.js] 引在 \<body\> 标签之后。<br>
默认情况下 progress 会监听页面的 load 事件，当 load 事件触发时完成进程。

``` html
<body>
<script src="progress.js"></script>
	.....
	.....
</body>

```
[progress.js]: https://github.com/baijunjie/progress.js/blob/master/progress.js

## API

如果不通过模块化加载，那么可以通过全局对象 bjj.progress 进行调用。

``` js
bjj.progress.color("#000"); // 修改进度条颜色

bjj.progress.set(50); // 设置进程的当前值，取值为 0~100。同时会暂停运行中的进程，使进程变为手动设置

bjj.progress.stop(); //	暂停进程

bjj.progress.play(); // 恢复运行进程

bjj.progress.start(); // 重新开始进程

bjj.progress.done(); // 完成进程

bjj.progress.fail(); // 进程回零，一般用于加载失败
```

如果使用 Ajax 更新页面内容，可以调用 .start() 方法重新开始进程，然后在 Ajax 的完成回调中调用 .done() 方法完成进程。<br>

注意，如果页面还未触发 load 事件，那么此时调用 .start() 会将 load 事件监听移除，为的是不让 load 影响新的进程。







