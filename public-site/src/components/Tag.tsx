type Props = {
  label: string;
};

export function Tag({ label }: Props) {
  return (
    <span className="rounded-full border border-public-border px-3 py-1 text-xs text-public-muted">
      #{label}
    </span>
  );
}
