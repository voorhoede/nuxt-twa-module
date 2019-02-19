const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    { handler: require('../../'), options: {
        hostName: 'hoi',
        defaultUrl: 'hey',
        iconPath: '/test/fixture/static/icon.png',
        sha256Fingerprints: '123'
    } }
  ]
}