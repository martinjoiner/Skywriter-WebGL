# Skywriter

NodeJS application written using the Express framework (https://www.npmjs.com/package/express).
Single HTML page for the interface and a RESTful API to feed live Twitter data obtained from the Twitter API using the npm Twitter package (https://www.npmjs.com/package/twitter). 

**Gulp** used to...
1. Watch for changes to client-side JavaScript and trigger a rebuild (gulp-concat, gulp-uglify) and... 
2. Watch for changes to server-side script and restart the NodeJS application

TODO: Unit tests, Jenkins deploy

## Client-side assets

WebGL interface written in JavaScript using the three.js library (http://threejs.org).
Asynchonous requests for live Twitter content is acheived using a modified version of MicroAjax (https://code.google.com/archive/p/microajax/) that I changed to work in strict mode. 
