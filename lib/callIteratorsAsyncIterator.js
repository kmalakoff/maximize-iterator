var getKeep = require('./getKeep');

async function next(iterator, options, callback) {
  const value = await iterator[Symbol.asyncIterator]().next();
  if (options.done) return;
  if (value === null) {
    options.done = true;
    return callback();
  }

  if (options.each) {
    const keep = await new Promise(function (resolve, reject) {
      getKeep(options.each(value), function (err, keep) {
        err ? reject(err) : resolve(keep);
      });
    });
    if (options.done) return;
    if (!keep) {
      options.done = true;
      return callback();
    }
  }
}

module.exports = async function callIteratorsAsyncIterator(iterator, options, callback) {
  var counter = 0;
  while (options.counter < options.concurrency) {
    if (options.done || counter++ > options.batch) return; // done
    options.counter++;

    next(iterator, options, callback)
      .then(function () {
        options.counter--;
        if (options.done) return;
        callIteratorsAsyncIterator(iterator, options, callback);
      })
      .catch(function (err) {
        options.counter--;
        if (options.done) return;
        if (err) {
          options.done = true;
          return callback(err);
        }
      });
  }
};
