'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';
import { ArticleDetail } from './action';
import DotGridBackground from '@/components/dot-grid-background';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { playAfterPageTransition } from '@/lib/page-transition';

gsap.registerPlugin(SplitText);

function ArticleHeader({ article }: { article: ArticleDetail }) {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = heroRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      const title = root.querySelector<HTMLElement>('[data-hero-title]');
      const excerpt = root.querySelector<HTMLElement>('[data-hero-excerpt]');

      const metaValues = gsap.utils.toArray<HTMLElement>(
        '[data-hero-meta-value]',
        root,
      );

      const fadeElements = gsap.utils.toArray<HTMLElement>(
        '[data-hero-fade]',
        root,
      );

      if (prefersReducedMotion) {
        gsap.set(
          [title, excerpt, ...metaValues, ...fadeElements].filter(Boolean),
          {
            opacity: 1,
            y: 0,
          },
        );

        return;
      }

      const splits: SplitText[] = [];

      /*
       * TITLE
       * Character reveal with masked lines.
       */
      let titleSplit: SplitText | null = null;

      if (title) {
        titleSplit = SplitText.create(title, {
          type: 'lines,chars',
          mask: 'lines',
          autoSplit: true,
        });

        splits.push(titleSplit);

        gsap.set(titleSplit.chars, {
          yPercent: 110,
          opacity: 0,
        });
      }

      /*
       * EXCERPT
       * Line-by-line reveal.
       */
      let excerptSplit: SplitText | null = null;

      if (excerpt) {
        excerptSplit = SplitText.create(excerpt, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
        });

        splits.push(excerptSplit);

        gsap.set(excerptSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });
      }

      /*
       * AUTHOR / PUBLISHED / UPDATED
       * Subtle character reveal.
       */
      const metaSplits = metaValues.map((element) => {
        const split = SplitText.create(element, {
          type: 'chars',
          mask: 'chars',
        });

        splits.push(split);

        gsap.set(split.chars, {
          yPercent: 100,
          opacity: 0,
        });

        return split;
      });

      /*
       * Everything that's not important enough for SplitText
       * simply fades upward.
       */
      gsap.set(fadeElements, {
        opacity: 0,
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      /*
       * Main headline.
       */
      if (titleSplit) {
        tl.to(titleSplit.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.42,
          stagger: 0.008,
          onComplete: () => titleSplit?.revert(),
        });
      }

      /*
       * Excerpt follows slightly after the title starts.
       */
      if (excerptSplit) {
        tl.to(
          excerptSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.055,
            onComplete: () => excerptSplit?.revert(),
          },
          '<0.16',
        );
      }

      /*
       * Metadata comes in together but with a tiny offset
       * between each field.
       */
      metaSplits.forEach((split) => {
        tl.to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.001,
            onComplete: () => split?.revert(),
          },
          '<',
        );
      });

      /*
       * Peripheral UI first.
       */
      tl.to(
        fadeElements,
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.035,
        },
        '>',
      );

      const cancelPlayBack = playAfterPageTransition(tl);

      return () => {
        cancelPlayBack();
        titleSplit?.revert();
        excerptSplit?.revert();
        splits.forEach((split) => split.revert());
      };
    },
    {
      scope: heroRef,
    },
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      <DotGridBackground />

      {/* Ambient brand glow */}
      <div className="-top-48 -right-40 absolute bg-primary/5 blur-[160px] rounded-full size-162.5 pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 container">
        {/* Top nav */}
        <div className="gap-6 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-4">
            <Link
              href="/article"
              className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Tất cả bài viết
            </Link>
          </div>

          <div className="hidden lg:block lg:col-span-8">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                Knowledge / Article
              </span>

              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                Levia / Kitchen Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Main hero */}
        <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12 mt-14 sm:mt-16">
          {/* Article index */}
          <div className="col-span-12 lg:col-span-3">
            <div data-hero-fade className="flex items-center gap-3">
              <span className="bg-primary size-1.5" />

              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Cẩm nang bếp
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div data-hero-fade className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="bg-primary/10 px-2.5 py-1 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.14em]"
                  >
                    /{tag.title}
                  </span>
                ))}
              </div>
            )}

            <h1
              data-hero-title
              className="max-w-5xl font-heading font-medium text-[clamp(2.75rem,5vw,5rem)] leading-[1.2] tracking-tight"
            >
              {article.title}
            </h1>
          </div>
        </div>

        <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12 mt-10">
          {article.excerpt && (
            <p
              data-hero-excerpt
              className="col-span-12 lg:col-span-3 max-w-xl text-muted-foreground text-base leading-relaxed"
            >
              {article.excerpt}
            </p>
          )}

          <div className="gap-x-4 grid grid-cols-subgrid col-span-12 lg:col-span-8 lg:col-start-5">
            {article.author && (
              <div className="col-span-4 lg:col-span-2">
                <span
                  data-hero-fade
                  className="block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
                >
                  Tác giả
                </span>

                <span data-hero-meta-value className="block mt-2 text-base">
                  {article.author}
                </span>
              </div>
            )}

            {article.publishedAt && (
              <div className="col-span-4 lg:col-span-2">
                <span
                  data-hero-fade
                  className="block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
                >
                  Xuất bản
                </span>

                <span data-hero-meta-value className="block mt-2 text-base">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            )}

            {article.updatedAt && (
              <div className="col-span-4 lg:col-span-2">
                <span
                  data-hero-fade
                  className="block font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
                >
                  Cập nhật
                </span>

                <span data-hero-meta-value className="block mt-2 text-base">
                  {formatDate(article.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArticleHeader;
