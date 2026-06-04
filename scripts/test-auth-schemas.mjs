import {
  birthYearSchema,
  displayNameSchema,
  profileSetupSchema,
  usernameSchema,
} from '../src/features/auth/schemas.ts';

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

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
    avatarUrl: 'https://lh3.googleusercontent.com/a/example',
  }).success,
  'valid profile setup with avatar',
);

console.log('scripts/test-auth-schemas.mjs: ok');
