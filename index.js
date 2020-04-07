var callOnce = require('./lib/callOnce');
var callIteratorNext = require('./lib/callIteratorNext');
var maximizeNext = require('./lib/maximizeNext');

var DEFAULT_CONCURRENCY = 4096;
var MAXIMUM_BATCH = 10;

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
      each: options.each,
      counter: 0,
    };

    maximizeNext(callIteratorNext(iterator), options, callOnce(callback));
  } else {
    return new Promise(function (resolve, reject) {
      maximizeIterator(iterator, options, function (err) {
        err ? reject(err) : resolve();
      });
    });
  }
};
