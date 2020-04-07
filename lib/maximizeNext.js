var getKeep = require('./getKeep');

module.exports = function maximizeNext(next, options, callback) {
  var counter = 0;
  while (options.counter < options.concurrency) {
    if (options.done || counter++ > options.batch) return; // done
    options.counter++;

    next(function (err, value) {
      if (options.done) return;

      if (!err && value === null) {
        options.done = true;
        return callback();
      }

      // skip errors if no each requested
      if (!options.each) {
        options.counter--;
        return maximizeNext(next, options, callback);
      }

      try {
        getKeep(options.each(err, value), function (err1, keep) {
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
          return maximizeNext(next, options, callback);
        });
      } catch (err) {
        options.done = true;
        return callback(err);
      }
    });
  }
};
