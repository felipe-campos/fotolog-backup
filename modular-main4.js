// modular-main3.js with less comments
// Gets links of the 30 last posts, fetches
// the last post and prints de photo URI


// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      request = require('request');
      // Promise = require('promise'),
      // util = require('util');   // for debugging only

var fotologName = 'radiohead',
    //fotologName = 'citadel',
    fotologName = 'tubi',
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
  
  console.log('getting photo URL...');
  
  var postUrl = fotologBaseUrl + fotologName + '/' + linksArray[8];
  
  fetch(postUrl).then( response => {
    return response.text();
  }).then( text => {
    return cheerio.load(text);
  }).then( $ => {
    return $('.wall_img_container_big').children().prop('src');
  }).then( imgUrl => {
    console.log('downloading ' + imgUrl + '...');
    request(imgUrl).pipe(fs.createWriteStream('./content/foto.jpg'));
  }).catch( error => {
    console.log('NOPE!', error);
  });
  
});
//  request
//    .get(postUrl)
//    .on('error', error => {
//      console.log(error);
//    })
//    .on('response', res => {
//      downloadPhoto()
//  });
  


process.on('exit', (code) => {
  console.timeEnd('Elapsed time');
});
