const rootPath = require('app-root-path')
const Jimp = require('jimp');
const { promisify } = require('util');
const copydir = require('copy-dir');
const fs = require('fs')
const Handlebars = require('handlebars');
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const consola = require('consola')
const appInfo = require(rootPath.path + '/package.json')

const asyncReadFile = promisify(fs.readFile)
const asyncWriteFile = promisify(fs.writeFile)
const asyncMkdirp = promisify(mkdirp)
const asyncRimRaf = promisify(rimraf)

const defaultOptions = {
  applicationId: `com.${appInfo.name}.${appInfo.name}`,
  launcherName: appInfo.name,
  versionCode: Number(String(appInfo.version).replace(/\./g, '')),
  versionName: appInfo.version,
  iconPath: '/static/icon.png'
}

function nuxtTwa (options) {
  if (!this.options.debug) {
    this.nuxt.hook('generate:before', async () => {
      if (!options.defaultUrl || !options.hostName) {
        consola.error('Nuxt TWA: You should at least set the hostName & defaultUrl in the config')
        return;
      }

      options = {
        ...defaultOptions,
        ...options
      }

      await asyncRimRaf(rootPath.path + '/android')
      consola.info("Copying android app to /android")
      copydir.sync('./plugins/nuxt-twa/android', rootPath.path + '/android')

      generateBuildFile(options)
      generateIcons(options)
    })

    this.nuxt.hook('build:done', () => generateAssetLinksFile(options, '/.nuxt/dist/client'))

    this.nuxt.hook('generate:done', () => {
      generateAssetLinksFile(options, '/dist')
      consola.success('Generated TWA assetlinks')
    })
  }
}

async function generateBuildFile(context) {
  try {
    const buildFileTemplate = await asyncReadFile(rootPath.path + '/plugins/nuxt-twa/android/app/build.gradle', 'utf8')
    const template = Handlebars.compile(buildFileTemplate)
    const buildFile = template(context)

    await asyncWriteFile(rootPath.path + '/android/app/build.gradle', buildFile)

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

    await asyncMkdirp(rootPath.path + path +'/.well-known')

    asyncWriteFile(rootPath.path + path +'/.well-known/assetlinks.json', file)
  }
}

function generateIcons({ iconPath }) {
  const androidIconsPath = rootPath.path + '/android/app/src/main/res'

  Jimp.read(rootPath.path + iconPath, (err, icon) => {
    if (err) throw err

    if (icon) {
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

module.exports = nuxtTwa
