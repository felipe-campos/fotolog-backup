//// will it work?
//
//console.time('Elapsed time');
//
//const fetch = require('node-fetch'),
//      cheerio = require('cheerio'),
//      fs = require('fs'),
//      request = require('request'),
//      async = require('async');
//      // util = require('util');   // for debugging only
//
////var fotologName = 'moderaterock',
////    fotologName = 'citadel',
////    // fotologName = 'tubi',
////    fotologBaseUrl  = 'http://www.fotolog.com/',
////    fotologMosaicUrl = fotologBaseUrl + fotologName + '/mosaic/',
////    fotologPostsLinks,
////    mosaicPageNumber = 1;
//
//
//(function() {
//  
//  //var base = 'http://www.fotolog.com/moderaterock/';
//  
//  var Fotolog = {
//    
//    name: 'moderaterock',
//    //url: 'http://www.fotolog.com/',
//    url: 'http://www.fotolog.com/moderaterock/',
//    mosaic: this.url + 'mosaic/',
//    mosaicLoop: 1,
//    backupDone: false,
//    postsAmount: undefined
//    
////    backup: function() {
////      
//////      var mosaic_01 = new MosaicPage(1),
//////          $promise = $Fetch(mosaic_01.url);
////      
////      var $promise = $Fetch(Fotolog.mosaic);
////      
////      $promise.then( $ => {
////        var container = $('.profile_bar_active').get(0),
////            $el = $(container).children().first();
////        Fotolog.postsAmount = parseInt($el.contents());
////        return console.log(Fotolog.postsAmount);
////      }).catch( error => {
////        console.log('Couldn’t get amount of posts.');
////        console.log(error);
////      });
////      
////    }
//    
//  };
//  
//  function MosaicPage(page) {
//    
//    this.page = page;
//    //this.base = 'http://www.fotolog.com/moderaterock/mosaic/';
//    this.base = Fotolog.url + Fotolog.name + '/mosaic/';
//    this.url = this.base + (30 * (this.page - 1)) + '/';
//    
//  }
//  
//  function PostPage(id) {
//    
//    this.id = id;
//    this.base = 'http://www.fotolog.com/moderaterock/';
//    this.url = this.base + id;
//    
//  }
//  
//  
//  function Factory() {}
//  
//  // By default, Factory creates a PostPage object
//  Factory.prototype.type = PostPage;
//  
//  Factory.prototype.createPage = function(options) {
//    
//    switch(options.type) {
//      case 'post':
//        this.type = PostPage;
//        break;
//      case 'mosaic':
//        this.type = MosaicPage;
//        break;
//    }
//    
//    return new this.type(options);
//  };
//  
//  
//  // fetches `url` and returns a Promise
//  // to the Cheerio-object-wrapped response
//  function $Fetch(url) {
//
//    var $prom = fetch(url)
//      .then( response => {
//        return response.text;
//      })
//      .then( text => {
//        return cheerio.load(text);
//      })
//      .catch( err => {
//        console.log('Error fetching ' + url);
//        console.log(err);
//      });
//
//    return $prom;
//  }
//  
//  //setTimeout(Fotolog.backup(), 500);
//  Fotolog.backup = (function() {
//
//    var $promise = $Fetch(Fotolog.mosaic);
//
//    $promise.then( $ => {
//      var container = $('.profile_bar_active').get(0),
//          $el = $(container).children().first();
//      Fotolog.postsAmount = parseInt($el.contents());
//      return console.log(Fotolog.postsAmount);
//    }).catch( error => {
//      console.log('Couldn’t get amount of posts.');
//      console.log(error);
//    });
//
//  })();
//  
//})();
//
//
//
//process.on('exit', _=> {
//  console.timeEnd('Elapsed time');
//});

'use strict';

console.time('Elapsed time');

const fetch = require('node-fetch'),
      cheerio = require('cheerio'),
      fs = require('fs'),
      request = require('request');
      // util = require('util');   // for debugging only

const fotolog = process.argv[2],
      base  = 'http://www.fotolog.com/' + fotolog + '/',
      posts_amount = +process.argv[3],
      picture_path = './content/';

let mosaicBase = base+ 'mosaic/',
    fotologPostsLinks,
    mosaicPageNumber = 1;

// Fetches URL, wrap it in a Cheerio object and
// returns a promise to it.
function $fetcher(url) {
  // `p$` will store a Promise that we’ll return
  let p$ = fetch(url).then( response => {
    return response.text();
  }).then( text => { 
    return cheerio.load(text);
  });
  return p$;
}


function mosaic_fetcher(page_number) {
  
  let p,  // `p` will store a Promise that we’ll return
      mosaic_url;
  
  page_number = +page_number;
  mosaic_url = set_mosaic_url(page_number);
  
  // Given its number, returns the mosaic page URL (e.g 'http://www.fotolog.com/<fotolog_name>/mosaic/30/').
  function set_mosaic_url(page_number) {
    return mosaicBase + (30 * (page_number - 1)) + '/';
  }
  
  // Given a Cheerio wrapped mosaic page, returns a Cherrio object
  // containing an array of the mosaic elements, which are links 
  // to Fotolog posts.
  function $get_mosaic_elements($) {
    return $('.wall_img_container');
  }
  
  // Given the Cheerio wrapped mosaic elements, returns a promise 
  // to an array containing respective Fotolog posts IDs.
  function get_posts_IDs($el) {
    let re = /\d+\/$/;
    return $el.map( (i, el) => {
      // 'http://www.fotolog.com/<fotologName>/12345678/' ...
      return (el.attribs.href)
        .match(re);  // ... store just '12345678/'
    }).get();  // .get() returns an array with the posts IDs
  }
  
  p = $fetcher(mosaic_url)
      .then($get_mosaic_elements)
      .then(get_posts_IDs)
      .catch( error => {
        console.log('FUÉIN!', error);
  });
  
  return p;  // return promise to array of posts IDs
}


//let arr = mosaic_fetcher(mosaicPageNumber);
//
//console.log('Porra! arr = ');
//arr.then( IDs => { console.log(IDs); });

function picture_backup(ID) {
  let url = base + ID,
      picture_name = ID.substring(0, ID.length - 1) + '.jpg';
  
  fetch(url).then( response => {
    return response.text();
  }).then( text => {
    return cheerio.load(text);
  }).then( $ => {
    return $('.wall_img_container_big').children().prop('src');
  }).then( picture_uri => {
    console.log('downloading ' + picture_uri + '...');
    request(picture_uri)
      .pipe(
        fs.createWriteStream(
          picture_path+picture_name
        )
      );

  });
}


for (let i = 1; i <= 3; i++) {
  
  //request(picture_uri)
  //  .pipe(fs.createWriteStream(path+picture_name));
  
  let j =i;
  
  let posts_IDs = mosaic_fetcher(j)
    .then( IDs => {
      mosaicPageNumber += 1;
      console.log("Parsed mosaic page number %d", mosaicPageNumber);
      IDs.forEach(picture_backup);
    }).catch( e => { 
      console.log(e); 
    });
  
}


process.on('exit', _=> {
  console.timeEnd('Elapsed time');
});
  
//function getCurMosaicPagePostsLinks() {
//  
//  // `p` will store a Promise that we’ll return
//  var p = fetch(mosaicBase).then( response => {
//    return response.text();
//  }).then( text => { 
//    return cheerio.load(text);
//  }).then( $ => {
//    var re = /\d+\/$/;  // 'http://www.fotolog.com/<fotologName>/12345678/' ...
//    return ($('.wall_img_container').map( (i, el) => {
//      // ... store just '12345678/'
//      return ($(el).prop('href')).match(re);
//    }).get());  // .get() returns an array with the posts IDs
//  }).catch( error => {
//    console.log('FUÉIN!', error);
//  });
//  
//  return p;  // return Promise with array of posts IDs
//}

//  function get_posts_IDs($el) {
//    let re = /\d+\/$/;
//    return $el.map( (i, el) => {
//      // 'http://www.fotolog.com/<fotologName>/12345678/' ...
//      //return ($(el).prop('href'))
//      //return (el.getAttribute('href'))
//      return (el.attribs.href)
//        .match(re);  // ... store just '12345678/'
//    }).get();  // .get() returns an array with the posts IDs
//  }