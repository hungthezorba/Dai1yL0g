import assert from 'node:assert/strict';

import { getLocalDayKey, formatDayLabel } from '../src/features/day/local-day.ts';

const fixed = new Date(2026, 5, 1, 15, 30, 0);
assert.equal(getLocalDayKey(fixed), '2026-06-01');
assert.equal(formatDayLabel(getLocalDayKey(fixed)), 'Today');
assert.equal(formatDayLabel('2026-05-31').includes('May'), true);

console.log('scripts/test-day-bucket.mjs: ok');
