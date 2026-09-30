type Props = {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-heading text-xl">{title}</h2>
        <p className="mt-2 text-sm text-admin-muted">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-lg border border-admin-border px-4 py-2 text-sm">
            Stay
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-brand-gradient px-4 py-2 text-sm text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
