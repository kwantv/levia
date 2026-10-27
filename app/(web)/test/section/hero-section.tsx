'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { goToPose } from './poses';
import { useAnnotationStore } from '../component/annotations/annotation-store';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const activate = () => goToPose('intro');

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        markers: true,
        onEnter: activate,
        onEnterBack: activate,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="items-center grid grid-cols-2 mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-dvh container"
    >
      <div className="space-y-4">
        <h1 className="w-fit font-heading text-6xl">The object</h1>
        <p className="max-w-[50ch] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas minus
          atque neque unde excepturi ratione exercitationem dignissimos
          repudiandae placeat. Deserunt doloribus officia quaerat quas, ullam
          unde vitae. Corporis, id accusamus.
        </p>
      </div>
      <div className="mt-20">
        <p className="max-w-[50ch] text-muted-foreground indent-36">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas minus
          atque neque unde excepturi ratione exercitationem dignissimos
          repudiandae placeat.
        </p>
      </div>
    </section>
  );
}
