var assert = require('assert');
var maximizeIterator = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  if (this.values.length) this.values.shift();
  this.values.length > 0 ? callback(new Error('Failed')) : callback(null, null);
};

describe('errors', function () {
  it('should filter errors', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var errors = [];
    maximizeIterator(
      iterator,
      function () {},
      {
        error: function (err) {
          errors.push(err);
        },
      },
      function (err) {
        assert.ok(!err);
        assert.equal(errors.length, 9);
        done();
      }
    );
  });
});
