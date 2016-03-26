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
      picture_path = './content/' + fotolog + '/';

let mosaic_base = base + 'mosaic/',
    fotolog_posts_links,
    mosaic_page_number = 1,
    // mosaic shows 30 posts per page
    mosaic_pages_amount = Math.ceil(posts_amount/30);


function create_relative_path(picturepath, options) {
  fs.access(picturepath, err => {
    if (err) {
      fs.mkdir(picturepath);
      return console.log(`Diretório '%s' criado.`, picturepath);
    } else {
       return console.log(`Diretório '%s' já existia.`, picturepath);
    }
  });
}

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
    return mosaic_base + (30 * (page_number - 1)) + '/';
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
    console.log('Downloading ' + picture_uri + '...');
    request(picture_uri)
      .pipe(fs.createWriteStream(picture_path + picture_name));
  });
}


create_relative_path(picture_path);

for (let i = 1; i <= mosaic_pages_amount; i++) {
  
  mosaic_page_number = i;
  
  let posts_IDs = mosaic_fetcher(mosaic_page_number)
    .then( IDs => {
      console.log("Parsed mosaic page number %d", mosaic_page_number);
      mosaic_page_number += 1;
      IDs.forEach(picture_backup);
    }).catch( e => { 
      console.log(e); 
    });
  
}


process.on('exit', _=> {
  console.timeEnd('Elapsed time');
});