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
        return consola.error('GenerateBuildFile: gradle file not found, does android folder exists?')
    }

    if(Object.keys(options).length === 0) {
        return consola.error('GenerateBuildFile: Options object is empty')
    }

    // const processedTemplate = processTemplate(options, gradleFile)
    const buildFileTemplate = await asyncReadFile(gradleFile, 'utf8')
    const template = Handlebars.compile(buildFileTemplate)

    // create build.gradle file with variables
    const buildFile = template(options)

    await asyncWriteFile(gradleFile, buildFile)
    consola.success('TWA build.gradle generated')
}
