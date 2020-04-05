var assert = require('assert');
var maximizeIterator = require('../..');

class Iterator {
  constructor(values) {
    this.values = values;
  }
  next(callback) {
    if (!this.values.length) return callback(null, { done: true });
    return callback(null, { done: false, value: this.values.shift() });
  }
}

describe('callback interface', function () {
  it('should get all (default options)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(iterator, (err) => {
      assert.ok(!err);
      assert.equal(iterator.values.length, 0);
      done();
    });
  });

  it('should get all (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, { concurrency: 1, each: results.push.bind(results) }, (err) => {
      assert.ok(!err);
      assert.equal(iterator.values.length, 0);
      assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      done();
    });
  });

  it('should get all (concurrency 100)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, { concurrency: 100, each: results.push.bind(results) }, (err) => {
      assert.ok(!err);
      assert.equal(iterator.values.length, 0);
      assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
      done();
    });
  });
});
