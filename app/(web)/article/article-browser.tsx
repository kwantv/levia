'use client';

import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState, ViewTransition } from 'react';

gsap.registerPlugin(ScrollTrigger);

type ArticleTag = {
  _id: string;
  title: string;
};

type ArticleItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverSrc?: string | null;
  coverAlt: string;
  publishedAt?: string | null;
  tags: ArticleTag[];
};

type TagFilter = ArticleTag & {
  count: number;
};

interface ArticleBrowserProps {
  articles: ArticleItem[];
  tags: TagFilter[];
}

const ALL_TAGS = 'all';

export default function ArticleBrowser({
  articles,
  tags,
}: ArticleBrowserProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);

  const [activeTag, setActiveTag] = useState(ALL_TAGS);

  const filteredArticles = useMemo(() => {
    if (activeTag === ALL_TAGS) {
      return articles;
    }

    return articles.filter((article) =>
      article.tags.some((tag) => tag._id === activeTag),
    );
  }, [activeTag, articles]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  const selectedTag = tags.find((tag) => tag._id === activeTag);

  const currentIndex =
    activeTag === ALL_TAGS
      ? -1
      : tags.findIndex((tag) => tag._id === activeTag);

  const currentLabel = selectedTag?.title ?? 'Tất cả bài viết';

  const currentDescription =
    activeTag === ALL_TAGS
      ? 'Kiến thức, cảm hứng và góc nhìn dành cho không gian bếp hiện đại'
      : `Khám phá các bài viết thuộc chủ đề ${selectedTag?.title ?? ''}`;

  const prevIndexRef = useRef<number>(currentIndex);
  const prevLabelRef = useRef(currentLabel);
  const prevDescRef = useRef(currentDescription);

  /**
   * Animated browser heading
   *
   * Same directional rolling behaviour used by ProductBrowser.
   */
  useGSAP(
    () => {
      const root = headerRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        prevIndexRef.current = currentIndex;
        prevLabelRef.current = currentLabel;
        prevDescRef.current = currentDescription;
        return;
      }

      const labelWrapper = root.querySelector<HTMLElement>(
        '[data-label-wrapper]',
      );
      const label = labelWrapper?.querySelector<HTMLElement>('h2');

      const descWrapper = root.querySelector<HTMLElement>(
        '[data-desc-wrapper]',
      );
      const desc = descWrapper?.querySelector<HTMLElement>('p');

      if (!labelWrapper || !label || !descWrapper || !desc) return;

      const currentLabelText = label.innerText;
      const currentDescText = desc.innerText;

      if (
        currentLabelText === prevLabelRef.current &&
        currentDescText === prevDescRef.current
      ) {
        return;
      }

      const isNext = currentIndex > prevIndexRef.current;
      const yOffset = 30;

      /*
       * Clone the previous text so the old and new states can
       * cross each other without React having to own both.
       */
      const cloneLabel = document.createElement('h2');

      cloneLabel.className = `${label.className} absolute top-0 left-0 w-full`;
      cloneLabel.innerText = prevLabelRef.current;

      labelWrapper.appendChild(cloneLabel);

      const cloneDesc = document.createElement('p');

      cloneDesc.className = `${desc.className} absolute top-0 left-0 w-full`;
      cloneDesc.innerText = prevDescRef.current;

      descWrapper.appendChild(cloneDesc);

      gsap.set([label, desc], {
        y: isNext ? yOffset : -yOffset,
        opacity: 0,
      });

      gsap.set([labelWrapper, descWrapper], {
        overflow: 'hidden',
      });

      const duration = 0.35;
      const ease = 'power3.inOut';

      const tl = gsap.timeline({
        onComplete: () => {
          cloneLabel.remove();
          cloneDesc.remove();

          labelWrapper.style.overflow = 'visible';
          descWrapper.style.overflow = 'visible';
        },
      });

      tl.to(
        cloneLabel,
        {
          y: isNext ? -yOffset : yOffset,
          opacity: 0,
          duration,
          ease,
        },
        0,
      );

      tl.to(
        label,
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
        },
        0,
      );

      tl.to(
        cloneDesc,
        {
          y: isNext ? -yOffset : yOffset,
          opacity: 0,
          duration,
          ease,
        },
        0,
      );

      tl.to(
        desc,
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
        },
        0,
      );

      prevIndexRef.current = currentIndex;
      prevLabelRef.current = currentLabelText;
      prevDescRef.current = currentDescText;

      return () => {
        tl.kill();

        cloneLabel.remove();
        cloneDesc.remove();
      };
    },
    {
      dependencies: [activeTag],
      scope: headerRef,
    },
  );

  /**
   * Normal article cards
   *
   * The featured article intentionally does not participate in
   * this animation.
   */
  useGSAP(
    () => {
      const root = articlesRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        '[data-article-card]',
        root,
      );

      if (!cards.length) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
          overwrite: true,

          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            once: true,
          },
        },
      );
    },
    {
      dependencies: [activeTag],
      scope: articlesRef,
      revertOnUpdate: true,
    },
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 container">
      {/* BROWSER HEADER */}
      <section ref={headerRef} className="gap-y-6 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary size-1.5" />

            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Tag / {String(currentIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-5 pb-6 border-b">
            <div className="space-y-3">
              <div
                data-label-wrapper
                key={`label-${activeTag}`}
                className="relative"
              >
                <h2 className="font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                  {currentLabel}
                </h2>
              </div>

              <div
                data-desc-wrapper
                key={`desc-${activeTag}`}
                className="relative"
              >
                <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
                  {currentDescription}
                </p>
              </div>
            </div>

            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              {String(filteredArticles.length).padStart(2, '0')} bài viết
            </span>
          </div>
        </div>
      </section>

      {/* FILTER */}
      <div className="grid lg:grid-cols-12 mb-10 sm:mb-14 py-5">
        <div className="lg:col-span-8 lg:col-start-5 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-none">
            <FilterButton
              active={activeTag === ALL_TAGS}
              onClick={() => setActiveTag(ALL_TAGS)}
            >
              <span>Tất cả</span>

              <span className="opacity-40">
                {String(articles.length).padStart(2, '0')}
              </span>
            </FilterButton>

            {tags.map((tag) => (
              <FilterButton
                key={tag._id}
                active={activeTag === tag._id}
                onClick={() => setActiveTag(tag._id)}
              >
                <span>{tag.title}</span>

                <span className="opacity-40">
                  {String(tag.count).padStart(2, '0')}
                </span>
              </FilterButton>
            ))}
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <section className="flex flex-col justify-center items-center border border-border min-h-100 text-center">
          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
            00 / Empty
          </span>

          <p className="mt-4 text-muted-foreground text-sm">
            Chưa có bài viết thuộc chủ đề này.
          </p>
        </section>
      ) : (
        <>
          {/* FEATURED — intentionally unchanged */}
          {featuredArticle && (
            <FeaturedArticle article={featuredArticle} activeTag={activeTag} />
          )}

          {remainingArticles.length > 0 && (
            <section className="mt-16 sm:mt-24">
              <div
                ref={articlesRef}
                className="grid sm:grid-cols-2 lg:grid-cols-4 border-border border-t border-l"
              >
                {remainingArticles.map((article, index) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    index={index + 2}
                    activeTag={activeTag}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'shrink-0 flex items-center gap-3',
        'h-10 px-4 sm:px-5',
        'border-y border-l border-border last:border-r',
        'font-mono text-[10px] uppercase tracking-[0.14em]',
        'transition-colors duration-300 cursor-pointer',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background text-muted-foreground hover:bg-primary/5 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function FeaturedArticle({
  article,
  activeTag,
}: {
  article: ArticleItem;
  activeTag: string;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block border border-white/10 overflow-hidden"
    >
      <article className="grid lg:grid-cols-12 min-h-130">
        {/* Content */}
        <div className="flex flex-col justify-between lg:col-span-5 p-6 sm:p-8 lg:p-10 xl:p-12">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Featured
                </span>
              </div>

              {article.publishedAt && (
                <span className="font-mono text-[10px] text-white/30 tracking-widest">
                  {article.publishedAt}
                </span>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10">
                {article.tags.map((tag) => {
                  const isActive =
                    activeTag !== ALL_TAGS && tag._id === activeTag;

                  return (
                    <span
                      key={tag._id}
                      className={cn(
                        'px-2 py-1',
                        'font-mono text-[9px] uppercase tracking-[0.15em] bg-primary/5',
                        'transition-colors duration-300',
                        isActive
                          ? 'text-primary bg-primary/15'
                          : 'text-muted-foreground',
                      )}
                    >
                      /{tag.title}
                    </span>
                  );
                })}
              </div>
            )}

            <h2 className="mt-6 max-w-2xl font-heading font-medium text-3xl sm:text-4xl xl:text-5xl leading-[1.02] tracking-[-0.04em]">
              {article.title}
            </h2>
          </div>

          <div className="mt-16">
            {article.excerpt && (
              <p className="max-w-md text-white/45 text-sm line-clamp-3 leading-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex justify-between items-end mt-8 pt-5 border-white/10 border-t">
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.16em]">
                Đọc bài viết
              </span>

              <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:col-span-7 bg-[#101010] min-h-90 lg:min-h-full overflow-hidden">
          {article.coverSrc ? (
            <>
              <ViewTransition
                name={`article-${article._id}-cover`}
                share="image-clip"
                default="none"
              >
                <Image
                  src={article.coverSrc}
                  alt={article.coverAlt}
                  fill
                  priority
                  className="brightness-80 group-hover:brightness-100 object-cover transition-[filter] duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </ViewTransition>

              <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-black/35 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({
  article,
  index,
  activeTag,
}: {
  article: ArticleItem;
  index: number;
  activeTag: string;
}) {
  return (
    <Link
      data-article-card
      href={`/article/${article.slug}`}
      className="group flex flex-col bg-background border-border border-r border-b min-w-0"
    >
      <article className="flex flex-col flex-1">
        {/* IMAGE */}
        <div className="relative bg-card aspect-4/3 overflow-hidden">
          {article.coverSrc ? (
            <ViewTransition
              name={`article-${article._id}-cover`}
              share="image-clip"
              default="none"
            >
              <Image
                src={article.coverSrc}
                alt={article.coverAlt}
                fill
                className="brightness-80 group-hover:brightness-100 object-cover transition-[filter,transform] duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </ViewTransition>
          ) : (
            <ImagePlaceholder />
          )}

          <span className="right-4 bottom-4 absolute bg-background/80 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] text-foreground uppercase tracking-[0.16em]">
            {String(index).padStart(2, '0')}
          </span>

          <div className="bottom-0 left-0 absolute bg-primary w-0 group-hover:w-full h-px transition-[width] duration-500 ease-out" />
        </div>

        {/* INFO */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 2).map((tag) => {
                const isActive =
                  activeTag !== ALL_TAGS && tag._id === activeTag;

                return (
                  <span
                    key={tag._id}
                    className={cn(
                      'px-2 py-1',
                      'font-mono text-[9px] uppercase tracking-[0.15em] bg-primary/5',
                      'transition-colors duration-300',
                      isActive
                        ? 'text-primary bg-primary/15'
                        : 'text-muted-foreground',
                    )}
                  >
                    /{tag.title}
                  </span>
                );
              })}
            </div>

            {article.publishedAt && (
              <span className="font-mono text-[9px] text-muted-foreground/50 shrink-0">
                {article.publishedAt}
              </span>
            )}
          </div>

          <h3 className="mt-4 font-heading font-medium group-hover:text-primary text-xl sm:text-2xl leading-[1.1] tracking-tight transition-colors duration-300">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-4 text-muted-foreground text-sm line-clamp-2 leading-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex justify-between items-end gap-6 mt-auto pt-8">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              Đọc bài viết
            </span>

            <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
        Levia / Hình ảnh
      </span>
    </div>
  );
}
