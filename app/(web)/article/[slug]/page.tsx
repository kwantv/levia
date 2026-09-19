import { getContentHeadings } from '@/sanity/lib/content-headings';
import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DotGridBackground from '@/components/dot-grid-background';
import { getAllArticleSlugs, getArticleBySlug } from './action';
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

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;

  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        {/* Ambient brand glow */}
        <div className="-top-48 -right-40 absolute bg-primary/5 blur-[160px] rounded-full size-162.5 pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-24 lg:pb-28 container">
          {/* Top nav */}
          <div className="gap-6 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <Link
                href="/article"
                className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                Tất cả bài viết
              </Link>
            </div>

            <div className="hidden lg:block lg:col-span-9">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-[0.22em]">
                  Knowledge / Article
                </span>

                <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.22em]">
                  Levia / Kitchen Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Main hero */}
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12 mt-14 sm:mt-20">
            {/* Article index */}
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Cẩm nang bếp
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
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

              <h1 className="max-w-5xl font-heading font-medium text-[clamp(2.75rem,6vw,6rem)] leading-[0.94] tracking-tighter">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="mt-8 max-w-3xl text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="gap-px grid sm:grid-cols-3 mt-12 bg-border border border-border">
                {article.author && (
                  <div className="bg-background p-4 sm:p-5">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                      Tác giả
                    </span>

                    <span className="block mt-2 text-sm">{article.author}</span>
                  </div>
                )}

                {article.publishedAt && (
                  <div className="bg-background p-4 sm:p-5">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                      Xuất bản
                    </span>

                    <span className="block mt-2 text-sm">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                )}

                {article.updatedAt && (
                  <div className="bg-background p-4 sm:p-5">
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                      Cập nhật
                    </span>

                    <span className="block mt-2 text-sm">
                      {formatDate(article.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── COVER ───────────────── */}
      {coverSrc && (
        <section className="border-border border-b">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
            <div className="relative border-border border-x">
              {/* image */}
              <div className="relative bg-card aspect-16/8 lg:aspect-16/7 overflow-hidden">
                <Image
                  src={coverSrc}
                  alt={article.coverImage?.alt || article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent pointer-events-none" />

                {/* technical corner marks */}
                <span className="top-5 left-5 absolute bg-primary size-2" />

                <span className="right-5 bottom-5 absolute font-mono text-[9px] text-white/50 uppercase tracking-[0.2em]">
                  Levia / Editorial
                </span>
              </div>

              {/* image footer */}
              <div className="flex justify-between items-center px-4 sm:px-6 border-border border-t h-12">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                  Hình ảnh bài viết
                </span>

                <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.18em]">
                  01 / Cover
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── ARTICLE BODY ───────────────── */}
      {article.content && article.content.length > 0 && (
        <section className="border-border border-b">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
            <div className="gap-0 grid lg:grid-cols-12">
              {/* Left label */}
              <div className="hidden lg:block lg:col-span-2 py-16 lg:py-24 pr-8 border-border border-r">
                <div className="top-28 sticky">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary size-1.5" />

                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                      Nội dung
                    </span>
                  </div>

                  <span className="block mt-4 font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.18em]">
                    Article / 01
                  </span>
                </div>
              </div>

              {/* Content */}
              <article className="lg:col-span-7 lg:px-10 xl:px-14 py-14 sm:py-20 lg:py-24">
                <div className="prose-blockquote:bg-primary/4 dark:prose-invert prose-h2:mt-16 prose-h3:mt-10 prose-h2:mb-6 prose-h3:mb-4 prose-blockquote:px-6 prose-blockquote:py-4 prose-img:border prose-blockquote:border-primary prose-hr:border-border prose-img:border-border max-w-none prose-headings:font-heading prose-headings:font-medium prose-strong:font-medium prose-a:text-primary prose-blockquote:text-foreground prose-headings:text-foreground prose-li:text-muted-foreground prose-p:text-[15px] prose-p:text-muted-foreground prose-strong:text-foreground sm:prose-p:text-base prose-h3:text-xl sm:prose-h3:text-2xl prose-h2:text-3xl sm:prose-h2:text-4xl hover:prose-a:underline prose-a:no-underline prose-blockquote:not-italic prose-li:leading-7 prose-p:leading-[1.85] prose-headings:tracking-tight prose prose-neutral">
                  <PortableText
                    value={article.content}
                    components={components}
                  />
                </div>
              </article>

              {/* TOC */}
              {headings.length > 0 && (
                <aside className="lg:col-span-3 py-10 lg:py-24 lg:pl-8 lg:border-border lg:border-l">
                  <div className="top-24 lg:sticky">
                    <TableOfContents headings={headings} />
                  </div>
                </aside>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── FAQ ───────────────── */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="bg-card/40 border-border border-b">
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
      <section>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <Link
            href="/article"
            className="group flex justify-between items-center gap-8 py-12 sm:py-16 border-border border-x"
          >
            <div className="px-6 sm:px-10 lg:px-12">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Tiếp tục khám phá
              </span>

              <p className="mt-2 font-heading text-2xl sm:text-3xl tracking-[-0.03em]">
                Xem tất cả bài viết
              </p>
            </div>

            <div className="flex justify-center items-center group-hover:bg-primary mr-6 sm:mr-10 lg:mr-12 border border-border group-hover:border-primary size-12 sm:size-14 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
