'use client';

import { useStore } from '@/lib/store';
import { resetInteractionLayers } from '@/lib/utils';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { movePoseTo } from './move-pose-to';

const HERO_POSE = { position: [1.6, 0, 0], rotation: [0, 0, 0] } as const;

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'bottom top',
      onLeave: () => {
        useStore.getState().setOrbit(false);
        resetInteractionLayers();
      },
      onEnterBack: () => {
        useStore.getState().setOrbit(true);
        movePoseTo(HERO_POSE);
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="items-center grid grid-cols-2 border w-full min-h-dvh"
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
};

export default HeroSection;
