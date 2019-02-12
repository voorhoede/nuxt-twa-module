# TWA module for nuxt

This module generates an android app using [trusted web activities](https://developers.google.com/web/updates/2019/02/using-twa). It uses the [SVGOMG example](https://github.com/GoogleChromeLabs/svgomg-twa) as template reference, and sets the necessery configuration for running the app, generates icons and files used by the PWA.

Trusted web activities only work when you are using a legitimate service worker, so we highly recommend using the [PWA module](https://github.com/nuxt-community/pwa-module) or setting up a PWA yourself.