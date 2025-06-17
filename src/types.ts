export type Callback = (err?: Error) => void;

export interface ForEachOptions {
  error?: (err: Error) => boolean | undefined;
  canProcess?: () => boolean;
  callbacks?: boolean;
  concurrency?: number;
  limit?: number;
}

export type EachDoneCallback = (error?: Error, done?: boolean) => undefined;
export type EachValue<T> = (value: T) => boolean | undefined | Error;
export type EachCallback<T> = (value: T, callback: EachDoneCallback) => undefined;
export type EachPromise<T> = (value: T) => Promise<boolean | undefined>;
export type EachFunction<T> = EachValue<T> | EachCallback<T> | EachPromise<T>;

export type NextCallback<T> = (error?: Error, value?: T | null) => undefined;
export type Next<T> = (callback: ProcessCallback<T>) => undefined;

export type ProcessCallback<T, TReturn = unknown> = (error?: Error, value?: IteratorResult<T, TReturn>) => undefined;
export type Processor = (doneOrError?: Error | boolean) => undefined;
export interface ProcessorOptions<T> extends ForEachOptions {
  each: EachFunction<T>;
  total: number;
  counter: number;
  done?: boolean;
  err?: Error;
}

export type Iterator<T, TReturn = unknown, TNext = unknown> = AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>;
