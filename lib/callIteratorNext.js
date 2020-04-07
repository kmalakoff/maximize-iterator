var HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function iteratorNextCallback(iterator) {
  if (HAS_ASYNC_ITERATOR && iterator[Symbol.asyncIterator]) {
    return function nextAsyncIterator(callback) {
      iterator[Symbol.asyncIterator]()
        .next()
        .then(function (value) {
          callback(null, value);
        })
        .catch(function (err) {
          callback(err);
        });
    };
  }
  return function nextIteratorCallback(callback) {
    iterator.next(callback);
  };
};
