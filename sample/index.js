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

console.log(config);

// initiate the library
let service = new provider(config);

// fetch platform info and post data by id platform
service.facebook.getByPlatform('111664839644').then((response) => {
  console.log({platform: response.platform, posts: response.posts.length});
}).catch((error) => {
  console.log(error);
});

// search platform by keyword
service.facebook.platforms.search({keyword: 'bola'}).then((response) => {
  console.log('platform search has ', response.length, ' result');
}).catch((error) => {
  console.log(error);
});