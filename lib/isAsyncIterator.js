const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function (obj) {
  if (!HAS_ASYNC_ITERATOR) return false;
  return obj && obj[Symbol.asyncIterator];
};
