import nextCallback from 'iterator-next-callback';
import createProcessor from './createProcessor';

const DEFAULT_CONCURRENCY = 4096;
const DEFAULT_LIMIT = Infinity;
const MAXIMUM_BATCH = 10;

function worker(iterator, fn, options, callback) {
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

  let processor = createProcessor(nextCallback(iterator), options, (err) => {
    options = null;
    processor = null;
    return callback(err);
  });
  processor();
}

export default function maximizeIterator(iterator, fn, options, callback) {
  if (typeof fn !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(iterator, fn, options, callback);
  return new Promise((resolve, reject) => worker(iterator, fn, options, (err) => (err ? reject(err) : resolve(undefined))));
}
