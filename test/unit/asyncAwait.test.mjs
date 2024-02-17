import assert from 'assert';
import maximizeIterator from 'maximize-iterator';

const HAS_ASYNC_AWAIT = typeof Symbol !== 'undefined' && Symbol.asyncIterator;

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('async await', () => {
  if (!HAS_ASYNC_AWAIT) return;

  it('should get all (default options)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    try {
      await maximizeIterator(iterator, () => {});
    } catch (err) {
      assert.ok(!err);
    }
    assert.equal(iterator.values.length, 0);
  });

  it('should get all (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    try {
      await maximizeIterator(
        iterator,
        (value) => {
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

  it('should get all (concurrency 100)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    try {
      await maximizeIterator(
        iterator,
        (value) => {
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

  it('should get with promises (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    try {
      await maximizeIterator(
        iterator,
        async (value) => {
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

  it('should get with promises and early exit (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    try {
      await maximizeIterator(
        iterator,
        async (value) => {
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
