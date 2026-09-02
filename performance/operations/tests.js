var BenchmarkSuite = require('benchmark-suite');
var nextTick = require('next-tick');

function Iterator(counter) {
  this.counter = counter;
}

Iterator.prototype.next = function next(callback) {
  const call = this.counter-- <= 0 ? callback.bind(null, null, null) : callback.bind(null, null, this.counter);
  this.counter % 50 ? nextTick(call) : call();
};

module.exports = async function run({ maximize, version, testOptions }) {
  var suite = new BenchmarkSuite('maximize ' + version, 'Operations');

  for (const test of testOptions) {
    suite.add(`${test.name}`, async function (fn) {
      const iterator = new Iterator(1000);
      await maximize(iterator, fn, test.options);
    });
  }

  suite.on('cycle', (results) => {
    for (var key in results) console.log(`${results[key].name.padStart(8, ' ')}| ${suite.formatStats(results[key].stats)}`);
  });
  suite.on('complete', function (results) {
    console.log('-----Fastest-----');
    for (var key in results) console.log(`${results[key].name.padStart(8, ' ')}| ${suite.formatStats(results[key].stats)}`);
  });

  console.log('----------' + suite.name + '----------');
  await suite.run({ time: 1000 });
  console.log('');
};
