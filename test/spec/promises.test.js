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

describe('promises interface', function () {
  it('should get all (default options)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    try {
      await maximizeIterator(iterator);
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 0);
  });

  it('should get all (concurrency 1)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    try {
      await maximizeIterator(iterator, { concurrency: 1, each: results.push.bind(results) });
      assert.equal(iterator.values.length, 0);
      assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    } catch (err) {
      assert.ok(!err);
    }
  });

  it('should get all (concurrency 100)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    try {
      await maximizeIterator(iterator, { concurrency: 100, each: results.push.bind(results) });
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 0);
    assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
  });

  it('should get with promises (concurrency 1)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    try {
      await maximizeIterator(iterator, {
        concurrency: 1,
        each: async function (value) {
          results.push(value);
          return true;
        },
      });
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 0);
    assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should get with promises and early exit (concurrency 1)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    try {
      await maximizeIterator(iterator, {
        concurrency: 1,
        each: async function (value) {
          if (value === 3) return false;
          results.push(value);
          return true;
        },
      });
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 7);
    assert.deepEqual(results, [1, 2]);
  });
});
