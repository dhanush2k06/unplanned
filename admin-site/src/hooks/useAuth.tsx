import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { fetchUserProfile, login as loginRequest, logout as logoutRequest, subscribeToAuth } from '../services/firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';

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
        setProfile(nextProfile);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [configured]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      loading,
      configured,
      isAdmin: Boolean(user && profile?.role === 'admin'),
      login: async (email, password) => {
        await loginRequest(email, password);
      },
      logout: async () => {
        await logoutRequest();
      },
    }),
    [user, profile, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
