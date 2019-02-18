const { promisify } = require('util')
const fs = require('fs')
const rimraf = require('rimraf')
const consola = require('consola')
const ncp = require('ncp')
const tmp  = require('tmp-promise')

const generateIcons = require('./lib/generate-icons')
const generateBuildFile = require('./lib/generate-build-file')
const generateAssetLinksFile = require('./lib/generate-asset-links-file')
const moduleRoot = __dirname

const asyncRimRaf = promisify(rimraf)
const asyncNcp = promisify(ncp)

module.exports = function nuxtTwa (options) {
  const { rootDir } = this.nuxt.options

  const pckg = require(rootDir + '/package.json')
  
  const defaultOptions = {
    applicationId: `com.${pckg.name}.${pckg.name}`,
    launcherName: pckg.name,
    versionCode: Number(String(pckg.version).replace(/\./g, '')),
    versionName: pckg.version,
    iconPath: '/static/icon.png'
  }
  
  this.nuxt.hook('build:before', async () => {
    if (!options.defaultUrl || !options.hostName) {
      if (!options.defaultUrl) consola.error('Nuxt TWA: defaultUrl is required')
      if (!options.hostName) consola.error('Nuxt TWA: hostName is required')
      
      return
    }
    
    options = {
      ...defaultOptions,
      ...options,
    }
    
    try {
      const tmpRes = await tmp.dir()
      const tempDir = tmpRes.path + '/android'
      
      consola.info("Generating android app files")
      
      await asyncNcp(moduleRoot + '/android', tempDir)
      
      await generateBuildFile(options, tempDir)

      const iconPath = rootDir + options.iconPath
      const androidIconsPath = tempDir + '/app/src/main/res'
      await generateIcons(iconPath, androidIconsPath, rootDir)
      
      await asyncNcp(tempDir, rootDir + '/android')
      
      asyncRimRaf(tempDir)
    } catch (err) {
      consola.log(err)
      
      if (fs.existsSync(tempDir)) {
        asyncRimRaf(tempDir)
      }
    }
  })

  this.nuxt.hook('build:done', () => {
    generateAssetLinksFile(options, rootDir + '/.nuxt/dist/client')
    consola.success('Generated TWA assetlinks')
  })

  this.nuxt.hook('generate:done', () => {
    generateAssetLinksFile(options, rootDir + '/dist')
  })
}

module.exports.meta = require('./package.json')
