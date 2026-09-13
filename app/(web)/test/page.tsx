'use client';

import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { InteractiveObject } from './component/interactive-object';
import { StageSection } from './stage-section';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

function DebugHud() {
  const stage = useStore((s) => s.stage);
  const orbitEnabled = useStore((s) => s.orbit);
  const dragging = useStore((s) => s.dragging);

  return (
    <div className="bottom-4 left-1/3 z-10 fixed font-mono text-xs">
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
  return (
    <>
      <Canvas
        style={{
          position: 'fixed',
          inset: '0',
          zIndex: 1,
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Environment preset="city" />
        <InteractiveObject />
      </Canvas>

      <div className="">
        <StageSection id="hero" className="items-center grid grid-cols-2 px-24">
          <div>
            <h1 className="font-semibold text-6xl">The Object</h1>
            <p className="mt-4 text-white/70">
              Drag to orbit, move your mouse to tilt.
            </p>
          </div>
        </StageSection>

        <StageSection id="material">
          <p className="bottom-24 left-1/2 absolute text-white/50 text-sm uppercase tracking-widest -translate-x-1/2">
            01 / 05
          </p>
          <h3 className="bottom-16 left-1/2 absolute font-semibold text-white text-2xl -translate-x-1/2">
            Aerospace-grade shell
          </h3>
        </StageSection>

        <StageSection id="sensor">
          <p className="bottom-24 left-1/2 absolute text-white/50 text-sm uppercase tracking-widest -translate-x-1/2">
            02 / 05
          </p>
          <h3 className="bottom-16 left-1/2 absolute font-semibold text-white text-2xl -translate-x-1/2">
            Precision sensor array
          </h3>
        </StageSection>

        <StageSection id="battery">
          <p className="bottom-24 left-1/2 absolute text-white/50 text-sm uppercase tracking-widest -translate-x-1/2">
            03 / 05
          </p>
          <h3 className="bottom-16 left-1/2 absolute font-semibold text-white text-2xl -translate-x-1/2">
            Cell architecture
          </h3>
        </StageSection>

        <StageSection id="chip">
          <p className="bottom-24 left-1/2 absolute text-white/50 text-sm uppercase tracking-widest -translate-x-1/2">
            04 / 05
          </p>
          <h3 className="bottom-16 left-1/2 absolute font-semibold text-white text-2xl -translate-x-1/2">
            Custom silicon
          </h3>
        </StageSection>

        <StageSection id="display">
          <p className="bottom-24 left-1/2 absolute text-white/50 text-sm uppercase tracking-widest -translate-x-1/2">
            05 / 05
          </p>
          <h3 className="bottom-16 left-1/2 absolute font-semibold text-white text-2xl -translate-x-1/2">
            Optical stack
          </h3>
        </StageSection>
      </div>

      <DebugHud />
    </>
  );
};

export default Page;
