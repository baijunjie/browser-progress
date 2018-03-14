# progress.js

一款小巧的伪进度条插件，会在页面顶部伪装一个进度条，就好像 [YouTube](https://www.youtube.com/) 正在使用的那种。
支持 IE6-8 等老式浏览器。

## Usage

将 [progress.js] 引在 \<body\> 标签之后。<br>
默认情况下 progress 会监听页面的 load 事件，当 load 事件触发时完成进程。<br>

注意，如果页面还未触发 load 事件，那么此时调用任何进程相关的操作，都会将 load 事件监听移除，为的是防止 load 影响新的进程。

``` html
<body>
<script src="progress.js"></script>
	.....
	.....
</body>
```
[progress.js]: https://github.com/baijunjie/progress.js/blob/master/progress.js


## AMD

该插件同时支持模块化调用，但是通过模块化调用时，progress 不会监听页面的 load 事件，也不会在初加入页面时自动启动进程。

## npm

```shell
$ npm install browser-progress
```

## API

如果不通过模块化加载，那么可以通过全局对象 progress 进行调用。

```js
// 修改进度条的容器，将进度条添加进指定的DOM元素中
// 第2个参数可以帮助修改进度条的样式，一般只是修改它的position
progress.appendTo(elem, style);

progress.color("#000"); // 修改进度条颜色

progress.set(.5); // 设置进程的当前值，取值为 0~1 的浮点数。同时会暂停运行中的进程，使进程变为手动设置

progress.stop(); //	暂停进程

progress.play(); // 恢复运行进程

progress.start(); // 重新开始进程

progress.done(); // 完成进程

progress.fail(); // 进程回零，一般用于加载失败

progress.hide(); // 隐藏默认的进度条样式

progress.show(); // 显示默认的进度条样式

// 设置进程回调，会将进程的当前值作为参数传入回调
// 当前值参数取值为 0~1 的浮点数
progress.progress(callback);

// 淡出动画（用于自定义进度条）
// 使 elem 元素在 duration 毫秒内淡出，duration 默认为 400
// 如果 duration 为一个 function，则 duration 会被当做 callback 来处理，同时第三个参数 callback 会被忽略
progress.fadeOut(elem, duration, callback);
```

如果使用 Ajax 更新页面内容，可以调用 .start() 方法重新开始进程，然后在 Ajax 的完成回调中调用 .done() 方法完成进程。

## Custom Progress

实现自定义进度条
``` html
<div id="progress-area">
	<div id="progress-text">0%</div>
	<div class="progress">
		<p id="progress-bar"></p>
	</div>
</div>

<script src="progress.js"></script>
<script>
	progress.hide(); // 隐藏掉原有的进度条样式
	progress.progress(function(value) {
		var percent = Math.round(value * 100) + '%';
		document.getElementById('progress-text').innerHTML = percent;
		document.getElementById('progress-bar').style.width = percent;
		if (value == 1) {
			progress.fadeOut(document.getElementById('progress-area'));
		}
	});
</script>
```









