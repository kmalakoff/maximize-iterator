var assert = require('assert');
var maximizeIterator = require('../../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype[Symbol.asyncIterator] = function () {
  var self = this;
  return { next: nextPromise };

  function nextPromise() {
    return new Promise(function (resolve) {
      var value = self.values.length ? self.values.shift() : null;
      return resolve({ value: value, done: value === null });
    });
  }
};

describe('asyncIterator', function () {
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
      await maximizeIterator(iterator, {
        concurrency: 1,
        each: function (err, value) {
          results.push(value);
        },
      });
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
      await maximizeIterator(iterator, {
        concurrency: 100,
        each: function (err, value) {
          results.push(value);
        },
      });
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
        each: async function (err, value) {
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
        each: async function (err, value) {
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
