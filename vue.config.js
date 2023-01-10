const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    // 为packages目录添加babel-loader处理
    chainWebpack: config => {
        config.module
        .rule('js')
        .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options
            })
    },
}