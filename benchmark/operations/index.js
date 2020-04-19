const tests = require('./tests');

const VERSIONS = require('../VERSIONS');
const TESTS_OPTIONS = require('../TESTS_OPTIONS');

(async () => {
  for (const options of VERSIONS) {
    await tests(Object.assign({}, options, { testOptions: TESTS_OPTIONS }));
  }
})();
