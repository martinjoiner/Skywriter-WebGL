'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

var scripts = {
  vendor: [
      './src/js/vendor/three-r87.min.js', 
      './src/js/vendor/OrbitControls.js', 
      './src/js/vendor/TGALoader.js', 
      './src/js/vendor/microajax-strict.js',
      './src/js/vendor/noise.js'
  ],
  app: [
      './src/js/splineFactory.js',
      './src/js/smoke.js',
      './src/js/plane.js',
      './src/js/words.js',
      './src/js/sounds.js',
      './src/js/app.js',
      './src/js/keys.js'
    ]
};

/** Rebuild the vendor libraries scripts */
gulp.task('build_vendor_bundle', function(){

  return gulp.src(scripts.vendor)
    .pipe( concat('vendor_bundle.min.js') )
    .pipe( uglify() )
    .pipe( gulp.dest('./public/js') );

});

/** Rebuild the app scripts */
gulp.task('build_app_scripts', function(){

	return gulp.src(scripts.app)
		.pipe( concat('app.min.js') )
		//.pipe( uglify() )
		.pipe( gulp.dest('./public/js') );

});

/** Start the development environment */
gulp.task('default', function() {

  // Watch the scripts for changes to trigger a rebuild
  gulp.watch(scripts.vendor, ['build_vendor_bundle']);

  gulp.watch(scripts.app, ['build_app_scripts']);

});
