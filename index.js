var nextCallback = require('iterator-next-callback');
var callOnce = require('call-once-next-tick');

var maximizeNext = require('./lib/maximizeNext');

var DEFAULT_CONCURRENCY = 4096;
var MAXIMUM_BATCH = 100;

module.exports = function maximizeIterator(iterator, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    options = options || {};
    options = {
      concurrency: options.concurrency || DEFAULT_CONCURRENCY,
      batch: options.batch || MAXIMUM_BATCH,
      each: options.each || function () {},
      counter: 0,
    };

    maximizeNext(nextCallback(iterator), options, callOnce(callback));
  } else {
    return new Promise(function (resolve, reject) {
      maximizeIterator(iterator, options, function (err) {
        err ? reject(err) : resolve();
      });
    });
  }
};
