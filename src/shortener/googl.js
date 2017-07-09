'use strict';

class Googl {

  constructor (options) {
    this.config = options;
  }

  getClicks (shorturl) {
    return new Promise((resolve, reject) => {
      // call goo.gl api
      return this.config.http.request({
        method: 'get',
        url: this.config.provider.endpoint,
        params: {
          'key': this.config.provider.token,
          'projection': 'ANALYTICS_CLICKS',
          'fields': 'analytics/allTime/longUrlClicks',
          'shortUrl': shorturl
        }
      }).then((response) => {
        response = response.data;
        if (response.status === 'OK') {
          resolve(Number(response.analytics.allTime.longUrlClicks))
        } else {
          resolve(Number(0))
        }
      }).catch((error) => {
        resolve(Number(0))
      });
    });
  }
}

module.exports = Googl