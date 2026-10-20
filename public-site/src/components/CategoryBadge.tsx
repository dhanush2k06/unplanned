type Props = {
  name: string;
  slug?: string;
};

export function CategoryBadge({ name }: Props) {
  return (
    <span className="text-[11px] uppercase tracking-[0.18em] text-brand-red font-medium">
      {name}
    </span>
  );
}
