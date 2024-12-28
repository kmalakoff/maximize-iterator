import assert from 'assert';
import maximizeIterator from 'maximize-iterator';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('legacy', () => {
  it('async replaced with callbacks', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      (value, callback) => {
        assert.ok(value);
        assert.ok(callback);
        setTimeout(callback, 10);
      },
      { async: true },
      (err) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });
});
