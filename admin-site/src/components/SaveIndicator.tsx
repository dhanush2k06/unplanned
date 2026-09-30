type Props = {
  status: 'idle' | 'saving' | 'saved' | 'error';
  savedAt?: Date | null;
  relative?: string;
};

export function SaveIndicator({ status, relative }: Props) {
  const label =
    status === 'saving'
      ? 'Saving...'
      : status === 'saved'
        ? `Saved ${relative ?? 'just now'}`
        : status === 'error'
          ? 'Save failed'
          : 'Unsaved changes';
  return <p className="text-xs text-admin-muted">{label}</p>;
}
