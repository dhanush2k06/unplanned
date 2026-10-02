import type { ReactNode } from 'react';

type Props = {
  title: string;
  action?: ReactNode;
};

export function Topbar({ title, action }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-admin-border bg-white px-4 py-3.5 sm:px-6 sm:py-4">
      <h1 className="font-heading text-lg sm:text-xl font-semibold text-admin-text">{title}</h1>
      {action}
    </div>
  );
}
