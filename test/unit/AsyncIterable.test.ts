import assert from 'assert';
import maximizeIterator from 'maximize-iterator';
import Pinkie from 'pinkie-promise';

// biome-ignore lint/suspicious/noShadowRestrictedNames: Legacy
const Symbol: SymbolConstructor = typeof global.Symbol === 'undefined' ? ({ asyncIterator: undefined } as unknown as SymbolConstructor) : global.Symbol;
const hasAsyncIterable = typeof Symbol !== 'undefined' && Symbol.asyncIterator !== undefined;

class Iterator<T> implements AsyncIterable<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        return new Pinkie((resolve) => {
          return resolve(this.values.length ? { done: false, value: this.values.shift() } : { done: true, value: null });
        });
      },
    };
  }
}

describe('AsyncIterable', () => {
  if (!hasAsyncIterable) return;

  (() => {
    // patch and restore promise
    if (typeof global === 'undefined') return;
    const globalPromise = global.Promise;
    before(() => {
      global.Promise = Pinkie;
    });
    after(() => {
      global.Promise = globalPromise;
    });
  })();

  it('should get all (concurrency 1)', async () => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    await maximizeIterator<number>(
      iterator,
      (value): undefined => {
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
      (value): undefined => {
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
