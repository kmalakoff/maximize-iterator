import worker from './worker.js';

import type { Callback, EachFunction, ForEachOptions, Iterator } from './types.js';

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): undefined;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): undefined;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): undefined;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): undefined;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): undefined;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): undefined;

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>): Promise<undefined>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<undefined>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>): Promise<undefined>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<undefined>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>): Promise<undefined>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<undefined>;

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: Iterator<T, TReturn, TNext>, each: EachFunction<T>, options?: ForEachOptions | Callback, callback?: Callback): undefined | Promise<undefined> {
  if (typeof each !== 'function') throw new Error('Missing each function');
  if (typeof options === 'function') {
    callback = options as Callback;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(iterator, each, options, callback) as undefined;
  return new Promise((resolve, reject) => worker(iterator, each, options, (err) => (err ? reject(err) : resolve(undefined))));
}
