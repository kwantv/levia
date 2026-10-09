'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SectionLabel from './section-label';

function StatementSection() {
  useGSAP(() => {
    const zone = document.querySelector<HTMLElement>('[data-statement-zone]');
    const pin = zone?.querySelector<HTMLElement>('[data-statement-pin]');
    const first = zone?.querySelector<HTMLElement>('[data-statement-first]');
    const second = zone?.querySelector<HTMLElement>('[data-statement-second]');

    if (!zone || !pin || !first || !second) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      gsap.set(first, { opacity: 1 });
      gsap.set(second, { autoAlpha: 0 });
      return;
    }

    const firstSplit = SplitText.create(first, {
      type: 'lines, chars',
      mask: 'lines',
    });

    const secondSplit = SplitText.create(second, {
      type: 'lines',
      mask: 'lines',
    });

    const SWAP_THRESHOLD = 0.6;

    // Phase 1: character-by-character color reveal.
    const colorTimeline = gsap.timeline({ paused: true });

    colorTimeline.fromTo(
      firstSplit.chars,
      {
        opacity: 0.2,
      },
      {
        opacity: 1,
        duration: 1,
        stagger: {
          each: 1,
        },
        ease: 'none',
      },
    );

    // Phase 2: discrete sentence swap.
    gsap.set(firstSplit.lines, {
      yPercent: 0,
      autoAlpha: 1,
    });

    gsap.set(secondSplit.lines, {
      yPercent: -110,
      autoAlpha: 0,
    });

    const swapTimeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.48,
        ease: 'power3.inOut',
      },
    });

    swapTimeline
      .to(
        firstSplit.lines,
        {
          yPercent: 110,
          autoAlpha: 0,
        },
        0,
      )
      .to(
        secondSplit.lines,
        {
          yPercent: 0,
          autoAlpha: 1,
        },
        0,
      );

    let isSwapped = false;

    const trigger = ScrollTrigger.create({
      trigger: pin,
      pin,
      start: 'top center-=10%',
      end: '+=100%',
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate: (self) => {
        // Scrub the color reveal only during the first 45%.
        const colorProgress = Math.min(self.progress / SWAP_THRESHOLD, 1);

        colorTimeline.progress(colorProgress);

        // Swap at the threshold; do not scrub the swap itself.
        const shouldSwap = self.progress >= SWAP_THRESHOLD;

        if (shouldSwap === isSwapped) return;

        isSwapped = shouldSwap;

        if (shouldSwap) {
          swapTimeline.play();
        } else {
          swapTimeline.reverse();
        }
      },
    });

    return () => {
      trigger.kill();
      colorTimeline.kill();
      swapTimeline.kill();

      firstSplit.revert();
      secondSplit.revert();
    };
  });

  return (
    <div
      data-statement-zone
      className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 container"
    >
      <div
        data-statement-pin
        className="items-start gap-y-8 lg:gap-x-8 grid grid-cols-12"
      >
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel>Statement / 03</SectionLabel>
        </div>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <div data-hero-statement className="grid">
            <p
              data-statement-first
              className="col-start-1 row-start-1 max-w-5xl font-heading text-foreground text-3xl sm:text-5xl lg:text-6xl leading-[1.3] tracking-tighter"
            >
              Chúng tôi không bắt đầu từ việc thêm nhiều tính năng hơn.
            </p>

            <p
              data-statement-second
              className="col-start-1 row-start-1 max-w-5xl font-heading text-primary text-3xl sm:text-5xl lg:text-6xl leading-[1.3] tracking-tighter"
            >
              Chúng tôi bắt đầu từ việc hiểu người đứng bếp hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatementSection;
