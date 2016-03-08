// Leraning the fetch API

var beginTime = Date.now();  // for perfomance checking

var cheerio = require('cheerio'),
    fetch = require('node-fetch'),
    util = require('util');  // for debugging only

fetch('http://fotolog.com/moderaterock/mosaic/').then( response => {
  return response.text();
}).then( text => {
  return cheerio.load(text);
}).then( $ => {
  return $('#pagination');
}).then( $pagination => {
  console.log('Page ' + $pagination.children('strong').html());
  console.log(Date.now() - beginTime);  // prints elapsed time in milliseconds
}).catch( error => {
  console.log('FUÉIN!', error);
});


//  console.log(util.inspect($pagination[0], { showHidden: true, depth: null }));
//  console.log(util.inspect($pagination[0]));
