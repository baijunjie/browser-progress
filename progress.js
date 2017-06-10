/*!
 * Pseudo progress v1.2.2
 * (c) 2014-2017 Junjie.Bai
 * MIT Licensed.
 *
 * https://github.com/baijunjie/progress.js
 */
(function(root, factory) {
	'use strict';

	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.progress = factory();
	}

}(this, function(require) {
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

	var testElem = document.createElement("div");
	// 返回支持的属性名
	function getSupportPropertyName(prop) {
		if (prop in testElem.style) return prop;

		var testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
			prefixs = [ "Webkit", "Moz", "ms", "O" ];

		for (var i = 0, l = prefixs.length; i < l; i++) {
			var prefixProp = prefixs[i] + testProp;
			if (prefixProp in testElem.style) {
				return prefixProp;
			}
		}
	}

	// 检查是否支持3D
	function checkTransform3dSupport() {
		testElem.style[support.transform] = "";
		testElem.style[support.transform] = "rotateY(90deg)";
		return testElem.style[support.transform] !== "";
	}

	var support = {};
	support.transform = getSupportPropertyName("transform");
	support.transition = getSupportPropertyName("transition");
	support.transform3d = checkTransform3dSupport();
	testElem = null;

	function Progress(color) {
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
		this._progressCallback = function(){};

		this._loop = new Loop();
		this._init();
		this.color(color || '#2299dd');

		this._loadedHandle = proxy(this._loadedHandle, this);
		if (document.readyState !== 'complete' && !require) {
			this.start();
			this._addLoadEvent();
		}
	}

	Progress.prototype = {
		_init: function() {
			this._progress = document.createElement('div');
			this._progressHeadLeft = document.createElement('div');
			this._progressHeadRight = document.createElement('div');

			this._css(this._progress, {
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

			this._css(this._progressHeadLeft, {
				'position': 'absolute',
				'right': '-80px',
				'top': 0,
				'width': '180px',
				'height': '100%',
				'opacity': .6,
				'border-radius': '100%',
				'clip': 'rect(-6px,90px,14px,-6px)'
			});

			this._css(this._progressHeadRight, {
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

			this._addDocument = proxy(this._addDocument, this);
			this._addDocument();
		},

		_addDocument: function() {
			if (document.body) {
				document.body.appendChild(this._progress);
			} else {
				window.setTimeout(this._addDocument);
			}
		},

		_loadedHandle: function() {
			this.done();
		},

		_addLoadEvent: function() {
			this._listenerLoad = true;
			if (window.addEventListener) window.addEventListener('load', this._loadedHandle, false);
			else if (window.attachEvent) window.attachEvent('onload', this._loadedHandle);
			else window.onload = this._loadedHandle;
		},

		_removeLoadEvent: function() {
			this._listenerLoad = false;
			if (window.removeEventListener) window.removeEventListener('load', this._loadedHandle, false);
			else if (window.detachEvent) window.detachEvent('onload', this._loadedHandle);
			else window.onload = null;
		},

		_run: function() {
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
		},

		_hide: function(animate) {
			if (!this._isShow) return;
			this._isShow = false;

			// 如果 animate 为 0 或者 undefined 这表示不需要淡出动画
			// 否则以 this._hideDuration 的时长进行淡出
			this.fadeOut(this._progress, (animate || 0) && this._hideDuration);
			return this;
		},

		_show: function() {
			if (this._isShow) return;
			this._isShow = true;

			if (this._timerID > 0) {
				window.clearTimeout(this._timerID);
				this._timerID = 0;
				this._fadeOutCallback();
			}

			this._css(this._progress, 'display', 'block');
			return this;
		},

		_css: function(elem, prop, value) {
			if (typeof prop === 'object') {
				for (var p in prop) {
					elem.style[p] = prop[p];
				}
			} else if (typeof value !== 'undefined') {
				elem.style[prop] = value;
			}
			return this;
		},

		_set: function(value) {
			this._value = value;
			if (support.transform) {
				var transform = 'translate(' + (value * 100) + '%,0)';
				if (support.transform3d) {
					transform += ' translateZ(0)';
				}
				this._css(this._progress, support.transform, transform);
			} else {
				this._css(this._progress, 'right', (this._valueStep3 - value) * 100 + '%');
			}
			this._progressCallback(value);
			return this;
		},

		appendTo: function(elem, style) {
			elem && elem.appendChild(this._progress);
			style && this._css(this._progress, style);
			return this;
		},

		color: function(color) {
			this._css(this._progress, 'background', color);
			this._css(this._progressHeadLeft, 'box-shadow', '1px 0 6px 1px ' + color);
			this._css(this._progressHeadRight, 'box-shadow', '1px 0 6px 1px ' + color);
			return this;
		},

		set: function(value) {
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
		},

		stop: function() {
			if (this._listenerLoad) {
				this._removeLoadEvent();
			}
			if (!this._isRun) return this;
			this._isRun = false;
			this._loop.remove(this._run);
			return this;
		},

		play: function() {
			if (this._listenerLoad) {
				this._removeLoadEvent();
			}
			if (this._isRun) return this;
			this._isRun = true;
			this._loop.add(this._run, this);
			return this;
		},

		start: function() {
			this._set(0);
			this._coe = this._coeStep1;
			this._targetValue = this._valueStep1;
			this._show();
			return this.play();
		},

		done: function() {
			this._coe = this._coeStep3;
			this._targetValue = this._valueStep3;
			return this.play();
		},

		fail: function() {
			this._coe = this._coeStep4;
			this._targetValue = this._valueStep0;
			return this.play();
		},

		hide: function() {
			this._css(this._progress, 'visibility', 'hidden');
			return this;
		},

		show: function() {
			this._css(this._progress, 'visibility', 'visible');
			return this;
		},

		progress: function(callback) {
			this._progressCallback = callback;
			return this;
		},

		fadeOut: function(elem, duration, callback) {
			if (typeof duration === 'function') {
				callback = duration;
				duration = this._hideDuration;
			} else if (typeof duration !== 'number') {
				duration = this._hideDuration;
			}

			var _this = this,
				css = this._css;

			// 这里使用异步，是为了等待视图完全刷新到 100% 状态后在执行隐藏操作
			// 否则会出现视图在 99% 时，进度条就隐藏了
			window.setTimeout(function() {
				if (duration && support.transition) {
					// 如果之前调用过 fadeOut, 这里将生成的 this._fadeOutCallback 保存至 fadeOutCallback
					// 在新的 this._fadeOutCallback 开始执行时，先执行之前的 fadeOutCallback
					var fadeOutCallback = _this._fadeOutCallback;
					_this._fadeOutCallback = function() {
						fadeOutCallback && fadeOutCallback.call(_this);
						css(elem, 'display', 'none');
						css(elem, support.transition, '');
						css(elem, 'opacity', 1);
						callback && callback.call(_this);
						_this._fadeOutCallback = null;
					};

					css(elem, support.transition, 'opacity ' + duration + 'ms');
					css(elem, 'opacity', 0);

					if (_this._timerID > 0) window.clearTimeout(_this._timerID);
					_this._timerID = window.setTimeout(function() {
						_this._timerID = 0;
						_this._fadeOutCallback();
					}, duration);
				} else {
					css(elem, 'display', 'none');
					callback && callback.call(_this);
				}
			});

			return this;
		},
	};

	var progress = new Progress();

	return progress;

}));
