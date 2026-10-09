import { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary size-1.5 shrink-0" />

      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}
