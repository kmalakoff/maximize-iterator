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
  var suite = new BenchmarkSuite('maximize', 'Memory');

  for (const test of testOptions) {
    suite.add(`${version}-${test.name}`, async function (fn) {
      const iterator = new Iterator(1000);
      await maximize(iterator, fn, test.options);
    });
  }

  suite.on('cycle', (results) => {
    for (var key in results) console.log(`${results[key].name} (${key}) x ${suite.formatStats(results[key].stats)}`);
  });
  suite.on('complete', function (results) {
    console.log('-----Largest-----');
    for (var key in results) console.log(`${results[key].name} (${key}) x ${suite.formatStats(results[key].stats)}`);
  });

  console.log('---------------');
  console.log('Running ' + suite.name);
  await suite.run({ time: 1000 }); //, heapdumpTrigger: 1024 * 20 });
  console.log('');
};
