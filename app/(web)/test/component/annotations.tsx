// components/stage-annotations.tsx
'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

export function StageAnnotations() {
  const annotations = useStore((s) => s.annotations);

  return (
    <>
      {annotations.map((a, i) => (
        <Html key={a.label} position={a.position} distanceFactor={6} occlude>
          <div
            className="flex items-center gap-2 opacity-0 pointer-events-none"
            style={{
              animation: 'annotation-pop 0.4s ease forwards',
              animationDelay: `${i * 100 + 200}ms`,
            }}
          >
            {/* marker dot at the exact 3D anchor point */}
            <span className="bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] rounded-full w-1.5 h-1.5 shrink-0" />
            {/* connecting line — width doubles as a small reveal via the keyframe below */}
            <span className="bg-white/50 w-8 h-px origin-left" />
            <span className="text-white/80 text-xs uppercase tracking-wide whitespace-nowrap">
              {a.label}
            </span>
          </div>
        </Html>
      ))}
    </>
  );
}
