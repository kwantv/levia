// components/hotspots.tsx
'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';

interface HotspotDef {
  id: string; // matches a stage id — this is the jump target
  position: readonly [number, number, number];
  label: string;
}

// Reordering STAGES in lib/stages.ts doesn't require touching this list —
// each entry just names which stage id it jumps to.
const HOTSPOTS: HotspotDef[] = [
  { id: 'material', position: [0.5, 0.5, 0.5], label: 'Material' },
  { id: 'sensor', position: [-0.5, 0.3, 0.5], label: 'Sensor' },
  { id: 'battery', position: [0, -0.5, 0.5], label: 'Battery' },
  { id: 'chip', position: [0.5, -0.3, -0.5], label: 'Chip' },
  { id: 'display', position: [-0.5, 0.5, -0.5], label: 'Display' },
];

function jumpToStage(id: string) {
  const section = document.getElementById(`stage-${id}`);
  if (!section) return;

  const { lenis } = useStore.getState();
  if (lenis) {
    lenis.scrollTo(section);
  } else {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Hotspots() {
  const stage = useStore((s) => s.stage);
  const visible = stage === 'hero';

  return (
    <>
      {HOTSPOTS.map((point) => (
        <Html
          key={point.id}
          position={point.position}
          occlude
          visible={visible}
        >
          <button
            onClick={() => jumpToStage(point.id)}
            className={`group relative flex h-3 w-3 items-center justify-center transition-opacity duration-200 ${
              visible
                ? 'opacity-100 pointer-events-auto'
                : 'pointer-events-none opacity-0'
            }`}
          >
            <span className="inline-flex absolute bg-white/60 rounded-full w-full h-full animate-ping" />
            <span className="inline-flex relative bg-white rounded-full w-3 h-3" />
            <span className="left-4 absolute bg-black/70 opacity-0 group-hover:opacity-100 px-2 py-1 rounded text-white text-xs whitespace-nowrap transition-opacity">
              {point.label}
            </span>
          </button>
        </Html>
      ))}
    </>
  );
}
