var gulp = require('gulp'),
	spawn = require('child_process').spawn,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	node;


/** Rebuild the scripts */
gulp.task('Rebuild-Scripts', function(){

	gulp.src([
			'src/javascript/vendor/three.min.js', 
			'src/javascript/vendor/microajax-strict.js', 
      'src/javascript/splineFactory.js',
			'src/javascript/app.js'
		])
		.pipe( concat('all.min.js') )
		//.pipe( uglify() )
		.pipe( gulp.dest('public/javascripts') );

});


/** Launch the server. If there's a server already running, kill it. */
gulp.task('Restart-Server', function() {
  if (node){
    node.kill();
  }

  node = spawn('node', ['./bin/www'], {stdio: 'inherit'});

  node.on('close', function (code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});


/** Start the development environment */
gulp.task('default', ['Restart-Server'], function() {

  // Watch the client side JavaScript for changes to trigger a rebuild
  gulp.watch(['./src/**/*.js'], ['Rebuild-Scripts']);

  // Watch the server-side scripts for changes to trigger a restart
  gulp.watch(['./app.js', './routes/*.js', './views/*.hjs'], ['Restart-Server']);
  
});


/** Clean up if an error goes unhandled. */
process.on('exit', function() {
    if (node){
      node.kill();
    } 
});
