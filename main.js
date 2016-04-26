'use strict';

console.time('Elapsed time');
process.on('exit', _=> console.timeEnd('Elapsed time'));

const request = require('request');

const mkdir = require("mkdir-promise"),
      $fetch = require('./$fetch'),
      getPostsURIsFromMosaic = require('./getPostsURIsFromMosaic'),
      backUp = require('./backUp');

const FOTOLOG = process.argv[2],
      base  = 'http://www.fotolog.com/' + FOTOLOG + '/',
      postsAmount = +process.argv[3],
      mosaicPagesAmount = Math.ceil(postsAmount/30),
      backupPath = './content/' + FOTOLOG + '/';


mkdir(backupPath).then(
  _=> console.log(`Diretório '${backupPath}' OK.`),
  exception => console.error(exception)
);

for (let i = 1; i <= mosaicPagesAmount; i++) {
  
  let mosaicPageNumber = i;
  
  let postsURIs = getPostsURIsFromMosaic(mosaicPageNumber)
    .then( URIs => URIs.forEach(backUp) )
    .catch( e => console.log(e) );

}
