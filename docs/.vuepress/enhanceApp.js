import Tree from '@/index'
import Demo from '@docs/components/demo.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@docs/style/index.scss'
// import ViewUI from 'view-design';
// import 'view-design/dist/styles/iview.css';
export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
  }) => {
    // ...做一些其他的应用级别的优化
    // Vue.use(ViewUI);
    Vue.component('Demo', Demo)
    Vue.use(Tree)
    Vue.use(ElementUI);
  }