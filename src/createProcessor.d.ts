import type { EachDoneCallback, Next, Processor, ProcessorOptions } from './types.ts';
export default function createProcessor<T, _TReturn = unknown>(next: Next<T>, options: ProcessorOptions<T>, callback: EachDoneCallback): Processor;
