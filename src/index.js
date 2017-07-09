'use strict';

const facebook = require('./facebook');
const shortener = require('./shortener');

class Provider {

  constructor (options) {
    // initiate shortener first
    this.shortener = new shortener(options.shortener);

    // pass shortener instance to facebook
    options.facebook.shortener = this.shortener;
    this.facebook = new facebook(options.facebook);
  }

}

module.exports = Provider
