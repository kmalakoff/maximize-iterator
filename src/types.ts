export type { CallbackIterator } from 'iterator-next-callback';
export type MaximizeCallback = (err?: Error) => void;
export interface MaximizeOptions {
  async?: boolean;
  concurrency?: number;
  limit?: number;
  callbacks?: boolean;
  batch?: number;
  error?: (err: Error) => void;
}

export interface MaximizeOptionsPrivate<T> extends MaximizeOptions {
  each: EachFunction<T>;
  stop: (counter: number) => boolean;
  total: number;
  counter: number;
  done: boolean;
}

export type EachFunctionCallback<T> = (value: T, callback?: (err?: Error, stop?: boolean) => void) => void;
export type EachFunctionPromise<T> = (value: T) => Promise<T>;
export type EachFunction<T> = EachFunctionCallback<T> | EachFunctionPromise<T>;
