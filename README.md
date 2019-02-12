# Nuxt TWA module


[![npm style guide](https://img.shields.io/npm/v/nuxt-twa-module.svg?style=flat)](https://github.com/voorhoede/nuxt-twa-module)


This module generates an android app using [trusted web activities](https://developers.google.com/web/updates/2019/02/using-twa). It uses the [SVGOMG example](https://github.com/GoogleChromeLabs/svgomg-twa) as template reference, and sets the necessery configuration for running the app, generates icons and files used by the PWA.


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
        defaultUrl: 'http://drinks-app.netlify.com', 
        hostName: 'drinks-app.netlify.com' 
        sha256Fingerprints: '/* your SHA-256 key */'

        /* optional */
        /* overwrite default location for icon */
        iconPath: '/static/icon.png' 
      }],

    ]
  }
```

The values in `defaultoptions` and module `options` will replace variables in the [build.gradle](https://github.com/voorhoede-labs/nuxt-twa-module/blob/master/android/app/build.gradle)

## Generating time 🏗

When the configuration is done you can run your project like you are used to.

```bash
  npm run generate

  or

  nuxt generate
```

### Output  

- An **android folder** in your project root, which you can be opened in android studio to [build your app](https://developer.android.com/studio/run/). When you've build and tested your app you can use [Generate Signed Bundle / APK](https://developer.android.com/studio/publish/app-signing). This will generate a .aab file that can be uploaded to the Google Play Store.
- You Nuxt app with an added `.well-known` folder which is needed to make your domain trusted with the app in the store.

---------------------
## Licence
[MIT](http://opensource.org/licenses/MIT)
