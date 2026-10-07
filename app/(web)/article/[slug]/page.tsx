import { getContentHeadings } from '@/sanity/lib/content-headings';
import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { getAllArticleSlugs, getArticleBySlug } from './action';
import ArticleHeader from './article-header';
import { TableOfContents } from './table-of-contents';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Không tìm thấy — Levia',
    };
  }

  return {
    title: article.seoTitle || `${article.title} — Levia`,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords?.join(', '),
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const coverSrc = getImageUrl(article.coverImage ?? undefined, 1800);
  const headings = getContentHeadings(article.content);

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}
      <ArticleHeader article={article} />

      {/* ───────────────── COVER ───────────────── */}
      {coverSrc && (
        <section className="mx-auto lg:px-8 lg:container">
          <div className="relative border-border lg:border-l">
            {/* image */}
            <div className="relative bg-card aspect-16/8 lg:aspect-16/7 overflow-hidden">
              <ViewTransition
                name={`article-${article._id}-cover`}
                share="image-clip"
                default="none"
              >
                <Image
                  src={coverSrc}
                  alt={article.coverImage?.alt || article.title}
                  fill
                  fetchPriority="high"
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </ViewTransition>

              <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent pointer-events-none" />

              {/* technical corner marks */}
              <span className="top-5 left-5 absolute bg-primary size-2" />
            </div>

            {/* image footer */}
            <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 h-12 container">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                Levia / editorial
              </span>

              <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.18em]">
                01 / Cover
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── ARTICLE BODY ───────────────── */}
      {article.content && article.content.length > 0 && (
        <section className="border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
            <div className="gap-0 grid lg:grid-cols-12">
              {/* TOC */}
              {headings.length > 0 && (
                <aside className="lg:col-span-4 lg:py-24 pt-10 lg:pl-8 lg:border-border lg:border-l">
                  <div className="top-24 lg:sticky">
                    <TableOfContents headings={headings} />
                  </div>
                </aside>
              )}

              {/* Content */}
              <article className="lg:col-span-8 lg:px-10 xl:px-14 py-8 sm:pb-20 lg:pb-24">
                <div className="prose-blockquote:bg-primary/4 dark:prose-invert prose-h2:mt-16 prose-h3:mt-10 prose-h2:mb-6 prose-h3:mb-4 prose-blockquote:px-6 prose-blockquote:py-4 prose-img:border prose-blockquote:border-primary prose-hr:border-border prose-img:border-border max-w-none prose-headings:font-heading prose-headings:font-medium prose-strong:font-medium prose-a:text-primary prose-blockquote:text-foreground prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-[15px] prose-p:text-muted-foreground prose-strong:text-foreground sm:prose-p:text-base prose-h3:text-xl sm:prose-h3:text-2xl prose-h2:text-3xl sm:prose-h2:text-4xl hover:prose-a:underline prose-a:no-underline prose-blockquote:not-italic prose-li:leading-7 prose-p:leading-[1.85] prose-headings:tracking-tight prose prose-neutral">
                  <PortableText
                    value={article.content}
                    components={components}
                  />
                </div>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── FAQ ───────────────── */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="bg-card/40">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
            <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
              <div className="col-span-12 lg:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary size-1.5" />

                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    FAQ / 01
                  </span>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                <div className="flex justify-between items-end gap-6 mb-10">
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em]">
                    Câu hỏi liên quan
                  </h2>

                  <span className="hidden sm:block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                    {String(article.faqs.length).padStart(2, '0')} câu hỏi
                  </span>
                </div>

                <div className="border-border border-t">
                  {article.faqs.map((faq, index) => (
                    <div
                      key={faq._key}
                      className="gap-5 grid sm:grid-cols-[3rem_1fr] py-7 sm:py-8 border-border border-b"
                    >
                      <span className="pt-1 font-mono text-[10px] text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <h3 className="font-heading font-medium text-lg sm:text-xl tracking-[-0.02em]">
                          {faq.label}
                        </h3>

                        <p className="mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                          {faq.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── BACK CTA ───────────────── */}
      <section className="relative border-t overflow-hidden">
        <div className="-bottom-80 -left-40 absolute bg-primary/5 blur-[160px] rounded-full size-[600px]" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <Link
            href="/article"
            className="group flex justify-between items-center gap-8 py-12 sm:py-16"
          >
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Tiếp tục khám phá
              </span>
              <p className="mt-2 font-heading text-2xl sm:text-3xl tracking-[-0.03em]">
                Xem tất cả bài viết
              </p>
            </div>

            <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 sm:size-14 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
