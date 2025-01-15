import assert from 'assert';

// @ts-ignore
import maximizeIterator from 'maximize-iterator';

function Iterator(values) {
  this.values = values;
}

Iterator.prototype.next = function (callback) {
  callback(null, this.values.length ? this.values.shift() : null);
};

describe('callback interface', () => {
  it('should get all (default options)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      () => {},
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (async)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      (value, callback) => {
        assert.ok(value);
        assert.ok(callback);
        setTimeout(callback, 10);
      },
      { callbacks: true },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (async, stop)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      (value, callback) => {
        assert.ok(value);
        assert.ok(callback);
        setTimeout(() => {
          callback(null, false);
        }, 10);
      },
      { callbacks: true },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 1,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('should get all (concurrency 100)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 100,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('should stop after 1 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
        return false;
      },
      {
        concurrency: 1,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });

  it('should stop after 1 (concurrency 1, error)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
        return new Error('Stop');
      },
      {
        concurrency: 1,
      },
      (err) => {
        assert.ok(err);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });

  it('limit 1 (concurrency default)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        limit: 1,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });

  it('limit 1 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 1,
        limit: 1,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });

  it('limit 1 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 10,
        limit: 1,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      }
    );
  });
  it('limit 5 (concurrency default)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        limit: 5,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      }
    );
  });

  it('limit 5 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 1,
        limit: 5,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      }
    );
  });

  it('limit 5 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 10,
        limit: 5,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      }
    );
  });

  it('limit 20 (concurrency default)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        limit: 20,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('limit 20 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 1,
        limit: 20,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });

  it('limit 20 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
      },
      {
        concurrency: 10,
        limit: 20,
      },
      (err) => {
        if (err) return done(err.message);
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      }
    );
  });
});
