"use strict";

/**
 * Copyright (c) 2008 Stefan Lange-Hegermann
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * ------------------------------------------------------------------------------
 *
 * Source: https://code.google.com/archive/p/microajax/downloads
 *
 * NOTICE 2 March 2015: This code has been modified to work in strict mode. 
 * All occurances of "this." have been replaced with "window." 
 *
 * @param {string} url
 * @param {closure} callbackFunction
 */
function microAjax(url, callbackFunction){
	window.bindFunction = function (caller, object) {
		return function() {
			return caller.apply(object, new Array(object));
		}
	}

	window.stateChange = function (object) {
		if (window.request.readyState==4) {
			window.callbackFunction(window.request.responseText);
		}
	}

	window.getRequest = function() {
		if (window.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		else if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		else
			return false;
	}

	if (arguments[2])
		window.postBody = arguments[2];
	else 
		window.postBody="";

	window.callbackFunction=callbackFunction;
	window.url=url;	
	window.request = window.getRequest();

	if(window.request) {
		window.request.onreadystatechange = window.bindFunction(window.stateChange, this);

		if (window.postBody!="") {
			window.request.open("POST", url, true);
			window.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			window.request.setRequestHeader('Connection', 'close');
		} else {
			window.request.open("GET", url, true);
		}

		window.request.send(window.postBody);
	}
}
