// sections/products-section.tsx
'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';

const DOCK_ID = 'dock-window-hero';

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => useStore.getState().setDockTargetId(DOCK_ID),
      onEnterBack: () => useStore.getState().setDockTargetId(DOCK_ID),
      onLeave: () => useStore.getState().setDockTargetId(null),
      onLeaveBack: () => useStore.getState().setDockTargetId(null),
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="items-center gap-6 grid grid-cols-3 px-24 min-h-dvh"
    >
      {/* Card 1 — the docked hero object */}
      <div className="relative flex flex-col justify-end bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl aspect-square">
        {/* Transparent window — the canvas behind the page shows through
            this exact rect, and ObjectDocking projects the object here. */}
        <div id={DOCK_ID} className="bottom-20 absolute inset-4" />
        <h4 className="font-heading text-xl">The Object</h4>
        <p className="text-muted-foreground text-sm">Starting at $299</p>
      </div>

      {/* Cards 2 & 3 — plain product cards, no 3D involved */}
      <div className="flex flex-col justify-end bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl aspect-square">
        <h4 className="font-heading text-xl">Companion Dock</h4>
        <p className="text-muted-foreground text-sm">$49</p>
      </div>
      <div className="flex flex-col justify-end bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl aspect-square">
        <h4 className="font-heading text-xl">Travel Case</h4>
        <p className="text-muted-foreground text-sm">$39</p>
      </div>
    </section>
  );
}
