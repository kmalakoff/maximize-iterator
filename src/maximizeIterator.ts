import worker from './worker.js';

import type { EachFunction, MaximizeCallback, MaximizeOptions } from './types.js';

export default function maximizeIterator<T>(iterator: AsyncIterableIterator<T>, each: EachFunction<T>, options?: MaximizeOptions | MaximizeCallback, callback?: MaximizeCallback): undefined | Promise<undefined> {
  if (typeof each !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options as MaximizeCallback;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(iterator, each, options, callback) as undefined;
  return new Promise((resolve, reject) => worker(iterator, each, options, (err) => (err ? reject(err) : resolve(undefined))));
}
