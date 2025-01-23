import nextCallback from 'iterator-next-callback';
import createProcessor from './createProcessor';

const DEFAULT_CONCURRENCY = 4096;
const DEFAULT_LIMIT = Infinity;
const MAXIMUM_BATCH = 10;

export default function worker(iterator, each, options, callback) {
  options = {
    each,
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
