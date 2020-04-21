var assert = require('assert');
var maximizeIterator = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('legacy', function () {
  it('async replaced with callbacks', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      function (value, callback) {
        assert.ok(value);
        assert.ok(callback);
        setTimeout(callback, 10);
      },
      { async: true },
      function (err) {
        assert.ok(!err);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });
});
