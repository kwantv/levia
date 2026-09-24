'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

  return (
    <>
      {/* FILTER */}
      <section className="border-white/10 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <div className="gap-6 grid lg:grid-cols-12 py-8">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 h-10 font-mono text-[10px] text-white/35 uppercase tracking-[0.2em]">
                Chủ đề
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="flex flex-wrap gap-px bg-border border border-border w-fit max-w-full">
                <FilterButton
                  active={activeTag === ALL_TAGS}
                  onClick={() => setActiveTag(ALL_TAGS)}
                >
                  Tất cả
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
                    {tag.title}

                    <span className="opacity-40">
                      {String(tag.count).padStart(2, '0')}
                    </span>
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 container">
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col justify-center items-center border border-white/10 min-h-100 text-center">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.25em]">
              00 / Empty
            </span>

            <p className="mt-5 text-white/50">
              Chưa có bài viết thuộc chủ đề này.
            </p>
          </div>
        ) : (
          <>
            {featuredArticle && <FeaturedArticle article={featuredArticle} />}

            {remainingArticles.length > 0 && (
              <div className="mt-16 sm:mt-24">
                {/* Section header */}
                <div className="flex justify-between items-end mb-7 pb-4 border-white/10 border-b">
                  <span className="font-mono text-[10px] text-white/35 uppercase tracking-[0.22em]">
                    Bài viết mới
                  </span>

                  <span className="font-mono text-[10px] text-white/25 uppercase tracking-[0.22em]">
                    {String(filteredArticles.length).padStart(2, '0')} bài viết
                  </span>
                </div>

                {/* Swiss grid */}
                <div className="gap-px grid sm:grid-cols-2 lg:grid-cols-3 bg-white/10 border border-white/10">
                  {remainingArticles.map((article, index) => {
                    const isWide = index % 7 === 3;

                    return (
                      <ArticleCard
                        key={article._id}
                        article={article}
                        index={index + 2}
                        wide={isWide}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
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
        'flex items-center gap-3 px-4 sm:px-5 h-10',
        'font-mono text-[10px] uppercase tracking-[0.14em]',
        'transition-all duration-300',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-background text-muted-foreground hover:bg-primary/5 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function FeaturedArticle({ article }: { article: ArticleItem }) {
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
              <span className="font-mono text-[10px] text-white/35 uppercase tracking-[0.22em]">
                01 / Featured
              </span>

              {article.publishedAt && (
                <span className="font-mono text-[10px] text-white/30 tracking-widest">
                  {article.publishedAt}
                </span>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10">
                {article.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="bg-primary px-2.5 py-1 font-mono text-[9px] text-primary-foreground uppercase tracking-[0.14em]"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}

            <h2 className="mt-6 max-w-2xl font-heading font-medium text-3xl sm:text-4xl xl:text-5xl leading-[1.02] tracking-[-0.04em]">
              {article.title}
            </h2>
          </div>

          <div className="mt-16">
            {article.excerpt && (
              <p className="max-w-md text-white/45 text-sm leading-6">
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
              <Image
                src={article.coverSrc}
                alt={article.coverAlt}
                fill
                priority
                className="object-cover scale-[1.01] group-hover:scale-[1.035] transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-black/35 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            <ImagePlaceholder />
          )}

          <span className="right-5 bottom-5 absolute font-mono text-[9px] text-white/40 uppercase tracking-[0.2em]">
            Levia / Editorial
          </span>
        </div>
      </article>
    </Link>
  );
}

function ArticleCard({
  article,
  index,
  wide,
}: {
  article: ArticleItem;
  index: number;
  wide?: boolean;
}) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className={[
        'group flex flex-col bg-[#080808]',
        'transition-colors duration-300 hover:bg-[#0d0d0d]',
        wide ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      {/* Image */}
      <div
        className={[
          'relative bg-[#101010] overflow-hidden',
          wide ? 'aspect-16/7' : 'aspect-4/3',
        ].join(' ')}
      >
        {article.coverSrc ? (
          <Image
            src={article.coverSrc}
            alt={article.coverAlt}
            fill
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes={
              wide
                ? '(max-width: 1024px) 100vw, 66vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
          />
        ) : (
          <ImagePlaceholder />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        <span className="top-4 left-4 absolute flex justify-center items-center bg-black/70 backdrop-blur-sm size-8 font-mono text-[9px] text-white/70">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag._id}
                className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em]"
              >
                /{tag.title}
              </span>
            ))}
          </div>

          {article.publishedAt && (
            <span className="font-mono text-[9px] text-white/25 shrink-0">
              {article.publishedAt}
            </span>
          )}
        </div>

        <h3
          className={[
            'mt-6 font-heading font-medium tracking-tight',
            'group-hover:text-white text-white/85 transition-colors',
            wide
              ? 'max-w-3xl text-2xl sm:text-3xl lg:text-4xl leading-[1.05]'
              : 'text-xl leading-[1.15]',
          ].join(' ')}
        >
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="mt-5 max-w-xl text-white/40 text-sm line-clamp-2 leading-6">
            {article.excerpt}
          </p>
        )}

        <div className="flex justify-between items-center mt-auto pt-8">
          <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.18em]">
            Đọc bài viết
          </span>

          <ArrowUpRight className="size-4 text-white/35 group-hover:text-white transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
        </div>
      </div>
    </Link>
  );
}

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em]">
        Levia / Hình ảnh
      </span>
    </div>
  );
}
