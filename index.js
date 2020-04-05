var getKeep = require('./lib/getKeep');
var callOnce = require('./lib/callOnce');

var DEFAULT_CONCURRENCY = 4096;
var MAXIMUM_BATCH = 10;

function callIterators(iterator, options, callback) {
  var counter = 0;
  while (options.counter < options.concurrency) {
    if (options.done || counter++ > options.batch) return; // done
    options.counter++;

    iterator.next(function (err, result) {
      if (options.done) return;
      if (err || result.done) {
        options.done = true;
        return callback(err);
      }

      if (!options.each) {
        options.counter--;
        return callIterators(iterator, options, callback);
      }

      try {
        getKeep(options.each(result.value), function (err1, keep) {
          if (options.done) return;
          if (err1) {
            options.done = true;
            return callback(err1);
          }

          if (!keep) {
            options.done = true;
            return callback();
          }
          options.counter--;
          return callIterators(iterator, options, callback);
        });
      } catch (err) {
        options.done = true;
        return callback(err);
      }
    });
  }
}

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

  if (typeof callback === 'function') return callIterators(iterator, options, callOnce(callback));
  return new Promise(function (resolve, reject) {
    maximizeIterator(iterator, options, function (err) {
      err ? reject(err) : resolve();
    });
  });
};
