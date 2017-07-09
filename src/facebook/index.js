'use strict';

const Axios = require('axios');
const Platforms = require('./platforms');
const Posts = require('./posts');

class Facebook {

  constructor (options) {
    if (!options.token) {
      options.token = options.clientId + '|' + options.clientSecret;
    }

    this.config = options;
    this.http = Axios.create({baseURL: this.config.endpoint});
    this.platforms = new Platforms({http: this.http, config: this.config});
    this.posts = new Posts({http: this.http, config: this.config});
    this.shortener = options.shortener;
  }

  getByPlatform (platformId) {
    let self = this;

    return new Promise((resolve, reject) => {
      // get platform info
      this.platforms.getOne(platformId).then((platform) => {
        // get platform posts
        this.posts.getByPlatform({platform: platform}).then((posts) => {
          // get platform posts click
          this.shortener.getPostsClicks(posts).then((postsWithClicks) => {
            resolve({platform: platform, posts: postsWithClicks});
          }).catch((error) => reject(error));
        }).catch((error) => reject(error));
      }).catch((error) => reject(error));
    });
  }
}

module.exports = Facebook