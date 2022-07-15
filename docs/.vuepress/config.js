const path = require('path');
const mdPlugin = require('./config/plugins')

const buildTransformers = () => {
    const transformer = () => {
      return {
        props: [],
        needRuntime: true,
      }
    }
  
    const transformers = {}
    const directives = [
      'infinite-scroll',
      'loading',
      'popover',
      'click-outside',
      'repeat-click',
      'trap-focus',
      'mousewheel',
      'resize',
    ]
    directives.forEach((k) => {
      transformers[k] = transformer
    })
  
    return transformers
  }

module.exports = {
    title: 'Virtual Tree',
    description: '虚拟化树形控件，致力于解决数据量过大导致页面卡顿甚至崩溃问题',
    base: '/virtual-tree/', // 部署站点的基础路径
    dest: 'dist', // 指定 vuepress build 的输出目录
    markdown: {
        extendMarkdown: (md) => mdPlugin(md)
    },
    themeConfig: {
        sidebarDepth: 2,
        sidebar: [
            ['/zh/guide/', '介绍'],
            ['/zh/demo/', '示例'],
        ]
    },
    vue: {
        template: {
          ssr: true,
          compilerOptions: {
            directiveTransforms: buildTransformers(),
          },
        },
    },

    configureWebpack: {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '..', '../src'),
            '@docs': path.resolve(__dirname, './'),
            '@examples': path.resolve(__dirname, '../examples')
          }
        }
      }
}