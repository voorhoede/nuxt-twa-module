const { readFileSync } = require('fs')
const { Nuxt, Builder, Generator } = require('nuxt-edge')
const path = require('path')
const request = require('request-promise-native')

const generateIcons = require('../lib/generate-icons')
const consola = require('consola')

const iconPath = path.resolve(__dirname, 'fixture/static/icon.png')
const androidIconsPath =  path.resolve(__dirname, '../android/app/src/main/res/');

describe('Test generate-icons', () => {
    beforeAll(() => {
        // Redirect std and console to consola too
        // Calling this once is sufficient
        consola.wrapAll()
    })

    beforeEach(() => {
        // Re-mock consola before each test call to remove
        // calls from before
        consola.mockTypes(() => jest.fn())
    })
  
    test('Give errors when generating icons without options', async () => {
        generateIcons();
        const consolaMessages = consola.error.mock.calls.map(c => c[0])
        expect(consolaMessages).toContain('Nuxt TWA: iconPath and androidIconsPath are required')
    })

    test('Give error on invalid Android folder', async () => {
        await generateIcons(iconPath, 'other/path');
        const consolaMessages = consola.error.mock.calls.map(c => c[0])
        expect(consolaMessages).toContain("Nuxt TWA: Android icons path invalid")
    })

    test('Give error on invalid iconPath', async () => {
        await generateIcons('path/to/invalid/icon', androidIconsPath);
        const consolaMessages = consola.error.mock.calls.map(c => c[0])
        expect(consolaMessages).toContain("Nuxt TWA: iconPath: no such file or directory")
    })

    test('Give success message when icons are generated', async () => {
        await generateIcons(iconPath, androidIconsPath);
        const consolaMessages = consola.success.mock.calls.map(c => c[0])
        expect(consolaMessages).toContain("Nuxt TWA: app icons generated")
    })
})
