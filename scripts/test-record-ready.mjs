import assert from 'node:assert/strict';

import { formatRecordReadyMs, recordReadyMeetsTarget } from '../src/features/capture/record-ready.ts';

assert.equal(formatRecordReadyMs(null), '—');
assert.equal(formatRecordReadyMs(450), '450ms');
assert.equal(formatRecordReadyMs(2400), '2.40s');

assert.equal(recordReadyMeetsTarget(null), 'pending');
assert.equal(recordReadyMeetsTarget(1500), 'ok');
assert.equal(recordReadyMeetsTarget(3500), 'warn');
assert.equal(recordReadyMeetsTarget(9000), 'slow');

console.log('scripts/test-record-ready.mjs: ok');
