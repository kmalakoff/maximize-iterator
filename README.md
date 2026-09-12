## maximize-iterator

Maximize the parallel calls of an iterator supporting asyncIterator interface.

```sh
npm install maximize-iterator
```

```js
const maximize = require('maximize-iterator');

async function* values() {
  yield* [1, 2, 3, 4];
}

async function main() {
  const results = [];
  await maximize(values(), (value) => results.push(value), { concurrency: 2 });
  console.log(results); // [1, 2, 3, 4]
}

main().catch(console.error);
```

## Options

- bool: callbacks - use an each function with a callback `function(entry, callback)` (default: false)
- function: error - handle iterator or item errors. Return true to stop processing (default: stop on error).
- function: canProcess - return false to pause requesting more iterator values (default: always process).
- number: concurrency - parallelism of processing. (default: 4096)
- number: limit - maximum number to process. (default: Infinity)
