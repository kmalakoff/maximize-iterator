import type { Callback, EachFunction, ForEachOptions, Iterator } from './types.ts';
import worker from './worker.ts';

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): void;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): void;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): void;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): void;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, callback: Callback): void;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions, callback: Callback): void;

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>): Promise<void>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<void>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>): Promise<void>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterable<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<void>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>): Promise<void>;
export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options: ForEachOptions): Promise<void>;

export default function maximizeIterator<T, TReturn = unknown, TNext = unknown>(iterator: Iterator<T, TReturn, TNext>, each: EachFunction<T>, options?: ForEachOptions | Callback, callback?: Callback): void | Promise<void> {
  if (typeof each !== 'function') throw new Error('Missing each function');
  callback = typeof options === 'function' ? options : callback;
  options = typeof options === 'function' ? {} : ((options || {}) as ForEachOptions);

  if (typeof callback === 'function') return worker(iterator, each, options, callback);
  return new Promise((resolve, reject) => worker(iterator, each, options, (err) => (err ? reject(err) : resolve())));
}
