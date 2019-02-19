const { promisify } = require('util')
const Handlebars = require('handlebars')
const fs = require('fs')
const consola = require('consola')
const asyncReadFile = promisify(fs.readFile)
const asyncWriteFile = promisify(fs.writeFile)

/**
 * Retrieve build.gradle file from the android folder
 * Parse it with options through handlepars
 * return new gradle file
 * @param {*} options 
 * @param {*} gradleFile 
 */

module.exports = async (options, gradleFile) => {
    if(!fs.existsSync(gradleFile)) {
        throw('GenerateBuildFile: gradle file not found, does android folder exists?')
    }

    if(Object.keys(options).length === 0) {
        throw('GenerateBuildFile: Options object is empty')
    }

    const gradleContent = await asyncReadFile(gradleFile, 'utf8')
    const template = Handlebars.compile(gradleContent)
    await asyncWriteFile(gradleFile, template(options))

    return true
}
