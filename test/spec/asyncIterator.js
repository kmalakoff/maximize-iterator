var assert = require('assert');
var maximizeIterator = require('../..');

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
      await maximizeIterator(iterator, function () {});
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 0);
  });

  it('should get all (concurrency 1)', async function () {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    try {
      await maximizeIterator(
        iterator,
        function (value) {
          results.push(value);
        },
        {
          concurrency: 1,
        }
      );
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
      await maximizeIterator(
        iterator,
        function (value) {
          results.push(value);
        },
        {
          concurrency: 100,
        }
      );
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
      await maximizeIterator(
        iterator,
        async function (value) {
          results.push(value);
          return true;
        },
        {
          concurrency: 1,
        }
      );
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
      await maximizeIterator(
        iterator,
        async function (value) {
          if (value === 3) return false;
          results.push(value);
          return true;
        },
        {
          concurrency: 1,
        }
      );
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 7);
    assert.deepEqual(results, [1, 2]);
  });
});
