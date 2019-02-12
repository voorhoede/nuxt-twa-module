# Nuxt TWA module


[![npm style guide](https://img.shields.io/npm/v/nuxt-twa-module.svg?style=flat)](https://github.com/voorhoede-labs/nuxt-twa-module)


This module generates an android app using [trusted web activities](https://developers.google.com/web/updates/2019/02/using-twa). It uses the [SVGOMG example](https://github.com/GoogleChromeLabs/svgomg-twa) as template reference and sets the necessery configuration for running the app, creates icons and generates files used by the application.


## Requirements
Trusted web activities only work when you are using a legitimate service worker, so we highly recommend using the [PWA module](https://github.com/nuxt-community/pwa-module) or setting up a PWA yourself.

To upload an app to the Google Play Store you **need a key** for signing. To create one follow [these instructions](https://developer.android.com/studio/publish/app-signing) 

**Important notice**
> Store the key in safe place, if you uploaded your app with a key you will need the **same key** for each update. 

After you've created this key you will need to copy the **SHA-256** for the nuxt configuration file by running this code

```bash 
$ keytool -list -v -keystore LOCATION_OF_YOUR_KEY.keystore
```

## Installation 🚀

```bash    
$ npm install nuxt-twa-module --save-dev
```

## Setting up configuration

Add `nuxt-twa-module` to `modules` section of `nuxt.config.js`.

```bash
  {
    modules: [
      ['nuxt-twa-module', {
        /* module options */
        defaultUrl: 'http://your-url.com', 
        hostName: 'your-url.com',
        sha256Fingerprints: '/* your SHA-256 key */',
        applicationId: 'com.example.example',
        launcherName: 'Your app name',
        versionCode: 1,
        versionName: '1.0'

        /* optional */
        /* overwrite default location for icon */
        iconPath: '/static/icon.png' 
      }],

    ]
  }
```

The values in `defaultoptions` and module `options` will replace variables in the [build.gradle](https://github.com/voorhoede-labs/nuxt-twa-module/blob/master/android/app/build.gradle)

## Time to build 🏗

When the configuration is done you can run your project like you are used to.

```bash
$ npm run build/generate
```
or 
```bash
$ nuxt build/generate
```

### Output  

- An **android folder** in your project root, which you can be opened in android studio to [build your app](https://developer.android.com/studio/run/). When you've build and tested your app you can use [Generate Signed Bundle / APK](https://developer.android.com/studio/publish/app-signing). This will generate a .aab file that can be uploaded to the Google Play Store.
- You Nuxt app with an added `.well-known` folder which is needed to make your domain trusted with the app in the store.

## Debug

To be able to test the android application, you need to tell chrome on your device it can trust your PWA. For this you need to have `android-platform-tools` installed on your machine.

```bash
$ brew cask install android-platform-tools
```

On chrome on your device, go to `chrome://flags` and enable `Enable command line on non-rooted devices`

On your machine, run the following command to whitelist your URL in chrome:
```bash
$ adb shell "echo '_ --disable-digital-asset-link-verification-for-url=\"<your URL>\"' > /data/local/tmp/chrome-command-line"
```

---------------------
## Licence
[MIT](http://opensource.org/licenses/MIT)
