'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';
import { tweenToPose } from './pose';

import { resetHeroLayers } from './component/reset-interaction';
import { getStagePose } from './stages';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface StageSectionProps {
  id: string;
  className?: string;
  children?: ReactNode;
}

export function StageSection({ id, className, children }: StageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pose = getStagePose(id);
    if (!section || !pose) return;

    const activate = () => {
      const isHero = id === 'hero';
      useStore.getState().setStage(id);
      useStore.getState().setOrbit(isHero);
      if (!isHero) resetHeroLayers();

      const { modelRef } = useStore.getState();
      const tl = gsap.timeline();

      if (modelRef) tl.call(() => tweenToPose(modelRef, pose));
    };

    // Crossing the vertical midpoint of a section is the boundary — tune
    // 'top center' to whatever crossing point feels right once this is running.
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: activate,
      onEnterBack: activate,
    });

    return () => trigger.kill();
  }, [id]);

  return (
    <section
      ref={sectionRef}
      id={`stage-${id}`}
      className={`relative min-h-screen w-full ${className ?? ''}`}
    >
      {children}
    </section>
  );
}
