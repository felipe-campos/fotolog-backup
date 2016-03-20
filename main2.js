// Gets links of the 30 last posts, fetches one
// arbitrarily chosen post and downloads its picture
// to `content/picture.jpg`

// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      request = require('request');
      // util = require('util');   // for debugging only

var fotologName = 'moderaterock',
    // fotologName = 'citadel',
    // fotologName = 'tubi',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks,
    mosaicPageNumber = 1;


function getCurMosaicPagePostsLinks() {
  
  // `p` will store a Promise that we’ll return
  var p = fetch(fotologMosaicUrl).then( response => {
    return response.text();
  }).then( text => { 
    return cheerio.load(text);
  }).then( $ => {
    var re = /\d+\/$/;  // 'http://www.fotolog.com/<fotologName>/12345678/' ...
    return ($('.wall_img_container').map( (i, el) => {
      return ($(el).prop('href')).match(re);  // ... store just '12345678/'
    }).get());  // use .get() to return an array with the posts IDs
  }).catch( error => {
    console.log('FUÉIN!', error);
  });
  
  return p;  // return Promise with array of posts IDs
}


fotologPostsLinks = getCurMosaicPagePostsLinks();

fotologPostsLinks.then( IDs => {
  
  console.log('getting picture URL...');
  var postUrl = fotologBaseUrl + fotologName + '/' + IDs[6];  // test with just one post
  
  fetch(postUrl).then( response => {
    return response.text();
  }).then( text => {
    return cheerio.load(text);
  }).then( $ => {
    return $('.wall_img_container_big').children().prop('src');
  }).then( imgUrl => {
    console.log('downloading ' + imgUrl + '...');
    request(imgUrl).pipe(fs.createWriteStream('./content/picture.jpg'));
  }).catch( error => {
    console.log('NOPE!', error);
  });
  
});


process.on('exit', _=> {
  console.timeEnd('Elapsed time');  //
});
