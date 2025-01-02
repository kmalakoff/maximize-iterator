const assert = require('assert');
const maximizeIterator = require('maximize-iterator');

describe('exports .cjs', () => {
  it('exports', () => {
    assert.equal(typeof maximizeIterator, 'function');
    assert.equal(typeof maximizeIterator.createProcessor, 'function');
  });
});
