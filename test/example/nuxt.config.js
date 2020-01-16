const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    {
      handler: require('../../'), options: {
        hostName: 'test.com',
        defaultUrl: 'https://test.com',
        sha256Fingerprints: ['123'],
        iconPath: '/test/fixture/static/icon.png',
        distFolder: '/test/example/.nuxt/dist/client',
        androidFolder: './test/example/android/'
      }
    }
  ]
}