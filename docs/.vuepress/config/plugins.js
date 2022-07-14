const path = require('path')
const fs  = require('fs')
const MarkdownIt  = require('markdown-it')
const mdContainer = require('markdown-it-container')
const highlight = require('../utils/highlight')
const paths = require('../utils/paths')
const localMd = MarkdownIt()
const scriptSetupRE = /<\s*script[^>]*/

module.exports = (md) => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {

      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const { children } = sourceFileToken;
        const sourceFile = children && children[0] ? children[0].content : ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve(paths.docRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        return `<Demo source="${encodeURIComponent(
          highlight(source, 'vue')
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(localMd.render(description))}">`
      } else {
        return '</Demo>'
      }
    },
  })
}
