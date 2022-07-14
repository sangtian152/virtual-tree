const path = require('path')
const vpRoot = path.resolve(__dirname, '..')
const docRoot = path.resolve(vpRoot, '..')
const projRoot = path.resolve(docRoot, '..')
module.exports.vpRoot = vpRoot
module.exports.docRoot = docRoot
module.exports.projRoot = projRoot
