// components/stage-annotations.tsx
'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { getStageAnnotations } from '../stages';

export function StageAnnotations() {
  const stage = useStore((s) => s.stage);
  const annotations = getStageAnnotations(stage);

  return (
    <>
      {annotations.map((a, i) => (
        // key includes `stage` so switching stages force-remounts every
        // annotation — a fresh DOM node replays the keyframe from `from`
        // automatically, with zero JS animation logic needed.
        <Html
          key={`${stage}-${a.label}`}
          position={a.position}
          distanceFactor={6}
          occlude
        >
          <div
            className="bg-black/70 px-2 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none"
            style={{
              animation: 'annotation-pop 0.35s ease forwards',
              animationDelay: `${i * 100 + 150}ms`,
              opacity: 0,
            }}
          >
            {a.label}
          </div>
        </Html>
      ))}
    </>
  );
}
