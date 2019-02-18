const { promisify } = require('util')
const consola = require('consola')
const mkdirp = require('mkdirp')
const fs = require('fs')
const asyncMkdirp = promisify(mkdirp)
const asyncWriteFile = promisify(fs.writeFile)

module.exports = {
    generateAssetLinksFile,
    generateConfig
}

/**
 * Create a assetlinks.json file in a .wellKnown folder
 * to create a links between the pwa and the app.
 * @param {Object} options 
 * @param {*} path 
 */
async function generateAssetLinksFile (options, path) {
    const directory = path +'/.well-known'
    
    if(!options.sha256Fingerprints) {
        return consola.error("GenerateAssetLinks: Missing SHA256 key to generate .well-known")
    }
    
    if(!path.length) {
        return consola.error("GenerateAssetLinks: No destination path defined")
    }
    
    const config = JSON.stringify(generateConfig(options))
    
    await asyncMkdirp(directory)
    await asyncWriteFile(`${directory}/assetlinks.json`, config)
    
    return consola.success(`GenerateAssetLinks: created ${directory}/assetlinks.json'`)
  }

function generateConfig (options) {
    return [{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
            "namespace": "android_app",
            "package_name": options.applicationId,
            "sha256_cert_fingerprints": options.sha256Fingerprints
        },
    }]
}