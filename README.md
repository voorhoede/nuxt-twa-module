# Nuxt TWA module

[![npm style guide](https://img.shields.io/npm/v/nuxt-twa-module.svg?style=flat)](https://github.com/voorhoede-labs/nuxt-twa-module) [![Nuxt TWA module](https://img.shields.io/codecov/c/github/voorhoede/nuxt-twa-module.svg?style=flat)](https://codecov.io/gh/voorhoede/nuxt-twa-module) [![Nuxt TWA module](https://img.shields.io/circleci/project/github/voorhoede/nuxt-twa-module/master.svg?style=flat)](https://circleci.com/gh/voorhoede/nuxt-twa-module) [![Greenkeeper badge](https://badges.greenkeeper.io/voorhoede/nuxt-twa-module.svg)](https://greenkeeper.io/)

**Nuxt module to transform your PWA into an Android app, using Trusted Web Activities (TWA)**

[Trusted Web Activities](https://developers.google.com/web/updates/2019/02/using-twa) (TWA) allow you to package a Progressive Web App (PWA) in an Android App. You can upload this app to the Google Play Store. This module sets the necessery configuration for running the app, creates icons and generates files used by the application.

## Requirements

Trusted Web Activities only work when you are using a legitimate service worker, so we highly recommend using the [PWA module](https://github.com/nuxt-community/pwa-module) or setting up a PWA yourself.

To upload an app to the Google Play Store you **need a key** for signing. To create one follow [these instructions](https://developer.android.com/studio/publish/app-signing)

**Important notice**

> Store the key in a safe place, if you uploaded your app with a key you will need the **same key** for each update.

After you've created this key you will need to copy the **SHA-256** for the nuxt configuration file by running this command:

```bash
keytool -list -v -keystore LOCATION_OF_YOUR_KEY.keystore
```

You will need Android Studio to create the signed app.

## Installation 🚀

```bash
npm install nuxt-twa-module --save-dev
```

## Setting up configuration

Add `nuxt-twa-module` to `modules` section of `nuxt.config.js`.

```js
  {
    modules: [
      ['nuxt-twa-module', {
        /* module options */
        defaultUrl: 'https://your-url.com',
        hostName: 'your-url.com',
        sha256Fingerprints: [/* your SHA-256 keys */],
        applicationId: 'com.example.example',
        launcherName: 'Your app name',
        versionCode: 1,
        versionName: '1.0',
        statusBarColor: /* color */,

        /* optional */
        /* overwrite default location for icon */
        iconPath: '/static/icon.png'
        /* Overwrite folder where to put .wellknown */
        distFolder: '.nuxt/dist/client',
      }],
    ]
  }
```

## Time to build 🏗

When the configuration is done you can run your project like you are used to.

```bash
npm run build
```

or

```bash
npm run generate
```

### Output

- An `android` folder in your project root, which you can open in Android Studio to [build your app](https://developer.android.com/studio/run/). When you've build and tested your app you can use [Generate Signed Bundle/APK](https://developer.android.com/studio/publish/app-signing). This will generate a .aab file that can be uploaded to the Google Play Store.
- You Nuxt app with an added `.well-known` folder which is needed to make your domain trusted with the app in the store.

## Debug

To be able to test the Android application, you need to tell Chrome on your device it can trust your PWA. For this you need to have `android-platform-tools` installed on your machine.

```bash
brew cask install android-platform-tools
```

In Chrome on your device, go to `chrome://flags` and enable `Enable command line on non-rooted devices`

On your machine, run the following command to whitelist your URL in Chrome:

```bash
adb shell "echo '_ --disable-digital-asset-link-verification-for-url=\"<your URL>\"' > /data/local/tmp/chrome-command-line"
```

## Links

- [Trusted Web Activities](https://developers.google.com/web/updates/2019/02/using-twa)
- [SVGOMG example](https://github.com/GoogleChromeLabs/svgomg-twa) used as template in this module.
- [Drinks app in the Google Play Store](https://play.google.com/store/apps/details?id=com.voorhoede.drinks)

---

## Licence

[MIT](LICENSE)
