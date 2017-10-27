'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

/** Rebuild the vendor libraries scripts */
gulp.task('build_vendor_bundle', function(){

  return gulp.src([
      './src/js/vendor/three-r87.min.js', 
      './src/js/vendor/OrbitControls.js', 
      './src/js/vendor/microajax-strict.js'
    ])
    .pipe( concat('vendor_bundle.min.js') )
    //.pipe( uglify() )
    .pipe( gulp.dest('./public/js') );

});

/** Rebuild the app scripts */
gulp.task('build_app_scripts', function(){

	return gulp.src([
      './src/js/splineFactory.js',
      './src/js/smoke.js',
      './src/js/plane.js',
      './src/js/words.js',
			'./src/js/app.js'
		])
		.pipe( concat('app.min.js') )
		//.pipe( uglify() )
		.pipe( gulp.dest('./public/js') );

});

/** Start the development environment */
gulp.task('default', function() {

  // Watch the client side JavaScript for changes to trigger a rebuild
  gulp.watch(['./src/js/vendor/*.js'], ['build_vendor_bundle']);

  gulp.watch(['./src/js/*.js'], ['build_app_scripts']);

});
