'use strict';

function mosaicFetcher(fotolog, pageNumber, fetchFunc) {
  
  const mosaicBase = 'http://www.fotolog.com/' + fotolog + '/mosaic/';
  let mosaicURI = setMosaicURI(pageNumber);
    
  // Given its number, returns the mosaic page URL (e.g 'http://www.fotolog.com/<fotolog_name>/mosaic/30/').
  function setMosaicURI(pageNumber) {
    return mosaicBase + (30 * (pageNumber - 1)) + '/';
  }
  
  // Given a Cheerio wrapped mosaic page, returns a Cherrio object
  // containing an array of the mosaic elements, which are links 
  // to Fotolog posts.
  function $getMosaicEls($) {
    return $('.wall_img_container');
  }
  
  // Given the Cheerio wrapped mosaic elements, returns a promise 
  // to an array containing respective Fotolog posts URIs.
  function getPostsURIs($el) {
    return $el.map( (i, el) => el.attribs.href ).get();
  }
  return fetchFunc(mosaicURI)
      .then($getMosaicEls)
      .then(getPostsURIs);
}


module.exports = mosaicFetcher;