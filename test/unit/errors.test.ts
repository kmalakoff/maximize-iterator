import assert from 'assert';
// @ts-ignore
import maximizeIterator from 'maximize-iterator';
import Pinkie from 'pinkie-promise';

// biome-ignore lint/suspicious/noShadowRestrictedNames: Legacy
const Symbol: SymbolConstructor = typeof global.Symbol === 'undefined' ? ({ asyncIterator: '@@' } as unknown as SymbolConstructor) : global.Symbol;
const _hasAsyncIterable = Symbol.asyncIterator === ('@@' as unknown);

class Iterator<T> implements AsyncIterableIterator<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  next() {
    return new Pinkie((resolve, reject) => {
      if (this.values.length) this.values.shift();
      return this.values.length > 0 ? reject(new Error('Failed')) : resolve({ done: true, value: null });
    });
  }
  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }
}

describe('errors', () => {
  it('should filter errors', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const errors = [];
    maximizeIterator<number>(
      iterator,
      (_value: number): undefined => {},
      {
        error(err: Error): undefined {
          errors.push(err);
        },
      },
      (err) => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(errors.length, 9);
        done();
      }
    );
  });
});
