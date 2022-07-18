import { isFunction } from './'
import { SlotsMixin } from '@/mixins/slots';


export function camelize(str) {
  const camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

function gen(name, mods) {
    if (!mods) {
      return '';
    }
  
    if (typeof mods === 'string') {
      return ` ${name}--${mods}`;
    }
  
    if (Array.isArray(mods)) {
      return mods.reduce((ret, item) => ret + gen(name, item), '');
    }
  
    return Object.keys(mods).reduce(
      (ret, key) => ret + (mods[key] ? gen(name, key) : ''),
      ''
    );
  }
  
  export function createBEM(name) {
    return function (el, mods) {
      if (el && typeof el !== 'string') {
        mods = el;
        el = '';
      }
  
      el = el ? `${name}__${el}` : name;
  
      return `${el}${gen(el, mods)}`;
    };
}

function install(vm, Vue) {
    const { name } = vm;
    Vue.component(name, vm);
    Vue.component(camelize(`-${name}`), vm);
}
  
// unify slots & scopedSlots
export function unifySlots(context) {
    // use data.scopedSlots in lower Vue version
    const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
    const slots = context.slots();
  
    Object.keys(slots).forEach((key) => {
      if (!scopedSlots[key]) {
        scopedSlots[key] = () => slots[key];
      }
    });
  
    return scopedSlots;
}

// should be removed after Vue 3
function transformFunctionComponent(
    pure
  ) {
    return {
      functional: true,
      props: pure.props,
      model: pure.model,
      render: (h, context) =>
        pure(h, context.props, unifySlots(context), context),
    };
  }
  
  export function createComponent(name) {
    return function(sfc){
      if (isFunction(sfc)) {
        sfc = transformFunctionComponent(sfc);
      }
  
      if (!sfc.functional) {
        sfc.mixins = sfc.mixins || [];
        sfc.mixins.push(SlotsMixin);
      }
  
      sfc.name = name;
      sfc.install = install;
  
      return sfc;
    };
  }

export function createNamespace(name) {
    name = 'vl-' + name;
    return [createComponent(name), createBEM(name)];
}