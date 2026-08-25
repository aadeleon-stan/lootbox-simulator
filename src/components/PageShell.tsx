import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  mode?: 'centered' | 'flow';
  title?: string;
  noPanel?: boolean;
  className?: string;
}

export default function PageShell({
  children,
  mode = 'flow',
  title,
  noPanel = false,
  className = '',
}: PageShellProps) {
  return (
    <div
      className={`flex flex-col items-center min-h-[calc(100svh-52px)] px-4 pb-6 ${
        mode === 'centered' ? 'justify-center' : 'pt-8'
      } ${className}`}
    >
      <div className="w-full max-w-sm">
        {noPanel ? (
          <>
            {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
            {children}
          </>
        ) : mode === 'centered' ? (
          children
        ) : (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
