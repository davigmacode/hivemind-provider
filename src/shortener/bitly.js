'use strict';

class Bitly {

  constructor (options) {
    this.config = options;
  }

  getClicks (shorturl) {
    return new Promise((resolve, reject) => {
      // call bitly api
      this.config.http.request({
        method: 'get',
        url: this.config.provider.endpoint,
        params: {
          'access_token': this.config.provider.token,
          'link': shorturl
        }
      }).then((response) => {
        response = response.data
        if (response.status_code === 200) {
          resolve(Number(response.data.link_clicks))
        } else {
          resolve(Number(0))
        }
      }).catch(() => {
        resolve(Number(0))
      });
    });
  }
}

module.exports = Bitly