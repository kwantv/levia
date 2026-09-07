'use client';

import type { ContentHeading } from '@/sanity/lib/content-headings';
import { List } from 'lucide-react';
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
    window.addEventListener('scroll', updateActiveHeading, { passive: true });

    return () => window.removeEventListener('scroll', updateActiveHeading);
  }, [headings]);

  function navigateToHeading(id: string) {
    const element = document.getElementById(id);
    if (!element) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.history.pushState(null, '', `#${id}`);
    element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setActiveId(id);
  }

  return (
    <nav aria-label="Mục lục bài viết" className="p-5 border border-border">
      <h2 className="flex items-center gap-2 font-semibold text-foreground text-sm">
        <List className="size-4 text-primary" />
        Mục lục
      </h2>
      <ol className="space-y-2 mt-4">
        {headings.map((heading) => (
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
              aria-current={activeId === heading.id ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigateToHeading(heading.id);
              }}
              className={
                activeId === heading.id
                  ? 'block border-primary border-l-2 pl-3 font-medium text-primary text-sm'
                  : 'block border-border border-l pl-3 text-muted-foreground hover:text-foreground text-sm transition-colors'
              }
              replace
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
