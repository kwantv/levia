'use client';

import DotGridBackground from '@/components/dot-grid-background';
import { usePageIntro } from '@/lib/use-page-intro';
import { useRef } from 'react';

type HeroStat = {
  label: string;
  value: string | number;

  /**
   * Enable ScrambleTextPlugin for this value.
   * Useful for numeric statistics.
   */
  scramble?: boolean;

  /**
   * Optional custom character set.
   *
   * Defaults to 0123456789 inside usePageIntro().
   */
  scrambleChars?: string;
};

interface ListingHeroProps {
  label: string;

  /**
   * Main part before the highlighted text.
   *
   * Example:
   * "Công nghệ cho"
   */
  title: string;

  /**
   * Gold highlighted portion.
   *
   * Example:
   * "căn bếp hiện đại"
   */
  accent: string;

  /**
   * Whether accent starts on a new line.
   */
  breakBeforeAccent?: boolean;

  descriptions: [string, string];

  stats: [HeroStat, HeroStat];
}

export function ListingHero({
  label,
  title,
  accent,
  breakBeforeAccent = false,
  descriptions,
  stats,
}: ListingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  usePageIntro({
    scope: sectionRef,
  });

  return (
    <section
      ref={sectionRef}
      className="relative border-border border-b overflow-hidden"
    >
      <DotGridBackground />

      {/* Ambient gold accent */}
      <div className="-top-56 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-175 pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20 container">
        <div className="gap-y-12 lg:gap-y-16 grid grid-cols-12">
          {/* Label (left, row 1) */}
          <div className="col-span-12 lg:col-span-3 lg:col-start-1 lg:row-start-1">
            <div data-intro-label className="flex items-center gap-3">
              <span className="bg-primary size-1.5 shrink-0" />

              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                {label}
              </span>
            </div>
          </div>

          {/* Title (right, row 1) */}
          <div className="col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <h1
              data-intro-title
              className="max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,8rem)] leading-[1.2] tracking-tight"
            >
              {title}

              {breakBeforeAccent ? <br /> : ' '}

              <span className="text-primary">{accent}</span>
            </h1>
          </div>

          {/* Descriptions (right, row 2) */}
          <div className="gap-8 grid sm:grid-cols-2 col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-2">
            {descriptions.map((description, index) => (
              <p
                key={index}
                data-intro-subtitle
                className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed"
              >
                {description}
              </p>
            ))}
          </div>

          {/* Statistics (left, row 2) */}
          <div className="self-start gap-px grid grid-cols-2 col-span-12 lg:col-span-4 lg:col-start-1 lg:row-start-2">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  {stat.label}
                </span>

                <span
                  {...(stat.scramble
                    ? {
                        'data-intro-scramble': '',
                        'data-intro-scramble-chars': stat.scrambleChars,
                      }
                    : {})}
                  className="block mt-3 font-heading font-light tabular-nums text-3xl"
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
