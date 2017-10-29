
/**
 * A Plane
 */
var Plane = function(){

    var speed = 0.004;

    var smokeTrail = new SmokeTrail();

    /** {boolean} Indicates if the smoker is operational */
    var smoking = false;

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
    var fuselage_geometry = new THREE.BoxGeometry(3, 8, 3);
    var fuselage = new THREE.Mesh(fuselage_geometry, material);
    box.add(fuselage);

    // Cockpit 
    var fuselage_geometry = new THREE.BoxGeometry(3, 4, 3);
    var fuselage = new THREE.Mesh(fuselage_geometry, material);
    fuselage.translateZ(1.5);
    box.add(fuselage);

    // Wing
    var wing_geometry = new THREE.BoxGeometry(20, 4, 0.5);
    var wing = new THREE.Mesh(wing_geometry, material);
    wing.translateZ(3);
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
    tail.rotateY( Math.PI / 2);
    tail.rotateZ( Math.PI / 2);
    tail.translateX( -12);
    tail.translateZ( -1.5);
    box.add(tail);

    // Tail fin
    var tailFin_geometry = new THREE.BoxGeometry(0.4, 3, 3);
    var tailFin = new THREE.Mesh(tailFin_geometry, material);
    tailFin.translateY(-11);
    tailFin.translateZ(3.2);
    box.add(tailFin);

    // Nose cone
    var nose_geometry = new THREE.CylinderGeometry( 1.2, 1.8, 2.6, 20 );
    var nose = new THREE.Mesh(nose_geometry, material);
    nose.position.set( 0, 5.2, 0);
    box.add( nose );

    // Propeller
    var propeller_geometry = new THREE.CylinderGeometry( 3, 3, 0.2, 20 );
    var propeller_material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.5 } );
    var scoutBox = new THREE.Mesh(propeller_geometry, propeller_material);
    scoutBox.position.set( 0, 7.2, 0);
    box.add( scoutBox );

    function setPosition(point) {
        box.position.copy(point);
        if( smoking ){
            smokeTrail.add();
        }
    }

    function setTangent(tangent) {

        axis.crossVectors(up, tangent).normalize();
        var radians = Math.acos(up.dot(tangent));

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

    return {
        speed: speed,
        box: box,
        smokeTrail: smokeTrail,
        setPosition: setPosition,
        setTangent: setTangent,
        toggleSmoke: toggleSmoke,
        startSmoke: startSmoke,
        stopSmoke: stopSmoke
    }
};
