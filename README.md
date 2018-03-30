# browser-progress

一款小巧的伪进度条插件，会在页面顶部伪装一个进度条，就好像 [YouTube](https://www.youtube.com/) 正在使用的那种。

<img src="https://github.com/baijunjie/browser-progress/blob/master/youtube-loading.jpg" width="640">



## Usage

将 `BrowserProgress.js` 放置在 `<body\>` 标签之后。

默认情况下 BrowserProgress 会监听页面的 `load` 事件，当 `load` 事件触发时完成进程。

**注意**，如果页面还未触发 `load` 事件，那么此时调用任何进程相关的操作，都会将 `load` 事件监听移除，为的是防止 `load` 影响新的进程。

``` html
<body>
<script src="BrowserProgress.js"></script>
    .....
    .....
</body>
```


## npm

```shell
$ npm install browser-progress
```

**注意**，插件同时支持模块化调用，但是通过模块化调用时，由于 BrowserProgress 是异步载入的，此时页面的 `document.readyState` 可能已经为 `complete`，因此页面在初始载入时 BrowserProgress 可能不会自动启动进程。



## API

如果不通过模块化加载，那么可以通过全局对象 BrowserProgress 进行调用。

```js
// 第一个参数为一个 DOM 对象，可以修改进度条的容器，将进度条移动至指定的 DOM 元素中
// 第二个参数是一个 Object, 可以修改进度条的样式，一般只是用来修改它的 position 属性
BrowserProgress.appendTo(elem, style);

BrowserProgress.color("#000"); // 修改进度条颜色

BrowserProgress.set(.5); // 设置进程的当前值，取值为 0~1 的浮点数。同时会暂停运行中的进程，使进程变为手动设置

BrowserProgress.stop(); // 暂停进程

BrowserProgress.play(); // 恢复运行进程

BrowserProgress.start(); // 重新开始进程

BrowserProgress.done(); // 完成进程

BrowserProgress.fail(); // 进程回零，一般用于加载失败

BrowserProgress.hide(); // 隐藏默认的进度条样式

BrowserProgress.show(); // 显示默认的进度条样式

// 设置进程回调，会将进程的当前值作为参数传入回调
// 当前值参数取值为 0~1 的浮点数
BrowserProgress.step(callback);

// 淡出动画（用于自定义进度条）
// 使 elem 元素在 duration 毫秒内淡出，duration 默认为 400
// 如果 duration 为一个 function，则 duration 会被当做 callback 来处理，同时第三个参数 callback 会被忽略
BrowserProgress.fadeOut(elem, duration, callback);
```

如果使用 Ajax 更新页面内容，可以调用 `BrowserProgress.start()` 方法重新开始进程，然后在 Ajax 的完成回调中调用 `BrowserProgress.done()` 方法完成进程。



## Custom Progress

实现自定义进度条
``` html
<div id="progress-area">
    <div id="progress-text">0%</div>
    <div class="progress">
        <p id="progress-bar"></p>
    </div>
</div>

<script src="BrowserProgress.js"></script>
<script>
    BrowserProgress.hide(); // 隐藏掉原有的进度条样式
    BrowserProgress.step(function(value) {
        var percent = Math.round(value * 100) + '%';
        document.getElementById('progress-text').innerHTML = percent;
        document.getElementById('progress-bar').style.width = percent;
        if (value == 1) {
            BrowserProgress.fadeOut(document.getElementById('progress-area'));
        }
    });
</script>
```









