import { useEffect, useState, type FormEvent } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { Topbar } from '../components/Topbar';
import { useToast } from '../hooks/useToast';
import { getSiteSettings, saveSiteSettings } from '../services/firebase/cms';
import type { SiteSettings } from '../types';

const defaultSettings: SiteSettings = {
  siteName: 'Dhanush',
  siteDescription: 'Personal blog about technology, AI, and engineering.',
  authorName: 'Dhanush',
  authorBio:
    "Student & builder passionate about Artificial Intelligence, systems engineering, and shipping real-world software products.",
  profileImage: '',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    medium: 'https://medium.com',
  },
};

export function SettingsPage() {
  const { notify } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getSiteSettings();
        if (mounted && data) {
          setSettings(data);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load site settings.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(e?: FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      notify('Site settings saved successfully.');
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-admin-bg pb-16">
      <Topbar
        title="Site Settings"
        action={
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        }
      />

      <main className="mx-auto max-w-4xl px-6 py-8">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-white p-6 shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">Error loading settings</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            {/* General Site Information */}
            <div className="rounded-xl border border-admin-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-admin-text">
                General Publication Information
              </h2>
              <p className="mt-1 text-xs text-admin-muted">
                These settings configure site branding, title tags, and default meta attributes.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Publication Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Publication Tagline / Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.siteDescription}
                    onChange={(e) =>
                      setSettings({ ...settings, siteDescription: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Author Profile Information */}
            <div className="rounded-xl border border-admin-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-admin-text">
                Author & About Profile
              </h2>
              <p className="mt-1 text-xs text-admin-muted">
                Displayed across author cards, the public /about page, and article footer metadata.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.authorName}
                    onChange={(e) =>
                      setSettings({ ...settings, authorName: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Author Biography / Intro
                  </label>
                  <textarea
                    rows={4}
                    value={settings.authorBio}
                    onChange={(e) =>
                      setSettings({ ...settings, authorBio: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-sm leading-relaxed text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <ImageUploader
                    label="Author Profile Picture"
                    value={settings.profileImage}
                    pathPrefix="profile"
                    onChange={(url) => setSettings({ ...settings, profileImage: url })}
                  />
                </div>
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="rounded-xl border border-admin-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-base font-semibold text-admin-text">
                Social & Professional Profiles
              </h2>
              <p className="mt-1 text-xs text-admin-muted">
                Links rendered in the public navbar, about page, and footer.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.github}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/username"
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-admin-muted">
                    Medium / Blog URL
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.medium}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, medium: e.target.value },
                      })
                    }
                    placeholder="https://medium.com/@username"
                    className="mt-1.5 w-full rounded-lg border border-admin-border bg-admin-bg px-3.5 py-2 text-xs text-admin-text focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                {saving ? 'Saving changes…' : 'Save Site Settings'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
