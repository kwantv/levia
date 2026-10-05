'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ProductDetail } from './action';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

type Props = {
  product: ProductDetail;
};

function ProductSpecs({ product }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reducedMotion) return;

      const title = section.querySelector<HTMLElement>('[data-specs-title]');

      const description = section.querySelector<HTMLElement>(
        '[data-specs-description]',
      );

      const rows = section.querySelectorAll<HTMLElement>('[data-spec-row]');

      if (!title || !description) return;

      let titleSplit: SplitText | undefined;
      let descriptionSplit: SplitText | undefined;

      const setup = async () => {
        await document.fonts.ready;

        titleSplit = SplitText.create(title, {
          type: 'chars,words',
          mask: 'chars',
        });

        descriptionSplit = SplitText.create(description, {
          type: 'lines',
          mask: 'lines',
        });

        gsap.set(titleSplit.chars, {
          yPercent: 105,
        });

        gsap.set(descriptionSplit.lines, {
          yPercent: 105,
        });

        gsap.set(rows, {
          autoAlpha: 0,
          x: -16,
        });

        gsap.set('[data-specs-eyebrow], [data-specs-count]', {
          autoAlpha: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            once: true,
          },
          defaults: {
            ease: 'power3.out',
          },
        });

        tl.to(
          '[data-specs-eyebrow]',
          {
            autoAlpha: 1,
            duration: 0.25,
          },
          0,
        );

        tl.to(
          titleSplit.chars,
          {
            yPercent: 0,
            duration: 0.38,
            stagger: {
              amount: 0.14,
            },
            onComplete: () => titleSplit?.revert(),
          },
          0.05,
        );

        tl.to(
          descriptionSplit.lines,
          {
            yPercent: 0,
            duration: 0.34,
            stagger: 0.05,
            onComplete: () => descriptionSplit?.revert(),
          },
          0.18,
        );

        tl.to(
          '[data-specs-count]',
          {
            autoAlpha: 1,
            duration: 0.24,
          },
          0.24,
        );

        tl.to(
          rows,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.045,
            ease: 'power2.out',
          },
          0.28,
        );
      };

      setup();

      return () => {
        titleSplit?.revert();
        descriptionSplit?.revert();
      };
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section ref={sectionRef} className="border-border border-t">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
        <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3">
            <div data-specs-eyebrow className="flex items-center gap-3">
              <span className="bg-primary size-1.5" />

              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Specification / 06
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-5 mb-10">
              <div>
                <h2
                  data-specs-title
                  className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em]"
                >
                  Thông số kỹ thuật
                </h2>

                <p
                  data-specs-description
                  className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed"
                >
                  Thông tin chi tiết về kích thước, công suất và các thông số
                  vận hành của {product.title}.
                </p>
              </div>

              <span
                data-specs-count
                className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]"
              >
                {String(product.specs.length).padStart(2, '0')} thông số
              </span>
            </div>

            <div className="border-border border-t">
              {product.specs.map((spec, index) => (
                <div
                  data-spec-row
                  key={spec.label}
                  className="gap-4 grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] py-5 border-border border-b"
                >
                  <span className="font-mono text-[9px] text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="font-medium text-sm">{spec.label}</span>

                  <span className="font-mono text-muted-foreground text-sm sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSpecs;
