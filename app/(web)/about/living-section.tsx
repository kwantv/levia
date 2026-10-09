'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

import SectionLabel from './section-label';
import { Waves, Flame, Soup, Gauge } from 'lucide-react';

const vietnamFeatures = [
  {
    icon: Waves,
    index: '01',
    title: 'Liu riu ổn định',
    description:
      'Duy trì mức nhiệt thấp ổn định để những món kho cần thời gian có thể chín đều mà không cháy đáy.',
    note: 'Low Heat / Stability',
  },
  {
    icon: Flame,
    index: '02',
    title: 'Turbo đúng lúc',
    description:
      'Công suất lớn được kích hoạt nhanh khi món ăn cần nhiệt mạnh — từ chảo xào đến những thao tác cần phản hồi tức thời.',
    note: 'Turbo / Response',
  },
  {
    icon: Soup,
    index: '03',
    title: 'Cho bữa ăn sum vầy',
    description:
      'Các chế độ tự động được xây dựng quanh những tình huống quen thuộc như nồi lẩu giữa bàn ăn gia đình.',
    note: 'Vietnamese Dining',
  },
  {
    icon: Gauge,
    index: '04',
    title: 'Phù hợp khí hậu Việt Nam',
    description:
      'Cấu trúc mâm từ được chú trọng khả năng chống nồm ẩm, phù hợp hơn với điều kiện khí hậu nhiệt đới.',
    note: 'Climate / Protection',
  },
];

function LivingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const title = section.querySelector<HTMLElement>('[data-living-title]');

      const paragraphs =
        section.querySelectorAll<HTMLElement>('[data-living-copy]');

      const features = section.querySelectorAll<HTMLElement>(
        '[data-living-features]',
      );

      if (!title) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

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

      const timeline = gsap.timeline({
        onComplete: () => {
          titleSplit.revert();
          paragraphSplits.forEach((split) => split.revert());
        },
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          once: true,
          toggleActions: 'play none none none',
        },
      });

      // Heading: masked character reveal.
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

      // Paragraphs: line-by-line reveal.
      paragraphSplits.forEach((split, index) => {
        timeline.from(
          split.lines,
          {
            yPercent: 105,
            autoAlpha: 0,
            duration: 0.38,
            stagger: 0.055,
            ease: 'power3.out',
          },
          0.18 + index * 0.1,
        );
      });

      // Feature cards: subtle fade and upward movement.
      timeline.from(
        features,
        {
          y: 18,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform',
        },
        0.45,
      );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        titleSplit.revert();
        paragraphSplits.forEach((split) => split.revert());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
        <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel>Living / 05</SectionLabel>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.22em]">
              Designed for Vietnamese Kitchen
            </span>

            <h2
              data-living-title
              className="mt-8 max-w-4xl font-heading font-medium text-[clamp(2.75rem,5vw,4rem)] leading-[1.3] tracking-tighter"
            >
              Mỗi chi tiết được làm ra cho
              <br />
              <span className="text-primary">bữa cơm Việt.</span>
            </h2>

            <div className="gap-10 grid md:grid-cols-2 mt-14 pt-8 border-border border-t">
              <p
                data-living-copy
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]"
              >
                Cho gian bếp của những gia đình trẻ đang dựng xây tổ ấm đầu
                tiên. Cho những bữa cơm thường ngày cần sự đơn giản, nhưng vẫn
                xứng đáng được chăm chút.
              </p>

              <p
                data-living-copy
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]"
              >
                Chúng tôi muốn công nghệ hiện diện vừa đủ: thông minh ở bên
                trong, nhưng tự nhiên và dễ sử dụng ở bên ngoài.
              </p>
            </div>
          </div>
        </div>

        <div
          data-living-features
          className="gap-px grid sm:grid-cols-2 mt-16 lg:mt-20 bg-border border border-border"
        >
          {vietnamFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.index}
                className="group bg-background p-6 sm:p-8 lg:p-10 min-h-75"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-primary">
                    {feature.index}
                  </span>

                  <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="mt-16">
                  <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                    {feature.note}
                  </span>

                  <h3 className="mt-4 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-md text-muted-foreground text-sm leading-[1.8]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LivingSection;
