import type { ReactNode } from 'react';

type Props = {
  title: string;
  action?: ReactNode;
};

export function Topbar({ title, action }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-admin-border bg-white px-6 py-4">
      <h1 className="font-heading text-xl">{title}</h1>
      {action}
    </div>
  );
}
