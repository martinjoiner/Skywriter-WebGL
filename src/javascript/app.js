"use strict";




/**
 * A SmokeTrail has many SmokeBubbles
 */
var SmokeTrail = function(){
  this.smokeBubbles = [];
};


/**
 * Method on SmokeTrail class: 
 */
SmokeTrail.prototype.age = function(){

  // Iterate over the smokeBubbles aging them
  var i = this.smokeBubbles.length;
  while( i-- ){
    
    if( this.smokeBubbles[i].beOlder() <= 0 ){
      scene.remove( this.smokeBubbles[i].mesh );
      this.smokeBubbles.splice( i, 1 );
    }
    
  }

  this.add();
};


/**
 * Method on SmokeTrail class: Adds a smoke bubble to the trail
 *
 * @param position
 */
SmokeTrail.prototype.add = function(){
  this.smokeBubbles.push( new SmokeBubble( this, plane.box.position.x, plane.box.position.y, plane.box.position.z ) );
};




/**
 * SmokeBubble class
 *
 * @param position
 */
var SmokeBubble = function( parent, x, y, z ){

  this.parent = parent;
  this.age = 0;
  this.scale = 0.1;

  this.originX = x;
  this.x = x;
  this.xDrift = Math.random() - 0.5;

  this.originY = y;
  this.y = y;
  this.yDrift = Math.random() - 0.5;

  // Define geometry and material for visualising the cuboid thing that'll travel along the line
  var geometry = new THREE.SphereGeometry( 8, 30 );
  var material = new THREE.MeshLambertMaterial( { color: 0xAAAAAA, transparent: true, opacity: 0.5 } );

  this.mesh = new THREE.Mesh(geometry, material);
  this.mesh.name = "Smoke Bubble";
  this.mesh.position.set(x, y, z);
  this.mesh.scale.x = this.scale;
  this.mesh.scale.y = this.scale;
  this.mesh.scale.z = this.scale;

  scene.add(this.mesh);
};


/**
 * Method on SmokeBubble class: Ages the bubble
 */
SmokeBubble.prototype.beOlder = function(){
  this.age++;

  // For the first 50 units grow
  if( this.age < 50 ){
    this.scale += 0.02;
  }

  // After age 80, shrink
  if( this.age > 80 ){
    this.scale -= 0.01;
  }

  if( Math.abs( this.originX - this.x ) < 1 ){
    this.x  += this.xDrift;
    this.mesh.position.x = this.x;
  }

  if( Math.abs( this.originY - this.y ) < 1 ){
    this.y  += this.yDrift;
    this.mesh.position.y = this.y;
  }

  this.mesh.scale.x = this.scale;
  this.mesh.scale.y = this.scale;
  this.mesh.scale.z = this.scale;

  return this.scale;
};




/**
 * A Plane has a 1 spline and a list of words.
 * It flies along a spline, discards it, and uses the next word to generate a new spline.
 * If it runs out of words it flies in circles
 */
var Plane = function(){

  this.speed = 0.008;
  this.propellaCounter = 0;
  this.words = [];

  // Define geometry and material for visualising the cuboid thing that'll travel along the line
  var geometry = new THREE.BoxGeometry(5, 16, 4);
  var material = new THREE.MeshLambertMaterial( { color: 0xBB88AA } );

  // Visualise the box 
  this.box = new THREE.Mesh(geometry, material);
  this.box.name = 'Plane';
  scene.add(this.box);

  // Put a little obiting scout
  geometry = new THREE.BoxGeometry(4, 4, 4);
  var scoutBox = new THREE.Mesh(geometry, material);
  scoutBox.name = 'Propella';
  scoutBox.position.set( 10, 5, 0);
  this.box.add( scoutBox );
};


/** Method on Plane class: Moves the propella */
Plane.prototype.incrementPropella = function(){
  this.propellaCounter += 0.5;
  this.box.children[0].position.x = Math.sin( this.propellaCounter ) * 8;
  this.box.children[0].position.z = Math.sin( this.propellaCounter - 1 ) * 8;
};


/** 
 * Method on Plane class: Adds a word to the plane's list
 *
 * @param {string} word
 */
Plane.prototype.addWord = function( word ){
  this.words.push( word );
}




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




/**
 * 
 */
function fetchWord(){

  microAjax("/word/6/sausage", function(data){ 

    data = JSON.parse(data);

    console.log( data.word );

    updateLineToWord( data.word );

  });
}




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




/**
 * Produces a geometry object based on a word
 *
 * @param {string} word
 *
 * @return {THREE.Geometry}
 */
function getWordGeometry( word ){
  // Create a spline that spells the word
  spline = splineFactory.word( word );

  // Get 50 points back from the spline
  var numPoints = 60;
  var splinePoints = spline.getPoints(numPoints);

  // Define geometry for visualising the spline
  var geometry = new THREE.Geometry();
  for (var i = 0; i < splinePoints.length; i++) {
    geometry.vertices.push(splinePoints[i]);
  }

  return geometry;
}




/**
 * Changes the spline that the plane is following
 *
 * @param {string} word
 */
function updateLineToWord( word ){
  var line = scene.getObjectByName( "Word" );
  line.geometry = getWordGeometry( word );
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
