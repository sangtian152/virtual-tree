// 核心插件
import corePlugin from './plugin/core'
// 组件
import Tree from './tree'
// 样式
import "@/styles/index.scss";
import "@/styles/checkbox.scss";

const install = function (Vue) {
  Vue.component(Tree.name, Tree)
  Vue.use(corePlugin)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install, 
  Tree
}
