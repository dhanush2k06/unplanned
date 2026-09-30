import { useState, type ReactNode } from 'react';
import type { ExtraProps } from 'react-markdown';

type CodeProps = ExtraProps & {
  className?: string;
  children?: ReactNode;
  inline?: boolean;
};

export function CodeBlock({ className, children, inline }: CodeProps) {
  const [copied, setCopied] = useState(false);
  const text = String(children ?? '').replace(/\n$/, '');
  const language = /language-(\w+)/.exec(className ?? '')?.[1] ?? 'text';

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#a8a8a8]">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff0000]" />
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-[11px] tracking-[0.12em] text-[#a8a8a8] transition hover:text-white"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-6">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
