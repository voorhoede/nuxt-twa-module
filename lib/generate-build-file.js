const { promisify } = require('util')
const Handlebars = require('handlebars')
const fs = require('fs')
const asyncReadFile = promisify(fs.readFile)
const asyncWriteFile = promisify(fs.writeFile)

/**
 * Retrieve build.gradle file from the android folder
 * Parse it with options through handlepars
 * return new gradle file
 * @param {Object} options - Object with module options
 * @param {String} gradleFile - path to file
 */
module.exports = async (options, gradleFile) => {
    if(!fs.existsSync(gradleFile)) {
        throw('Gradle file not found, does android folder exists?')
    }
    if(typeof options !== 'object' || Object.keys(options).length === 0 ) {
        throw('Module options are empty')
    }
    if(!('defaultUrl' in options)) {
        throw('Module options.defaultUrl is missing')
    }
    if(!('hostName' in options)) {
        throw('Module options.hostName is missing')
    }
    const gradleContent = await asyncReadFile(gradleFile, 'utf8')
    const template = Handlebars.compile(gradleContent)
    await asyncWriteFile(gradleFile, template(options))
    return true
}
