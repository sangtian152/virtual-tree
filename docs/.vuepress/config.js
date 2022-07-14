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
    title: 'Hello VuePress',
    description: 'Just playing around',
    base: '/', // 部署站点的基础路径
    dest: 'dist', // 指定 vuepress build 的输出目录
    markdown: {
        extendMarkdown: (md) => mdPlugin(md)
    },
    themeConfig: {
        sidebarDepth: 2,
        sidebar: [
            ['/zh/guide/', '介绍'],
            ['/zh/demo/', '示例'],
            ['/zh/home/', 'home'],
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