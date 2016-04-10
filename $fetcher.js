'use strict';

const fetch = require('node-fetch'),
      cheerio = require('cheerio');

// Fetches URL, wrap it in a Cheerio object and
// returns a promise to it.
function $fetcher(url) {
  return fetch(url).then( response => {
    return response.text();
  }).then( text => { 
    return cheerio.load(text);
  });
}

module.exports = $fetcher;