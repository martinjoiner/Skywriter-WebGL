
Pilot = function() {

	/** {string} mode - Can be 'human' or 'path' */
	var mode = 'path';

	function toggleMode() {
		if (mode === 'human') {
			mode = 'path';
		} else {
			mode = 'human';
		}
	}

	function getMode() {
		return mode;
	}

	/**
	 * @return {boolean}
	 */
	function isInHumanMode() {
		return (mode === 'human');
	}

	return {
		toggleMode: toggleMode,
		getMode: getMode,
		isInHumanMode: isInHumanMode
	}

}

pilot = new Pilot();
