var getKeep = require('./getKeep');

module.exports = function callIteratorsCallback(iterator, options, callback) {
  var counter = 0;
  while (options.counter < options.concurrency) {
    if (options.done || counter++ > options.batch) return; // done
    options.counter++;

    iterator.next(function (err, value) {
      if (options.done) return;
      if (err || value === null) {
        options.done = true;
        return callback(err);
      }

      if (!options.each) {
        options.counter--;
        return callIteratorsCallback(iterator, options, callback);
      }

      try {
        getKeep(options.each(value), function (err1, keep) {
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
          return callIteratorsCallback(iterator, options, callback);
        });
      } catch (err) {
        options.done = true;
        return callback(err);
      }
    });
  }
};
