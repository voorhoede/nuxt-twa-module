const Jimp = require('jimp')
const fs = require('fs')

/**
 * Generate icons for android app
 * @param {String} iconPath - Location of source icon file
 * @param {String} destination - destination folder for generated output 
 */
module.exports = function generateIcons(iconPath, destination) {
    if (!iconPath) {
        throw (`No iconPath defined got: "${iconPath}" `)
    }
    
    if (!destination || !fs.existsSync(destination)) {
        throw (`Invalid or non-existing destination got:"${destination}" `)
    }

    return Jimp.read(iconPath)
        .then(icon => {
            // generate icons in desired formats
            // NOTE: order needs to be from large to small
            icon
                .resize(192, 192).write(destination + '/mipmap-xxxhdpi/ic_launcher.png')
                .resize(144, 144).write(destination + '/mipmap-xxhdpi/ic_launcher.png')
                .resize(96, 96).write(destination + '/mipmap-xhdpi/ic_launcher.png')
                .resize(72, 72).write(destination + '/mipmap-hdpi/ic_launcher.png')
                .resize(48, 48).write(destination + '/mipmap-mdpi/ic_launcher.png')
            
            return true
        })
        .catch( () => {
            throw `Error Invalid iconPath got: "${iconPath}"`
        })
  }