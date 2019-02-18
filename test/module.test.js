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
        const iconFolder =  path.resolve(testFolder, 'res/')

        beforeAll( () => {
            fs.mkdirSync(iconFolder, { recursive: true })
        })

        test('Give errors when generating icons without options', async () => {
            generateIcons();
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('Nuxt TWA: iconPath and androidIconsPath are required')
        })

        test('Give error on invalid Android folder', async () => {
            await generateIcons(iconPath, 'other/path')
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain("Nuxt TWA: Android icons path invalid")
        })

        test('Give error on invalid iconPath', async () => {
            await generateIcons('path/to/invalid/icon', iconFolder)
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain("Nuxt TWA: iconPath: no such file or directory")
        })

        test('Give success message when icons are generated', async () => {
            await generateIcons(iconPath, iconFolder)
            const consolaMessages = consola.success.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain("Nuxt TWA: app icons generated")
        })
    })

    describe('Test generate-build-file', () => {
        const appDirectory =  path.resolve(__dirname, 'test-env/app')
        const buildOptions = {
            testString: 'Hello World'
        }

        // Create app folder and a fresh copy of build.gradle
        beforeAll(() => {
            prepareAppFolder(appDirectory)
        })

        const gradleFile = path.resolve(__dirname, 'test-env/app/build.gradle')

        test('GenerateBuildFile: run with unknown gradlefile', async () => {
            await generateBuildFile(buildOptions, '')
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('GenerateBuildFile: gradle file not found, does android folder exists?')
        })

        test('GenerateBuildFile: run without options', async () => {
            await generateBuildFile({}, gradleFile)
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('GenerateBuildFile: Options object is empty')
        })

        test('GenerateBuildFile: successfully create gradle file', async () => {
            await generateBuildFile(buildOptions, gradleFile)
            const consolaMessages = consola.success.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('TWA build.gradle generated')
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

        test('GenerateAssetLinksFile: test without options', () => {
            generateAssetLinksFile({}, '')
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('GenerateAssetLinks: Missing SHA256 key to generate .well-known')
        })

        test('GenerateAssetLinksFile: test without path', () => {
            generateAssetLinksFile(options, '')
            const consolaMessages = consola.error.mock.calls.map(c => c[0])
            expect(consolaMessages).toContain('GenerateAssetLinks: No destination path defined')
        })

        test('GenerateAssetLinksFile: test generated config', async () => {
            await generateAssetLinksFile(options, testFolder)
            const consolaMessages = consola.success.mock.calls.map(c => c[0])
            expect(consolaMessages[0]).toMatch(/GenerateAssetLinks: created/)
        })

        test('GenerateAssetLinksFile: test generated config', () => {
            const generatedConfig = generateConfig(options)
            expect(generatedConfig).toEqual(mockdata)
        })
        
    })
})
 

