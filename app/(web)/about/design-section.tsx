'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import SectionLabel from './section-label';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const materials = [
  ['01', 'Viền inox', 'Cấu trúc chắc chắn, đường nét chính xác.'],
  ['02', 'Kính ceramic', 'Bề mặt liền mạch, dễ làm sạch và bền bỉ.'],
  ['03', 'Đen ánh kim', 'Sang trọng nhưng không phô trương.'],
];

function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const title = section.querySelector<HTMLElement>('[data-design-title]');
      const description = section.querySelector<HTMLElement>(
        '[data-design-description]',
      );
      const materialRows =
        section.querySelectorAll<HTMLElement>('[data-design-row]');
      const visual = section.querySelector<HTMLElement>('[data-design-visual]');

      if (!title || !description || !visual) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reduceMotion) return;

      const titleSplit = SplitText.create(title, {
        type: 'lines, chars',
        mask: 'lines',
      });

      const descriptionSplit = SplitText.create(description, {
        type: 'lines',
        mask: 'lines',
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      // Title: masked character reveal.
      timeline.from(
        titleSplit.chars,
        {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.01,
          ease: 'power3.out',
        },
        0,
      );

      // Description: line-by-line reveal.
      timeline.from(
        descriptionSplit.lines,
        {
          yPercent: 105,
          autoAlpha: 0,
          duration: 0.38,
          stagger: 0.055,
          ease: 'power3.out',
        },
        0.2,
      );

      // Material rows: subtle upward stagger.
      timeline.from(
        materialRows,
        {
          x: -14,
          autoAlpha: 0,
          duration: 0.38,
          stagger: 0.075,
          ease: 'power3.out',
          clearProps: 'transform',
        },
        0.35,
      );

      // Visual: restrained fade and lift.
      timeline.from(
        visual,
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.25,
      );

      timeline.eventCallback('onComplete', () => {
        titleSplit.revert();
        descriptionSplit.revert();
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        titleSplit.revert();
        descriptionSplit.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 lg:py-32"
      data-design-section
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
        <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
          {/* Row 1: Eyebrow */}
          <div className="col-span-12 lg:col-span-4">
            <SectionLabel>Design / 04</SectionLabel>
          </div>

          {/* Row 1: Title + description */}
          <div className="col-span-12 lg:col-span-8">
            <h2
              data-design-title
              className="mt-8 max-w-4xl font-heading font-medium text-[clamp(2.75rem,5vw,4rem)] leading-[1.3] tracking-tighter"
            >
              <span className="text-primary">Tối giản</span> để công nghệ trở
              nên tự nhiên.
            </h2>

            <p
              data-design-description
              className="mt-7 max-w-2xl text-muted-foreground text-sm sm:text-base leading-[1.9]"
            >
              Levia theo đuổi tinh thần tối giản châu Âu: ít chi tiết hơn, đường
              nét rõ hơn và vật liệu được lựa chọn để hòa vào kiến trúc căn bếp
              thay vì cạnh tranh với nó.
            </p>
          </div>

          {/* Row 2, left: Material rows */}
          <div className="col-span-12 lg:col-span-4 mt-4 lg:mt-8">
            <div className="border-border border-t">
              {materials.map(([index, title, description]) => (
                <div
                  key={index}
                  data-design-row
                  className="gap-5 grid grid-cols-[2.5rem_1fr] py-6 border-border border-b"
                >
                  <span className="font-mono text-[10px] text-primary">
                    {index}
                  </span>

                  <div>
                    <h3 className="font-heading font-medium text-xl tracking-tight">
                      {title}
                    </h3>

                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2, right: Visual */}
          <div
            data-design-visual
            className="relative col-span-12 lg:col-span-8 bg-card mt-2 lg:mt-8 min-h-90 sm:min-h-120 lg:min-h-160 overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="top-[16%] left-[12%] absolute border border-primary/20 w-[76%] aspect-4/3">
                <div className="top-1/2 left-1/2 absolute border border-border rounded-full size-[52%] -translate-x-1/2 -translate-y-1/2" />
                <div className="top-1/2 left-1/2 absolute border border-primary/20 rounded-full size-[31%] -translate-x-1/2 -translate-y-1/2" />
                <div className="top-1/2 left-1/2 absolute bg-primary/10 blur-3xl rounded-full size-[30%] -translate-x-1/2 -translate-y-1/2" />
              </div>

              <span className="top-6 left-6 absolute bg-primary size-1.5" />

              <div className="right-6 bottom-6 left-6 absolute flex justify-between gap-4">
                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                  Form / Material
                </span>

                <span className="font-mono text-[8px] text-muted-foreground text-right uppercase tracking-[0.18em]">
                  European Minimalism
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DesignSection;
