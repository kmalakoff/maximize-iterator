import assert from 'assert';
import maximizeIterator from 'maximize-iterator';
import Iterator from '../lib/Iterator.cjs';

describe('exports .mjs', () => {
  it('should get all (default options)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      () => {},
      (err) => {
        assert.ok(!err);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });
});
