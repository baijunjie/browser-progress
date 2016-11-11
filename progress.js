/*!
 * Pseudo progress v1.1.3
 * @author baijunjie
 *
 * https://github.com/baijunjie/progress.js
 */
(function(root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.bjj = root.bjj || {};
		root.bjj.progress = factory();
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
		this.requestAnimationFrame = requestAnimationFrame;

		if (!this.requestAnimationFrame) {
			var lastTime = 0;
			this.requestAnimationFrame = function(callback) {
				var currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function() {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		this.runFunc = []; //储存所有主循环中运行的方法
		this.loopRun = false; //表示循环是否已经运行（只要 runFunc 中有需要运行的方法，即使已经 stop，也视为运行状态）
		this.isStop = false; //表示循环是否暂停
		this.timerID = 0;
		this._loopCallback = proxy(this._loopCallback, this);
	}

	Loop.prototype = {
		_loopCallback: function() {
			var i = this.runFunc.length;
			while (i--) {
				if (this.runFunc[i]() === false) { // 如果方法返回 false，则将该方法移出循环
					this.runFunc.splice(i, 1);
				}
			}

			if (this.runFunc.length) {
				this.timerID = this.requestAnimationFrame.call(window, this._loopCallback);
			} else {
				this.loopRun = false;
			}
		},

		add: function(func, target) {
			if (typeof func !== 'function') return this;
			if (target) {
				func = proxy(func, target);
			}
			this.runFunc.unshift(func);

			if (this.loopRun) return this;
			this.loopRun = true;
			if (!this.isStop) {
				this.timerID = this.requestAnimationFrame.call(window, this._loopCallback);
			}
			return this;
		},

		remove: function(func) {
			if (typeof func !== 'function') {
				this.runFunc = [];
				return this;
			}
			var i = this.runFunc.length;
			while (i--) {
				if (this.runFunc[i].guid === func.guid) {
					this.runFunc.splice(i, 1);
					return this;
				}
			}
		},

		stop: function() { // 停止循环
			if (this.isStop) return this;
			this.isStop = true;
			cancelAnimationFrame(this.timerID);
			return this;
		},

		play: function() { // 启动循环
			if (!this.isStop) return this;
			this.isStop = false;
			if (this.loopRun) {
				this.timerID = this.requestAnimationFrame.call(window, this._loopCallback);
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

	function Progress(color) {
		this.hideDuration = 400; // 进程隐藏的持续时间
		this.coeStep1 = .1;
		this.coeStep2 = .01;
		this.coeStep3 = .3;
		this.coeStep4 = .1;
		this.valueStep1 = 20;
		this.valueStep2 = 95;
		this.valueStep3 = 100;
		this.valueStep4 = 0;

		this.value = 0;
		this.targetValue = 100;
		this.coe = 1;
		this.isRun = false;
		this.isShow = false;
		this.timerID = 0; // 用于记录hide动画使用的计时器ID

		this.loop = new Loop();
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
			this.progress = document.createElement('div');
			this.progressHeadLeft = document.createElement('div');
			this.progressHeadRight = document.createElement('div');

			this._css(this.progress, {
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

			this._css(this.progressHeadLeft, {
				'position': 'absolute',
				'right': '-80px',
				'top': 0,
				'width': '180px',
				'height': '100%',
				'opacity': .6,
				'border-radius': '100%',
				'clip': 'rect(-6px,90px,14px,-6px)'
			});

			this._css(this.progressHeadRight, {
				'position': 'absolute',
				'right': 0,
				'top': 0,
				'width': '20px',
				'height': '100%',
				'opacity': .6,
				'border-radius': '100%',
				'clip': 'rect(-6px,22px,14px,10px)'
			});

			this.progress.appendChild(this.progressHeadLeft);
			this.progress.appendChild(this.progressHeadRight);

			this._addDocument = proxy(this._addDocument, this);
			this._addDocument();
		},

		_addDocument: function() {
			if (document.body) {
				document.body.appendChild(this.progress);
			} else {
				window.setTimeout(this._addDocument);
			}
		},

		_loadedHandle: function() {
			this.done();
		},

		_addLoadEvent: function() {
			this.listenerLoad = true;
			if (window.addEventListener) window.addEventListener('load', this._loadedHandle, false);
			else if (window.attachEvent) window.attachEvent('onload', this._loadedHandle);
			else window.onload = this._loadedHandle;
		},

		_removeLoadEvent: function() {
			this.listenerLoad = false;
			if (window.removeEventListener) window.removeEventListener('load', this._loadedHandle, false);
			else if (window.detachEvent) window.detachEvent('onload', this._loadedHandle);
			else window.onload = null;
		},

		_run: function() {
			var v = this.value,
				d = this.targetValue - v,
				t = d * this.coe;
			if (Math.abs(d) > .1) {
				v += t;
				this._set(v);
			} else {
				this._set(this.targetValue);
				if (this.targetValue === this.valueStep1) {
					this.coe = this.coeStep2;
					this.targetValue = this.valueStep2;
				} else {
					if (this.targetValue === this.valueStep3 || this.targetValue === this.valueStep4) {
						this._hide(this.targetValue);
					}
					this.isRun = false;
					return false;
				}
			}
		},

		_hide: function(animate) {
			if (!this.isShow) return;
			this.isShow = false;
			if (animate && support.transition) {
				this._css(this.progress, support.transition, 'opacity ' + this.hideDuration + 'ms');
				this._css(this.progress, 'opacity', 0);
				var _this = this;
				this.timerID = window.setTimeout(function() {
					_this._css(_this.progress, 'display', 'none');
					_this._css(_this.progress, support.transition, '');
					_this._set(0);
					_this.timerID = 0;
				}, this.hideDuration);
			} else {
				this._css(this.progress, 'display', 'none');
				this._set(0);
			}
			return this;
		},

		_show: function() {
			if (this.isShow) return;
			this.isShow = true;

			if (this.timerID > 0) {
				window.clearTimeout(this.timerID);
				this._css(this.progress, support.transition, '');
				this._set(0);
				this.timerID = 0;
			}

			this._css(this.progress, {
				'display': 'block',
				'opacity': 1
			});
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
			this.value = value;
			if (support.transform) {
				var transform = 'translate(' + value + '%,0)';
				if (support.transform3d) {
					transform += ' translateZ(0)';
				}
				this._css(this.progress, support.transform, transform);
			} else {
				this._css(this.progress, 'right', (100 - value) + '%');
			}
			return this;
		},

		appendTo: function(elem, style) {
			elem && elem.appendChild(this.progress);
			style && this._css(this.progress, style);
			return this;
		},

		color: function(color) {
			this._css(this.progress, 'background', color);
			this._css(this.progressHeadLeft, 'box-shadow', '1px 0 6px 1px ' + color);
			this._css(this.progressHeadRight, 'box-shadow', '1px 0 6px 1px ' + color);
			return this;
		},

		set: function(value) {
			this.stop();
			value = Math.max(0, Math.min(100, value));
			if (value < this.valueStep1) {
				this.coe = this.coeStep1;
				this.targetValue = this.valueStep1;
			} else if (value < this.valueStep2) {
				this.coe = this.coeStep2;
				this.targetValue = this.valueStep2;
			} else if (value < this.valueStep3) {
				this.coe = this.coeStep3;
				this.targetValue = this.valueStep3;
			}
			this._set(value);
			if (value === this.valueStep3 || value === this.valueStep4) {
				this._hide(value);
			} else {
				this._show();
			}
			return this;
		},

		stop: function() {
			if (this.listenerLoad) {
				this._removeLoadEvent();
			}
			if (!this.isRun) return this;
			this.isRun = false;
			this.loop.remove(this._run);
			return this;
		},

		play: function() {
			if (this.listenerLoad) {
				this._removeLoadEvent();
			}
			if (this.isRun) return this;
			this.isRun = true;
			this.loop.add(this._run, this);
			return this;
		},

		start: function() {
			this._set(0);
			this.coe = this.coeStep1;
			this.targetValue = this.valueStep1;
			this._show();
			return this.play();
		},

		done: function() {
			this.coe = this.coeStep3;
			this.targetValue = this.valueStep3;
			return this.play();
		},

		fail: function() {
			this.coe = this.coeStep4;
			this.targetValue = this.valueStep4;
			return this.play();
		}
	};

	var progress = new Progress();

	return progress;

}));
