import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  verifyBeforeUpdateEmail, 
  reload,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';

export interface AuthResponse {
  success: boolean;
  isConfigured?: boolean;
  emailVerified?: boolean;
  user?: any;
  message?: string;
  error?: string;
}

const DEFAULT_TIMEOUT_MS = 15000;

// Promise Timeout Wrapper to prevent hanging promises
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject({ code: 'auth/timeout', message: 'Authentication request timed out. Please try again.' });
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// Formats Firebase Error Codes to Human-Readable Feedback
export const parseFirebaseError = (error: any): string => {
  console.error('[Firebase Error Object]:', error);
  if (error?.stack) {
    console.error('[Firebase Error Stack Trace]:', error.stack);
  }

  if (!error) return 'An unknown error occurred.';

  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/timeout':
      return 'Authentication request timed out. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format. Please check your email spelling.';
    case 'auth/weak-password':
      return 'Password is too weak. Must be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No registered account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access temporarily locked for security. Try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Google Sign-In popup was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Google Sign-In popup was blocked by browser. Please allow popups for this site.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized for Google Sign-In in Firebase Console. Add localhost to Authorized Domains.';
    default:
      return message ? `${message} (${code})` : `Firebase Error (${code || 'unknown'})`;
  }
};

// Configure Session Persistence based on Remember Me
export const configurePersistence = async (rememberMe: boolean) => {
  if (!isFirebaseConfigured) return;
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  } catch (e: any) {
    console.warn('[Session Persistence Notice]:', e);
  }
};

// 1. REBUILT SIGNUP FLOW
export const registerUser = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const cleanEmail = (email || '').trim().toLowerCase();

  console.log('[Signup] Starting signup for:', cleanEmail);

  if (!isFirebaseConfigured) {
    const err = 'Firebase is not configured in .env. Please configure VITE_FIREBASE_API_KEY.';
    console.error('[Signup FAILED]:', err);
    return { success: false, isConfigured: false, error: err };
  }

  try {
    // 1. Create Firebase User
    const userCredential = await withTimeout(createUserWithEmailAndPassword(auth, cleanEmail, password));
    const user = userCredential.user;
    console.log('[Signup] User created:', user.uid);

    // 2. Send Email Verification
    try {
      await withTimeout(sendEmailVerification(user));
      console.log('[Signup] Verification email sent');
    } catch (verr: any) {
      console.error('[Signup Verification Email Error]:', verr);
      try {
        await user.delete();
        console.log('[Signup Cleanup] Deleted auth user due to verification failure');
      } catch (delErr) {
        console.error('[Signup Cleanup FAILED]:', delErr);
      }
      throw verr;
    }

    // 3. Create Firestore User Document
    try {
      await withTimeout(
        setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email: user.email,
          role: 'customer',
          emailVerified: false,
          createdAt: serverTimestamp(),
        }),
        5000
      );
      console.log('[Signup] Firestore document created');
    } catch (fsErr: any) {
      console.error('[Signup Firestore Doc Notice]:', fsErr);
    }

    // 4. Update Profile Display Name
    try {
      await updateProfile(user, { displayName: name });
      console.log('[Signup] Profile updated');
    } catch (pErr: any) {
      console.error('[Signup Profile Update Notice]:', pErr);
    }

    // 5. User remains signed in on Firebase client (unverified state) to support verification resends
    console.log('[Signup] Session kept active for verification check');

    console.log('[Signup] Signup complete');

    return {
      success: true,
      isConfigured: true,
      emailVerified: false,
      user: null,
      message: 'Your account has been created successfully. A verification email has been sent to your email address. Please verify your email before logging in.',
    };
  } catch (error: any) {
    console.error('[Signup FAILED]:', error);
    return {
      success: false,
      isConfigured: true,
      error: parseFirebaseError(error),
    };
  }
};

// 2. REBUILT LOGIN FLOW
export const loginUser = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
  const cleanEmail = (email || '').trim().toLowerCase();

  console.log('[Login] Login started for:', cleanEmail);

  if (!isFirebaseConfigured) {
    const err = 'Firebase is not configured in .env.';
    console.error('[Login FAILED]:', err);
    return { success: false, isConfigured: false, error: err };
  }

  try {
    await configurePersistence(rememberMe);
    const userCredential = await withTimeout(signInWithEmailAndPassword(auth, cleanEmail, password));
    const user = userCredential.user;
    console.log('[Login] Authentication successful:', user.uid);

    await withTimeout(reload(user));
    console.log('[Login] Verification status checked:', user.emailVerified);

    if (!user.emailVerified) {
      console.warn(`[Login Denied]: ${user.email} is not email verified.`);
      // Keep session active on Firebase client to allow resends/refreshes
      return {
        success: false,
        isConfigured: true,
        emailVerified: false,
        user,
        message: 'Your email address has not been verified.',
      };
    }

    try {
      await withTimeout(
        setDoc(
          doc(db, 'users', user.uid),
          { emailVerified: true, lastLogin: serverTimestamp() },
          { merge: true }
        ),
        5000
      );
    } catch (e: any) {
      console.warn('[Login Firestore Sync Notice]:', e);
    }

    console.log('[Login] Login complete');

    return {
      success: true,
      isConfigured: true,
      emailVerified: true,
      user,
    };
  } catch (error: any) {
    console.error('[Login FAILED]:', error);
    return {
      success: false,
      isConfigured: true,
      error: parseFirebaseError(error),
    };
  }
};

// 3. REBUILT GOOGLE SIGN-IN
export const signInWithGoogle = async (rememberMe: boolean = true): Promise<AuthResponse> => {
  if (!isFirebaseConfigured) {
    const err = 'Firebase credentials missing in .env.';
    console.error('[Google FAILED]:', err);
    return { success: false, isConfigured: false, error: err };
  }

  console.log('[Google] Popup opened');

  try {
    await configurePersistence(rememberMe);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await withTimeout(signInWithPopup(auth, provider));
    const user = result.user;
    console.log('[Google] Google authenticated:', user.uid);

    try {
      await withTimeout(
        setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            name: user.displayName || 'Google User',
            email: user.email,
            role: 'customer',
            emailVerified: user.emailVerified,
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        ),
        5000
      );
      console.log('[Google] Firestore synced');
    } catch (e: any) {
      console.warn('[Google Firestore Sync Notice]:', e);
    }

    console.log('[Google] Login complete');

    return {
      success: true,
      isConfigured: true,
      emailVerified: user.emailVerified,
      user,
      message: `Welcome, ${user.displayName || 'Customer'}! Logged in with Google.`,
    };
  } catch (error: any) {
    console.error('[Google FAILED]:', error);
    return {
      success: false,
      isConfigured: true,
      error: parseFirebaseError(error),
    };
  }
};

// 4. RESEND VERIFICATION EMAIL
export const resendVerificationEmail = async (): Promise<AuthResponse> => {
  if (!isFirebaseConfigured || !auth.currentUser) {
    const err = 'No active registration session found. Please sign in to request a new verification email.';
    console.error('[Resend Email FAILED]:', err);
    return { success: false, error: err };
  }

  try {
    await withTimeout(sendEmailVerification(auth.currentUser));
    console.log('[Resend Email] Verification email resent to:', auth.currentUser.email);
    return {
      success: true,
      message: `Verification email resent to ${auth.currentUser.email}!`,
    };
  } catch (error: any) {
    console.error('[Resend Email FAILED]:', error);
    return {
      success: false,
      error: parseFirebaseError(error),
    };
  }
};

// 5. REFRESH VERIFICATION STATUS
export const refreshEmailVerificationStatus = async () => {
  if (!isFirebaseConfigured || !auth.currentUser) {
    return { isVerified: false, isConfigured: isFirebaseConfigured };
  }

  try {
    await withTimeout(reload(auth.currentUser));
    const isVerified = auth.currentUser.emailVerified;
    console.log('[Refresh Status] Status checked:', isVerified);

    if (isVerified) {
      try {
        await withTimeout(
          setDoc(
            doc(db, 'users', auth.currentUser.uid),
            { emailVerified: true, updatedAt: serverTimestamp() },
            { merge: true }
          ),
          5000
        );
      } catch (e: any) {
        console.warn('[Refresh Status Firestore Sync Notice]:', e);
      }
    }

    return { isVerified, user: auth.currentUser, isConfigured: true };
  } catch (error: any) {
    console.error('[Refresh Status FAILED]:', error);
    return { isVerified: false, isConfigured: true };
  }
};

// 6. PASSWORD RESET
export const sendPasswordReset = async (email: string): Promise<AuthResponse> => {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!isFirebaseConfigured) {
    const err = 'Firebase is not configured in .env.';
    console.error('[Password Reset FAILED]:', err);
    return { success: false, isConfigured: false, error: err };
  }

  try {
    await withTimeout(sendPasswordResetEmail(auth, cleanEmail));
    console.log('[Password Reset] Email sent to:', cleanEmail);
    return {
      success: true,
      isConfigured: true,
      message: `Password reset email sent to ${cleanEmail}. Check your inbox!`,
    };
  } catch (error: any) {
    console.error('[Password Reset FAILED]:', error);
    return {
      success: false,
      isConfigured: true,
      error: parseFirebaseError(error),
    };
  }
};

// 7. CHANGE & VERIFY EMAIL
export const changeAndVerifyEmail = async (newEmail: string): Promise<AuthResponse> => {
  const cleanEmail = (newEmail || '').trim().toLowerCase();

  if (!isFirebaseConfigured || !auth.currentUser) {
    const err = 'User not authenticated in Firebase. Please sign in to update email.';
    console.error('[Change Email FAILED]:', err);
    return { success: false, error: err };
  }

  try {
    await withTimeout(verifyBeforeUpdateEmail(auth.currentUser, cleanEmail));
    console.log('[Change Email] Verification link sent to:', cleanEmail);
    return {
      success: true,
      message: `Verification link sent to new email: ${cleanEmail}. Please verify before it becomes active.`,
    };
  } catch (error: any) {
    console.error('[Change Email FAILED]:', error);
    return {
      success: false,
      error: parseFirebaseError(error),
    };
  }
};

// 8. LOGOUT USER
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('[Logout] Signed out successfully');
  } catch (e: any) {
    console.error('[Logout Notice]:', e);
  }
};
