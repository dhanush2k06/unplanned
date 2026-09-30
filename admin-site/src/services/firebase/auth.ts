import { doc, getDoc } from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import type { UserProfile } from '../../types';
import { getDb, getFirebaseAuth } from './config';

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function logout() {
  return signOut(getFirebaseAuth());
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(getDb(), 'users', uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (data.role !== 'admin') return null;
  return {
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    role: 'admin',
    photoURL: String(data.photoURL ?? ''),
    createdAt: null,
  };
}
