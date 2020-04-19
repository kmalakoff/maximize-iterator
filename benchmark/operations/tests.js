var BenchmarkSuite = require('benchmark-suite');
var nextTick = require('next-tick');

function Iterator(counter) {
  this.counter = counter;
}

Iterator.prototype.next = function (callback) {
  nextTick(this.counter-- <= 0 ? callback.bind(null, null, null) : callback.bind(null, null, this.counter));
};

module.exports = async function run({ maximize, version, testOptions }) {
  console.log('****************\n');
  console.log(`Running: ${version}`);
  console.log('----------------');

  var suite = new BenchmarkSuite('maximize', 'Operations');

  for (const test of testOptions) {
    suite.add(`${version}-${test.name}`, async function (fn) {
      const iterator = new Iterator(10000);
      await maximize(iterator, fn, test.options);
    });
  }

  suite.on('cycle', (results) => {
    for (var key in results) console.log(`${results[key].name} (${key}) x ${suite.formatStats(results[key].stats)}`);
  });
  suite.on('complete', function (results) {
    console.log('----------------');
    console.log('Largest');
    console.log('----------------');
    for (var key in results) console.log(`${results[key].name} (${key}) x ${suite.formatStats(results[key].stats)}`);
    console.log('****************\n');
  });

  console.log('Comparing ' + suite.name);
  await suite.run({ time: 10000 });
  console.log('****************\n');
};
