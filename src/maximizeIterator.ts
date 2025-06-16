import worker from './worker.js';

import type { Callback, EachFunction, ForEachOptions } from './types.js';

export default function maximizeIterator<T>(iterator: AsyncIterableIterator<T>, each: EachFunction<T>, options?: ForEachOptions | Callback, callback?: Callback): undefined | Promise<undefined> {
  if (typeof each !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options as Callback;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(iterator, each, options, callback) as undefined;
  return new Promise((resolve, reject) => worker(iterator, each, options, (err) => (err ? reject(err) : resolve(undefined))));
}
