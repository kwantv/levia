'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { InteractiveObject } from './component/interactive-object';
import { HeroSection } from './section/hero-section';
import { ShowcaseSection } from './section/showcase-section';
import ProductSection from './section/product-section';
import { RefObject, useRef } from 'react';

export type SceneMorphState = {
  progress: number;

  // viewport pixel coordinates
  targetX: number;
  targetY: number;

  targetScale: number;
};

export type SceneMorphRef = RefObject<SceneMorphState>;

function DebugHud() {
  const stage = useStore((s) => s.stage);
  const orbitEnabled = useStore((s) => s.orbit);
  const dragging = useStore((s) => s.dragging);

  return (
    <div className="bottom-4 left-1/3 z-10 fixed gap-10 columns-2 font-mono text-xs">
      <p>
        orbit:{' '}
        <strong
          className={cn(orbitEnabled ? 'text-emerald-600' : 'text-rose-600')}
        >
          {String(orbitEnabled)}
        </strong>
      </p>
      <p>
        dragging:{' '}
        <strong className={cn(dragging ? 'text-emerald-600' : 'text-rose-600')}>
          {String(dragging)}
        </strong>
      </p>
      <p>
        stage: <strong>{stage}</strong>
      </p>
    </div>
  );
}

const Page = () => {
  const eventSourceRef = useRef<HTMLDivElement>(null);

  const morphRef = useRef<SceneMorphState>({
    progress: 0,
    targetX: 0,
    targetY: 0,
    targetScale: 0.55,
  });

  return (
    // <div ref={eventSourceRef} className="relative">
    <>
      <Canvas
        id="scene-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          // GSAP animates this, not width/height.
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          willChange: 'clip-path',
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Environment preset="city" />
        <InteractiveObject morph={morphRef} />
      </Canvas>

      <div
        id="scene-card-frame"
        className="z-2 fixed shadow-2xl border border-white/10 pointer-events-none"
      />

      <HeroSection />
      <ShowcaseSection />
      <ProductSection morph={morphRef} />

      <DebugHud />
    </>
    // </div>
  );
};

export default Page;
