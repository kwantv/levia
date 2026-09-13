'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/lib/store';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    // Every time Lenis updates scroll position, tell ScrollTrigger to
    // recalculate — this is what keeps pinned/scrubbed sections accurate.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (which is already a rAF loop) instead
    // of running a second, separate rAF loop. `lenis.raf` expects
    // milliseconds; GSAP's ticker gives seconds, so we multiply by 1000.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Lenis fakes smoothing by lagging behind real scroll input, which
    // GSAP's ticker lag-smoothing (meant for dropped frames) would fight.
    // Disabling it here avoids the two systems correcting against each other.
    gsap.ticker.lagSmoothing(0);

    useStore.getState().setLenis(lenis);

    return () => {
      lenis.destroy();
      useStore.getState().setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
