import mainloop from 'mainloop';
import { support, proxy, css } from './utils';

class Progress {
    constructor(color) {
        this._init(color);
    }

    _init(color) {
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
        this._stepCallback = function() {};

        this._createElem();
        this.color(color || '#000');

        this._loadedHandle = proxy(this._loadedHandle, this);

        if (document.readyState !== 'complete') {
            this.start();
            this._addLoadEvent();
        }
    }

    _createElem() {
        this._progress = document.createElement('div');
        this._progressHeadLeft = document.createElement('div');
        this._progressHeadRight = document.createElement('div');

        css(this._progress, {
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

        css(this._progressHeadLeft, {
            'position': 'absolute',
            'right': '-80px',
            'top': 0,
            'width': '180px',
            'height': '100%',
            'opacity': .6,
            'border-radius': '100%',
            'clip': 'rect(-6px,90px,14px,-6px)'
        });

        css(this._progressHeadRight, {
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
    }

    _addDocument() {
        if (document.body) {
            document.body.appendChild(this._progress);
        } else {
            setTimeout(this._addDocument);
        }
    }

    _loadedHandle() {
        this.done();
    }

    _addLoadEvent() {
        this._listenerLoad = true;
        if (window.addEventListener) window.addEventListener('load', this._loadedHandle, false);
        else if (window.attachEvent) window.attachEvent('onload', this._loadedHandle);
        else window.onload = this._loadedHandle;
    }

    _removeLoadEvent() {
        this._listenerLoad = false;
        if (window.removeEventListener) window.removeEventListener('load', this._loadedHandle, false);
        else if (window.detachEvent) window.detachEvent('onload', this._loadedHandle);
        else window.onload = null;
    }

    _run() {
        let v = this._value,
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

    _hide(animate) {
        if (!this._isShow) return;
        this._isShow = false;

        // 如果 animate 为 0 或者 undefined 这表示不需要淡出动画
        // 否则以 this._hideDuration 的时长进行淡出
        this.fadeOut(this._progress, (animate || 0) && this._hideDuration);
        return this;
    }

    _show() {
        if (this._isShow) return;
        this._isShow = true;

        if (this._timerID > 0) {
            clearTimeout(this._timerID);
            this._timerID = 0;
            this._fadeOutCallback();
        }

        css(this._progress, 'display', 'block');
        return this;
    }

    _set(value) {
        this._value = value;
        if (support.transform) {
            let transform = 'translate(' + (value * 100) + '%,0)';
            if (support.transform3d) {
                transform += ' translateZ(0)';
            }
            css(this._progress, support.transform, transform);
        } else {
            css(this._progress, 'right', (this._valueStep3 - value) * 100 + '%');
        }
        this._stepCallback(value);
        return this;
    }

    appendTo(elem, style) {
        elem && elem.appendChild(this._progress);
        style && css(this._progress, style);
        return this;
    }

    color(color) {
        css(this._progress, 'background', color);
        css(this._progressHeadLeft, 'box-shadow', '1px 0 6px 1px ' + color);
        css(this._progressHeadRight, 'box-shadow', '1px 0 6px 1px ' + color);
        return this;
    }

    set(value) {
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

    stop() {
        if (this._listenerLoad) {
            this._removeLoadEvent();
        }

        if (!this._isRun) return this;

        this._isRun = false;
        mainloop.remove(this._run);
        return this;
    }

    play() {
        if (this._listenerLoad) {
            this._removeLoadEvent();
        }

        if (this._isRun) return this;

        this._isRun = true;
        mainloop.add(this._run, this);
        return this;
    }

    start() {
        this._set(0);
        this._coe = this._coeStep1;
        this._targetValue = this._valueStep1;
        this._show();
        return this.play();
    }

    done() {
        this._coe = this._coeStep3;
        this._targetValue = this._valueStep3;
        return this.play();
    }

    fail() {
        this._coe = this._coeStep4;
        this._targetValue = this._valueStep0;
        return this.play();
    }

    hide() {
        css(this._progress, 'visibility', 'hidden');
        return this;
    }

    show() {
        css(this._progress, 'visibility', 'visible');
        return this;
    }

    step(callback) {
        this._stepCallback = callback;
        return this;
    }

    fadeOut(elem, duration, callback) {
        if (typeof duration === 'function') {
            callback = duration;
            duration = this._hideDuration;
        } else if (typeof duration !== 'number') {
            duration = this._hideDuration;
        }

        // 这里使用异步，是为了等待视图完全刷新到 100% 状态后在执行隐藏操作
        // 否则会出现视图在 99% 时，进度条就隐藏了
        setTimeout(() => {
            if (duration && support.transition) {
                // 如果之前调用过 fadeOut, 这里将生成的 this._fadeOutCallback 保存至 fadeOutCallback
                // 在新的 this._fadeOutCallback 开始执行时，先执行之前的 fadeOutCallback
                let fadeOutCallback = this._fadeOutCallback;
                this._fadeOutCallback = () => {
                    fadeOutCallback && fadeOutCallback.call(this);
                    css(elem, 'display', 'none');
                    css(elem, support.transition, '');
                    css(elem, 'opacity', 1);
                    callback && callback.call(this);
                    this._fadeOutCallback = null;
                };

                css(elem, support.transition, 'opacity ' + duration + 'ms');
                css(elem, 'opacity', 0);

                if (this._timerID > 0) clearTimeout(this._timerID);
                this._timerID = setTimeout(() => {
                    this._timerID = 0;
                    this._fadeOutCallback();
                }, duration);
            } else {
                css(elem, 'display', 'none');
                callback && callback.call(this);
            }
        });

        return this;
    }
}

export default new Progress();
