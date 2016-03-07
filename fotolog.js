// Fotolog module

var Fotolog = function(name) {
  this.name = name;
  this.baseUrl = 'http://www.fotolog.com/';
};

Fotolog.prototype = {
  
//  baseUrl: 'http://www.fotolog.com/',
  
  url: function() {
    return this.baseUrl + this.name + '/';
  },
  
  mosaicUrl: function() {
    return this.baseUrl + 'mosaic/';
  },
  
  mosaicNextPage: function() {
    return 'falta fazer';
  }
  
};


//module.exports = Fotolog;

module.exports = function(name) {
  return new Fotolog(name);
};