'use client';

import DotBackground from '@/components/dot-background';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { useAfterTransition } from '@/lib/use-after-transition';

import dynamic from 'next/dynamic';
const Canvas = dynamic(() => import('../component/canvas'), { ssr: false });

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const SCREENS = { morph: 1, travel: 1.2, hold: 1 };
const TOTAL = SCREENS.morph + SCREENS.travel + SCREENS.hold;

const products = [
  { title: 'Bếp đôi LV79DI', href: '/product/lv79di', bg: '' }, // the canvas lives here
  { title: 'Product Two', href: '/product', bg: 'bg-emerald-600' },
  { title: 'Product Three', href: '/product', bg: 'bg-amber-600' },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ProductSection() {
  const entered = useAfterTransition();

  const container = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null); // empty placeholder for card 1
  const bgFrameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null); // fixed, clipped
  const innerRef = useRef<HTMLDivElement>(null); // viewport-sized, scaled

  useGSAP(
    () => {
      const section = container.current!;
      const trackEl = track.current!;
      const slot = slotRef.current!;
      const bgFrame = bgFrameRef.current!;
      const frame = frameRef.current!;
      const inner = innerRef.current!;
      const articles = Array.from(trackEl.children) as HTMLElement[];

      // p = 0: fills the viewport. p = 1: sits exactly on the slot.
      const morph = { p: 0 };

      const render = () => {
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        const r = slot.getBoundingClientRect();
        const t = morph.p;

        // current visible rect
        const left = lerp(0, r.left, t);
        const top = lerp(0, r.top, t);
        const width = lerp(vw, r.width, t);
        const height = lerp(vh, r.height, t);

        // cover-scale the viewport-sized canvas into that rect, centered
        const s = Math.max(width / vw, height / vh);
        const dx = left + width / 2 - vw / 2;
        const dy = top + height / 2 - vh / 2;

        const clip = `inset(${top}px ${vw - left - width}px ${vh - top - height}px ${left}px)`;
        const hidden =
          t === 1 && (r.bottom < 0 || r.top > vh) ? 'hidden' : 'visible';

        bgFrame.style.clipPath = clip;
        bgFrame.style.visibility = hidden;

        frame.style.clipPath = clip;
        frame.style.visibility = hidden;

        inner.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${s})`;
      };
      gsap.ticker.add(render);

      // ---------- timelines ----------
      const step = () => articles[1].offsetLeft - articles[0].offsetLeft;
      const startX = () => step() * (articles.length - 1);

      gsap.set(trackEl, { x: startX });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * TOTAL,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl
        // 1. fullscreen canvas -> card 1 (drives the interpolation above)
        .fromTo(
          morph,
          { p: 0 },
          { p: 1, duration: SCREENS.morph, ease: 'power2.inOut' },
        )
        // 2. track slides, cards 2 and 3 enter from the right
        .fromTo(trackEl, { x: startX }, { x: 0, duration: SCREENS.travel })
        // 3. hold
        .to({}, { duration: SCREENS.hold });

      // reveal text animation
      const main = tl.scrollTrigger!;
      const texts = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      const links = gsap.utils.toArray<HTMLElement>('[data-link]');
      const icons = gsap.utils.toArray<HTMLElement>('[data-icon]');
      let remaining = texts.length;

      const allDone = () => {
        gsap.set(links, { pointerEvents: 'auto' });
        gsap.to(icons, { autoAlpha: 1, duration: 0.3, stagger: 0.1 });
      };

      texts.forEach((text, i) => {
        SplitText.create(text, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.4,
              ease: 'power4.out',
              stagger: 0.05,
              delay: i * 0.1,
              scrollTrigger: {
                trigger: section,
                start: () =>
                  main.start +
                  window.innerHeight * (SCREENS.morph + SCREENS.travel),
                once: true,
              },
              onComplete: () => {
                self.revert();
                if (--remaining === 0) allDone();
              },
            }),
        });
      });

      return () => {
        gsap.ticker.remove(render);
      };
    },
    { scope: container },
  );

  return (
    <>
      {/* Always fixed to the viewport, sized/positioned by JS */}
      <div
        ref={bgFrameRef}
        className="z-1 fixed inset-0 bg-background pointer-events-none"
      >
        <DotBackground />
      </div>

      {/* canvas layer: above the annotations, below headers */}
      <div ref={frameRef} className="z-3 fixed inset-0 pointer-events-none">
        <div
          ref={innerRef}
          className="top-0 left-0 absolute w-dvw h-dvh will-change-transform"
        >
          {entered && <Canvas />}
        </div>
      </div>

      <section
        ref={container}
        className="relative bg-black mx-auto pt-[24vh] h-max lg:h-screen lg:overflow-hidden"
      >
        <header className="top-[24vh] lg:absolute inset-x-0 items-start grid-12 mx-auto container">
          <h2
            data-reveal
            className="col-span-4 font-heading font-semibold text-3xl sm:text-4xl"
          >
            Dòng sản phẩm Lorem <br /> ipsum dolor sit amet.
          </h2>
          <p
            data-reveal
            className="col-span-3 text-muted-foreground text-sm sm:text-base"
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
            dignissimos accusamus, quibusdam amet optio rerum eum eveniet iste
            dicta deleniti?
          </p>
          <a
            href="/product"
            data-link
            className="group inline-flex flex-nowrap justify-between justify-self-end items-center gap-4 -col-end-1 hover:border-primary hover:border-b w-max transition-colors pointer-events-none"
          >
            <span
              data-reveal
              className="font-medium text-muted-foreground text-sm uppercase"
            >
              Khám phá các sản phẩm
            </span>

            <ArrowUpRight
              data-icon
              className="invisible size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </header>

        <div
          ref={track}
          className="top-[46vh] lg:absolute inset-x-0 grid-12 mx-auto mt-6 w-full will-change-transform container"
        >
          {products.map((p, i) => (
            <article key={p.title} className="col-span-4">
              <div
                ref={i === 0 ? slotRef : undefined}
                className="relative w-full h-[38vh]"
              >
                {i > 0 && <div className={`absolute inset-0 ${p.bg}`} />}
              </div>
              <a href={p.href} data-reveal>
                <h3 className="mt-3 font-medium">{p.title}</h3>
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
