import type { Callback, EachFunction, ForEachOptions } from './types.ts';
export default function worker<T, TReturn = unknown, TNext = unknown>(iterator: AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>, each: EachFunction<T>, options_: ForEachOptions, callback: Callback): void;
