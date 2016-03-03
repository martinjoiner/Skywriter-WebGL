var express = require('express');
var router = express.Router();

var Twitter = require('twitter');

var config = require('../config.js');

var client = new Twitter( config.twitter.oAuth );




/**
 * Grabs a random item from an array of strings that matches the desired length
 *
 * @param {array} words
 * @param {integer} charCount The length of the word
 *
 * @return {string}
 */
function extractRandomWordOfLength( words, charCount ){

  // Strip any items that do not match our desired charCount
  var i = words.length;
  while( i-- ){
    if( words[i].length != charCount ){
      words.splice(i,1);
    }
  }

  // pick a random word
  var pointer = Math.round( Math.random() * words.length );

  return words[pointer];
}




/**
 * Gets a random word from an array of tweets
 * 
 * @param {array}
 * @param {integer} charCount
 *
 * @return {string}
 */
function findAWordInTheseTweets( statuses, charCount ){
  var status;
  var words = [];
  // Iterate over all the statuses grabbing only proper words and adding them to an array
  for( var i in statuses ){
    status = statuses[i];
    words = words.concat( status.text.match(/[A-Za-z]{4,9}/g) );
  }

  return extractRandomWordOfLength( words, charCount );
}




/** GET /word/n/xxx request */
router.get('/:charCount/:seed?', function(req, res, next) {

  // Force the charCount param to be an integer
  req.params.charCount = parseInt( req.params.charCount );

  // seed is an optional param so lets give it a default 
  if( typeof req.params.seed === 'undefined' ){
    req.params.seed = 'fish';
  }

  var params = {
    q: req.params.seed,
    count: 10,  
    lang: 'en'
  };

  client.get('search/tweets', params, function(error, tweets, response){
 
    if (!error) {
      var word = findAWordInTheseTweets(tweets.statuses, req.params.charCount);

      res.send( { 
        charCount: req.params.charCount,
        seed: req.params.seed,
        word: word
      });
    }

  });

});

module.exports = router;
