import {
  GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE,
  isGoogleSignInNativeAvailable,
} from './google-signin-availability';

export { GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE, isGoogleSignInNativeAvailable };

type GoogleSignInImpl = typeof import('./google-signin.impl.native');

let implPromise: Promise<GoogleSignInImpl> | null = null;

function loadGoogleSignInImpl(): Promise<GoogleSignInImpl> {
  if (!implPromise) {
    implPromise = import('./google-signin.impl.native');
  }
  return implPromise;
}

export function configureGoogleSignIn(): void {
  if (!isGoogleSignInNativeAvailable()) {
    return;
  }
  void loadGoogleSignInImpl().then((impl) => impl.configureGoogleSignInImpl());
}

export async function signInWithGoogleNative(): Promise<void> {
  if (!isGoogleSignInNativeAvailable()) {
    throw new Error(GOOGLE_SIGNIN_UNAVAILABLE_MESSAGE);
  }
  const impl = await loadGoogleSignInImpl();
  await impl.signInWithGoogleNativeImpl();
}

export async function signOutGoogleNative(): Promise<void> {
  if (!isGoogleSignInNativeAvailable()) {
    return;
  }
  const impl = await loadGoogleSignInImpl();
  await impl.signOutGoogleNativeImpl();
}
