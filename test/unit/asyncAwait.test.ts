import assert from 'assert';
import Pinkie from 'pinkie-promise';

// @ts-ignore
import maximizeIterator from 'maximize-iterator';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('async await', () => {
  if (typeof Symbol === 'undefined' || !Symbol.asyncIterator) return;
  (() => {
    // patch and restore promise
    // @ts-ignore
    let rootPromise: Promise;
    before(() => {
      rootPromise = global.Promise;
      // @ts-ignore
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = rootPromise;
    });
  })();

  it('should get all (default options)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    await maximizeIterator(iterator, (_) => {});
    assert.equal(iterator.values.length, 0);
  });

  it('should get all (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
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
  });

  it('should get all (concurrency 100)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    await maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 100,
      }
    );
    assert.equal(iterator.values.length, 0);
    assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
  });

  it('should get with promises (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
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
    assert.equal(iterator.values.length, 0);
    assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should get with promises and early exit (concurrency 1)', async () => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
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
    assert.equal(iterator.values.length, 7);
    assert.deepEqual(results, [1, 2]);
  });
});
