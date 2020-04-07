## maximize-iterator

Maximize the parallel calls of an iterator supporting asyncIterator interface.

```
const maximize = require('maximize-iterator');

(async ()=> {
  // run 1024 in parallel until done - promises
  var iterator = // create it somehow with a next method returing {done: value: }
  await maximize(iterator, { concurrency: 1024, each: (err, value) => { /* do something including false stop */ } });
})();

// run 1024 in parallel until done - callbacks
var iterator = // create it somehow with a next method returing {done: value: }
maximize(iterator, { concurrency: 1024, each: (err, value) => { /* do something including false stop */ } }, (err) => {
  /* done */
});
```
