// Prints links IDs of the last 30 fotolog posts.
// getCurMosaicPagePostsLinks() returns a Promise.

// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio');
//      Promise = require('promise'),
//      util = require('util');   // for debugging only

var fotologName = 'radiohead',
    // fotologName = process.argv[2],
    fotologName = 'citadel',
    // fotologName = 'tubi',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks = [],
    mosaicPageNumber = 1;


function getCurMosaicPagePostsLinks() {
  
  // `p` will store a Promise that we’ll return
  var p = fetch(fotologMosaicUrl).then( response => {
    return response.text();
  }).then( text => { 
    return cheerio.load(text);
  }).then( $ => {
    var re = /\d+\/$/;  // 'http://www.fotolog.com/<fotologName>/12345678/' ...
    return ($('.wall_img_container').map((i, el) => {
      return ($(el).prop('href')).match(re);  // ... store just '12345678/'
    }).get());  // use .get() to return an array with the posts IDs
  }).then( IDs => {
    // console.log(IDs);
    return IDs;
  }).catch( error => {
    console.log('FUÉIN!', error);
  });
  
  return p;  // return Promise with array of posts IDs
}


fotologPostsLinks = getCurMosaicPagePostsLinks();
fotologPostsLinks.then( linksArray => {
  console.log(linksArray);
});

process.on('exit', (code) => {
  console.timeEnd('Elapsed time');
});
