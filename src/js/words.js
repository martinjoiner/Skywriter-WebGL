
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
