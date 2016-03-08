// Objective: save every post of a given Fotolog, namely:
// 
//     - the picture posted
//     - the description posted (which comes with post date)
//     - every comment on the post (author + content)
//
//
// Strategy to achieve Objetive:
// 
//     1. know every post link
//     2. parse every post page by iterating over the links
//     3. for each post page parsed, download Objective data and store it as follow
// 
//
// File System for downloaded data:
// 
//  <Fotolog Name> ┐  
//                 ├ <First Year> ───┐
//                 │                 ├ <Month (1-12)> ───┐
//                 ├ <Second Year>   │                   ├─ <Day (1-31)> ──┐
//                 │                 ├ <Month (1-12)>    │                 ├─ fotolog-picture_<YYYY>-<MM>-<DD>.jpg
//                 │       •                             ├─ <Day (1-31)>   ├─ fotolog-description_<YYYY>-<MM>-<DD>.txt
//                 │       •                  •                            └─ fotolog-comments_<YYYY>-<MM>-<DD>.txt
//                 │       •                  •                  •
//                 │                          •                  •
//                 └ <Last Year>                                 •
//
//
// - A fotolog-comment .txt archive will not be created if the picture had no comments
// - A <Year> directory will not be created if no pictures were posted in such year
// - <Month> and <Day> directories follow the same rule. In other words: there must not be an empty directory in the FS


var beginTime = Date.now(),
//    request = require('request'),
    fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    Promise = require('promise'),
    util = require('util'),   // for debugging only
    fotologName = 'moderaterock',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks = [],
    $, $mosaicPagination, $mosaicCurrentPage,
    mosaicPreviousPage = 0,
    notLastMosaicPage = true,
    mosaicCurrentPagePostsLinks = [];

//fotologMosaicUrl += '30/';  console.log(Date.now() - beginTime);  // prints elapsed time in milliseconds

fetch('http://fotolog.com/moderaterock/mosaic/').then( response => {
  return response.text();
}).then( text => {
  return cheerio.load(text);
}).then( $ => {
  
  
  mosaicCurrentPagePostsLinks = $('.wall_img_container').map((i, el) => {
    return $(el).prop('href');
  }).get();
  
//  $mosaicPagination = Promise.resolve($('#pagination'));
//  $mosaicCurrentPage = Promise.resolve($mosaicPagination.children('strong'));
//  
//  Promise.resolve($('#pagination')).then( value => {
//    $mosaicPagination = value;
//    return value;
//  }).then( $mP => {
//    $mosaicCurrentPage = Promise.resolve($mP.children('strong')).then( value => {
//      return value;
//    });
//  });
  
  $mosaicCurrentPage = Promise.resolve($('#pagination')).then( $pag => {
    return $pag.children('strong');
  });
  
  return Promise.all([mosaicCurrentPagePostsLinks, $mosaicCurrentPage]);
  /*return Promise.all([
    mosaicCurrentPagePostsLinks,
    $mosaicPagination,
    $mosaicCurrentPage
  ]);*/
  
  
}).then( values => {
//  console.log('Page ' + values[1].html());
  console.log(values[0]);
  console.log(Date.now() - beginTime);  // prints elapsed time in milliseconds
}).catch( error => {
  console.log('FUÉIN!', error);
});

/*
var promiseLoadPage = new Promise( (resolve, reject) => {
  request(fotologMosaicUrl, (err, resp, body) => {
    if (err) {
      return reject(err);
    }
    resolve(cheerio.load(body));
  });
});

function getPostLinks($) {
//  var promiseLoadPagination = new Promise( (resolve, reject) => {
//    $mosaicPagination = $('#pagination');
//    resolve ($mosaicPagination);
//  });
  mosaicCurrentPagePostsLinks = $('.wall_img_container').map((i, el) => {
    return $(el).prop('href');
  }).get();
  $mosaicPagination = $('#pagination');
  Promise.resolve($mosaicPagination).then( ($mP) => {
    $mosaicCurrentPage = $mP.children('strong');
  });
}
*/


 
/*
do {
  if (mosaicPreviousPage !== 0) {
    mosaicPreviousPage = $mosaicCurrentPage.html();      // a string. will be converted to number
    fotologMosaicUrl += (30 * mosaicPreviousPage) + '/'; // string is converted to number before operation (number * string)
  }
//  console.log(fotologMosaicUrl);
  request(fotologMosaicUrl, (err, resp, body) => {
    
    $ = cheerio.load(body);
    $mosaicPagination = $('#pagination');
    $mosaicCurrentPage = $mosaicPagination.children('strong');
    mosaicCurrentPagePostsLinks = $('.wall_img_container').map((i, el) => {
      return $(el).prop('href');
    }).get();console.log($mosaicCurrentPage);
    
    Array.prototype.push.apply(fotologPostsLinks, mosaicCurrentPagePostsLinks);
    
//    if ($mosaicCurrentPage[0].next === null) { break mosaic_loop; }
  });

} while ($mosaicCurrentPage[0].next !== null);


console.log(fotologPostsLinks);
*/
