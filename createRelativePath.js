'use strict';

const fs = require('fs')

function createRelativePath(path, options) {
  fs.access(path, err => {
    if (err) {
      fs.mkdir(path);
      return console.log(`Diretório '%s' criado.`, path);
    } else {
       return console.log(`Diretório '%s' já existia.`, path);
    }
  });
}

module.exports = createRelativePath;