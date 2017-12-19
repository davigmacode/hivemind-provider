'use strict';

class Platforms {

  constructor (options) {
    this.api = options.http;
    this.config = options.config;
  }

  search (options) {
    return new Promise((resolve, reject) => {
      // request to the graph api
      this.api.request({
        method: 'get',
        url: 'search',
        params: {
          'q': options.keyword,
          'type': 'page',
          'access_token': this.config.token,
          'fields': 'id,name,username,fan_count,link,picture',
          'limit': 25
        }
      }).then((results) => {
        let response = results.data;
        let platforms = response.data.map((item) => {
          item.fans = item.fan_count;
          item.picture = item.picture.data.url;
          delete item.fan_count;
          return item;
        });
        resolve(platforms);
      }).catch((http) => {
        reject(http.response.data.error);
      });
    });
  }

  getOne (id) {
    // http access to facebook api
    return new Promise((resolve, reject) => {
      this.api.request({
        method: 'get',
        url: id,
        params: {
          'access_token': this.config.token,
          'fields': 'id,name,username,fan_count,link,picture'
        }
      }).then((response) => {
        // get platform info
        let platform = response.data

        if (!platform.error) {
          // format platform info
          platform.fans = platform.fan_count;
          platform.picture = platform.picture.data.url;
          platform._id = platform.id;

          delete platform.id;
          delete platform.fan_count;

          resolve(platform);
        } else {
          reject(platform.error);
        }
      }).catch((http) => {
        if (!http.response) {
          http.response = {
            data: {
              error: {
                message: 'Connection timeout or unexpected error occured'
              }
            }
          };
        }

        reject(http.response.data.error);
      });
    });
  }
}

module.exports = Platforms;