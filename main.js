'use strict';

console.time('Elapsed time');

const request = require('request');

const createRelativePath = require('./createRelativePath'),
      $fetcher = require('./$fetcher'),
      mosaicFetcher = require('./mosaicFetcher'),
      backup = require('./backup');

const FOTOLOG = process.argv[2],
      base  = 'http://www.fotolog.com/' + FOTOLOG + '/',
      postsAmount = +process.argv[3],
      mosaicPagesAmount = Math.ceil(postsAmount/30),
      backupPath = './content/' + FOTOLOG + '/';

exports.FOTOLOG = FOTOLOG;
exports.$fetcher = $fetcher;


createRelativePath(backupPath);

for (let i = 1; i <= mosaicPagesAmount; i++) {
  
  let mosaicPageNumber = i;
  
  //let posts_IDs = mosaicFetcher(mosaicPageNumber)
  let postsIDs = mosaicFetcher(FOTOLOG, mosaicPageNumber, $fetcher)
    .then( IDs => IDs.forEach(backup) )
    .catch( e => console.log(e) );
  
}


process.on('exit', _=> {
  console.timeEnd('Elapsed time');
});
