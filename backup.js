'use strict';

const FOTOLOG = process.argv[2],
      $fetch = require('./$fetch'),
      fs = require('fs'),
      request = require('request'),
      mkdir = require("mkdir-promise"),
      MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',  'July', 'August', 'September', 'October', 'November', 'December'
      ];


function $postFetcher(fotolog, ID, fetchFunc) {
  const base = 'http://www.fotolog.com/' + FOTOLOG + '/';
  let uri = base + ID;

  return fetchFunc(uri);
}


// Second to last object in `#description_photo > p` contents array
// is a text node automatically generated by Fotolog, informing post
// date. Ergo the use of `eq(-2)`.
function getPostDate($) {

  // "May" -> "05"  ;  "November" -> "11"
  function formatMonthToNumber(monthName) {
    let monthNum = MONTH_NAMES.indexOf(monthName) + 1;
    if (monthNum === 0) return new Error('Month’s no good.');

    return ( (monthNum < 10) ? '0' : '' ) + monthNum;
  }

  return Promise.resolve(
    $('#description_photo').children('p')
      .contents().eq(-2).text()
  ).then( dateStr => {

      dateStr = dateStr.trim();
      // now, `dateStr` is something like "On May 05 2005"

      let year = dateStr.substr(-4);
      let day = dateStr.substr(-7, 2);
      let monthName = dateStr.substring(3, dateStr.length - 8);
      let month = formatMonthToNumber(monthName);

      return [$, year, month, day];
  });
}


function createDateDirectory($array) {

  let $ = $array[0],
      year = $array[1],
      month = $array[2],
      day = $array[3];

  let date = year + '-' + month + '-' + day,
      path = './content/' + FOTOLOG + '/' + date + '/';

  return mkdir(path)
    .then( _=> console.log(`Diretório '${path}' criado.`),
           exception => console.error(exception) )
    .then( _=> [$, path, date]);
}



function backup(ID) {

  // whilst developing, try just 3 handpicked posts
  if (ID !== '14182234/' && ID !== '10611508/' && ID !== '10239857/') {
    return;
  }

  return $postFetcher(FOTOLOG, ID, $fetch)
    .then(getPostDate)
    .then(createDateDirectory)
    .then( $array => {
  
    let $ = $array[0],
        path = $array[1],
        date = $array[2],
        pathdate = path + date; //console.log(date);
    let picturePath = path + 'picture.jpg',
        descriptionPath = path + 'post.txt',
        commentsPath = path + 'comments.json';

    let pictureURI = $('meta[property="og:image"]').prop('content');
    // console.log(pictureURI);

    request(pictureURI).pipe(fs.createWriteStream(picturePath));



    let descrpt = $('meta[itemprop="description"]').prop('content');

    //console.log('Raw description:\n${descrpt}');
    descrpt = descrpt.substring(0, descrpt.length - FOTOLOG.length - 3);
    descrpt = descrpt.replace(/\s?(?:<BR>\s)*<BR>$/, '');
    descrpt = descrpt.replace(/\s?<BR>\s<BR>\s?/g, '<BR>');
    // console.log('Cleaned description:\n${descrpt}');

    fs.writeFile(descriptionPath, descrpt, err => {
      if (err) return new Error('Description’s no good.');
      console.log(descriptionPath + ' saved.');
    });


    /*let comments = $('.flog_img_comments').not('#comment_form')
      .children('p').get();*/
    /*console.log('Comments:');
    console.log(comments);*/

  }).catch( error => console.log(error) );
    
}


module.exports = backup;