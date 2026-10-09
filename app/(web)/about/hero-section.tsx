'use client';

import DotGridBackground from '@/components/dot-grid-background';
import SectionLabel from './section-label';

import { playAfterPageTransition } from '@/lib/page-transition';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

function HeroSection() {
  useGSAP(() => {
    const hero = document.querySelector('[data-about-hero]');
    if (!hero) return;

    const title = hero.querySelector<HTMLElement>('[data-hero-title]');
    const subtitles = gsap.utils.toArray<HTMLElement>(
      '[data-hero-subtitle]',
      hero,
    );
    const labels = gsap.utils.toArray<HTMLElement>('[data-hero-label]', hero);

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      gsap.set([...subtitles, ...labels, ...(title ? [title] : [])], {
        autoAlpha: 1,
        clearProps: 'transform',
      });
      return;
    }

    const splits: SplitText[] = [];

    const titleSplit = title
      ? SplitText.create(title, {
          type: 'lines, chars',
          mask: 'lines',
        })
      : null;

    if (titleSplit) {
      splits.push(titleSplit);
      gsap.set(titleSplit.chars, {
        yPercent: 110,
        autoAlpha: 0,
      });
    }

    const subtitleSplits = subtitles.map((element) => {
      const split = SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
      });

      splits.push(split);

      gsap.set(split.lines, {
        yPercent: 105,
        autoAlpha: 0,
      });

      return split;
    });

    // Labels fade only: no translation or scaling.
    gsap.set(labels, { autoAlpha: 0 });

    const timeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Restore the original DOM after all reveals finish.
        splits.forEach((split) => split.revert());
      },
    });

    if (titleSplit) {
      timeline.to(
        titleSplit.chars,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.012,
        },
        0,
      );
    }

    subtitleSplits.forEach((split, index) => {
      timeline.to(
        split.lines,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.36,
          stagger: 0.045,
        },
        index === 0 ? '<0.16' : '<0.24',
      );
    });

    timeline.to(
      labels,
      {
        autoAlpha: 1,
        duration: 0.3,
        ease: 'power1.out',
      },
      '-=0.12',
    );

    const cancelPlayBack = playAfterPageTransition(timeline);

    return () => {
      cancelPlayBack();
      splits.forEach((split) => split.revert());
    };
  });

  return (
    <section data-about-hero className="relative border-b overflow-hidden">
      <DotGridBackground />

      <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-175 pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 container">
        <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
          <div data-hero-label className="col-span-12 lg:col-span-3">
            <SectionLabel>About / 01</SectionLabel>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <span
              data-hero-label
              className="font-mono text-[10px] text-primary uppercase tracking-[0.22em]"
            >
              Levia / Kitchen Intelligence
            </span>

            <h1
              data-hero-title
              className="mt-6 max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,7rem)] leading-[1.2] tracking-tighter"
            >
              Hiểu cách
              <br />
              <span className="text-primary">người Việt nấu ăn.</span>
            </h1>

            <div className="gap-8 grid md:grid-cols-2 mt-12 sm:mt-16 pt-7 border-border border-t">
              <p
                data-hero-subtitle
                className="max-w-lg font-heading text-xl sm:text-2xl leading-[1.45] tracking-tight"
              >
                Levia ra đời từ một câu hỏi đơn giản:
              </p>

              <p
                data-hero-subtitle
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.8]"
              >
                Một chiếc bếp từ sẽ như thế nào nếu được thiết kế bằng chính dữ
                liệu về cách con người nấu ăn?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
