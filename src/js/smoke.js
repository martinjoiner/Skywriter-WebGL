
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


