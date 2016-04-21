'use strict';

const fetch = require('node-fetch'),
      cheerio = require('cheerio');

// Fetches URL, wrap it in a Cheerio object and
// returns a promise to it.
function $fetcher(url) {
  return fetch(url)
    .then( response => response.text() )
    .then( text => cheerio.load(text) );
}

module.exports = $fetcher;