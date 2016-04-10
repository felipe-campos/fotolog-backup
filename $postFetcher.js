'use strict';

function $postFetcher(fotolog, ID, fetchFunc) {
  
  const base = 'http://www.fotolog.com/' + fotolog + '/';
  let uri = base + ID;
  
  function $memoizeParentEl($) {
    console.log('$memoizeParentEl');
    let $memoizedParent =
        Promise.resolve( $('#wall_column_left').children() );
    return Promise.all( [$memoizedParent, $] );
  }   // return Cheerio wrapped post too _^
  
  return fetchFunc(uri).then($memoizedParentEl);
}


module.exports = $postFetcher;