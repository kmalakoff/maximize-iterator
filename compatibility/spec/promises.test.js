var assert = require('assert');
var maximizeIterator = require('../..');

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  if (!this.values.length) return callback(null, null);
  return callback(null, this.values.shift());
};

describe('promises interface', function () {
  if (typeof Promise === 'undefined') return; // no promise support

  it('should get all (default options)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(iterator)
      .then(function () {
        assert.equal(iterator.values.length, 0);
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should get all (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (err, value) {
        results.push(value);
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should get all (concurrency 100)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 100,
      each: function (err, value) {
        results.push(value);
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should get with promises (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (err, value) {
        results.push(value);
        return true;
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should get with promises and early exit (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (err, value) {
        if (value === 3) return false;
        results.push(value);
        return true;
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 7);
        assert.deepEqual(results, [1, 2]);
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should stop after 1 false (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (err, value) {
        results.push(value);
        return false;
      },
    })
      .then(function () {
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      })
      .catch(function (err) {
        assert.ok(!err);
        done();
      });
  });

  it('should stop after 1 throw (concurrency 1)', function (done) {
    var iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var results = [];
    maximizeIterator(iterator, {
      concurrency: 1,
      each: function (err, value) {
        results.push(value);
        throw Error('Stop');
      },
    })
      .then(function () {
        assert.ok(false);
        done();
      })
      .catch(function (err) {
        assert.ok(err);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      });
  });
});
