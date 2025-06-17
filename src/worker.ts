import nextCallback from 'iterator-next-callback';
import createProcessor from './createProcessor.js';

import type { Callback, EachFunction, ForEachOptions, ProcessorOptions } from './types.js';

const DEFAULT_CONCURRENCY = 4096;
const DEFAULT_LIMIT = Infinity;

export default function worker<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options_: ForEachOptions, callback: Callback) {
  let options: ProcessorOptions<T> = {
    callbacks: options_.callbacks,
    concurrency: options_.concurrency || DEFAULT_CONCURRENCY,
    limit: options_.limit || DEFAULT_LIMIT,
    // default is exit on error
    error: options_.error || (() => true),
    each,
    canProcess: options_.canProcess || (() => true),
    total: 0,
    counter: 0,
    done: false,
  };

  let processor = createProcessor(nextCallback<T, TReturn, TNext>(iterator), options, (err?: Error) => {
    options = null;
    processor = null;
    callback(err);
  });
  processor();
}
