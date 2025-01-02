import assert from 'assert';
import maximizeIterator, { createProcessor } from 'maximize-iterator';

describe('exports .mjs', () => {
  it('exports', () => {
    assert.equal(typeof maximizeIterator, 'function');
    assert.equal(typeof createProcessor, 'function');
  });
});
