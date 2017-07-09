'use strict';

const Axios = require('axios');
const Bitly = require('./bitly');
const Googl = require('./googl');

class Shortener {

  constructor (options) {
    this.http = Axios.create({timeout: 5000});
    this.bitly = new Bitly({http: this.http, provider: options.bitly});
    this.googl = new Googl({http: this.http, provider: options.googl});
  }

  getPostsClicks (posts) {
    let self = this;

    // create loop of promise
    return new Promise((resolve, reject) => {
      if (posts && posts.length > 0) {
        // run the function over all items.
        let actions = posts.map((post) => self.getPostClicks(post));

        // return array of posts with clicks
        Promise.all(actions).then((posts) => resolve(posts));
      } else {
        // return an empty array
        resolve([]);
      }
    });
  }

  getPostClicks (post) {
    return new Promise((resolve, reject) => {
      if (post) {
        if (post.link) {
          this.getClicks(post.link).then((clicks) => {
            post.clicks = clicks;
            resolve(post);
          });
        } else {
          resolve(post);
        }
      } else {
        reject({error: 'post should provided'});
      }
    });
  }

  getClicks (url) {
    return new Promise((resolve, reject) => {
      if (url) {
        if (url.indexOf('bit.ly') !== -1) {
          // GET clicks from bit.ly
          this.bitly.getClicks(url).then((clicks) => resolve(clicks));
        } else if (url.indexOf('goo.gl') !== -1) {
          // GET clicks from goo.gl
          this.googl.getClicks(url).then((clicks) => resolve(clicks));
        } else {
          resolve(Number(0));
        }
      } else {
        resolve(Number(0));
      }
    })
  }
}

module.exports = Shortener