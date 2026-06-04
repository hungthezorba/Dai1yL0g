import {
  birthYearSchema,
  displayNameSchema,
  normalizePhoneToE164,
  otpCodeSchema,
  phoneE164Schema,
  profileSetupSchema,
  usernameSchema,
} from '../src/features/auth/schemas.ts';

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(phoneE164Schema.safeParse('+14155552671').success, 'valid E.164 phone');
assert(!phoneE164Schema.safeParse('4155552671').success, 'reject bare national');

const normalized = normalizePhoneToE164('4155552671');
assert(normalized === '+14155552671', 'normalize US 10-digit');

assert(otpCodeSchema.safeParse('123456').success, 'valid otp');
assert(!otpCodeSchema.safeParse('12345').success, 'reject short otp');

assert(usernameSchema.safeParse('alex_daily').success, 'valid username');
assert(!usernameSchema.safeParse('Bad-Name').success, 'reject invalid username');

assert(displayNameSchema.safeParse('Alex').success, 'valid display name');

const year = new Date().getFullYear() - 20;
assert(birthYearSchema.safeParse(String(year)).success, 'valid birth year');
assert(!birthYearSchema.safeParse(String(new Date().getFullYear())).success, 'reject too young');

assert(
  profileSetupSchema.safeParse({
    displayName: 'Alex',
    username: 'alex_daily',
    timezone: 'America/Los_Angeles',
    birthYear: year,
  }).success,
  'valid profile setup',
);

console.log('scripts/test-auth-schemas.mjs: ok');
