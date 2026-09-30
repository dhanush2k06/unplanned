type Props = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-xl border border-admin-border bg-white p-5">
      <p className="text-sm text-admin-muted">{label}</p>
      <p className="mt-2 font-heading text-3xl">{value}</p>
    </div>
  );
}
