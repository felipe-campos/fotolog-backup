//const http = require('http');
//
//var server = http.createServer( (request, response) => {
//        response.writeHead(200, {'Content-Type': 'text/plain'});
//        response.end('Hello World!\n');
//      } ).listen(8124);
//
//console.log('Server running at http://127.0.0.1:8124/');


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

var http = require('http');

var request = require('request'),
    cheerio = require('cheerio'),
    fotologName = 'moderaterock',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/';
//fotologMosaicUrl += '30/';

request(fotologMosaicUrl, (err, resp, body) => {
//  console.log('ERR:\n' + err);
//  console.log('RESP:\n' + resp);
//  console.log('BODY:\n' + body);
//  var $ = cheerio.load('#wall_column_left', body),
//  var $ = cheerio.load('#wall_column_left', 'body', body),
  
  var $ = cheerio.load(body);
  $.prototype.isLastChild = function () {
    return (this[0].next) ? false : true;
  };
  
  var $pagination = $('#pagination'),
      $currentPage = $pagination.children('strong'),
      // caveat: BEWARE of text nodes, comment nodes etc.
      pagination = $pagination.get(0);  // TRASH PROBABLY

  console.log($currentPage);
//  console.log($currentPage.text());
//  console.log($pagination);
  console.log('This is the last mosaic page: ' + $currentPage.isLastChild());
  
  
  
  
//  console.log('Estamos na página ' + $pagination.find('strong').html() + '.\n');
  
});

//var server = http.createServer( (request, response) => {
//        response.writeHead(200, {'Content-Type': 'text/plain'});
//        response.end('Hello World!\n');
//      } ).listen(8124);

//var server = http.createServer( (request, response) => {
//        response.writeHead(200, {'Content-Type': 'text/plain'});
//        response.end('Hello World!\n');
//      } ).listen(8124);

//console.log('Server running at http://127.0.0.1:8124/');
