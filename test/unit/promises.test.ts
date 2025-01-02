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

describe('promises interface', () => {
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

  it('should get all (default options)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(iterator, () => {})
      .then(() => {
        assert.equal(iterator.values.length, 0);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
  });

  it('should get all (promises)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      (value, callback) => {
        assert.ok(value);
        assert.ok(!callback);
        return Promise.resolve();
      },
      (err) => {
        assert.ok(!err, err ? err.message : '');
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (promises, stop)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator(
      iterator,
      (value, callback) => {
        assert.ok(value);
        assert.ok(!callback);
        return Promise.resolve(false);
      },
      (err) => {
        assert.ok(!err, err ? err.message : '');
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results.sort(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort());
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
  });

  it('should get with promises (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
        return true;
      },
      {
        concurrency: 1,
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
  });

  it('should get with promises and early exit (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        if (value === 3) return false;
        results.push(value);
        return true;
      },
      {
        concurrency: 1,
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 7);
        assert.deepEqual(results, [1, 2]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
  });

  it('should stop after 1 false (concurrency 1)', (done) => {
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
        done();
      });
  });

  it('should stop after 1 throw (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value) => {
        results.push(value);
        throw Error('Stop');
      },
      {
        concurrency: 1,
      }
    )
      .then(() => {
        assert.ok(false);
        done();
      })
      .catch((err) => {
        assert.ok(err);
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 9);
        assert.deepEqual(results, [1]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 5);
        assert.deepEqual(results, [1, 2, 3, 4, 5]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
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
      }
    )
      .then(() => {
        assert.equal(iterator.values.length, 0);
        assert.deepEqual(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => {
        assert.ok(!err, err ? err.message : '');
      });
  });
});
