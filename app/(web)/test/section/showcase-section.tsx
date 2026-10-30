'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { AnnotationId } from '../component/annotations/annotation-layer';
import { goToPose, type PoseName } from './poses';
import SafetySection from './safety-section';

gsap.registerPlugin(ScrollTrigger);

export type Section = {
  pose: PoseName;
  annotation?: AnnotationId;
  title: string;
  body: string;
  options: string[];
};

const SECTIONS: Section[] = [
  {
    pose: 'hero',
    annotation: 'ruler',

    title: 'Hero',
    body: 'Absolute camera view with an overshooting ease, and a bouncy spring on the object.',
    options: [
      'view { azimuth, polar, distance, fov }',
      "duration: 1.6, ease: 'easeOutBack'",
      'rotation + config { tension: 120, friction: 14 }',
    ],
  },
  {
    pose: 'detail',

    title: 'Detail',
    body: 'Relative moves from wherever things currently are, with a stiff spring.',
    options: [
      'by { azimuth, distance, fov }',
      "duration: 2, ease: 'easeInOutQuart'",
      'rotateBy + config { tension: 300, friction: 30 }',
    ],
  },
  {
    pose: 'cut',

    title: 'Hard cut',
    body: 'The camera jumps instantly and pans its look-at point. The object keeps floating on a slow spring.',
    options: [
      'view { target: [0, 0.5, 0] }',
      'immediate: true (camera only)',
      'rotation + config { tension: 60, friction: 20 }',
    ],
  },
  {
    pose: 'wide',
    title: 'Wide',
    body: 'A long linear dolly-out with a wide lens, while the object spins on the default spring.',
    options: [
      'view { distance: 11, fov: 70 }',
      "duration: 3, ease: 'linear'",
      'rotation: [0, 360, 0] (default spring)',
    ],
  },
];

export default function Page() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-pose]').forEach((el) => {
        const title = el.querySelector('[data-header-title]');
        const subtitle = el.querySelector('[data-header-subtitle]');

        gsap.set(title, {
          autoAlpha: 0.3,
        });

        gsap.set(subtitle, {
          opacity: 0,
          y: 40,
        });

        const activate = () => {
          gsap.to(title, {
            autoAlpha: 1,
            duration: 0.3,
            ease: 'power3.out',
          });

          gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          });

          const name = el.dataset.pose as PoseName;
          goToPose(name);
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
    <div ref={root} className="relative space-y-16 pointer-events-none">
      {SECTIONS.slice(0, -1).map((s) => (
        <section
          key={s.pose}
          data-pose={s.pose}
          className="relative mx-auto px-4 sm:px-6 lg:px-8 h-[200dvh] container"
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
      className="top-16 lg:top-32 sticky max-w-md pointer-events-auto"
    >
      <span className="mb-1 font-mono text-muted-foreground text-xs uppercase tracking-widest">
        pose · {s.pose}
      </span>
      <h2
        data-header-title
        className="mb-3 font-heading font-semibold text-4xl"
      >
        {s.title}
      </h2>
      <div data-header-subtitle className="space-y-3">
        <p className="text-muted-foreground">{s.body}</p>
        <ul className="space-y-1 font-mono text-muted-foreground text-xs">
          {s.options.map((o) => (
            <li key={o}>• {o}</li>
          ))}
        </ul>
      </div>
    </header>
  );
}
