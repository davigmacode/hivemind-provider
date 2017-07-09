'use strict';

const moment = require('moment');

class Posts {

  constructor (options) {
    this.api = options.http;
    this.config = options.config;
    this.moment = moment;
  }

  getByPlatform (options) {
    // cache root object
    let self = this;

    return new Promise((resolve, reject) => {
      // check for page id/username
      let platformId = options.platform._id;
      if (platformId === '' || platformId === null || platformId === undefined)
        reject({message: 'Platform object should provided'})

      // defined required post properties
      let fields = [
        'likes.limit(0).summary(true)',
        'comments.limit(0).summary(true)',
        'reactions.type(NONE).limit(0).summary(total_count).as(reaction_total)',
        'reactions.type(LIKE).limit(0).summary(total_count).as(reaction_like)',
        'reactions.type(LOVE).limit(0).summary(total_count).as(reaction_love)',
        'reactions.type(WOW).limit(0).summary(total_count).as(reaction_wow)',
        'reactions.type(HAHA).limit(0).summary(total_count).as(reaction_haha)',
        'reactions.type(SAD).limit(0).summary(total_count).as(reaction_sad)',
        'reactions.type(ANGRY).limit(0).summary(total_count).as(reaction_angry)',
        'reactions.type(THANKFUL).limit(0).summary(total_count).as(reaction_thankful)',
        'shares',
        'picture',
        'full_picture',
        'created_time',
        'updated_time',
        'description',
        'message',
        'caption',
        'source',
        'permalink_url',
        'icon',
        'link',
        'type',
        'name'
      ]

      let request = {};

      // defined request is first time or nextpage
      if (options.nextPage) {
        // next request
        request = {
          method: 'get',
          url: options.nextPage
        }
      } else {
        // first request
        request = {
          method: 'get',
          url: platformId + '/posts',
          params: {
            'access_token': self.config.token,
            'since': options.since || 'yesterday',
            'fields': fields.join(',')
          }
        }

        options.posts = [];
      }

      // http access to facebook api
      self.api.request(request).then((http) => {
        let response = http.data;
        if (!response.error) {
          // return posts data
          let posts = response.data;
          // cache the posts array
          options.posts.push.apply(options.posts, posts);

          // check for the next page
          if (response.paging && response.paging.next) {
            options.nextPage = response.paging.next;
            resolve(self.getByPlatform(options))
          } else {
            // format each of post data and resolve
            self.formatMany(options.posts, options.platform).then((posts) => {
              resolve(posts)
            })
          }
        } else {
          reject(response.error);
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

  formatMany (posts, platform) {
    // cache root object
    let self = this;

    return new Promise((resolve, reject) => {
      if (posts && posts.length > 0) {
        // run the function over all items.
        let actions = posts.map((x) => self.formatOne(x, platform));

        Promise.all(actions).then((posts) => {
          resolve(posts);
        });
      } else {
        resolve({posts: []});
      }
    });
  }

  formatOne (post, platform) {
    return new Promise((resolve, reject) => {
      post._id = post.id;
      post.platformId = platform._id;
      post.created_time = new Date(post.created_time);
      post.updated_time = new Date(post.updated_time);
      post.created_time_unix = this.moment(post.created_time).unix();
      post.updated_time_unix = this.moment(post.updated_time).unix();
      post.shares = post.shares ? post.shares.count : 0;
      post.comments = post.comments ? post.comments.summary.total_count : 0;
      post.likes = post.likes ? post.likes.summary.total_count : 0;
      post.virals = post.shares / post.likes || 0;
      post.potentials = ((post.shares + post.comments) / platform.fans) * 1000;
      post.clicks = 0;
      post.reactions = {
        total: post.reaction_total.summary.total_count,
        like: post.reaction_like.summary.total_count,
        love: post.reaction_love.summary.total_count,
        wow: post.reaction_wow.summary.total_count,
        haha: post.reaction_haha.summary.total_count,
        sad: post.reaction_sad.summary.total_count,
        angry: post.reaction_angry.summary.total_count,
        thankful: post.reaction_thankful.summary.total_count
      }

      // delete unused atribute
      delete post.id;
      delete post.reaction_total;
      delete post.reaction_like;
      delete post.reaction_love;
      delete post.reaction_wow;
      delete post.reaction_haha;
      delete post.reaction_sad;
      delete post.reaction_angry;
      delete post.reaction_thankful;

      resolve(post);
    });
  }
}

module.exports = Posts;