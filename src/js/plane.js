
/**
 * A Plane
 */
var Plane = function(){

    var speed = 0.004;

    var smokeTrail = new SmokeTrail();

    /** {boolean} Indicates if the smoker is operational */
    var smoking = false;

    // The direction of the plane
    var tangent = new THREE.Vector3(1, 1, 0);

    // 
    var axis = new THREE.Vector3();

    

    // Audio
    var smokeNoise = audioCtx.createBrownNoise();
    var gainNode = audioCtx.createGain();
    smokeNoise.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;

    // Material for plane panels
    var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );

    var box = new THREE.Group();
    scene.add(box);

    // The fuselage 
    var fuselage_geometry = new THREE.BoxGeometry(3, 3, 8);
    var fuselage = new THREE.Mesh(fuselage_geometry, material);
    box.add(fuselage);

    // Cockpit 
    var fuselage_geometry = new THREE.BoxGeometry(2.5, 2.5, 4);
    var fuselage = new THREE.Mesh(fuselage_geometry, material);
    fuselage.translateY(1.5);
    box.add(fuselage);

    // Wing
    var wing_geometry = new THREE.BoxGeometry(22, 0.4, 4);
    var wing = new THREE.Mesh(wing_geometry, material);
    wing.translateY(3);
    box.add(wing);

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
    tail.rotateY( Math.PI / -2);
    tail.translateX( -12);
    tail.translateZ( -1.5);
    box.add(tail);

    // Tail fin
    var tailFin_geometry = new THREE.BoxGeometry(0.4, 3, 3);
    var tailFin = new THREE.Mesh(tailFin_geometry, material);
    tailFin.translateY(4);
    tailFin.translateZ(-11);
    box.add(tailFin);

    // Nose 
    var nose_shape = new THREE.Shape();
    nose_shape.moveTo(0, 0);
    nose_shape.lineTo(0, 1.5);
    nose_shape.lineTo(3, 2);
    nose_shape.lineTo(3, -1.1);
    nose_shape.lineTo(0, 0);
    var nose_geometry = new THREE.ExtrudeGeometry(nose_shape, extrudeSettings);
    var nose = new THREE.Mesh(nose_geometry, material);
    nose.rotateY( Math.PI / 2);
    nose.position.set( -1.5, -0.5, 6.4);
    box.add( nose );

    // Propeller
    var propeller_geometry = new THREE.CylinderGeometry( 2.6, 2.6, 0.2, 20 );
    var propeller_material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.5 } );
    var propeller = new THREE.Mesh(propeller_geometry, propeller_material);
    propeller.position.set( 0, 0, 7);
    propeller.rotateX( Math.PI / -2);
    box.add( propeller );

    function setPosition(point) {
        box.position.copy(point);
        if( smoking ){
            smokeTrail.add();
        }
    }

    function setTangent(newTangent) {

        tangent = newTangent;

        axis.crossVectors(forward, tangent).normalize();
        
        var radians = Math.acos(forward.dot(tangent));

        // Pitch where:
        // -0.5 is flying directly upwards
        //  0.0 is cruising perfectly level 
        //  0.5 is plummeting towards the earth
        var pitch = 0.5 - ( Math.abs( Math.PI - radians ) ) / Math.PI;

        // Set gravity boost to some value between 0.9 - 1.1
        gravityBoost = 1 + (pitch/5);

        // Set the plane's rotation based on spline
        box.quaternion.setFromAxisAngle(axis, radians);
    }

    function toggleSmoke() {
        if( smoking ){
            return stopSmoke();
        }
        return startSmoke();
    }

    function startSmoke() {
        gainNode.gain.value = 0.02;
        return smoking = true;
    } 

    function stopSmoke() {
        gainNode.gain.value = 0;
        return smoking = false;
    }

    /**
     * @param {float} amount - How much to increase pitch by in Radians
     */
    function pitchAdjust(amount) {
        // TODO: Make the nose of the plane pitch up or down based on amount param
    }

    function pitchUp() {
        pitchAdjust(0.05);
    }

    function pitchDown() {
        pitchAdjust(-0.05);
    }

    return {
        speed: speed,
        box: box,
        smokeTrail: smokeTrail,
        setPosition: setPosition,
        setTangent: setTangent,
        toggleSmoke: toggleSmoke,
        startSmoke: startSmoke,
        stopSmoke: stopSmoke,
        pitchUp: pitchUp,
        pitchDown: pitchDown
    }
};
