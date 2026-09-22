'use client';

import type { ContentHeading } from '@/sanity/lib/content-headings';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type TableOfContentsProps = {
  headings: ContentHeading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');

  useEffect(() => {
    const updateActiveHeading = () => {
      const activeHeading = headings.reduce<ContentHeading | null>(
        (current, heading) => {
          const element = document.getElementById(heading.id);

          return element && element.getBoundingClientRect().top <= 160
            ? heading
            : current;
        },
        null,
      );

      setActiveId(activeHeading?.id ?? headings[0]?.id ?? '');
    };

    updateActiveHeading();

    window.addEventListener('scroll', updateActiveHeading, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveHeading);
    };
  }, [headings]);

  function navigateToHeading(id: string) {
    const element = document.getElementById(id);

    if (!element) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.history.pushState(null, '', `#${id}`);

    element.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    setActiveId(id);
  }

  return (
    <nav aria-label="Mục lục bài viết">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-border border-b">
        <div className="flex items-center gap-3">
          <span className="bg-primary size-1.5" />

          <h2 className="font-mono text-[10px] text-foreground uppercase tracking-[0.2em]">
            Mục lục
          </h2>
        </div>

        <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.18em]">
          Index / 01
        </span>
      </div>

      {/* Items */}
      <ol className="mt-2">
        {headings.map((heading, index) => {
          const active = activeId === heading.id;

          return (
            <li
              key={heading.key}
              className={
                heading.level === 3
                  ? 'pl-3'
                  : heading.level === 4
                    ? 'pl-6'
                    : undefined
              }
            >
              <Link
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  navigateToHeading(heading.id);
                }}
                replace
                className={[
                  'group relative grid grid-cols-[2rem_1fr] gap-2 py-3',
                  'border-border border-b',
                  'text-sm transition-colors',
                  active
                    ? 'text-foreground border-primary'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                <span
                  className={[
                    'font-mono text-[9px] transition-colors',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground/40 group-hover:text-muted-foreground',
                  ].join(' ')}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="leading-snug">{heading.text}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.18em]">
        Levia / Navigation
      </p>
    </nav>
  );
}
