'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { playAfterPageTransition } from '@/lib/page-transition';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type ProductMetaProps = {
  product: {
    sku: string;
    title: string;
    desc?: string | null;
    price?: number | null;
    category?: {
      title: string;
    } | null;
    specs: {
      label: string;
      value: string;
    }[];
  };
};

export function ProductMeta({ product }: ProductMetaProps) {
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = metaRef.current;
      if (!root) return;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reducedMotion) return;

      const title = root.querySelector<HTMLElement>('[data-meta-title]');
      const description = root.querySelector<HTMLElement>(
        '[data-meta-description]',
      );
      const price = root.querySelector<HTMLElement>('[data-meta-price]');
      const specs = root.querySelectorAll<HTMLElement>('[data-meta-spec]');

      if (!title || !description) return;

      const titleSplit = SplitText.create(title, {
        type: 'chars,words',
        mask: 'chars',
      });

      const descriptionSplit = SplitText.create(description, {
        type: 'lines',
        mask: 'lines',
      });

      /*
       * Set before timeline starts so nothing briefly flashes.
       */
      gsap.set(titleSplit.chars, {
        yPercent: 105,
      });

      gsap.set(descriptionSplit.lines, {
        yPercent: 105,
      });

      gsap.set(specs, {
        autoAlpha: 0,
        x: -14,
      });

      gsap.set('[data-meta-eyebrow], [data-meta-category], [data-meta-cta]', {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      tl.to(
        '[data-meta-eyebrow], [data-meta-category]',
        {
          autoAlpha: 1,
          duration: 0.25,
          stagger: 0.04,
        },
        0,
      );

      tl.to(
        titleSplit.chars,
        {
          yPercent: 0,
          duration: 0.38,
          stagger: {
            amount: 0.16,
          },
          onComplete: () => titleSplit?.revert(),
        },
        0.06,
      );

      tl.to(
        descriptionSplit.lines,
        {
          yPercent: 0,
          duration: 0.36,
          stagger: 0.055,
          onComplete: () => descriptionSplit?.revert(),
        },
        0.22,
      );

      if (specs.length) {
        tl.to(
          specs,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.045,
            ease: 'power2.out',
          },
          0.32,
        );
      }

      /*
       * Price scramble.
       */
      if (price) {
        const finalPrice = price.textContent ?? '';

        tl.fromTo(
          price,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.01,
          },
          0.42,
        ).to(
          price,
          {
            duration: 0.55,
            scrambleText: {
              text: finalPrice,
              chars: '0123456789.',
              speed: 0.5,
              revealDelay: 0.05,
              tweenLength: false,
            },
            ease: 'none',
          },
          0.42,
        );
      }

      tl.to(
        '[data-meta-cta]',
        {
          autoAlpha: 1,
          duration: 0.28,
        },
        0.48,
      );

      const cancelPlayBack = playAfterPageTransition(tl);

      return () => {
        cancelPlayBack();
        tl?.kill();
        titleSplit?.revert();
        descriptionSplit?.revert();
      };
    },
    {
      scope: metaRef,
    },
  );

  return (
    <div ref={metaRef} className="top-16 lg:sticky flex flex-col self-start">
      <div>
        <div data-meta-eyebrow className="flex items-center gap-3">
          <span className="bg-primary size-1.5" />

          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Product / {product.sku}
          </span>
        </div>

        {product.category && (
          <p
            data-meta-category
            className="mt-12 font-mono text-[9px] text-primary uppercase tracking-[0.18em]"
          >
            {product.category.title}
          </p>
        )}

        <h1
          data-meta-title
          className="mt-4 max-w-xl font-heading font-medium text-[clamp(3rem,4vw,4rem)] leading-[1.3] tracking-[-0.055em]"
        >
          {product.title}
        </h1>

        <p
          data-meta-description
          className="mt-7 max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]"
        >
          {product.desc}
        </p>
      </div>

      <div className="hidden lg:block">
        {product.specs.length > 0 && (
          <div className="mt-12 border-border border-t">
            {product.specs.slice(0, 4).map((spec, index) => (
              <div
                data-meta-spec
                key={spec.label}
                className="gap-4 grid grid-cols-[2rem_minmax(0,1fr)_auto] py-4 border-border border-b"
              >
                <span className="font-mono text-[9px] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="text-muted-foreground text-sm">
                  {spec.label}
                </span>

                <span className="font-mono text-sm text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 mt-12">
        {product.price != null && (
          <div>
            <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              Giá niêm yết
            </span>

            <span
              data-meta-price
              className="block mt-2 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.03em]"
            >
              {product.price.toLocaleString('vi-VN')}

              <span className="ml-1 text-muted-foreground text-lg">₫</span>
            </span>
          </div>
        )}

        <Link
          data-meta-cta
          href="/agency"
          className="group flex justify-between items-center gap-6"
        >
          <div>
            <span className="font-medium text-sm">Tìm đại lý gần bạn</span>

            <p className="mt-1 text-muted-foreground text-xs">
              Trải nghiệm sản phẩm trực tiếp tại showroom Levia.
            </p>
          </div>

          <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 shrink-0">
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
          </div>
        </Link>
      </div>
    </div>
  );
}
