// Does nothing. Its just me trying Design Patterns.

// will print elapsed time by calling console.timeEnd() as a callback
// to the 'exit' event emitted by the process global object
console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      request = require('request'),
      async = require('async');
      // Promise = require('promise'),
      // util = require('util');   // for debugging only

var fotologName = 'moderaterock',
    fotologName = 'citadel',
    // fotologName = 'tubi',
    fotologBaseUrl  = 'http://www.fotolog.com/',
    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
    fotologPostsLinks,
    mosaicPageNumber = 1;


var fotolog = function(name) {
  
  var name = name;
  var baseUrl = 'http://www.fotolog.com/';
  var mosaicBaseUrl = this.baseUrl + this.name + '/mosaic/';
  
};

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



(function() {
  
  //var base = 'http://www.fotolog.com/moderaterock/';
  
  var Fotolog = {
    
    name: 'moderaterock',
    url: 'http://www.fotolog.com/moderaterock/',
    mosaicLoop: 1,
    backupDone: false,
    postsAmount: undefined,
    
    backup: function() {
      
      var mosaic_01 = new MosaicPage(1),
          $promise = $Fetch(mosaic_01.url);
      
      $promise.then( $ => {
        var container = $('.profile_bar_active').get(0),
            $el = $(container).children().first();
        Fotolog.postsAmount = parseInt($el.contents());
      }).catch( error => {
        console.log('Couldn’t get amount of posts.');
        console.log(error);
      });
      
    }
    
  };
  
  function MosaicPage(page) {
    
    this.page = page;
    //this.base = 'http://www.fotolog.com/moderaterock/mosaic/';
    this.base = Fotolog.url + Fotolog.name + '/mosaic/';
    this.url = this.base + (30 * (this.page - 1)) + '/';
    
  }
  
  function PostPage(id) {
    
    this.id = id;
    this.base = 'http://www.fotolog.com/moderaterock/';
    this.url = this.base + id;
    
  }
  
  
  function Factory() {}
  
  // By default, Factory creates a PostPage object
  Factory.prototype.type = PostPage;
  
  Factory.prototype.createPage = function(options) {
    
    switch(options.type) {
      case 'post':
        this.type = PostPage;
        break;
      case 'mosaic':
        this.type = MosaicPage;
        break;
    }
    
    return new this.type(options);
  };
  
//  options examples:
// 
//  {
//    type: 'mosaic',
//    page: 1
//  }
//
//  {
//    type: 'post',
//    id: '11737448/'
//  }

//  Maybe could simplify Factory:
//
//    if (options.type) {
//      return new MosaicPage(options.page)
//    }
//    return new PostPage(options)
//
//  But then, `options` would be an object, when creating
//  MosaicPage, or a string, when creating PostPage.
  
  // fetches `url` and returns a Promise
  // to the Cheerio-object-wrapped response
  function $Fetch(url) {

    var $prom = fetch(this.url)
      .then( response => {
        return response.text;
      })
      .then( text => {
        return cheerio.load(text);
      })
      .catch( err => {
        console.log('Error fetching ' + url);
        console.log(err);
      });

    return $prom;
  }
  
  
  function getAmountOfPosts($mosaicPromise) {
    $mosaicPromise.then( $ => {
      var container = $('.profile_bar_active').get(0),
          numOfPostsEl = container.children().first();
      return parseInt(numOfPostsEl.contents());
    }).catch( error => {
      console.log('Couldn’t get amount of posts.');
      console.log(error);
    });
  }
  
  function backupFotolog() {
    
    // do stuff
    
  }
  
  
})();





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



process.on('exit', _=> {
  console.timeEnd('Elapsed time');
});

