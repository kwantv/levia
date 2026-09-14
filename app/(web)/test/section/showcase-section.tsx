// sections/showcase-section.tsx
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef } from 'react';
import { movePoseTo } from './move-pose-to';
import { SHOWCASE_STAGES } from './showcase-stages';
import { useStore } from '@/lib/store';

export function ShowcaseSection() {
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenis = useStore((s) => s.lenis);

  useEffect(() => {
    const instances: Array<{ kill: () => void }> = [];

    SHOWCASE_STAGES.forEach((stage, i) => {
      const trigger = triggerRefs.current[i];
      const textEl = titleRefs.current[i];

      if (!trigger || !textEl) return;

      const detailEl = trigger.querySelector<HTMLElement>(
        '[data-stage-detail]',
      );

      const enter = () => {
        movePoseTo(stage.pose);
        gsap.to(textEl, { opacity: 1, duration: 0.3 });
        if (detailEl) gsap.to(detailEl, { opacity: 1, y: 0, duration: 0.3 });
      };

      const leave = () => {
        gsap.to(textEl, { opacity: 0.25, duration: 0.3 });
      };

      const st = ScrollTrigger.create({
        trigger: trigger,
        start: () => `top ${96 + i * 56}`,
        end: () => `bottom ${96 + i * 56}`,
        markers: true,
        onEnter: enter,
        onEnterBack: enter,
        onLeave: leave,
        onLeaveBack: leave,
      });

      instances.push(st);
    });

    return () => instances.forEach((i) => i.kill());
  }, []);

  const jumpToStage = (i: number) => {
    const target = triggerRefs.current[i];
    if (!target || !lenis) return;

    lenis.scrollTo(target, {
      offset: -(96 + i * 56) + 16, // mirrors the ScrollTrigger start() offset
      duration: 0.7,
    });
  };

  return (
    <section className="relative">
      {SHOWCASE_STAGES.map((stage, i) => (
        <Fragment key={stage.id}>
          <div
            className="z-10 sticky px-24 pointer-events-none"
            style={{ top: `calc(6rem + ${i * 3.5}rem)` }}
          >
            <div
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              onClick={() => jumpToStage(i)}
              className="opacity-25 hover:opacity-75 max-w-md transition-opacity cursor-pointer pointer-events-auto"
            >
              <h3 className="mb-3 font-heading text-3xl">{stage.title}</h3>
            </div>
          </div>

          <div
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            className="relative h-dvh"
          >
            <div
              data-stage-detail
              className="top-2/3 left-2/3 absolute opacity-0 translate-y-2"
            >
              <p className="max-w-[30ch] text-muted-foreground">
                {stage.description}
              </p>
            </div>
          </div>
        </Fragment>
      ))}
    </section>
  );
}
