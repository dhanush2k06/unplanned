import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, isAdmin, configured, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('dhanushharidoss47@gmail.com');
  const [password, setPassword] = useState('Dhanush47#');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destination = (location.state as { from?: string } | null)?.from || '/dashboard';

  if (!loading && isAdmin) {
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/configuration-not-found') {
        setError(
          'Email/Password sign-in provider is not enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method, click "Email/Password", and toggle it ON.',
        );
      } else {
        const message = err instanceof Error ? err.message : 'Failed to sign in.';
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-brand-gradient p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-red">
            Studio CMS
          </span>
          <h1 className="mt-3 font-heading text-2xl font-bold text-admin-text">
            Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-admin-muted">
            Sign in to manage articles, categories, and settings.
          </p>
        </div>

        {!configured && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <p className="font-semibold">Firebase Not Configured</p>
            <p className="mt-1">
              Please configure your <code>VITE_FIREBASE_*</code> environment variables in the admin site’s <code>.env</code> file.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-admin-muted"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2.5 text-sm text-admin-text transition focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-admin-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2.5 text-sm text-admin-text transition focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !configured}
            className="w-full rounded-lg bg-brand-gradient py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Authenticating…' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 border-t border-admin-border pt-4 text-center text-xs text-admin-muted">
          <span>Protected publishing workspace</span>
        </div>
      </div>
    </div>
  );
}
