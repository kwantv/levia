'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { InteractiveObject } from './component/interactive-object';
import HeroSection from './section/hero-section';
import { ShowcaseSection } from './section/showcase-section';

function DebugHud() {
  const stage = useStore((s) => s.stage);
  const orbitEnabled = useStore((s) => s.orbit);
  const dragging = useStore((s) => s.dragging);
  const animating = useStore((s) => s.animating);

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
        animating:{' '}
        <strong
          className={cn(animating ? 'text-emerald-600' : 'text-rose-600')}
        >
          {String(animating)}
        </strong>
      </p>
      <p>
        stage: <strong>{stage}</strong>
      </p>
    </div>
  );
}

const Page = () => {
  return (
    <>
      <Canvas
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Environment preset="city" />
        <InteractiveObject />
      </Canvas>

      <HeroSection />
      <ShowcaseSection />

      <DebugHud />
    </>
  );
};

export default Page;
