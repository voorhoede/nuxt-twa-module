const Jimp = require('jimp');
const { promisify } = require('util');
const copydir = require('copy-dir');
const fs = require('fs')
const Handlebars = require('handlebars');
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const consola = require('consola')
const moduleRoot = __dirname

const asyncReadFile = promisify(fs.readFile)
const asyncWriteFile = promisify(fs.writeFile)
const asyncMkdirp = promisify(mkdirp)
const asyncRimRaf = promisify(rimraf)

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

    // replace the current /android directory with a fresh copy
    await asyncRimRaf(rootDir + '/android')
    await asyncMkdirp(rootDir + '/android')
    consola.info("Copying android app to /android")
    copydir.sync(moduleRoot + '/android', rootDir + '/android')

    generateBuildFile(options, rootDir)
    generateIcons(options, rootDir)
  })

  this.nuxt.hook('build:done', () => {
    generateAssetLinksFile(options, rootDir + '/.nuxt/dist/client')
  })

  this.nuxt.hook('generate:done', () => {
    generateAssetLinksFile(options, rootDir + '/dist')
    consola.success('Generated TWA assetlinks')
  })
}

async function generateBuildFile(options, rootDir) {
  try {
    // get template as string from android template
    const buildFileTemplate = await asyncReadFile(moduleRoot + '/android/app/build.gradle', 'utf8')
    const template = Handlebars.compile(buildFileTemplate)

    // create build.gradle file with variables
    const buildFile = template(options)
    await asyncWriteFile(rootDir + '/android/app/build.gradle', buildFile)

    consola.success('TWA build.gradle generated')
  } catch (err) {
    consola.error(err)
  }
}

async function generateAssetLinksFile(options, path) {
  if (options.sha256Fingerprints) {
    const config = [{
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": options.applicationId,
        "sha256_cert_fingerprints": options.sha256Fingerprints
      }
    }]

    const file = JSON.stringify(config)

    // create assetlink file in desired path
    await asyncMkdirp(path +'/.well-known')
    asyncWriteFile(path +'/.well-known/assetlinks.json', file)
  }
}

function generateIcons(options, rootDir) {
  const iconPath = rootDir + options.iconPath
  const androidIconsPath = rootDir + '/android/app/src/main/res'

  Jimp.read(iconPath, (err, icon) => {
    if (err) throw err

    if (icon) {
      // generate icons in desired formats
      // NOTE: order needs to be from large to small
      icon
        .resize(192, 192).write(androidIconsPath + '/mipmap-xxxhdpi/ic_launcher.png')
        .resize(144, 144).write(androidIconsPath + '/mipmap-xxhdpi/ic_launcher.png')
        .resize(96, 96).write(androidIconsPath + '/mipmap-xhdpi/ic_launcher.png')
        .resize(72, 72).write(androidIconsPath + '/mipmap-hdpi/ic_launcher.png')
        .resize(48, 48).write(androidIconsPath + '/mipmap-mdpi/ic_launcher.png')

      consola.success('TWA images generated')
    }
  });
}

module.exports.meta = require('./package.json')
