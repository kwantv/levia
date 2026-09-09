import { Badge } from '@/components/ui/badge';
import { getContentHeadings } from '@/sanity/lib/content-headings';
import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { Calendar, ChevronLeft, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  if (!article) return { title: 'Không tìm thấy — Levia' };
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

  const coverSrc = getImageUrl(article.coverImage ?? undefined, 1200);
  const headings = getContentHeadings(article.content);

  return (
    <>
      {/* ──────── HEADER ──────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Back link */}
          <Link
            href="/article"
            className="inline-flex items-center gap-1 mb-8 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ChevronLeft className="size-4" />
            Tất cả bài viết
          </Link>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Badge
                  key={tag._id}
                  variant="secondary"
                  className="font-normal text-xs"
                >
                  {tag.title}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            {article.title}
          </h1>

          {/* Excerpt — GEO/AEO answer block */}
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-muted-foreground text-sm">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {article.author}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatDate(article.publishedAt)}
              </span>
            )}
            {article.updatedAt && (
              <span className="text-xs">
                (Cập nhật: {formatDate(article.updatedAt)})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ──────── COVER IMAGE ──────── */}
      {coverSrc && (
        <section className="bg-background border-border border-t">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={coverSrc}
                alt={article.coverImage?.alt || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* ──────── CONTENT ──────── */}
      {article.content && article.content.length > 0 && (
        <section className="bg-background py-12 sm:py-16 border-border border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="items-start gap-12 grid lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="prose-invert dark:prose-invert max-w-3xl prose">
                <PortableText value={article.content} components={components} />
              </div>
              {headings.length > 0 && (
                <aside className="top-24 lg:sticky order-first lg:order-last">
                  <TableOfContents headings={headings} />
                </aside>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ──────── FAQs ──────── */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="bg-card py-16 sm:py-20 border-border border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="mb-8 font-heading text-2xl sm:text-3xl tracking-tight">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-6">
              {article.faqs.map((faq) => (
                <div key={faq._key} className="pb-6 border-border border-b">
                  <h3 className="mb-2 font-semibold text-foreground">
                    {faq.label}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────── BACK CTA ──────── */}
      <section className="bg-background py-12 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <Link
            href="/article"
            className="inline-flex items-center gap-1 font-medium text-primary text-sm hover:underline"
          >
            <ChevronLeft className="size-4" />
            Xem tất cả bài viết
          </Link>
        </div>
      </section>
    </>
  );
}
