/*!
 * BrowserProgress - 一款小巧的伪进度条插件
 * @version v1.3.0
 * @author Junjie.Bai
 * @license MIT
 * 
 * git - git+https://github.com/baijunjie/browser-progress.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BrowserProgress"] = factory();
	else
		root["BrowserProgress"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.proxy = proxy;
exports.css = css;
var testElem = document.createElement('div');

// 返回支持的属性名
function getSupportPropertyName(prop) {
    if (prop in testElem.style) return prop;

    var testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
        prefixs = ['Webkit', 'Moz', 'ms', 'O'];

    for (var i = 0, l = prefixs.length; i < l; i++) {
        var prefixProp = prefixs[i] + testProp;
        if (prefixProp in testElem.style) {
            return prefixProp;
        }
    }
}

// 检查是否支持3D
function checkTransform3dSupport() {
    testElem.style[support.transform] = '';
    testElem.style[support.transform] = 'rotateY(90deg)';
    return testElem.style[support.transform] !== '';
}

var support = exports.support = {};
support.transform = getSupportPropertyName('transform');
support.transition = getSupportPropertyName('transition');
support.transform3d = checkTransform3dSupport();
testElem = null;

// 使用方法一：
// 第一个参数为调用的方法
// 第二个参数为该方法调用时 this 的引用对象，如果传入 null，则不会改变 this 的引用
// 使用方法二：
// 第一个参数为调用方法时 this 的引用对象，如果传入 null，则不会改变 this 的引用
// 第二个参数为将要调用 this 引用对象的方法的名称字符串
// 以上两种用法从第三个参数开始可以为调用函数传入若干个参数
// 如果该函数本身就有默认参数，比如 .each() 方法会给函数传入两个参数，分别为索引号和对应的对象，那么通过代理设置的参数会插在原函数的参数前
var guid = 0;
function proxy(func, target) {
    if (typeof target === 'string') {
        var tmp = func[target];
        target = func;
        func = tmp;
    }

    if (typeof func !== 'function') {
        return undefined;
    }

    var slice = Array.prototype.slice,
        args = slice.call(arguments, 2),
        proxy = function proxy() {
        return func.apply(target || this, args.concat(slice.call(arguments)));
    };

    proxy.guid = func.guid = func.guid || guid++;

    return proxy;
}

function css(elem, prop, value) {
    if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
        for (var p in prop) {
            elem.style[p] = prop[p];
        }
    } else if (typeof value !== 'undefined') {
        elem.style[prop] = value;
    }
    return this;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * mainloop v1.0.3
 * (c) 2014-2018 BaiJunjie
 * MIT Licensed.
 *
 * https://github.com/baijunjie/mainloop
 */
(function(root, factory) {
    'use strict';

    if (true) {
        module.exports = factory();
    } else {}

}(this, function() {
    'use strict';

    var requestAnimationFrame = window.requestAnimationFrame,
        cancelAnimationFrame = window.cancelAnimationFrame,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
        requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!cancelAnimationFrame) {
        cancelAnimationFrame = function(id) {
            window.clearTimeout(id);
        };
    }

    function Loop() {
        this._requestAnimationFrame = requestAnimationFrame;

        if (!this._requestAnimationFrame) {
            var lastTime = 0;
            this._requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        this._runFunc = []; //储存所有循环中运行的方法
        this._active = !!this._runFunc.length; //表示循环是否在激活状态。当循环中存在需要运行的方法时，则被判定为激活状态
        this._isRun = true; //表示循环是否在运行状态
        this._timerID = 0;
        this._loopCallback = proxy(this._loopCallback, this);
    }

    Loop.prototype = {
        _loopCallback: function() {
            var i = this._runFunc.length;
            while (i--) {
                if (this._runFunc[i]() === false) { // 如果方法返回 false，则将该方法移出循环
                    this._runFunc.splice(i, 1);
                }
            }

            if (this._runFunc.length) {
                this._timerID = this._requestAnimationFrame.call(window, this._loopCallback);
            } else {
                this._active = false;
            }
        },

        add: function(func, target) {
            if (typeof func !== 'function') return this;
            if (target) {
                func = proxy(func, target);
            }
            this._runFunc.unshift(func);

            if (this._active) return this;
            this._active = true;
            if (this._isRun) {
                this._timerID = this._requestAnimationFrame.call(window, this._loopCallback);
            }
            return this;
        },

        remove: function(func) {
            if (typeof func !== 'function') {
                this._runFunc = [];
                return this;
            }
            var i = this._runFunc.length;
            while (i--) {
                if (this._runFunc[i].guid === func.guid) {
                    this._runFunc.splice(i, 1);
                    return this;
                }
            }
        },

        stop: function() { // 停止循环
            if (!this._isRun) return this;
            this._isRun = false;
            cancelAnimationFrame(this._timerID);
            return this;
        },

        play: function() { // 启动循环
            if (this._isRun) return this;
            this._isRun = true;
            if (this._active) {
                this._timerID = this._requestAnimationFrame.call(window, this._loopCallback);
            }
            return this;
        }
    };

    var guid = 0;
    function proxy(func, target) {
        if (typeof target === 'string') {
            var tmp = func[target];
            target = func;
            func = tmp;
        }

        if (typeof func !== 'function') {
            return undefined;
        }

        var slice = Array.prototype.slice,
            args = slice.call(arguments, 2),
            proxy = function() {
                return func.apply(target || this, args.concat(slice.call(arguments)));
            };

        proxy.guid = func.guid = func.guid || guid++;

        return proxy;
    }

    return new Loop();
}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mainloop = __webpack_require__(1);

var _mainloop2 = _interopRequireDefault(_mainloop);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Progress = function () {
    function Progress(color) {
        _classCallCheck(this, Progress);

        this._init(color);
    }

    _createClass(Progress, [{
        key: '_init',
        value: function _init(color) {
            this._hideDuration = 400; // 进程隐藏的持续时间
            this._coeStep1 = .1;
            this._coeStep2 = .01;
            this._coeStep3 = .3;
            this._coeStep4 = .1;
            this._valueStep0 = 0;
            this._valueStep1 = .2;
            this._valueStep2 = .95;
            this._valueStep3 = 1;

            this._mind = this._valueStep3 * 0.001;
            this._value = 0;
            this._targetValue = 0;
            this._coe = 1;
            this._isRun = false;
            this._isShow = false;
            this._timerID = 0; // 用于记录hide动画使用的计时器ID
            this._stepCallback = function () {};

            this._createElem();
            this.color(color || '#000');

            this._loadedHandle = (0, _utils.proxy)(this._loadedHandle, this);

            if (document.readyState !== 'complete') {
                this.start();
                this._addLoadEvent();
            }
        }
    }, {
        key: '_createElem',
        value: function _createElem() {
            this._progress = document.createElement('div');
            this._progressHeadLeft = document.createElement('div');
            this._progressHeadRight = document.createElement('div');

            (0, _utils.css)(this._progress, {
                'display': 'none',
                '-webkit-pointer-events': 'none',
                'pointer-events': 'none',
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                'user-select': 'none',
                'position': 'fixed',
                'right': '100%',
                'top': 0,
                'z-index': 2147483647,
                'width': '100%',
                'height': '2px',
                'opacity': 1
            });

            (0, _utils.css)(this._progressHeadLeft, {
                'position': 'absolute',
                'right': '-80px',
                'top': 0,
                'width': '180px',
                'height': '100%',
                'opacity': .6,
                'border-radius': '100%',
                'clip': 'rect(-6px,90px,14px,-6px)'
            });

            (0, _utils.css)(this._progressHeadRight, {
                'position': 'absolute',
                'right': 0,
                'top': 0,
                'width': '20px',
                'height': '100%',
                'opacity': .6,
                'border-radius': '100%',
                'clip': 'rect(-6px,22px,14px,10px)'
            });

            this._progress.appendChild(this._progressHeadLeft);
            this._progress.appendChild(this._progressHeadRight);

            this._addDocument = (0, _utils.proxy)(this._addDocument, this);
            this._addDocument();
        }
    }, {
        key: '_addDocument',
        value: function _addDocument() {
            if (document.body) {
                document.body.appendChild(this._progress);
            } else {
                setTimeout(this._addDocument);
            }
        }
    }, {
        key: '_loadedHandle',
        value: function _loadedHandle() {
            this.done();
        }
    }, {
        key: '_addLoadEvent',
        value: function _addLoadEvent() {
            this._listenerLoad = true;
            if (window.addEventListener) window.addEventListener('load', this._loadedHandle, false);else if (window.attachEvent) window.attachEvent('onload', this._loadedHandle);else window.onload = this._loadedHandle;
        }
    }, {
        key: '_removeLoadEvent',
        value: function _removeLoadEvent() {
            this._listenerLoad = false;
            if (window.removeEventListener) window.removeEventListener('load', this._loadedHandle, false);else if (window.detachEvent) window.detachEvent('onload', this._loadedHandle);else window.onload = null;
        }
    }, {
        key: '_run',
        value: function _run() {
            var v = this._value,
                d = this._targetValue - v,
                t = d * this._coe;
            if (Math.abs(d) > this._mind) {
                v += t;
                this._set(v);
            } else {
                this._set(this._targetValue);
                if (this._targetValue === this._valueStep1) {
                    this._coe = this._coeStep2;
                    this._targetValue = this._valueStep2;
                } else {
                    if (this._targetValue === this._valueStep3 || this._targetValue === this._valueStep0) {
                        this._hide(this._targetValue);
                    }
                    this._isRun = false;
                    return false;
                }
            }
        }
    }, {
        key: '_hide',
        value: function _hide(animate) {
            if (!this._isShow) return;
            this._isShow = false;

            // 如果 animate 为 0 或者 undefined 这表示不需要淡出动画
            // 否则以 this._hideDuration 的时长进行淡出
            this.fadeOut(this._progress, (animate || 0) && this._hideDuration);
            return this;
        }
    }, {
        key: '_show',
        value: function _show() {
            if (this._isShow) return;
            this._isShow = true;

            if (this._timerID > 0) {
                clearTimeout(this._timerID);
                this._timerID = 0;
                this._fadeOutCallback();
            }

            (0, _utils.css)(this._progress, 'display', 'block');
            return this;
        }
    }, {
        key: '_set',
        value: function _set(value) {
            this._value = value;
            if (_utils.support.transform) {
                var transform = 'translate(' + value * 100 + '%,0)';
                if (_utils.support.transform3d) {
                    transform += ' translateZ(0)';
                }
                (0, _utils.css)(this._progress, _utils.support.transform, transform);
            } else {
                (0, _utils.css)(this._progress, 'right', (this._valueStep3 - value) * 100 + '%');
            }
            this._stepCallback(value);
            return this;
        }
    }, {
        key: 'appendTo',
        value: function appendTo(elem, style) {
            elem && elem.appendChild(this._progress);
            style && (0, _utils.css)(this._progress, style);
            return this;
        }
    }, {
        key: 'color',
        value: function color(_color) {
            (0, _utils.css)(this._progress, 'background', _color);
            (0, _utils.css)(this._progressHeadLeft, 'box-shadow', '1px 0 6px 1px ' + _color);
            (0, _utils.css)(this._progressHeadRight, 'box-shadow', '1px 0 6px 1px ' + _color);
            return this;
        }
    }, {
        key: 'set',
        value: function set(value) {
            this.stop();
            value = Math.max(this._valueStep0, Math.min(this._valueStep3, value));

            if (value < this._valueStep1) {
                this._coe = this._coeStep1;
                this._targetValue = this._valueStep1;
            } else if (value < this._valueStep2) {
                this._coe = this._coeStep2;
                this._targetValue = this._valueStep2;
            } else if (value < this._valueStep3) {
                this._coe = this._coeStep3;
                this._targetValue = this._valueStep3;
            }

            this._set(value);

            if (value === this._valueStep3 || value === this._valueStep0) {
                this._hide(value);
            } else {
                this._show();
            }

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this._listenerLoad) {
                this._removeLoadEvent();
            }

            if (!this._isRun) return this;

            this._isRun = false;
            _mainloop2.default.remove(this._run);
            return this;
        }
    }, {
        key: 'play',
        value: function play() {
            if (this._listenerLoad) {
                this._removeLoadEvent();
            }

            if (this._isRun) return this;

            this._isRun = true;
            _mainloop2.default.add(this._run, this);
            return this;
        }
    }, {
        key: 'start',
        value: function start() {
            this._set(0);
            this._coe = this._coeStep1;
            this._targetValue = this._valueStep1;
            this._show();
            return this.play();
        }
    }, {
        key: 'done',
        value: function done() {
            this._coe = this._coeStep3;
            this._targetValue = this._valueStep3;
            return this.play();
        }
    }, {
        key: 'fail',
        value: function fail() {
            this._coe = this._coeStep4;
            this._targetValue = this._valueStep0;
            return this.play();
        }
    }, {
        key: 'hide',
        value: function hide() {
            (0, _utils.css)(this._progress, 'visibility', 'hidden');
            return this;
        }
    }, {
        key: 'show',
        value: function show() {
            (0, _utils.css)(this._progress, 'visibility', 'visible');
            return this;
        }
    }, {
        key: 'step',
        value: function step(callback) {
            this._stepCallback = callback;
            return this;
        }
    }, {
        key: 'fadeOut',
        value: function fadeOut(elem, duration, callback) {
            var _this = this;

            if (typeof duration === 'function') {
                callback = duration;
                duration = this._hideDuration;
            } else if (typeof duration !== 'number') {
                duration = this._hideDuration;
            }

            // 这里使用异步，是为了等待视图完全刷新到 100% 状态后在执行隐藏操作
            // 否则会出现视图在 99% 时，进度条就隐藏了
            setTimeout(function () {
                if (duration && _utils.support.transition) {
                    // 如果之前调用过 fadeOut, 这里将生成的 this._fadeOutCallback 保存至 fadeOutCallback
                    // 在新的 this._fadeOutCallback 开始执行时，先执行之前的 fadeOutCallback
                    var fadeOutCallback = _this._fadeOutCallback;
                    _this._fadeOutCallback = function () {
                        fadeOutCallback && fadeOutCallback.call(_this);
                        (0, _utils.css)(elem, 'display', 'none');
                        (0, _utils.css)(elem, _utils.support.transition, '');
                        (0, _utils.css)(elem, 'opacity', 1);
                        callback && callback.call(_this);
                        _this._fadeOutCallback = null;
                    };

                    (0, _utils.css)(elem, _utils.support.transition, 'opacity ' + duration + 'ms');
                    (0, _utils.css)(elem, 'opacity', 0);

                    if (_this._timerID > 0) clearTimeout(_this._timerID);
                    _this._timerID = setTimeout(function () {
                        _this._timerID = 0;
                        _this._fadeOutCallback();
                    }, duration);
                } else {
                    (0, _utils.css)(elem, 'display', 'none');
                    callback && callback.call(_this);
                }
            });

            return this;
        }
    }]);

    return Progress;
}();

exports.default = new Progress();
module.exports = exports['default'];

/***/ })
/******/ ]);
});