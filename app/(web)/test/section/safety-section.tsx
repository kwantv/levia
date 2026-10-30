'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { goToPose, type PoseName } from './poses';
import { SectionHeader } from './showcase-section';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TEXTS = [
  'Cảm ứng chống tràn mặt kính',
  'Tự động ngắt khi nồi cạn nước',
  'Cảnh báo khi không có nồi trên bếp',
  'Cảnh báo nhiệt dư vùng nấu',
  'Tự động giảm dòng điện khi quá tải',
  'Khóa trẻ em an toàn tuyệt đối',
];

const R = 180; // circle radius (px)
const STEM = 36; // stem length (px)
const SPIN = 360; // clockwise degrees across the section

type Section = {
  pose: PoseName;
  title: string;
  body: string;
  options: string[];
};

export default function SafetySection({ s }: { s: Section }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const box = q('[data-circle]');
      const dashed = q('[data-dashed]');
      const solid = q('[data-solid]');
      const items = q('[data-item]');
      const n = items.length;

      /* ---------- items follow an angle around the circle ---------- */
      const parts = items.map((el) => {
        const p = gsap.utils.selector(el);
        return {
          el,
          dot: p('[data-dot]'),
          label: p('[data-label]'),
        };
      });

      parts.forEach(({ dot }) => {
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
      });

      const place = (deg: number) =>
        parts.forEach(({ el, label }, i) => {
          const a = ((deg + (i * 360) / n - 90) * Math.PI) / 180;
          const c = Math.cos(a);
          const s = Math.sin(a);
          gsap.set(el, { x: c * R, y: s * R });
          // anchors the label's nearest edge to the stem tip, so it never flips
          gsap.set(label, {
            x: c * STEM,
            y: s * STEM,
            xPercent: -50 + 50 * c,
            yPercent: -50 + 50 * s,
          });
        });
      place(0);

      /* ---------- enter: dashed -> solid, subtle scale ---------- */
      const swap = gsap
        .timeline({ paused: true, delay: 0.8 })
        .to(dashed, { autoAlpha: 0, duration: 0.01 }, 0)
        .to(solid, { autoAlpha: 1, duration: 0.01 }, 0)
        .to(box, { scale: 1.1, duration: 0.2, ease: 'power2.out' }, 0);

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        onEnter: () => swap.play(),
        onEnterBack: () => swap.play(),
        onLeaveBack: () => swap.reverse(),
      });

      /* ---------- scroll: rotate clockwise + reveal one by one ---------- */
      const angle = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      tl.to(angle, { v: SPIN, duration: 1, onUpdate: () => place(angle.v) }, 0);

      parts.forEach(({ el, label }, i) => {
        const order = n - i;
        const t = 0.05 + order * 0.1;

        tl.to(el, { autoAlpha: 1, duration: 0.01 }, t).fromTo(
          label,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.1 },
          t,
        );
      });

      // keep the pose behavior the other sections have
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        onEnter: () => goToPose(s.pose),
        onEnterBack: () => goToPose(s.pose),
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-pose={s.pose}
      className="relative mx-auto px-4 sm:px-6 lg:px-8 h-[300vh] container"
    >
      {/* stage: spans the whole section, sticky child stays on screen while scrolling */}
      <div className="-z-10 absolute inset-0 pointer-events-none">
        <div className="top-16 lg:top-32 sticky h-screen">
          <div
            data-circle
            className="top-[calc(50%-4rem)] lg:top-[calc(50%-8rem)] left-2/3 absolute size-90 -translate-x-1/2 -translate-y-1/2"
          >
            <svg viewBox="0 0 360 360" className="size-full overflow-visible">
              <circle
                data-dashed
                cx={180}
                cy={180}
                r={R - 1}
                fill="none"
                className="text-muted-foreground/60"
                stroke="currentColor"
                strokeDasharray="4 8"
              />
              <circle
                data-solid
                cx={180}
                cy={180}
                r={R - 1}
                fill="none"
                stroke="currentColor"
                className="invisible text-muted-foreground"
              />
            </svg>

            {/* origin = circle center */}
            <div className="top-1/2 left-1/2 absolute font-mono text-foreground">
              {TEXTS.map((t) => (
                <div
                  key={t}
                  data-item
                  className="invisible top-0 left-0 absolute"
                >
                  <X
                    data-dot
                    strokeWidth={1}
                    className="top-0 left-0 absolute size-4 origin-center"
                  />
                  <p
                    data-label
                    className="top-0 left-0 absolute w-max max-w-48 text-sm"
                  >
                    {t}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionHeader s={s} />
    </section>
  );
}
