export {
  GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE,
  isGoogleSignInNativeAvailable,
} from './google-signin-availability';

export function configureGoogleSignIn(): void {
  // No-op on web.
}

export async function signInWithGoogleNative(): Promise<void> {
  throw new Error('Google sign-in requires the iOS or Android development build.');
}

export async function signOutGoogleNative(): Promise<void> {
  // No-op on web.
}
