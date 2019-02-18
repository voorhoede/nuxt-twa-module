const path = require('path')
const fs = require('fs')
const consola = require('consola')
const rimraf = require('rimraf')

/** prepare the app folder for the generate build file tests */
module.exports = function prepareAppFolder (directory) {
    const originalGradle = path.resolve(__dirname, '../fixture/mockdata/build.gradle')
    const copiedGradlePath = path.resolve(__dirname, '../test-env/app/build.gradle')

    if(fs.existsSync(directory)){ 
        rimraf(directory, (error) => {
            return consola.error(error)
        })
    }

    fs.mkdirSync(directory)

    fs.copyFile(originalGradle, copiedGradlePath, (err) => {
        if (err) return consola.error(err);
        return consola.success('prepareAppFolder: copied original gradle to test folder');
    });

}