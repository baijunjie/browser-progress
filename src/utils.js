let testElem = document.createElement('div');

// 返回支持的属性名
function getSupportPropertyName(prop) {
    if (prop in testElem.style) return prop;

    let testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
        prefixs = [ 'Webkit', 'Moz', 'ms', 'O' ];

    for (let i = 0, l = prefixs.length; i < l; i++) {
        let prefixProp = prefixs[i] + testProp;
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

export let support = {};
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
let guid = 0;
export function proxy(func, target) {
    if (typeof target === 'string') {
        let tmp = func[target];
        target = func;
        func = tmp;
    }

    if (typeof func !== 'function') {
        return undefined;
    }

    let slice = Array.prototype.slice,
        args = slice.call(arguments, 2),
        proxy = function() {
            return func.apply(target || this, args.concat(slice.call(arguments)));
        };

    proxy.guid = func.guid = func.guid || guid++;

    return proxy;
}

export function css(elem, prop, value) {
    if (typeof prop === 'object') {
        for (var p in prop) {
            elem.style[p] = prop[p];
        }
    } else if (typeof value !== 'undefined') {
        elem.style[prop] = value;
    }
    return this;
}