import assert from 'assert';
import maximizeIterator from 'maximize-iterator';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  if (this.values.length) this.values.shift();
  this.values.length > 0 ? callback(new Error('Failed')) : callback(null, null);
};

describe('errors', () => {
  it('should filter errors', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const errors = [];
    maximizeIterator(
      iterator,
      () => {},
      {
        error: (err) => {
          errors.push(err);
        },
      },
      (err) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(errors.length, 9);
        done();
      }
    );
  });
});
