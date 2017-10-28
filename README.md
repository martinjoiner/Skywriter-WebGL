# Skywriter

Single page WebGL interface for an interactive skywriter plane. The plane will fly a dynamic path, turning on it's smoker at strategic points in order to write words using smoke trails in the sky.

The eventual goal is for it to continually fly, writing a never-ending stream of live Tweets.

## Installation

Clone down the repo to your machine and point the browser to `/public/index.html`. The whole page is static HTML and JavaScript.

## Developing

If you are changing the JavaScript you will need the NPM package [Gulp](https://www.npmjs.com/package/gulp) running so it can watch for changes to the JavaScript files and trigger a rebuild task that concatenates the files.

Run `npm install` to fetch the modules (you will need both Node and NPM installed on your machine for this).

Once that is done you can trigger the `watch` task simply type typing `gulp`:

```bash
gulp
``` 

## Client-side libraries

 - [Three.js library](http://threejs.org) for WebGL.
 - [MicroAjax](https://code.google.com/archive/p/microajax/) (modified to work in strict mode) for easy AJAX requests. 
