export type { CallbackIterator } from 'iterator-next-callback';
export type Callback = (err?: Error) => void;

export interface ForEachOptions {
  error?: (err: NodeJS.ErrnoException) => boolean;
  callbacks?: boolean;
  concurrency?: number;
  limit?: number;
  batch?: number;
}

export type EachDoneCallback = (error?: Error, value?: boolean) => undefined;
export type EachCallback<T> = (value: T, callback: EachDoneCallback) => undefined;
export type EachPromise<T> = (value: T) => Promise<boolean | undefined>;
export type EachFunction<T> = EachCallback<T> | EachPromise<T>;

export type NextCallback<T> = (error?: Error, value?: T | null) => undefined;
export type Next<T> = (callback: ProcessCallback<T>) => undefined;

export type ProcessCallback<T> = (error?: Error, value?: T | null) => undefined;
export type Processor = (doneOrError?: Error | boolean) => undefined;
export interface ProcessorOptions<T> extends ForEachOptions {
  each: EachFunction<T>;
  stop: (count?: number) => boolean;
  total: number;
  counter: number;
  done?: boolean;
  err?: Error;
}
