'use client';

import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  className?: string;
  showRuler?: boolean;
  showColumns?: boolean;
}

export function GridBackground({
  className,
  showRuler = true,
  showColumns = true,
}: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'z-50 fixed inset-0 mx-auto overflow-hidden pointer-events-none container',
        className,
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1920px] h-full">
        <div
          className={cn(
            'relative gap-4 grid grid-cols-4 h-full',
            'sm:grid-cols-6 sm:gap-5',
            'lg:grid-cols-12 lg:gap-6',
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'relative border-transparent border-x h-full',
                showColumns && 'bg-foreground/[0.025] border-foreground/[0.06]',
                index >= 4 && 'hidden sm:block',
                index >= 6 && 'sm:hidden lg:block',
              )}
            >
              {showRuler && (
                <div className="top-0 absolute inset-x-0 flex justify-between">
                  <span className="bg-foreground/20 w-px h-2" />
                  <span className="bg-foreground/20 w-px h-2" />
                </div>
              )}

              {showRuler && (
                <span className="top-3 left-1 absolute font-mono text-[9px] text-foreground/25">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
