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


//    request = require('request'),

console.time('Elapsed time');  // will print elapsed time by calling console.timeEnd() at the end

var fetch = require('node-fetch'),
    cheerio = require('cheerio'),
    Promise = require('promise'),
    util = require('util'),   // for debugging only
    fotologName = 'moderaterock',
    // fotologName = process.argv[2],
    // fotologName = 'somos6';
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks = [],
    $mosaicCurrentPage = {},
    mosaicPageNumber = 1,
    mosaicCurrentPagePostsLinks = [];


function getCurrentMosaicPageUrlComplement(pageNumber) {
  if (pageNumber === 1) {  // initial mosaic page
    return '';             // doesn’t need complement
  }
  return (30 * (pageNumber - 1)) + '/';  // e.g. URL for page 2 is http://fotolog.com/<fotologName>/mosaic/30/
}

function isMosaicLastPage($currentPage) { // expects a cheerio object as argument
  return ($currentPage[0].next) ? false : true;
}



(function getCurMosaicPagePostsLinks() {
    
  Promise.resolve(fotologMosaicUrl += getCurrentMosaicPageUrlComplement(mosaicPageNumber)).then( mosaicUrl => {
    fetch(mosaicUrl).then( response => {
    return response.text();
  }).then( text => {
    return cheerio.load(text);
  }).then( $ => {

    mosaicCurrentPagePostsLinks = $('.wall_img_container').map((i, el) => {
      return $(el).prop('href');
    }).get();

    $mosaicCurrentPage = Promise.resolve($('#pagination')).then( $pag => {
      return $pag.children('strong');
    });

    return Promise.all([mosaicCurrentPagePostsLinks, $mosaicCurrentPage]);

  }).then( values => {
    Promise.resolve(Array.prototype.push.apply(fotologPostsLinks, values[0])).then( () => {
      if (isMosaicLastPage(values[1])) {
        return () => {
          console.log(fotologPostsLinks);
          console.timeEnd('Elapsed time');
        }();
      } else {
        mosaicPageNumber++;
        getCurMosaicPagePostsLinks();
      }
    });
  }).catch( error => {
//    console.log('FUÉIN!', error);
      console.err(error.msg);
  });

  });

})();
