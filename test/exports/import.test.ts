import assert from 'assert';
// @ts-ignore
import maximizeIterator from 'maximize-iterator';
import Iterator from '../lib/Iterator.cjs';

describe('exports .ts', () => {
  it('should get all (default options)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      () => {},
      (err) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });
});
