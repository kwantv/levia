'use client';

import { useRef } from 'react';

export default function DotGridBackground() {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ref.current?.style.setProperty('--mouse-x', `${x}px`);
    ref.current?.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Base dot grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--foreground) 15%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Cursor illuminated dots */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: `
            radial-gradient(
              circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%),
              color-mix(in oklch, var(--primary) 10%, transparent),
              transparent 70%
            ),
            radial-gradient(
              circle,
              color-mix(in oklch, var(--primary) 60%, transparent) 1px,
              transparent 1.5px
            )
          `,
          backgroundSize: '100% 100%, 28px 28px',
          maskImage: `
            radial-gradient(
              circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%),
              black,
              transparent
            )
          `,
          WebkitMaskImage: `
            radial-gradient(
              circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%),
              black,
              transparent
            )
          `,
        }}
      />

      {/* Subtle primary glow */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(
              320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              color-mix(in oklch, var(--primary) 7%, transparent),
              transparent 70%
            )
          `,
        }}
      />
    </div>
  );
}
