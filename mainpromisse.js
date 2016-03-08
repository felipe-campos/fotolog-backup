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


var request = require('request'),
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

//fotologMosaicUrl += '30/';

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



//promise.then(getPostLinks($), (err) => {
//  console.log(err);
//}).done();

 

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


/*
request(fotologMosaicUrl, (err, resp, body) => {
  
  var $ = cheerio.load(body),
      $pagination = $('#pagination'),
      $currentPage = $pagination.children('strong');
  
  $.prototype.isLastChild = function () {  // caveat: a text or comment node is also a ‘child’
    return (this[0].next) ? false : true;
  };
  
  pictureLinks = $('.wall_img_container').map( (i, el) => {
    return $(el).prop('href');
  }).get();
  
//  function getPictureLinks(arr) {
//    return Array.prototype.push.apply(arr, )
//  }
  
  console.log(pictureLinks);
  console.log('This is the last mosaic page: ' + $currentPage.isLastChild());
  
});
*/

//  console.log('Estamos na página ' + $pagination.find('strong').html() + '.\n');
//  console.log($mosaicPictureItems);
//  console.log($currentPage);
//  console.log($currentPage.text());
//  console.log($relevantContent._root[0].children[0]);
//  console.log('XXXXXXXXXXXX');
//  console.log($relevantContent._root[0].children[1]);
//  console.log($mosaic.children);
//  console.log($mosaic.children[1]);
//  console.log($mosaic.children[2]);
//  console.log($pagination);


//      $relevantContent = $('.wall_column_left'),
//      $mosaicPictureItems = $relevantContent.find('.wall_img_container');
//      $pagination = $relevantContent.find('#pagination'),
  
//  var $mosaic = $('#list_photos_mosaic');


//var http = require('http');
//var server = http.createServer( (request, response) => {
//        response.writeHead(200, {'Content-Type': 'text/plain'});
//        response.end('Hello World!\n');
//      } ).listen(8124);

//console.log('Server running at http://127.0.0.1:8124/');
