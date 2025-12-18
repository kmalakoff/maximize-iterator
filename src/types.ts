export type Callback = (err?: Error) => void;

export interface ForEachOptions {
  error?: (err: Error) => boolean | void;
  canProcess?: () => boolean;
  callbacks?: boolean;
  concurrency?: number;
  limit?: number;
}

export type EachDoneCallback = (error?: Error, done?: boolean) => void;
export type EachValue<T> = (value: T) => boolean | void | Error;
export type EachCallback<T> = (value: T, callback: EachDoneCallback) => void;
export type EachPromise<T> = (value: T) => Promise<boolean | undefined>;
export type EachFunction<T> = EachValue<T> | EachCallback<T> | EachPromise<T>;

export type NextCallback<T> = (error?: Error, value?: T | null) => void;
export type Next<T> = (callback: ProcessCallback<T>) => void;

export type ProcessCallback<T, TReturn = unknown> = (error?: Error, value?: IteratorResult<T, TReturn>) => void;
export type Processor = (doneOrError?: Error | boolean) => void;
export interface ProcessorOptions<T> extends ForEachOptions {
  each: EachFunction<T>;
  total: number;
  counter: number;
  done?: boolean;
  err?: Error;
}

export type Iterator<T, TReturn = unknown, TNext = unknown> = AsyncIterator<T, TReturn, TNext> | AsyncIterable<T, TReturn, TNext> | AsyncIterableIterator<T, TReturn, TNext>;
