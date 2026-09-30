import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import type { UserProfile } from '../../types';
import { getDb, getFirebaseAuth } from './config';

const ADMIN_EMAIL = 'dhanushharidoss47@gmail.com';

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function login(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  } catch (error: unknown) {
    // If the admin user doesn't exist yet in Firebase Auth, automatically create it on initial setup
    const code = (error as { code?: string })?.code;
    if (
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      (code === 'auth/user-not-found' || code === 'auth/invalid-credential')
    ) {
      try {
        const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
        await setDoc(doc(getDb(), 'users', cred.user.uid), {
          name: 'Dhanush',
          email,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        return cred;
      } catch {
        // If creation fails (e.g. user exists with wrong password), rethrow original error
        throw error;
      }
    }
    throw error;
  }
}

export async function logout() {
  return signOut(getFirebaseAuth());
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(getDb(), 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    if (data.role !== 'admin') return null;
    return {
      name: String(data.name ?? 'Dhanush'),
      email: String(data.email ?? ADMIN_EMAIL),
      role: 'admin',
      photoURL: String(data.photoURL ?? ''),
      createdAt: null,
    };
  }

  // If the signed-in user is the admin but document doesn't exist yet, auto-create it
  const currentAuth = getFirebaseAuth().currentUser;
  if (currentAuth && (currentAuth.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || currentAuth.uid === uid)) {
    const profileData = {
      name: 'Dhanush',
      email: currentAuth.email || ADMIN_EMAIL,
      role: 'admin',
      photoURL: currentAuth.photoURL || '',
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(userRef, profileData);
    } catch {
      // Ignore if firestore rules prevent writing before admin role exists
    }
    return {
      name: profileData.name,
      email: profileData.email,
      role: 'admin',
      photoURL: profileData.photoURL,
      createdAt: null,
    };
  }

  return null;
}
