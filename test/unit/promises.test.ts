import assert from 'assert';
// @ts-ignore
import maximizeIterator from 'maximize-iterator';
import Pinkie from 'pinkie-promise';

class Iterator<T> implements AsyncIterator<T> {
  values: T[];

  constructor(values: T[]) {
    this.values = values;
  }
  next() {
    return new Pinkie((resolve) => {
      return resolve(this.values.length ? { done: false, value: this.values.shift() } : { done: true, value: null });
    });
  }
}

describe('promises interface', () => {
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

  it('should get all (default options)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator<number>(iterator, async (): Promise<undefined> => {})
      .then(() => {
        assert.equal(iterator.values.length, 0);
        done();
      })
      .catch((err) => {
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should get all (promises)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator<number>(
      iterator,
      (value, callback?): Promise<undefined> => {
        assert.ok(value);
        assert.ok(!callback);
        return Promise.resolve(undefined);
      },
      (err) => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (promises, stop)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    maximizeIterator<number>(
      iterator,
      (value: number, callback?): Promise<boolean> => {
        assert.ok(value);
        assert.ok(!callback);
        return Promise.resolve(false);
      },
      (err) => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(iterator.values.length, 0);
        done();
      }
    );
  });

  it('should get all (concurrency 1)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator<number>(
      iterator,
      async (value: number): Promise<undefined> => {
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
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should get all (concurrency 100)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator<number>(
      iterator,
      async (value: number): Promise<undefined> => {
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
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should get with promises (concurrency 1)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator<number>(
      iterator,
      (value: number): boolean => {
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
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should get with promises and early exit (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value: number): boolean => {
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
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should stop after 1 false (concurrency 1)', (done) => {
    const iterator = new Iterator<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator<number>(
      iterator,
      (value: number): boolean => {
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
        if (err) {
          done(err.message);
          return;
        }
        done();
      });
  });

  it('should stop after 1 throw (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 1 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 1 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 5 (concurrency default)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 5 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 5 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 20 (concurrency default)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 20 (concurrency 1)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });

  it('limit 20 (concurrency 10)', (done) => {
    const iterator = new Iterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results = [];
    maximizeIterator(
      iterator,
      (value): undefined => {
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
        if (err) {
          done(err.message);
          return;
        }
      });
  });
});
