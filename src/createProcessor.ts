import compat from 'async-compat';

import type { EachDoneCallback, Next, Processor, ProcessorOptions } from './types.ts';

const isError = (err?: Error): boolean => err && err.stack !== undefined && err.message !== undefined;

function processDone<T>(err: Error, options: ProcessorOptions<T>, callback: EachDoneCallback) {
  // mark this iteration done
  options.err = options.err || err;
  options.done = true;

  // process done
  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

function processResult(err, keep, options, callback) {
  options.counter--;

  // mark this iteration done
  if ((err && compat.defaultValue(options.error(err), false)) || (!err && !compat.defaultValue(keep, true))) {
    options.err = options.err || err;
    options.done = true;
  }

  // process done
  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

export default function createProcessor<T, TReturn = unknown>(next: Next<T>, options: ProcessorOptions<T>, callback: EachDoneCallback): Processor {
  let isProcessing = false;
  return function processor(doneOrError?: Error | boolean): undefined {
    const error = doneOrError as Error;
    if (doneOrError && processDone(isError(error) ? error : null, options, callback)) return;
    if (isProcessing) return;
    isProcessing = true;

    while (options.counter < options.concurrency) {
      if (options.done || !options.canProcess()) break;
      if (options.total >= options.limit) {
        processDone(null, options, callback);
        return;
      }
      options.total++;
      options.counter++;

      next((err?: Error, result?: IteratorResult<T, TReturn>) => {
        if (err || result.done) {
          return !processResult(err, false, options, callback) && !isProcessing ? processor() : undefined;
        }
        compat.asyncFunction(options.each, options.callbacks, result.value, (err, keep) => (!processResult(err, keep, options, callback) && !isProcessing ? processor() : undefined));
      });
    }

    isProcessing = false;
  };
}
