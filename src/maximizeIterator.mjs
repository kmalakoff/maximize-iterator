import createProcessor from './createProcessor';

import nextCallback from 'iterator-next-callback';

const DEFAULT_CONCURRENCY = 4096;
const DEFAULT_LIMIT = Infinity;
const MAXIMUM_BATCH = 10;

export default function maximizeIterator(iterator, fn, options, callback) {
  if (typeof fn !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    options = options || {};
    options = {
      each: fn,
      callbacks: options.callbacks || options.async,
      concurrency: options.concurrency || DEFAULT_CONCURRENCY,
      limit: options.limit || DEFAULT_LIMIT,
      batch: options.batch || MAXIMUM_BATCH,
      error:
        options.error ||
        (() => {
          return true; // default is exit on error
        }),
      total: 0,
      counter: 0,
      stop: (counter) => counter > options.batch,
    };

    let processor = createProcessor(nextCallback(iterator), options, function processorCallback(err) {
      options = null;
      processor = null;
      return callback(err);
    });
    processor();
  } else {
    return new Promise((resolve, reject) => {
      maximizeIterator(iterator, fn, options, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
