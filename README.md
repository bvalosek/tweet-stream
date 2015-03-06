# tweet-stream

Create a readable object stream of tweets from the Twitter REST API via
[twit](https://github.com/ttezel/twit).

## Installation

```
$ npm install tweet-stream
```

## Overview

The point of this module is to provide a readable `Stream` instance that spits
out tweet objects directly from the REST API, that traverses the entire result
via paging with the `max_id` parameter.

This can be used to backfill tweets for a specific user or search term; it is
NOT related to the
[Twitter streaming API](https://dev.twitter.com/streaming/overview).

Note that this will make requests as fast as possible, so watch out for rate
limiting.

## Usage

```javascript
import Twit from 'twit';
import TweetStream from 'tweet-stream';
import through from 'through';

// Create an API instance with Twit
var twit = new Twit({
  consumer_key        : '...',
  consumer_secret     : '...',
  access_token        : '...',
  access_token_secret : '...'
});

// Create the object stream of all tweets for this response
var stream = new TweetStream(twit, 'statuses/user_timeline', {
  screen_name: 'bvalosek',
  include_rts: false,
  exclude_replies: true
});

// Dump to console
stream.pipe(through(data => console.log(data)));
```

### In ES5-only Environments

If not using in an environment that supports ES6+, an ES5 build is available:

```
var TweetStream = require('tweet-stream/es5');

...
```

## Testing

Maybe someday.

## License

MIT
