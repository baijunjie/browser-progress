/*!
 * Pseudo progress v0.9
 * @author baijunjie
 *
 * https://github.com/baijunjie/progress
 */
(function(root, factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		root.bjj = root.bjj || {};
		root.bjj.progress = factory();
	}

}(this, function() {
	"use strict";

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
		this.timerID = -1;
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
			if (typeof func !== "function") return this;
			var f = func;
			if (target) {
				f = proxy(func, target);
			}
			this.runFunc.unshift(f);

			if (this.loopRun) return this;
			this.loopRun = true;
			if (!this.isStop) {
				this.timerID = this.requestAnimationFrame.call(window, this._loopCallback);
			}
			return this;
		},

		remove: function(func) {
			if (typeof func !== "function") return this;
			var i = this.runFunc.length;
			while (i--) {
				if (this.runFunc[i].guid === func.guid) {
					this.runFunc.splice(i, 1);
				}
			}
		},

		stop: function() { // 循环暂停运行
			if (this.isStop) return this;
			this.isStop = true;
			cancelAnimationFrame(this.timerID);
			return this;
		},

		play: function() { // 循环恢复运行
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
		if (typeof target === "string") {
			var tmp = func[target];
			target = func;
			func = tmp;
		}

		if (typeof func !== "function") {
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
		this.coeStep1 = .05;
		this.coeStep2 = .01;
		this.coeStep3 = .3;
		this.valueStep1 = 70;
		this.valueStep2 = 95;
		this.valueStep3 = 100;

		this.value = 0;
		this.targetValue = 100;
		this.coe = 1;
		this.isRun = false;
		this.isShow = false;

		this.loop = new Loop();
		this._init();
		this.color(color || "#2299dd");

		this._loadedHandle = proxy(this._loadedHandle, this);
		if (document.readyState !== "complete") {
			this.start();
			this._addLoadEvent();
		}
	}

	Progress.prototype = {
		_init: function() {
			this.progress = document.createElement("div");
			this.progressBar = document.createElement("div");
			this.progressInner = document.createElement("div");

			this._css(this.progress, {
				"display": "none",
				"opacity": 1,
				"-webkit-pointer-events": "none",
				"pointer-events": "none",
				"-webkit-user-select": "none",
				"-moz-user-select": "none",
				"user-select": "none",
				"position": "fixed",
				"top": 0,
				"z-index": 99999,
				"width": "100%"
			});

			this._css(this.progressBar, {
				"position": "absolute",
				"right": "100%",
				"width": "100%",
				"height": "2px"
			});

			this._css(this.progressInner, {
				"position": "absolute",
				"right": 0,
				"width": "100px",
				"height": "100%"
			});

			if (support.transform) {
				this._css(this.progressInner, support.transform, "rotate(3deg) translate(0px, -4px)");
			}

			this.progressBar.appendChild(this.progressInner);
			this.progress.appendChild(this.progressBar);
			document.body.appendChild(this.progress);
		},

		_loadedHandle: function() {
			this.finish();
			this._removeLoadEvent();
		},

		_addLoadEvent: function() {
			this.listenerLoad = true;
			if (window.addEventListener) window.addEventListener("load", this._loadedHandle, false);
			else if (window.attachEvent) window.attachEvent("onload", this._loadedHandle);
			else window.onload = this._loadedHandle;
		},

		_removeLoadEvent: function() {
			this.listenerLoad = false;
			if (window.removeEventListener) window.removeEventListener("load", this._loadedHandle, false);
			else if (window.detachEvent) window.detachEvent("onload", this._loadedHandle);
			else window.onload = null;
		},

		_run: function() {
			var v = this.value,
				d = this.targetValue - v,
				t = d * this.coe;
			if (d > .1) {
				v += t;
				this._set(v);
			} else {
				this._set(this.targetValue);
				if (this.targetValue === this.valueStep1) {
					this.coe = this.coeStep2;
					this.targetValue = this.valueStep2;
				} else {
					this.isRun = false;
					return false;
				}
			}
		},

		_hide: function() {
			if (!this.isShow) return;
			this.isShow = false;
			if (support.transition) {
				this._css(this.progress, "opacity", 0);
				this._css(this.progress, support.transition, "opacity " + this.hideDuration + "ms");
				var _this = this;
				window.setTimeout(function() {
					_this._css(_this.progress, "display", "none");
					_this._css(_this.progress, support.transition, "");
				}, this.hideDuration);
			} else {
				this._css(this.progress, "display", "none");
			}
			return this;
		},

		_show: function() {
			if (this.isShow) return;
			this.isShow = true;
			this._css(this.progress, {
				"display": "block",
				"opacity": 1
			});
			return this;
		},

		_css: function(elem, prop, value) {
			if (typeof prop === "object") {
				for (var p in prop) {
					elem.style[p] = prop[p];
				}
			} else if (typeof value !== "undefined") {
				elem.style[prop] = value;
			}
			return this;
		},

		_set: function(value) {
			this.value = value;
			if (support.transform) {
				var transform = "translate(" + value + "%,0)";
				if (support.transform3d) {
					transform += " translateZ(0)";
				}
				this._css(this.progressBar, support.transform, transform);
			} else {
				this._css(this.progressBar, "right", (100 - value) + "%");
			}

			if (value === this.valueStep3) {
				this._hide();
			}
			return this;
		},

		color: function(color) {
			this._css(this.progressBar, "background", color);
			this._css(this.progressInner, "box-shadow", "0 0 10px " + color + ", 0 0 5px " + color);
			return this;
		},

		set: function(value) {
			this._show();
			this.stop();
			value = Math.max(0, Math.min(100, value));
			this._set(value);
			return this;
		},

		stop: function() {
			if (!this.isRun) return this;
			this.isRun = false;
			this.loop.remove(this._run);
			return this;
		},

		play: function() {
			if (this.isRun) return this;
			this.isRun = true;
			if (this.value < this.valueStep1) {
				this.coe = this.coeStep1;
				this.targetValue = this.valueStep1;
			} else if (this.value < this.valueStep2) {
				this.coe = this.coeStep2;
				this.targetValue = this.valueStep2;
			} else if (this.value < this.valueStep3) {
				this.coe = this.coeStep3;
				this.targetValue = this.valueStep3;
			}
			this.loop.add(this._run, this);
			return this;
		},

		start: function() {
			if (this.listenerLoad) {
				this._removeLoadEvent();
			}
			this._set(0);
			this._show();
			this.play();
			return this;
		},

		finish: function() {
			this.coe = this.coeStep3;
			this.targetValue = this.valueStep3;
			this.play();
			return this;
		}
	};

	var progress = new Progress();

	return progress;

}));
