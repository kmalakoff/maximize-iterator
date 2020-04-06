var callOnce = require('./lib/callOnce');
var callIteratorsCallback = require('./lib/callIteratorsCallback');

const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;
var useAsyncIterator = require('./lib/useAsyncIterator');
var callIteratorsAsyncIterator = HAS_ASYNC_ITERATOR ? require('./lib/callIteratorsAsyncIterator') : null;

var DEFAULT_CONCURRENCY = 4096;
var MAXIMUM_BATCH = 10;

module.exports = function maximizeIterator(iterator, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  options = {
    concurrency: options.concurrency || DEFAULT_CONCURRENCY,
    batch: options.batch || MAXIMUM_BATCH,
    each: options.each,
    counter: 0,
  };

  if (typeof callback === 'function') {
    if (useAsyncIterator(iterator)) return callIteratorsAsyncIterator(iterator, options, callOnce(callback));
    else return callIteratorsCallback(iterator, options, callOnce(callback));
  }
  return new Promise(function (resolve, reject) {
    maximizeIterator(iterator, options, function (err) {
      err ? reject(err) : resolve();
    });
  });
};
