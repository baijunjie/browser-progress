let testElem = document.createElement('div');

// 返回支持的属性名
function getSupportPropertyName(prop) {
    if (prop in testElem.style) return prop;

    const testProp = prop.charAt(0).toUpperCase() + prop.substr(1),
        prefixs = [ 'Webkit', 'Moz', 'ms', 'O' ];

    for (let i = 0, l = prefixs.length; i < l; i++) {
        const prefixProp = prefixs[i] + testProp;
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

export const support = {};
support.transform = getSupportPropertyName('transform');
support.transition = getSupportPropertyName('transition');
support.transform3d = checkTransform3dSupport();
testElem = null;

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