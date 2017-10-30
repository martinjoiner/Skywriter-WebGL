"use strict";



/** Global variables */
var controls, 
    renderer,
    scene, 
    camera, 
    spline,
    plane,
    gravityBoost = 0, 

    // Counter is a percentage as a decimal in range 0.0 - 1.0
    counter = 0,

    tangent = new THREE.Vector3(),
    axis = new THREE.Vector3(),
    up = new THREE.Vector3( 0, 1, 0),
    forward = new THREE.Vector3( 0, 0, 1),

    audioCtx = new AudioContext();



function movePlane() {
    movePlaneAlongSpline();
}


/** 
 * Increments the plane along a spline 
 */
function movePlaneAlongSpline() {

    plane.speed = plane.speed * gravityBoost;
    if( plane.speed < 0.001 ){
        plane.speed = 0.001;
    }
    if( plane.speed > 0.002 ){
        plane.speed = 0.002;
    }

    plane.smokeTrail.age();

    // Increment counter
    counter += plane.speed;

    // Make sure it doesn't go above 1
    if (counter > 1) {
        counter = 0;
    } 

    // Set the plane's position in the world based on the spline
    plane.setPosition( spline.getPointAt(counter) );

    // The direction the plane is heading
    tangent = spline.getTangentAt(counter).normalize();

    plane.setTangent(tangent);
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
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.name = "Only Camera";
    camera.position.set(120, 120, 390);
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
    //scene.add(line); // <-- Uncomment to show the path

    plane = new Plane();

    // Fire the renderloop
    render();

    // Set the movePlane() function to fire every x miliseconds
    setInterval(movePlane, 50);
    

})();
