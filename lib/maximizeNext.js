var nextTick = require('next-tick');

var getKeep = require('./getKeep');
var getResult = require('./getResult');

function callDone(options, callback) {
  if (!options.done || options.counter > 0) return false;
  callback(options.err);
  return true;
}

function processDone(options, callback) {
  options.done = true;
  return callDone(options, callback);
}

function processError(err, options, callback) {
  if (getResult(options.error(err), false)) {
    options.err = err;
    options.done = true;
  }
  return callDone(options, callback);
}

function processAvailable(next, options, callback) {
  var isProcessing = false;
  return function waiter() {
    if (isProcessing) return;
    isProcessing = true;

    var counter = 0;
    while (options.counter < options.concurrency) {
      if (options.done || counter++ > options.batch) break;
      if (options.total >= options.limit) return processDone(options, callback);
      options.total++;
      options.counter++;

      next(function (err, value) {
        if (err || value === null) {
          options.counter--;
          return err ? processError(err, options, callback) : processDone(options, callback);
        }

        try {
          getKeep(options.each(null, value), function (err, keep) {
            options.counter--;
            if (err) return processError(err, options, callback);
            else if (!keep) return processDone(options, callback);
            if (!callDone(options, callback)) waiter();
          });
        } catch (err) {
          options.counter--;
          return processError(err, options, callback);
        }
      });
    }

    isProcessing = false;
  };
}

module.exports = function maximizeNext(next, options, callback) {
  processAvailable(next, options, callback)();
};
