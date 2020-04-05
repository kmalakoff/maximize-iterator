module.exports = function callOnce(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(this, arguments);
  };
};
