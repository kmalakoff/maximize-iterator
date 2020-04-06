var assert = require('assert');
var maximizeIterator = require('../..');

class Iterator {
  constructor(values) {
    this.values = values;
  }
  next(callback) {
    if (!this.values.length) return callback(null, null);
    return callback(null, this.values.shift());
  }
}

describe('promises interface', function () {
  it('should get all (default options)', function (callback) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(iterator)
      .then(function () {
        assert.equal(iterator.values.length, 0);
        callback();
      })
      .catch(function (err) {
        assert.ok(!err);
        callback(err);
      });
  });

  it('should get all (concurrency 1)', function (callback) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, { concurrency: 1, each: results.push.bind(results) })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        callback();
      })
      .catch(function (err) {
        assert.ok(!err);
        callback(err);
      });
  });

  it('should get all (concurrency 100)', function (callback) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, { concurrency: 100, each: results.push.bind(results) })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
        callback();
      })
      .catch(function (err) {
        assert.ok(!err);
        callback(err);
      });
  });

  it('should get with promises (concurrency 1)', function (callback) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (value) {
        results.push(value);
        return true;
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        callback();
      })
      .catch(function (err) {
        assert.ok(!err);
        callback(err);
      });
  });

  it('should get with promises and early exit (concurrency 1)', function (callback) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (value) {
        if (value === 3) return false;
        results.push(value);
        return true;
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 7);
        assert.deepEqual(results, [1, 2]);
        callback();
      })
      .catch(function (err) {
        assert.ok(!err);
        callback(err);
      });
  });
});
