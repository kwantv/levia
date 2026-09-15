'use client';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneMorphRef } from '../page';
// import { useGSAP } from '@gsap/react';

// import type { SceneMorphRef } from '@/lib/scene-morph';

gsap.registerPlugin(ScrollTrigger);

type ProductSectionProps = {
  morph: SceneMorphRef;
};

const ProductSection = ({ morph }: ProductSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      const section = sectionRef.current;

      const card = firstCardRef.current;

      const canvas = document.getElementById('scene-canvas');

      const frame = document.getElementById('scene-card-frame');

      if (!section || !card || !canvas || !frame) {
        return;
      }

      const clamp01 = gsap.utils.clamp(0, 1);

      const updateScene = () => {
        const sectionRect = section.getBoundingClientRect();

        const rect = card.getBoundingClientRect();

        /**
         * Begin morphing when the ProductSection
         * enters near the bottom of the screen.
         */
        const startY = window.innerHeight * 0.95;

        /**
         * Finish before ProductSection reaches
         * the very top.
         */
        const endY = window.innerHeight * 0.15;

        const progress = clamp01((startY - sectionRect.top) / (startY - endY));

        morph.current.progress = progress;

        morph.current.targetX = rect.left + rect.width / 2;

        morph.current.targetY = rect.top + rect.height / 2;

        morph.current.targetScale = 0.55;

        /**
         * Target card expressed as viewport
         * inset values.
         */
        const targetTop = rect.top;

        const targetRight = window.innerWidth - rect.right;

        const targetBottom = window.innerHeight - rect.bottom;

        const targetLeft = rect.left;

        /**
         * 0:
         *
         * inset(0 0 0 0)
         *
         * 1:
         *
         * inset(card bounds)
         */
        const top = gsap.utils.interpolate(0, targetTop, progress);

        const right = gsap.utils.interpolate(0, targetRight, progress);

        const bottom = gsap.utils.interpolate(0, targetBottom, progress);

        const left = gsap.utils.interpolate(0, targetLeft, progress);

        const radius = gsap.utils.interpolate(0, 16, progress);

        gsap.set(canvas, {
          clipPath: `
            inset(
              ${top}px
              ${right}px
              ${bottom}px
              ${left}px
              round ${radius}px
            )
          `,
        });

        /**
         * Don't show the card chrome immediately.
         *
         * Canvas first shrinks, then the frame
         * becomes visible near the end.
         */
        const frameProgress = clamp01((progress - 0.65) / 0.35);

        gsap.set(frame, {
          left: rect.left,
          top: rect.top,

          width: rect.width,
          height: rect.height,

          borderRadius: radius,

          opacity: frameProgress,
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: section,

        /**
         * Keep tracking for the complete time
         * ProductSection travels through viewport.
         */
        start: 'top bottom',
        end: 'bottom top',

        onEnter: updateScene,
        onUpdate: updateScene,
        onRefresh: updateScene,

        onLeaveBack: () => {
          morph.current.progress = 0;

          gsap.set(canvas, {
            clipPath: 'inset(0px 0px 0px 0px round 0px)',
          });

          gsap.set(frame, {
            opacity: 0,
          });
        },
      });

      updateScene();

      return () => {
        trigger.kill();
      };
    },
    [],
    // {
    //   scope: sectionRef,
    // },
  );

  return (
    <section ref={sectionRef} className="relative h-dvh">
      <div className="content-center grid px-24 min-h-dvh">
        <div className="items-center gap-6 grid grid-cols-3">
          {/* Canvas destination */}
          <div ref={firstCardRef} className="aspect-square" />

          <div
            data-product-reveal
            className="flex flex-col justify-end bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl aspect-square"
          >
            <h4 className="font-heading text-xl">Companion Dock</h4>

            <p className="text-muted-foreground text-sm">$49</p>
          </div>

          <div
            data-product-reveal
            className="flex flex-col justify-end bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl aspect-square"
          >
            <h4 className="font-heading text-xl">Travel Case</h4>

            <p className="text-muted-foreground text-sm">$39</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
