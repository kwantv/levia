'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { AnnotationId } from '../component/annotations/annotation-layer';
import { goToPose, type PoseName } from './poses';
import SafetySection from './safety-section';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export type Section = {
  pose: PoseName;
  annotation?: AnnotationId;
  title: string;
  body: string;
  body2?: string;
};

const SECTIONS: Section[] = [
  {
    pose: 'power',
    annotation: 'ruler',
    title: 'Mạnh mẽ Lorem ipsum dolor sit amet.',
    body: 'Sở hữu sức mạnh bứt phá với tổng công suất lên tới 5600W và chế độ đun sôi chớp nhoáng Booster 2800W cho mỗi vùng nấu, LV79DI đảm bảo hiệu suất truyền nhiệt tối đa. Tích hợp công nghệ Digital Inverter, bếp hoạt động vô cùng êm ái, siêu tiết kiệm điện năng và duy trì sự mượt mà ngay cả khi điện áp thấp ở mức 100-265V',
    body2:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolor a sunt eum, nemo laboriosam maiores nihil quos ut porro veritatis alias doloremque? Reprehenderit consectetur ipsa numquam quaerat perferendis vel!',
  },
  {
    pose: 'durability',
    title: 'Bền bỉ',
    body: 'Sở hữu sức mạnh bứt phá với tổng công suất lên tới 5600W và chế độ đun sôi chớp nhoáng Booster 2800W cho mỗi vùng nấu, LV79DI đảm bảo hiệu suất truyền nhiệt tối đa. Tích hợp công nghệ Digital Inverter, bếp hoạt động vô cùng êm ái, siêu tiết kiệm điện năng và duy trì sự mượt mà ngay cả khi điện áp thấp ở mức 100-265V',
    body2:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolor a sunt eum, nemo laboriosam maiores nihil quos ut porro veritatis alias doloremque? Reprehenderit consectetur ipsa numquam quaerat perferendis vel!',
  },
  {
    pose: 'modern',
    title: 'Hiện đại',
    body: 'Sở hữu sức mạnh bứt phá với tổng công suất lên tới 5600W và chế độ đun sôi chớp nhoáng Booster 2800W cho mỗi vùng nấu, LV79DI đảm bảo hiệu suất truyền nhiệt tối đa. Tích hợp công nghệ Digital Inverter, bếp hoạt động vô cùng êm ái, siêu tiết kiệm điện năng và duy trì sự mượt mà ngay cả khi điện áp thấp ở mức 100-265V',
    body2:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolor a sunt eum, nemo laboriosam maiores nihil quos ut porro veritatis alias doloremque? Reprehenderit consectetur ipsa numquam quaerat perferendis vel!',
  },
  {
    pose: 'safety',
    title: 'An toàn',
    body: 'Sở hữu sức mạnh bứt phá với tổng công suất lên tới 5600W và chế độ đun sôi chớp nhoáng Booster 2800W cho mỗi vùng nấu, LV79DI đảm bảo hiệu suất truyền nhiệt tối đa. Tích hợp công nghệ Digital Inverter, bếp hoạt động vô cùng êm ái, siêu tiết kiệm điện năng và duy trì sự mượt mà ngay cả khi điện áp thấp ở mức 100-265V',
    body2:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, dolor a sunt eum, nemo laboriosam maiores nihil quos ut porro veritatis alias doloremque? Reprehenderit consectetur ipsa numquam quaerat perferendis vel!',
  },
];

export default function Page() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-pose]').forEach((el) => {
        const title = el.querySelector('[data-header-title]');
        const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]', el);

        gsap.set(title, { autoAlpha: 0.3 });

        // eyebrow + body: masked line reveal
        reveals.forEach((node, i) => {
          SplitText.create(node, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true, // re-splits on resize / font load
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.4,
                ease: 'power4.out',
                stagger: 0.05,
                delay: i * 0.2,
                scrollTrigger: {
                  trigger: el,
                  start: 'top top+=10%',
                  toggleActions: 'play none none none',
                },
              }),
          });
        });

        const activate = () => {
          gsap.to(title, { autoAlpha: 1, duration: 0.3, ease: 'power3.out' });
          goToPose(el.dataset.pose as PoseName);
        };

        ScrollTrigger.create({
          trigger: el,
          start: 'top top+=10%',
          end: 'bottom top+=10%',
          onEnter: activate,
          onEnterBack: activate,
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative space-y-16">
      {SECTIONS.slice(0, -1).map((s) => (
        <section
          key={s.pose}
          data-pose={s.pose}
          className="relative grid-12 mx-auto h-[200dvh] container"
        >
          <SectionHeader s={s} />
        </section>
      ))}
      <SafetySection s={SECTIONS[SECTIONS.length - 1]} />
    </div>
  );
}

export function SectionHeader({ s }: { s: Section }) {
  return (
    <header
      data-header
      className="top-0 z-10 sticky lg:content-center content-end space-y-4 lg:space-y-6 grid grid-cols-subgrid col-span-full lg:col-span-6 h-screen"
    >
      <span
        data-reveal
        className="col-span-full font-mono text-muted-foreground text-xs uppercase tracking-widest lg:col-auto"
      >
        pose · {s.pose}
      </span>
      <h2
        data-header-title
        className="col-span-full lg:col-span-3 font-heading font-semibold text-3xl sm:text-4xl translate-y-[-0.2ex]"
      >
        {s.title}
      </h2>
      <div className="self-start space-y-4 lg:space-y-6 grid grid-cols-subgrid col-span-full lg:col-span-6 pb-6">
        <p
          data-reveal
          className="col-span-full sm:col-span-4 lg:col-span-3 sm:col-start-3 lg:col-start-2 text-muted-foreground text-sm sm:text-base"
        >
          {s.body}
        </p>
        <p
          data-reveal
          className="col-span-full sm:col-span-4 lg:col-span-3 sm:col-start-3 lg:col-start-4 text-muted-foreground text-sm sm:text-base"
        >
          {s.body2}
        </p>
      </div>
    </header>
  );
}
