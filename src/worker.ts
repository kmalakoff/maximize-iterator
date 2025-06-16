import nextCallback from 'iterator-next-callback';
import createProcessor from './createProcessor.js';

import type { Callback, EachFunction, ForEachOptions, ProcessorOptions } from './types.js';

const DEFAULT_CONCURRENCY = 4096;
const DEFAULT_LIMIT = Infinity;
const MAXIMUM_BATCH = 10;

export default function worker<T>(iterator: AsyncIterableIterator<T>, each: EachFunction<T>, options_: ForEachOptions, callback: Callback) {
  let options: ProcessorOptions<T> = {
    callbacks: options_.callbacks,
    concurrency: options_.concurrency || DEFAULT_CONCURRENCY,
    limit: options_.limit || DEFAULT_LIMIT,
    batch: options_.batch || MAXIMUM_BATCH,
    // default is exit on error
    error: options_.error || (() => true),
    each,
    stop: (counter) => counter > options.batch,
    total: 0,
    counter: 0,
    done: false,
  };

  let processor = createProcessor(nextCallback(iterator), options, (err?: Error) => {
    options = null;
    processor = null;
    callback(err);
  });
  processor();
}
