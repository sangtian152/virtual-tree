import ElIcon from './src/icon';

/* istanbul ignore next */
ElIcon.install = function(Vue) {
  Vue.component(ElIcon.name, ElIcon);
};

export default ElIcon;
