'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef } from 'react';
import { getStickyOffset, movePoseTo, scrollToStage } from '../utils';
import { SHOWCASE_STAGES } from './showcase-stages';
import { useStore } from '@/lib/store';

export function ShowcaseSection() {
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        useStore.getState().setStage(stage.id);
        movePoseTo(stage.pose);
        textEl.classList.add('opacity-100!');
        if (detailEl) gsap.to(detailEl, { opacity: 1, y: 0, duration: 0.3 });
      };

      const leave = () => {
        textEl.classList.remove('opacity-100!');
        const { stage: currentStage, setStage } = useStore.getState();
        if (currentStage === stage.id) setStage(null);
      };

      const st = ScrollTrigger.create({
        trigger: trigger,
        start: () => `top ${getStickyOffset(i)}`,
        end: () => `bottom ${getStickyOffset(i)}`,
        onEnter: enter,
        onEnterBack: enter,
        onLeave: leave,
        onLeaveBack: leave,
      });

      instances.push(st);
    });

    return () => instances.forEach((i) => i.kill());
  }, []);

  return (
    <section className="relative">
      {SHOWCASE_STAGES.map((stage, i) => (
        <Fragment key={stage.id}>
          <div
            className="z-10 sticky px-24 pointer-events-none"
            style={{ top: getStickyOffset(i) }}
          >
            <div
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              onClick={() => scrollToStage(stage.id)}
              className="opacity-25 hover:opacity-75 w-fit transition-opacity cursor-pointer pointer-events-auto"
            >
              <h3 className="mb-3 font-heading text-3xl">{stage.title}</h3>
            </div>
          </div>

          <div
            id={`stage-${stage.id}`}
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
