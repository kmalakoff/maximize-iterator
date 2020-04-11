var assert = require('assert');
var maximizeIterator = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('callback interface', function () {
  it('should get all (default options)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      function () {},
      function (err) {
        assert.ok(!err);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(
      iterator,
      function (err, value) {
        results.push(value);
      },
      {
        concurrency: 1,
      },
      function (err) {
        assert.ok(!err);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('should get all (concurrency 100)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(
      iterator,
      function (err, value) {
        results.push(value);
      },
      {
        concurrency: 100,
      },
      function (err) {
        assert.ok(!err);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('should stop after 1 (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(
      iterator,
      function (err, value) {
        results.push(value);
        return false;
      },
      {
        concurrency: 1,
      },
      function (err) {
        assert.ok(!err);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });

  it('should stop after 1 (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(
      iterator,
      function (err, value) {
        results.push(value);
        throw Error('Stop');
      },
      {
        concurrency: 1,
      },
      function (err) {
        assert.ok(err);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });
});
