var getKeep = require('./getKeep');

module.exports = function maximizeNext(next, options, callback) {
  var counter = 0;
  while (options.counter < options.concurrency) {
    if (options.done || counter++ > options.batch) return;
    options.counter++;

    next(function (err, value) {
      if (value === null) {
        options.counter--;
        options.done = true;
        if (options.counter <= 0) return callback(options.err);
        return;
      }

      try {
        getKeep(options.each(err, value), function (err1, keep) {
          options.counter--;
          if (err1) {
            options.err = err1;
            options.done = true;
          } else if (!keep) {
            options.done = true;
          }
          if (options.done && options.counter <= 0) return callback(options.err);

          return maximizeNext(next, options, callback);
        });
      } catch (err) {
        options.counter--;
        options.err = err;
        options.done = true;
        if (options.counter <= 0) return callback(options.err);
      }
    });
  }
};
