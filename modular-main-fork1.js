// Begin trying Design Patterns

// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      request = require('request');
      // Promise = require('promise'),
      // util = require('util');   // for debugging only

var fotologName = 'moderaterock',
    fotologName = 'citadel',
    // fotologName = 'tubi',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks,
    mosaicPageNumber = 1;



// fetches `url` and returns a Promise
// to the Cheerio-object-wrapped response
function $fetch(url) {
  
  var prom = fetch(this.url)
    .then( response => {
      return response.text;
    })
    .then( text => {
      return cheerio.load(text);
    })
    .catch( err => {
      console.log('Error fetching' + url);
      console.log(err);
    });
  
  return prom;
}


var fotolog = {
  
  name: 'moderaterock',
  base: 'http://www.fotolog.com/' + this.name,
  //mosaicBaseUrl: this.baseUrl + this.name + '/mosaic/',
  //url: this.base + this.name,  // + '/' ?
  //howManyPictures: ,
  
  mosaic: {
    
    page: 1,  // initial  value
    base: fotolog.base + '/mosaic/',  // 'mosaic/' ?  
    url: this.base + (30 * (this.page - 1)) + '/',
    
    // cache relevant element
    $: $fetch(this.url),
    
    getHowManyPictures: function() {
      
    }
  }
  
};



process.on('exit', (code) => {
  console.timeEnd('Elapsed time');
});

