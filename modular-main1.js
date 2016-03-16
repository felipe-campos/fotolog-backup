// Prints links IDs of the last 30 fotolog posts


// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio');
//      Promise = require('promise'),
//      util = require('util');   // for debugging only

var fotologName = 'radiohead',
    // fotologName = process.argv[2],
    // fotologName = 'moderaterock',
    fotologName = 'citadel',
    // fotologName = 'tubi',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks = [],
    mosaicPageNumber = 1;
//    mosaicCurrentPagePostsLinks = [];


//function getCurrentMosaicPageUrlComplement(pageNumber) {
//  if (pageNumber === 1) {  // initial mosaic page
//    return '';             // doesn’t need complement
//  }
//  return (30 * (pageNumber - 1)) + '/';  // e.g. URL for page 2 is http://fotolog.com/<fotologName>/mosaic/30/
//}
//
//function isMosaicLastPage($currentPage) { // expects a cheerio object as argument
//  return ($currentPage[0].next) ? false : true;
//}



function getCurMosaicPagePostsLinks() {
    
  // Promise.resolve(fotologMosaicUrl += getCurrentMosaicPageUrlComplement(mosaicPageNumber)).then( mosaicUrl => {
  
  fetch(fotologMosaicUrl).then( response => {
    return response.text();
  }).then( text => { 
    return cheerio.load(text);
  }).then( $ => {
    var re = /\d+\/$/;
//    console.log(util.inspect($, { showHidden: true, depth: null }));
    return ($('.wall_img_container').map((i, el) => {
      return ($(el).prop('href')).match(re);
    }).get());

//    return mosaicCurrentPagePostsLinks;

  }).then( links => {
    console.log(links);  // prints correctly
    return links;
  }).catch( error => {
    console.log('FUÉIN!', error);
//      console.err(error.msg);
  });
  
}


fotologPostsLinks = getCurMosaicPagePostsLinks();
console.log(fotologPostsLinks);  // prints `undefined`

process.on('exit', (code) => {
  console.timeEnd('Elapsed time');
});
