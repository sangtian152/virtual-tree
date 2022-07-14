import Vue from 'vue';

export const keysOf = (arr) => Object.keys(arr);

export function debugWarn(scope, message) {
    if (process.env.NODE_ENV !== 'production') {
      const error = isString(scope)
        ? new ElementPlusError(`[${scope}] ${message}`)
        : scope
      // eslint-disable-next-line no-console
      console.warn(error)
    }
}

export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

const isClient = !Vue.prototype.$isServer

const hasOwnProperty = Object.prototype.hasOwnProperty;


export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

export function isNumber(obj) {
  return typeof obj === 'number' && !isNaN(obj)
}

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isFunction(val) {
  return typeof val === 'function';
}

export const isFirefox = () =>
  isClient && /firefox/i.test(window.navigator.userAgent)

export const rAF = (fn) =>
  isClient
    ? window.requestAnimationFrame(fn)
    : (setTimeout(fn, 16))

export const cAF = (handle) =>
  isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle)