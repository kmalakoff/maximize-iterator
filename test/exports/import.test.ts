import assert from 'assert';
// @ts-ignore
import maximizeIterator, { createProcessor } from 'maximize-iterator';

describe('exports .ts', () => {
  it('exports', () => {
    assert.equal(typeof maximizeIterator, 'function');
    assert.equal(typeof createProcessor, 'function');
  });
});
