const consola = require('consola')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const prepareAppFolder = require('./helpers/index.js')
const generateIcons = require('../lib/generate-icons')
const generateBuildFile = require('../lib/generate-build-file')
const { generateAssetLinksFile, generateConfig } = require('../lib/generate-asset-links-file')

describe('Test TWA module', () => {
    const iconPath = path.resolve(__dirname, 'fixture/static/icon.png')
    const testFolder =  path.resolve(__dirname, 'test-env')

    beforeAll(() => {
        // Redirect std and console to consola too
        // Calling this once is sufficient
        consola.wrapAll()
        if(fs.existsSync(testFolder)){ 
            rimraf(testFolder, (error) => console.log(error))
        }
        fs.mkdirSync(testFolder, { recursive: true })
    })

    beforeEach(() => { 
        // Re-mock consola before each test call to remove
        // calls from before
        consola.mockTypes(() => jest.fn()) 
    })

    afterAll( () => {
        return rimraf(testFolder, (error) => console.log(error))
    })

    describe('Test generate-icons', () => {
        const destination =  path.resolve(testFolder, 'res/')

        beforeAll( () => {
            fs.mkdirSync(destination, { recursive: true })
        })

        test('Get error when no icon is defined', async () => {
            expect.assertions(1)
            try {
                await generateIcons('', destination)
            } catch (error) {
                expect(error)
                    .toMatch(/No iconPath defined/)
            }
        })

        test('Get error when run with non-existing directory', async () => {
            expect.assertions(1)
            try {
                await generateIcons(iconPath, 'other/path')
            } catch (error) {
                expect(error)
                    .toMatch(/Invalid or non-existing/)
            }
        })

        test('Get error when run with invalid icon file', async () => {
            expect.assertions(1)
            try {
                await generateIcons('path/to/invalid/icon', destination)
            } catch (error) {
                expect(error)
                    .toMatch(/Invalid iconPath/)
            }
        })

        test('Try to generate icons', async () => {
            expect.assertions(1)
            let value = ''
            try {
                value = await generateIcons(iconPath, destination)
            } finally {
                expect(value)
                    .toBe(true)
            }
        })
    })

    describe('Test generate-build-file', () => {
        const appDirectory =  path.resolve(__dirname, 'test-env/app')
        const gradleFile = path.resolve(__dirname, 'test-env/app/build.gradle')
        const buildOptions = {
            defaultUrl: 'test',
            hostName: 'test123',
            sha256Fingerprints: '123',
            iconPath: 'fixture/static/icon.png'
        }

        const missingDefaultUrl = {
            hostName: 'test123',
        }

        const missingHostname = {
            defaultUrl: 'test123',
        }

        // Create app folder and a fresh copy of build.gradle
        beforeAll(() => {
            prepareAppFolder(appDirectory)
        })
        

        test('Get error when gradle file is undefined', async () => {
            expect.assertions(1)
            try {
                await generateBuildFile(buildOptions, '')
            } catch (error) {
                expect(error)
                    .toMatch(/Gradle file not found/)
            }
        })

        test('Get error when options are empty', async () => {
            expect.assertions(1)
            try {
                await generateBuildFile({}, gradleFile)
            } catch (error) {
                expect(error)
                    .toMatch(/Module options are empty/)
            }
        })

        test('Get error when options are empty', async () => {
            expect.assertions(1)
            try {
                await generateBuildFile(missingDefaultUrl, gradleFile)
            } catch (error) {
                expect(error)
                    .toMatch(/options.defaultUrl is missing/)
            }
        })

        test('Get error when options are empty', async () => {
            expect.assertions(1)
            try {
                await generateBuildFile(missingHostname, gradleFile)
            } catch (error) {
                expect(error)
                    .toMatch(/options.hostName is missing/)
            }
        })

        test('Try to generate build file', async () => {
            expect.assertions(1)
            let value = ''
            try {
                value = await generateBuildFile(buildOptions, gradleFile)
            } finally {
                expect(value)
                    .toBe(true)
            }
        })
    })
    
    describe('Test generate-asset-links-file', () => {
        const options = {
            applicationId: "test",
            sha256Fingerprints: "123"
        }

        const mockdata = [{
            "relation": ["delegate_permission/common.handle_all_urls"],
            "target": {
                "namespace": "android_app",
                "package_name": "test",
                "sha256_cert_fingerprints": "123"
            },
        }]

        test('Get error when no options are passed', async () => {
            expect.assertions(1)
            try {
                await generateAssetLinksFile({}, '')
            } catch (error) {
                expect(error)
                .toMatch(/Missing SHA256/)
            }
        })

        test('Get error when destination path is invalid', async() => {
            expect.assertions(1)
            try {
                await generateAssetLinksFile(options, '')
            } catch (error) {
                expect(error)
                .toMatch(/No destination path/)
            }
        })

        test('Try to generated config', async () => {
            expect.assertions(1)
            let value = ''
            try {
                value = await generateAssetLinksFile(options, testFolder)
            } finally {
                expect(value)
                    .toBe(true)
            }
        })

        test('Test generated config', () => {
            const generatedConfig = generateConfig(options)
            expect(generatedConfig).toEqual(mockdata)
        })
    })
})
 

