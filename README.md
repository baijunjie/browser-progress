# progress.js

一款小巧的伪进度条插件，会在页面顶部伪装一个进度条，就好像 [YouTube](https://www.youtube.com/) 正在使用的那种。<br>
支持 IE6-8 等老式浏览器

## Usage

将 [progress.js] 引在 \<body\> 标签之后。默认情况下 progress 会监听页面的 load 事件，当 load 事件触发时，进度条完成。

``` html
<body>
<script src="progress.js"></script>
	.....
	.....
</body>

```
[progress.js]: https://github.com/baijunjie/progress.js/blob/master/progress.js

## API

如果过不通过模块化加载，那么可以通过全局对象 bjj.progress 进行调用。

``` js
bjj.progress.color(#000); // 修改进度条颜色

bjj.progress.stop(); //	进度条暂停

bjj.progress.play(); // 进度条恢复运行

bjj.progress.start(); // 进度条重新开始

bjj.progress.finish(); // 进度条完成
```







