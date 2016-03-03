
/** 
 * SplineFactory class written using the revealing module pattern 
 * makes splines to spell words in smoke trails
 */
var SplineFactory = function(){

	// Distance between letters
	var ledding = 20;

	var charDefs = {
		a: [
			[   0,   0,   0 ],
			[  75,  10,   0 ],
			[ 170,  50,   0 ],
			[ 170, 150,   0 ],
			[ 100, 190,   0 ],
			[  30, 150,   0 ],
			[  50,  30,   0 ],
			[ 170,  40,   0 ],
			[ 170, 170,  50 ],
			[ 170, 140,  20 ],
			[ 170,  70,   0 ],
			[ 200,   0,   0 ]
		],
		b: [
			[   0,   0,   0 ],
			[  15,  40,   0 ],
			[  15, 260,   0 ],
			[  15, 250, -50 ],
			[  15, 190, -50 ],
			[  30,  40,   0 ],
			[  70,  30,   0 ],
			[  110, 120,   0 ],
			[  80, 180,   0 ],
			[  15, 140,   0 ],
			[  15,  70,   0 ],
			[  70,  10,   0 ],
			[  90,  10,   0 ]
		],
		c: [
			[   0,   0,   0 ],
			[  15,  40,   0 ],
			[  15, 160,   0 ],
			[  90, 170,   0 ],
			[  15, 190,   0 ],
			[  30,  40,   0 ],
			[  70,  30,   0 ],
			[  90,  50,   0 ],
			[  90,  50, -50 ],
			[  70,  30, -20 ],
			[  90,   0,   0 ]
		],
		test: [
			[   0,   0,   0 ],
			[   0, 200,   0 ],
			[ 140, 150,   0 ],
			[ 120,  50,  70 ],
			[  60,  60, 140 ],
			[  70, 150, 120 ],
			[  75, 150,  20 ],
			[ 250, 100,  20 ],
			[ 250, 300, -30 ]
		]
	};


	/** 
	 * Gets the vectors to create a spline in the shape of a letter
	 *
	 * @param {string} key
	 * @param {integer} xOffset
	 *
	 * @return {array} Contains {array} vectors, {number} width 
	 */
	function getCharVectors( key, xOffset ){
		var item,
			vectors = [],
			width = 0;

		for( var i in charDefs[key] ){
			item = charDefs[key][i];
			if( item[0] > width ){
				width = item[0];
			}
			vectors = vectors.concat( new THREE.Vector3( item[0] + xOffset, item[1], item[2] ) );
		}

		return { 
			width: width, 
			vectors: vectors 
		};
	}


	/** 
	 * Returns a spline that spells out a word
	 *
	 * @param {string} word The word to spell out with the vector points
	 *
	 * @return {THREE.CatmullRomCurve3} The spline
	 */
	var word = function( word ){
	  var vectors = [],
	    offset = -100,
	    vectorsResult;

	  for( var i = 0, iLimit = word.length; i < iLimit; i++ ){

	    vectorsResult = getCharVectors( word[i], offset );

	    // Increment the offset for the next iteration
	    offset += vectorsResult.width + ledding;
	    vectors = vectors.concat( vectorsResult.vectors );
	  }

	  return new THREE.CatmullRomCurve3( vectors );
	}


	/** Revealing only the word method */
	return {
		word: word
	}
};

var splineFactory = new SplineFactory();
