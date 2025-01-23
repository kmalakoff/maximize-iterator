export type MaximizeCallback = (err?: Error) => void;
export interface MaximizeOptions {
  async?: boolean;
  concurrency?: number;
  limit?: number;
  callbacks?: boolean;
  error?: (err: Error) => void;
}

export type EachFunctionCallback<T> = (value: T, callback?: (err?: Error, stop?: boolean) => void) => void;
export type EachFunctionPromise<T> = (value: T) => Promise<T>;
export type EachFunction<T> = EachFunctionCallback<T> | EachFunctionPromise<T>;
