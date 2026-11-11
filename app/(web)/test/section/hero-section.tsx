'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { goToPose } from './poses';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const activate = () => goToPose('hero');

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        onEnter: activate,
        onEnterBack: activate,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="z-10 relative flex flex-col gap-6 lg:gap-8 mx-auto pb-6 sm:pb-10 lg:pb-16 h-[calc(100vh-4rem)] lg:pointer-events-none container"
    >
      {/* Texts around object (desktop only; on smaller screens this space is left for the object) */}
      <div className="flex-1 grid-12">
        <div className="grid grid-cols-subgrid grid-rows-3 col-span-full lg:col-span-6 lg:col-start-7 font-mono text-muted-foreground text-xs sm:text-sm uppercase">
          <div className="relative place-self-end p-4 row-[1/2] col-[3/5] sm:col-[5/7] lg:col-[5/6]">
            <Plus className="absolute inset-0 stroke-1 size-6 text-primary origin-center -translate-1/2" />
            <span className="pointer-events-auto">
              Bếp từ Lorem ipsum dolor sit amet.
            </span>
          </div>
          <div className="relative p-4 row-[2/3] col-[1/3] sm:col-[1/3] lg:col-[1/2]">
            <span className="pointer-events-auto">
              lv79di Lorem ipsum dolor sit amet.
            </span>
          </div>
          <div className="relative p-4 row-[3/4] col-[2/4] sm:col-[2/4] lg:col-[2/3]">
            <Plus className="absolute inset-0 stroke-1 size-6 text-primary origin-center -translate-1/2" />
            <span className="pointer-events-auto">
              Tương tác Lorem ipsum dolor sit amet.
            </span>
          </div>
        </div>
      </div>

      <div className="flex-0 content-start gap-y-6 lg:gap-y-0 grid-12 size-full">
        {/* Headline */}
        <h1 className="col-span-full lg:col-span-6 font-heading font-medium text-4xl sm:text-6xl lg:text-8xl leading-[1.2] tracking-tight translate-y-[-0.5ex] pointer-events-auto">
          Định nghĩa
          <br /> lại căn bếp Việt.
        </h1>

        <div className="gap-y-6 grid grid-cols-subgrid col-span-full lg:col-span-6">
          {/* Description */}
          <p className="col-span-full lg:col-span-3 text-muted-foreground text-sm sm:text-base pointer-events-auto">
            Levia mang công nghệ và tư duy thiết kế hiện đại vào gian bếp Việt.
            Tạo nên trải nghiệm nấu nướng tinh tế, trực quan và đầy cảm hứng.
          </p>

          {/* CTAs */}
          <div className="flex sm:flex-row flex-col lg:justify-self-end items-stretch sm:items-start gap-3 col-span-full lg:col-span-3">
            <Link
              href="#products"
              className="group inline-flex justify-between sm:justify-start items-center gap-4 bg-primary hover:bg-primary/90 px-5 py-3 font-medium text-primary-foreground text-xs uppercase transition-colors pointer-events-auto"
            >
              Khám phá sản phẩm
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="#technology"
              className="group inline-flex justify-between sm:justify-start items-center gap-4 px-5 py-3 border border-foreground/20 hover:border-primary font-medium hover:text-primary text-xs uppercase transition-colors pointer-events-auto"
            >
              Khám phá Levia
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
          </div>

          <p className="inline-flex lg:justify-self-end items-center gap-4 col-span-full text-muted-foreground/60 text-xs lg:text-right uppercase tracking-widest">
            <ArrowDown className="size-4" />
            Cuộn xuống để khám phá
          </p>
        </div>
      </div>
    </section>
  );
}
