import type { AsyncFunction } from 'async-compat';
import compat from 'async-compat';
import type { EachDoneCallback, Next, Processor, ProcessorOptions } from './types.ts';

const isError = (err?: Error | null): boolean => !!err && err.stack !== undefined && err.message !== undefined;

function processDone<T>(err: Error | null | undefined, options: ProcessorOptions<T>, callback: EachDoneCallback): boolean {
  if (err) options.err = options.err || err;
  options.done = true;

  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

function processResult<T>(err: Error | null | undefined, keep: boolean | undefined, options: ProcessorOptions<T>, callback: EachDoneCallback): boolean {
  options.counter--;

  if ((err && compat.defaultValue(options.error?.(err), false)) || (!err && !compat.defaultValue(keep, true))) {
    if (err) options.err = options.err || err;
    options.done = true;
  }

  if (!options.done || options.counter > 0) return false;
  callback(options.err, options.done);
  return true;
}

export default function createProcessor<T, _TReturn = unknown>(next: Next<T>, options: ProcessorOptions<T>, callback: EachDoneCallback): Processor {
  let flushing = false;

  function callDefer(err?: Error | null, keep?: boolean): void {
    const shouldContinue = !processResult(err, keep, options, callback);
    if (flushing) return;
    if (shouldContinue) flush();
  }

  function flush(): void {
    flushing = true;

    while (options.counter < options.concurrency) {
      if (options.done || !options.canProcess()) break;
      if (options.total >= options.limit) {
        processDone(undefined, options, callback);
        flushing = false;
        return;
      }
      options.total++;
      options.counter++;

      next((err?: Error | null, result?: IteratorResult<T>) => {
        if (err || !result || result.done) {
          return callDefer(err, false);
        }
        compat.asyncFunction(options.each as AsyncFunction, !!options.callbacks, result.value, (err?: Error | null, keep?: boolean) => callDefer(err, keep));
      });
    }

    flushing = false;
  }

  return function processor(doneOrError?: Error | boolean): void {
    const error = doneOrError as Error;
    if (doneOrError && processDone(isError(error) ? error : undefined, options, callback)) return;
    flush();
  };
}
