'use strict';

//const $postFetcher = require('./$postFetcher');

const FOTOLOG = process.argv[2],
      $fetcher = require('./$fetcher'),
      createRelativePath = require('./createRelativePath'),
      fs = require('fs'),
      request = require('request'),
      MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',  'July', 'August', 'September', 'October', 'November', 'December'
      ];


// Promise to array of objects containing description 
// data. The objects have `type: 'text'` or `type: 'tag'`.
// Tags are chiefly <br>, both automatically generated
// ones and user-inputted ones).
/*function getDescription($memoizedParent, $) {
  console.log('getDescription');
  return Promise.resolve(
    $('#description_photo', $memoizedParent)
      .children('p').contents().get());
}*/


// Second to last object in `arr` is the automatically
// generated text informing post date. Function returns
// an array containing year, month and day strings.
function getPostDate($) {
  
  return Promise.resolve( 
    $('#description_photo').children('p')
      .contents().eq(-2).text()
  ).then( dateStr => {
    
    dateStr = dateStr.trim();  
    // now, `dateStr` is something like "On May 05 2005"
    
    let year = dateStr.substr(-4);
    let day = dateStr.substr(-7, 2);
    let monthName = dateStr.substring(3, dateStr.length - 8);

    // "May" -> "05"  ;  "November" -> "11"
    let month = (function(monthName) {
      let monthNum = MONTH_NAMES.indexOf(monthName) + 1;
      if (monthNum === 0) throw new Error('Month’s no good.');
      return ( (monthNum < 10) ? '0' : '' ) + monthNum;
    })(monthName);

    return [year, month, day, $];
  });
} 


function $postFetcher(fotolog, ID, fetchFunc) {
  
  const base = 'http://www.fotolog.com/' + FOTOLOG + '/';
  let uri = base + ID;

  return fetchFunc(uri);
}


function createDateDirectory($array) {

  let year = $array[0], 
      month = $array[1],
      day = $array[2],
      $ = $array[3];
  
  let date = year + '-' + month + '-' + day,
      path = './content/' + FOTOLOG + '/' + date + '/',
      mkDir = Promise.resolve(createRelativePath(path));
  
  return Promise.all([$, path, date, mkDir]);
}
// 2004-08-30_fotolog_post.json;



function backup(ID) {
  
  // whilst developing, try just 3 handpicked posts
  if (ID === '14182234/' || ID === '10611508/' || ID === '10239857/') {
  return $postFetcher(FOTOLOG, ID, $fetcher)
    .then(getPostDate)
    .then(createDateDirectory)
    .then( $array => {
    let $ = $array[0],
        path = $array[1],
        date = $array[2],
        pathdate = path + date; //console.log(date);
    let picturePath = pathdate + '_fotolog_picture.jpg',
        descriptionPath = pathdate + '_fotolog_post.json',
        commentsPath = pathdate + '_fotolog_comments.json';
    
    // let pictureURI = $('.wall_img_container_big').children().prop('src');
    let pictureURI = $('meta[property="og:image"]')
      .prop('content'); // console.log(pictureURI);
    
    request(pictureURI).pipe(fs.createWriteStream(picturePath));
    
    
    let description = $('meta[itemprop="description"]')
      .prop('content');
    console.log('Raw description:');
    console.log(description);
    description = description.substring(0, description.length - FOTOLOG.length - 13);
    description = description.replace(/\s?<BR>\s<BR>\s?/g, '<BR>');
    console.log('Cleaned description:');
    console.log(description);
    
    fs.writeFile(descriptionPath, description, err => {
      if (err) throw new Error(err.message);
      console.log(descriptionPath + ' saved.');
    });
    
    
    let comments = $('.flog_img_comments').not('#comment_form')
      .children('p').get();
    console.log('Comments:');
    console.log(comments);
    
  }).catch( error => {
    console.log(error);
  });
    
      
  }
  
  return;    
}


module.exports = backup;