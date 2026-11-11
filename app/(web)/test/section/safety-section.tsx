'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { goToPose } from './poses';
import { Section, SectionHeader } from './showcase-section';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TEXTS = [
  'Cảm ứng chống tràn mặt kính',
  'Tự động ngắt khi nồi cạn nước',
  'Cảnh báo khi không có nồi trên bếp',
  'Cảnh báo nhiệt dư vùng nấu',
  'Tự động giảm dòng điện khi quá tải',
  'Khóa trẻ em an toàn tuyệt đối',
];

const MAX_R = 180; // max circle radius (px)
const MIN_R = 60; // min circle radius (px)
const SPIN = 360; // clockwise degrees across the section

export default function SafetySection({ s }: { s: Section }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q('[data-stage]')[0] as HTMLElement;
      const box = q('[data-circle]');
      const dashed = q('[data-dashed]');
      const solid = q('[data-solid]');
      const items = q('[data-item]');
      const n = items.length;

      /* ---------- responsive dimensions (mutable, read by place) ---------- */
      const dim = { R: MAX_R, STEM: 36 };
      const angle = { v: 0 };

      const parts = items.map((el) => {
        const p = gsap.utils.selector(el);
        return { el, dot: p('[data-dot]'), label: p('[data-label]') };
      });

      parts.forEach(({ dot }) => {
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
      });

      const place = (deg: number) =>
        parts.forEach(({ el, label }, i) => {
          const a = ((deg + (i * 360) / n - 90) * Math.PI) / 180;
          const c = Math.cos(a);
          const sn = Math.sin(a);
          gsap.set(el, { x: c * dim.R, y: sn * dim.R });
          // anchors the label's nearest edge to the stem tip, so it never flips
          gsap.set(label, {
            x: c * dim.STEM,
            y: sn * dim.STEM,
            xPercent: -50 + 50 * c,
            yPercent: -50 + 50 * sn,
          });
        });

      const layout = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (!w || !h) return;

        const labelW = w < 480 ? 80 : w < 720 ? 128 : 192;
        const stem = w < 480 ? 14 : w < 720 ? 24 : 36;

        // leave room on both axes for stem + label
        const fitW = w / 2 - stem - labelW - 16;
        const fitH = h / 2 - stem - 24;
        const R = gsap.utils.clamp(MIN_R, MAX_R, Math.min(fitW, fitH));

        dim.R = R;
        dim.STEM = stem;

        gsap.set(box, { width: R * 2, height: R * 2 });
        parts.forEach(({ label }) => gsap.set(label, { maxWidth: labelW }));
        place(angle.v);
      };

      const ro = new ResizeObserver(layout);
      ro.observe(stage);
      layout();

      /* ---------- enter: dashed -> solid, subtle scale ---------- */
      const swap = gsap
        .timeline({ paused: true })
        .to(dashed, { autoAlpha: 0, duration: 0.01 }, 0)
        .to(solid, { autoAlpha: 1, duration: 0.01 }, 0)
        .to(box, { scale: 1.1, duration: 0.2, ease: 'power2.out' }, 0);

      let pending: gsap.core.Tween | undefined;
      const play = () => {
        pending?.kill();
        pending = gsap.delayedCall(0.8, () => swap.play());
      };
      const back = () => {
        pending?.kill();
        swap.reverse();
      };

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        onEnter: play,
        onEnterBack: play,
        onLeaveBack: back,
      });

      /* ---------- scroll: rotate clockwise + reveal one by one ---------- */
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

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=10%',
        end: 'bottom top+=10%',
        onEnter: () => goToPose(s.pose),
        onEnterBack: () => goToPose(s.pose),
      });

      return () => ro.disconnect();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-pose={s.pose}
      className="relative grid-12 mx-auto h-[300vh] container"
    >
      <div className="z-2 absolute inset-0 grid-12 pointer-events-auto">
        {/* full width on small screens, right half from lg up */}
        <div
          data-stage
          className="top-0 sticky col-span-full lg:col-span-6 lg:col-start-7 h-screen"
        >
          {/* size-90 is only a fallback; layout() sets width/height from the stage */}
          <div
            data-circle
            className="top-1/3 lg:top-1/2 left-1/2 absolute size-90 -translate-1/2"
          >
            <svg viewBox="0 0 360 360" className="size-full overflow-visible">
              <circle
                data-dashed
                cx={180}
                cy={180}
                r={179}
                fill="none"
                className="text-muted-foreground/60"
                stroke="currentColor"
                strokeDasharray="4 8"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                data-solid
                cx={180}
                cy={180}
                r={179}
                fill="none"
                stroke="currentColor"
                className="invisible text-muted-foreground"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

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
                    className="top-0 left-0 absolute size-3 sm:size-4 origin-center"
                  />
                  <p
                    data-label
                    className="top-0 left-0 absolute w-[12ch] text-muted-foreground text-xs lg:text-sm pointer-events-auto"
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
