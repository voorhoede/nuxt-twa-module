const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
      ['@@', {
          hostName: 'hey',
          defaultUrl:'hoi',
          iconPath: '/test/fixture/static/icon.png'
      }]
  ]
}
