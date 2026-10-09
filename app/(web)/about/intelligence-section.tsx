'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

import SectionLabel from './section-label';

function IntelligenceSection() {
  useGSAP(
    () => {
      const section = document.querySelector<HTMLElement>(
        '[data-intelligence-section]',
      );

      if (!section) return;

      const title = section.querySelector<HTMLElement>(
        '[data-intelligence-title]',
      );

      const paragraphs = section.querySelectorAll<HTMLElement>(
        '[data-intelligence-copy]',
      );

      const cards = section.querySelector<HTMLElement>(
        '[data-intelligence-cards]',
      );

      if (!title || !cards) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reduceMotion) return;

      const titleSplit = SplitText.create(title, {
        type: 'lines, chars',
        mask: 'lines',
      });

      const paragraphSplits = Array.from(paragraphs).map((paragraph) =>
        SplitText.create(paragraph, {
          type: 'lines',
          mask: 'lines',
        }),
      );

      const cardItems = gsap.utils.toArray<HTMLElement>(':scope > *', cards);

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      // Display title: masked character reveal.
      timeline.from(
        titleSplit.chars,
        {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.01,
        },
        0,
      );

      // Body copy: reveal each line from below.
      paragraphSplits.forEach((split, index) => {
        timeline.from(
          split.lines,
          {
            yPercent: 105,
            autoAlpha: 0,
            duration: 0.38,
            stagger: 0.055,
          },
          0.18 + index * 0.1,
        );
      });

      // Principle cards: subtle upward fade, staggered.
      timeline.from(
        cardItems,
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.09,
          clearProps: 'transform',
        },
        0.48,
      );

      // Restore the original text markup after the reveal completes.
      timeline.eventCallback('onComplete', () => {
        titleSplit.revert();
        paragraphSplits.forEach((split) => split.revert());
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        titleSplit.revert();
        paragraphSplits.forEach((split) => split.revert());
      };
    },
    { scope: undefined },
  );

  return (
    <section id="intelligence" data-intelligence-section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
        <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel>Smart / 02</SectionLabel>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            {/* Intentionally not animated */}
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.22em]">
              AI driven technology
            </span>

            <h2
              data-intelligence-title
              className="mt-8 max-w-4xl font-heading font-medium text-[clamp(2.75rem,5vw,4rem)] leading-[1.3] tracking-tighter"
            >
              Công nghệ bắt đầu từ{' '}
              <span className="text-primary">hành vi thực tế.</span>
            </h2>

            <div className="gap-10 grid md:grid-cols-2 mt-12 pt-8 border-border border-t">
              <p
                data-intelligence-copy
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]"
              >
                Levia ứng dụng AI để phân tích thói quen nấu nướng thực tế, từ
                cách người dùng tăng giảm nhiệt đến những khoảng thời gian một
                món ăn cần được giữ ổn định.
              </p>

              <p
                data-intelligence-copy
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]"
              >
                Những dữ liệu đó trở thành cơ sở để tinh chỉnh từng vùng nhiệt
                và từng thao tác điều khiển — để chiếc bếp phản hồi gần với phản
                xạ tự nhiên của người đứng bếp hơn.
              </p>
            </div>
          </div>
        </div>

        <div
          data-intelligence-cards
          className="gap-px grid sm:grid-cols-3 mt-16 bg-border border border-border"
        >
          <Principle
            number="01"
            label="Observe"
            title="Quan sát"
            description="Hiểu cách người dùng thực sự nấu ăn."
          />

          <Principle
            number="02"
            label="Learn"
            title="Phân tích"
            description="Tìm ra những mẫu hành vi có ý nghĩa."
          />

          <Principle
            number="03"
            label="Respond"
            title="Phản hồi"
            description="Biến dữ liệu thành trải nghiệm sử dụng."
          />
        </div>
      </div>
    </section>
  );
}

function Principle({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between bg-background p-6 sm:p-8 min-h-65">
      <div className="flex justify-between">
        <span className="font-mono text-[10px] text-primary">{number}</span>

        <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div>
        <h3 className="font-heading font-medium text-2xl tracking-[-0.03em]">
          {title}
        </h3>

        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default IntelligenceSection;
