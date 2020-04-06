const HAS_ASYNC_ITERATOR = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

module.exports = function (obj) {
  if (!HAS_ASYNC_ITERATOR || obj.next) return false; // prefer callback-based next over asyncIterator
  return !!obj[Symbol.asyncIterator];
};
