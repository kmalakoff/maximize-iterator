var compat = require('async-compat');

function callDone(options, callback) {
  if (!options.done || options.counter > 0) return false;
  callback(options.err);
  return true;
}

function processDone(err, options, callback) {
  options.err = options.err || err;
  options.done = true;
  return callDone(options, callback);
}

module.exports = function createProcessor(next, options, callback) {
  var isProcessing = false;
  return function processor(done) {
    if (done && processDone(null, options, callback)) return;
    if (isProcessing) return;
    isProcessing = true;

    var counter = 0;
    while (options.counter < options.concurrency) {
      if (options.done || options.stop(counter++)) break;
      if (options.total >= options.limit) return processDone(null, options, callback);
      options.total++;
      options.counter++;

      next(function (err, value) {
        if (err || value === null) {
          options.counter--;
          if (err && compat.defaultValue(options.error(err), false)) return processDone(err, options, callback);
          else if (!err) return processDone(null, options, callback);
          else if (!isProcessing) return processor();
          return;
        }

        try {
          compat.asyncFunction(options.each, options.async, value, function (err, keep) {
            options.counter--;
            if (err && compat.defaultValue(options.error(err), false)) return processDone(err, options, callback);
            else if (!err && !compat.defaultValue(keep, true)) return processDone(null, options, callback);
            // eslint-disable-next-line no-useless-return
            else if (callDone(options, callback)) return;
            else if (!isProcessing) return processor();
          });
        } catch (err) {
          options.counter--;
          return processDone(err, options, callback);
        }
      });
    }

    isProcessing = false;
  };
};
