'use client';

import { useStore } from '@/lib/store';
import { movePoseTo } from '../utils';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

const HERO_POSE = { position: [1.6, 0, 0], rotation: [0, 0, 0] } as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 96',
      end: 'bottom 96',
      onLeave: () => {
        useStore.getState().setOrbit(false);
        useStore.getState().resetInteraction?.();
      },
      onEnterBack: () => {
        useStore.getState().setOrbit(true);
        useStore.getState().setStage('hero');
        movePoseTo(HERO_POSE);
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="items-center grid grid-cols-2 w-full min-h-dvh"
    >
      <div className="space-y-4 p-24">
        <h1 className="w-fit font-heading text-6xl">The object</h1>
        <p className="max-w-[50ch] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas minus
          atque neque unde excepturi ratione exercitationem dignissimos
          repudiandae placeat. Deserunt doloribus officia quaerat quas, ullam
          unde vitae. Corporis, id accusamus.
        </p>
      </div>
      <div className="mt-20">
        <p className="max-w-[50ch] text-muted-foreground indent-36">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas minus
          atque neque unde excepturi ratione exercitationem dignissimos
          repudiandae placeat.
        </p>
      </div>
    </section>
  );
}
