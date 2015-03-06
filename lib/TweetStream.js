import {Readable} from 'stream';
import debug from 'debug';

debug = debug('TweetStream');

/**
 * A readable stream of objects from the twitter API
 * @private
 */
export default class TweetStream extends Readable
{
  /**
   * @param {Twit} twit Instance of twit Twitter API wrapper
   * @param {string} url API url path
   * @param {object} params API options
   */
  constructor(twit, url, params)
  {
    super({ objectMode: true });

    this._twit = twit;
    this._url = url;
    this._params = params;

    this._maxId = null;
    this._lastMaxId = null;
    this._loading = false;
    this._done = false;
  }

  /**
   * @private
   */
  _read()
  {
    if (this._loading || this._done) return;

    this._loading = true;

    // Shallow clone + overrides
    let params = Object.assign({}, {
      count: 200,
      max_id: this._maxId ? this._maxId : undefined
    }, this._params);

    debug('fetching %s %s', this._url, JSON.stringify(params));

    this._twit.get(this._url, params, (err, data) => {
      this._loading = false;

      if (err) {
        return this.emit('error', err);
      }

      debug('received %d objects', data.length);

      // Prevent further load requests if this is the last page
      if (data.length === 1) {
        this._done = true;
      }

      // No data => done
      if (!data.length) {
        return this.push(null);
      }

      // Keep track of last ID to know when we're done
      let lastTweet = data[data.length - 1];
      this._lastMaxId = this._maxId;
      this._maxId = lastTweet.id_str;

      // Emit data
      for (let tweet of data) {
        if (tweet.id_str !== this._lastMaxId) {
          this.push(tweet);
        }
      }

      // If last page, signal done
      if (data.length === 1) {
        return this.push(null);
      }
    });
  }
}

