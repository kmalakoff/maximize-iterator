var nextCallback = require('iterator-next-callback');
var callOnce = require('call-once-next-tick');

var maximizeNext = require('./lib/maximizeNext');

var DEFAULT_CONCURRENCY = 4096;
var MAXIMUM_BATCH = 10;

module.exports = function maximizeIterator(iterator, fn, options, callback) {
  if (typeof fn !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    options = options || {};
    options = {
      concurrency: options.concurrency || DEFAULT_CONCURRENCY,
      batch: options.batch || MAXIMUM_BATCH,
      each: fn,
      counter: 0,
    };

    maximizeNext(nextCallback(iterator), options, callback);
  } else {
    return new Promise(function (resolve, reject) {
      maximizeIterator(
        iterator,
        fn,
        options,
        callOnce(function (err) {
          err ? reject(err) : resolve();
        })
      );
    });
  }
};
