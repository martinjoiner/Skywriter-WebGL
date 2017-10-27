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


  // Directional lights scattered throughout the scene
  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xff8888, 1 ); 
  lights[0].name = "Left Red Light";
  lights[0].position.set( 50, 160, 20);

  lights[1] = new THREE.DirectionalLight( 0x0088ff, 1 ); 
  lights[1].name = "Right Blue Light";
  lights[1].position.set( 800, 160, 20);

  for( var i = 0; i < lights.length; i++ ){
    scene.add( lights[i] );
  }


  //controls = new THREE.TrackballControls(camera, render.domElement);

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
