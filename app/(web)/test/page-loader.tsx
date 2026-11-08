'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneReady } from './scene-ready';
import { useLenis } from '@/components/provider/smooth-scroll';

const MIN_VISIBLE_MS = 800; // avoids a flash on fast/cached loads
const COUNTER_DELAY_MS = 400; // only show the counter if loading takes longer than this

export default function PageLoader() {
  const ready = useSceneReady((s) => s.ready);
  const progress = useSceneReady((s) => s.progress);
  const setReady = useSceneReady((s) => s.setReady);

  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const t0 = useRef(0);
  const [gone, setGone] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    t0.current = performance.now();
    const t = setTimeout(setReady, 15000); // never trap the user
    return () => clearTimeout(t);
  }, [setReady]);

  useEffect(() => {
    if (ready) return;

    const t = setTimeout(() => {
      if (counter.current) {
        gsap.to(counter.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }, COUNTER_DELAY_MS);

    return () => clearTimeout(t);
  }, [ready]);

  // counter
  useEffect(() => {
    if (!counter.current) return;

    const value = Math.round(
      Math.min(100, Math.max(0, progress <= 1 ? progress * 100 : progress)),
    );

    const counterValue = {
      value: Number(counter.current.textContent),
    };

    const tween = gsap.to(counterValue, {
      value,
      duration: 0.4,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        if (counter.current) {
          counter.current.textContent = String(counterValue.value).padStart(
            3,
            '0',
          );
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [progress]);

  // exit
  useEffect(() => {
    if (!ready || !root.current) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wait =
      Math.max(0, MIN_VISIBLE_MS - (performance.now() - t0.current)) / 1000;
    const { setRevealed } = useSceneReady.getState();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: wait,
        onComplete: () => {
          setGone(true);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      });

      if (reduce) {
        tl.add(setRevealed).to(root.current, { autoAlpha: 0, duration: 0.2 });
        return;
      }

      tl.to(counter.current, {
        yPercent: 110,
        duration: 0.5,
        ease: 'power4.inOut',
      }).fromTo(
        root.current,
        {
          scale: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        },
        {
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.8,
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '<0.1',
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  // Scroll lock only while mounted
  useEffect(() => {
    if (!lenis) return;

    if (gone) lenis.start();
    else lenis.stop();

    return () => {
      lenis.start();
    };
  }, [lenis, gone]);

  useEffect(() => {
    if (gone) return;

    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      id="page-loader"
      ref={root}
      role="status"
      aria-live="polite"
      className="z-40 fixed inset-0 bg-background origin-bottom will-change-transform"
    >
      <span className="sr-only">Loading experience</span>

      <div className="justify-end content-end grid mx-auto p-4 sm:p-6 lg:p-8 w-full h-full container">
        {/* Counter */}
        <div className="overflow-hidden">
          <span
            ref={counter}
            className="block opacity-0 font-extralight tabular-nums text-[10rem] leading-none"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
