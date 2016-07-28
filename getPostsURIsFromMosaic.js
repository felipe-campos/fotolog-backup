'use strict';

const $fetch = require('./$fetch');

const FOTOLOG = process.argv[2],
      mosaicBase = 'http://www.fotolog.com/' + FOTOLOG + '/mosaic/';


function getPostsURIsFromMosaic(mosaicPageNumber) {

  let mosaicURI = setMosaicURI(mosaicPageNumber);

  // Given its number, returns the mosaic page URL (e.g 'http://www.fotolog.com/<fotolog_name>/mosaic/30/').
  function setMosaicURI(mosaicPageNumber) {
    return mosaicBase + (30 * (mosaicPageNumber - 1)) + '/';
  }

  // Given a Cheerio-wrapped mosaic page, returns a Cherrio object
  // containing an array of the mosaic elements which are links
  // to Fotolog posts.
  function $getMosaicEls($) {
    return $('.wall_img_container');
  }

  // Given the Cheerio wrapped mosaic elements, returns an array
  // containing respective Fotolog posts URIs.
  function getPostsURIs($el) {
    // Cheerio’s “map” params don’t follow ES’s “map” order
    return $el.map( (i, el) => el.attribs.href ).get();
  }

  return $fetch(mosaicURI)
      .then($getMosaicEls)
      .then(getPostsURIs);
}


module.exports = getPostsURIsFromMosaic;
