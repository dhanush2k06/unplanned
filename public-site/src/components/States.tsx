type Props = {
  message?: string;
};

export function SkeletonGrid({ message = 'Loading articles...' }: Props) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">{message}</p>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-[14px] bg-public-surface" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="rounded-[14px] border border-public-border bg-public-surface px-6 py-12 text-center">
      <h2 className="font-heading text-2xl">{title}</h2>
      {detail ? <p className="mt-2 text-public-muted">{detail}</p> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-[14px] border border-public-border bg-public-surface px-6 py-12 text-center">
      <h2 className="font-heading text-2xl">Something went wrong.</h2>
      <p className="mt-2 text-public-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-brand-gradient px-5 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
