import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { fetchUserProfile, login as loginRequest, logout as logoutRequest, subscribeToAuth } from '../services/firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';

const ADMIN_EMAIL = 'dhanushharidoss47@gmail.com';

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToAuth(async (next) => {
      setUser(next);
      if (!next) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const nextProfile = await fetchUserProfile(next.uid);
        if (nextProfile) {
          setProfile(nextProfile);
        } else if (next.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setProfile({
            name: next.displayName || 'Dhanush',
            email: next.email,
            role: 'admin',
            photoURL: next.photoURL || '',
            createdAt: null,
          });
        }
      } catch {
        if (next.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setProfile({
            name: 'Dhanush',
            email: next.email,
            role: 'admin',
            photoURL: '',
            createdAt: null,
          });
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [configured]);

  const isAdmin = Boolean(
    user && (
      profile?.role === 'admin' ||
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    )
  );

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile: profile || (isAdmin && user ? {
        name: user.displayName || 'Dhanush',
        email: user.email || ADMIN_EMAIL,
        role: 'admin',
        photoURL: user.photoURL || '',
        createdAt: null,
      } : null),
      loading,
      configured,
      isAdmin,
      login: async (email, password) => {
        setLoading(true);
        try {
          const cred = await loginRequest(email, password);
          setUser(cred.user);
          const nextProfile = await fetchUserProfile(cred.user.uid);
          setProfile(nextProfile || {
            name: cred.user.displayName || 'Dhanush',
            email: cred.user.email || email,
            role: 'admin',
            photoURL: cred.user.photoURL || '',
            createdAt: null,
          });
        } finally {
          setLoading(false);
        }
      },
      logout: async () => {
        await logoutRequest();
        setUser(null);
        setProfile(null);
      },
    }),
    [user, profile, loading, configured, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
