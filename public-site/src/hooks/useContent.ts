import { useEffect, useState } from 'react';
import { fetchCategories, fetchPublishedSummaries, fetchSiteSettings } from '../services/firebase/content';
import type { ArticleSummary, Category, SiteSettings } from '../types';
import { defaultSettings } from '../data/sample';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSiteSettings()
      .then((value) => {
        if (active) setSettings(value);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}

export function usePublishedArticles(max = 12) {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPublishedSummaries(max)
      .then((value) => {
        if (active) {
          setArticles(value);
          setError(null);
        }
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Something went wrong.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [max]);

  return { articles, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((value) => {
        if (active) setCategories(value);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}
