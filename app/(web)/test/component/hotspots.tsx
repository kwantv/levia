'use client';

import { Html } from '@react-three/drei';
import { useStore } from '@/lib/store';
import { scrollToStage } from '../utils';
import { cn } from '@/lib/utils';

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

export function Hotspots() {
  const orbitEnabled = useStore((s) => s.orbit);

  return (
    <>
      {HOTSPOTS.map((point) => (
        <Html
          key={point.id}
          position={point.position}
          occlude
          visible={orbitEnabled}
        >
          <button
            onClick={() => scrollToStage(point.id)}
            className={cn(
              'group relative flex justify-center items-center w-3 h-3 transition-opacity duration-200',
              orbitEnabled
                ? 'opacity-100 pointer-events-auto cursor-pointer'
                : 'pointer-events-none opacity-0',
            )}
          >
            <span className="inline-flex absolute bg-muted-foreground rounded-full w-full h-full animate-ping" />
            <span className="inline-flex relative bg-foreground rounded-full w-3 h-3" />
            <span className="left-4 absolute bg-foreground opacity-0 group-hover:opacity-100 px-2 py-1 font-mono text-background text-xs whitespace-nowrap transition-opacity">
              {point.label}
            </span>
          </button>
        </Html>
      ))}
    </>
  );
}
