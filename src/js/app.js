"use strict";



/** Global variables */
var controls, 
  renderer,
  scene, 
  camera, 
  spline, 
  smokeTrail,
  plane,
  gravityBoost = 0, 
  counter = 0,

  tangent = new THREE.Vector3(),
  axis = new THREE.Vector3(),
  up = new THREE.Vector3( 0, 1, 0);




/** Increments the box counter, looping within limits */
function moveBox() {

  plane.speed = plane.speed * gravityBoost;
  if( plane.speed < 0.003 ){
    plane.speed = 0.003;
  }
  if( plane.speed > 0.010 ){
    plane.speed = 0.010;
  }

  smokeTrail.age();

  // Increment counter
  counter += plane.speed;

  // Increment propella
  plane.incrementPropella();

  // Make sure it doesn't go above 1
  if (counter > 1) {
    counter = 0;
  } 

  plane.box.position.copy( spline.getPointAt(counter) );

  tangent = spline.getTangentAt(counter).normalize();

  axis.crossVectors(up, tangent).normalize();

  var radians = Math.acos(up.dot(tangent));

  // Set gravity boost to some value between 0.5 - 1.5
  gravityBoost = ( ( Math.PI - Math.abs( Math.PI - radians ) ) / Math.PI ) + 0.5;

  plane.box.quaternion.setFromAxisAngle(axis, radians);
}          




/** Render loop */
function render() {
  requestAnimationFrame(render);
  //controls.update();
  renderer.render(scene, camera);
} 




/** Initialise the scene */
(function() {

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.name = 'Skywriter';

  // Add a camera 
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 5000);
  camera.name = "Only Camera";
  camera.position.set(125, 130, 400);
  camera.lookAt(new THREE.Vector3(125, 140, 0));
  scene.add(camera);


  // LIGHTS
  scene.add( new THREE.DirectionalLight( 0xFFFFFF, 0.5 ) );
  scene.add( new THREE.AmbientLight( 0xFFFFFF, 0.5 ) );




  // TGA texture cube map -------------------------------------------------
  // Following code is a rehash of CubeTextureLoader but made to work with TGA files
  // https://github.com/mrdoob/three.js/blob/master/src/loaders/CubeTextureLoader.js
  // I could repackage it as a module and submit pull request to ThreeJS

  var path = "ame_desert/desertsky_";
  var format = '.tga';
  var urls = [
      path + 'ft' + format, path + 'bk' + format,
      path + 'up' + format, path + 'dn' + format, 
      path + 'rt' + format, path + 'lf' + format
    ];

  var texture = new THREE.CubeTexture();

  var loader = new THREE.TGALoader();
  //loader.setCrossOrigin( this.crossOrigin );
  //loader.setPath( this.path );

  var loaded = 0;

  function loadTexture( i ) {

    loader.load( urls[ i ], function ( image ) {

      texture.images[ i ] = image.image;

      loaded ++;

      if ( loaded === 6 ) {

        texture.needsUpdate = true;

      }

    }, function(){
      // console.log("loaded!");
    } );

  }

  for ( var i = 0; i < urls.length; ++ i ) {
    loadTexture( i );
  }

  scene.background = texture;

  // END TGA SKYMAP ----------------------------------------------------------




  // Controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );

  // Define geometry for visualising the spline
  var geometry = getWordGeometry( 'cab' );

  // Define a material to visualise the spline
  var material = new THREE.LineBasicMaterial({
    color: 0x111111,
  });

  // Visualise the spline on the scene
  var line = new THREE.Line(geometry, material);
  line.name = 'Word';
  scene.add(line);

  plane = new Plane();

  // Fire the renderloop
  render();

  // Set the moveBox() function to fire every x miliseconds
  setInterval(moveBox, 50);

  smokeTrail = new SmokeTrail();

})();
