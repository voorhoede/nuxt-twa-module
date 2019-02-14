const Jimp = require('jimp')
const consola = require('consola')
const fs = require('fs')

module.exports = function generateIcons(iconPath, androidIconsPath) {
    if (!iconPath) {
        return consola.error('Nuxt TWA: iconPath and androidIconsPath are required')
    }
    
    if (!androidIconsPath || !fs.existsSync(androidIconsPath)) {
        return consola.error('Nuxt TWA: Android icons path invalid')
    }

    return Jimp.read(iconPath)
        .then(icon => {
            // generate icons in desired formats
            // NOTE: order needs to be from large to small
            icon
                .resize(192, 192).write(androidIconsPath + '/mipmap-xxxhdpi/ic_launcher.png')
                .resize(144, 144).write(androidIconsPath + '/mipmap-xxhdpi/ic_launcher.png')
                .resize(96, 96).write(androidIconsPath + '/mipmap-xhdpi/ic_launcher.png')
                .resize(72, 72).write(androidIconsPath + '/mipmap-hdpi/ic_launcher.png')
                .resize(48, 48).write(androidIconsPath + '/mipmap-mdpi/ic_launcher.png')
            
            return consola.success('Nuxt TWA: app icons generated')
        })
        .catch( (error) => {
            consola.error("Nuxt TWA: iconPath: no such file or directory")
        })
  }