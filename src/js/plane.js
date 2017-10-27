
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
