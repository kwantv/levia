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
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
      <ProductSection />

      <DebugHud />
    </>
  );
};

export default Page;
