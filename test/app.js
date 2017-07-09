'use strict';

const provider = require('../src');
const env = require('dotenv').config();

if (env.error) {
  throw env.error
}

const config = {
  facebook: {
    endpoint: process.env.FACEBOOK_ENDPOINT,
    clientId: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
  },
  shortener: {
    googl: {
      endpoint: process.env.GOOGL_ENDPOINT,
      token: process.env.GOOGL_TOKEN,
    },
    bitly: {
      endpoint: process.env.BITLY_ENDPOINT,
      token: process.env.BITLY_TOKEN,
    }
  }
}

describe('facebook', function() {
  describe('platforms', function() {
    describe('search()', function() {
      it('should return array of object', function(done) {
        let service = new provider(config);
        return service.facebook.platforms.search({keyword: 'bola'}).then(() => {
          done()
        })
      });
    });
  });
});