
/**
 * A Plane has a 1 spline and a list of words.
 * It flies along a spline, discards it, and uses the next word to generate a new spline.
 * If it runs out of words it flies in circles
 */
var Plane = function(){

  this.speed = 0.004;
  this.propellaCounter = 0;

  /** Array of words that the plane will try to write */
  this.words = [];

  // Material for plane panels
  var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );

  this.box = new THREE.Group();
  scene.add(this.box);

  // The fuselage 
  var fuselage_geometry = new THREE.BoxGeometry(3, 8, 3);
  var fuselage = new THREE.Mesh(fuselage_geometry, material);
  this.box.add(fuselage);

  // Cockpit 
  var fuselage_geometry = new THREE.BoxGeometry(3, 4, 3);
  var fuselage = new THREE.Mesh(fuselage_geometry, material);
  fuselage.translateZ(1.5);
  this.box.add(fuselage);

  // Wing
  var wing_geometry = new THREE.BoxGeometry(20, 4, 0.5);
  var wing = new THREE.Mesh(wing_geometry, material);
  wing.translateZ(3);
  this.box.add(wing);

  // Tail
  var tail_shape = new THREE.Shape();
  tail_shape.moveTo(0, 2);
  tail_shape.lineTo(0, 2.5);
  tail_shape.lineTo(8, 1.5);
  tail_shape.lineTo(8, -1.4);
  tail_shape.lineTo(0, 2);
  var extrudeSettings = {
    steps: 2,
    amount: 3,
    bevelEnabled: false
  }
  var tail_geometry = new THREE.ExtrudeGeometry(tail_shape, extrudeSettings);
  var tail = new THREE.Mesh(tail_geometry, material);
  tail.rotateY( Math.PI / 2);
  tail.rotateZ( Math.PI / 2);
  tail.translateX( -12);
  tail.translateZ( -1.5);
  this.box.add(tail);

  // Tail fin
  var tailFin_geometry = new THREE.BoxGeometry(0.4, 3, 3);
  var tailFin = new THREE.Mesh(tailFin_geometry, material);
  tailFin.translateY(-11);
  tailFin.translateZ(3.2);
  this.box.add(tailFin);

  // Nose cone
  var nose_geometry = new THREE.CylinderGeometry( 1.2, 1.8, 2.6, 20 );
  var nose = new THREE.Mesh(nose_geometry, material);
  nose.position.set( 0, 5.2, 0);
  this.box.add( nose );

  // Propeller
  var propeller_geometry = new THREE.CylinderGeometry( 3, 3, 0.2, 20 );
  var propeller_material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.5 } );
  var scoutBox = new THREE.Mesh(propeller_geometry, propeller_material);
  scoutBox.position.set( 0, 7.2, 0);
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
