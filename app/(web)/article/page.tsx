import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/sanity/lib/image';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllArticles, getArticleTags } from './action';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Cẩm nang bếp — Levia',
  description:
    'Giải đáp mọi thắc mắc về bếp từ, mẹo nấu món Việt, so sánh sản phẩm và hướng dẫn chọn bếp phù hợp.',
};

export default async function ArticlePage() {
  const [articles, tags] = await Promise.all([
    getAllArticles(),
    getArticleTags(),
  ]);

  return (
    <>
      {/* ──────── HERO ──────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="gap-4 grid grid-cols-4 mx-auto px-4 sm:px-6 lg:px-8 container">
          <p className="mb-2 font-mono font-medium text-sm uppercase tracking-wider">
            [Article]
          </p>
          <div className="col-span-3 md:col-span-2 lg:col-span-1">
            <h1 className="font-heading text-primary text-4xl sm:text-5xl tracking-tight">
              Cẩm nang bếp
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground text-lg">
              Giải đáp thắc mắc về bếp từ, mẹo nấu món Việt ngon hơn mỗi ngày,
              và hướng dẫn chọn bếp phù hợp cho gia đình bạn.
            </p>
          </div>
        </div>
      </section>

      {/* ──────── TAGS ──────── */}
      {tags.length > 0 && (
        <section className="">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag._id}
                  className="bg-background px-4 py-2 border border-border font-medium text-muted-foreground text-sm"
                >
                  {tag.title}
                  <span className="ml-1.5 text-primary text-xs">
                    {tag.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────── ARTICLE GRID ──────── */}
      <section className="bg-background py-16 sm:py-20 border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          {articles.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Chưa có bài viết nào.
            </p>
          ) : (
            <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article) => {
                const coverSrc = getImageUrl(
                  article.coverImage ?? undefined,
                  600,
                );

                return (
                  <Link
                    key={article._id}
                    href={`/article/${article.slug}`}
                    className="group"
                  >
                    <Card className="flex flex-col hover:ring-primary/30 h-full overflow-hidden transition-colors">
                      {/* Cover image */}
                      <div className="relative bg-muted/30 aspect-video overflow-hidden">
                        {coverSrc ? (
                          <Image
                            src={coverSrc}
                            alt={article.coverImage?.alt || article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full text-muted-foreground">
                            <span className="text-xs">Ảnh bài viết</span>
                          </div>
                        )}
                      </div>

                      <CardHeader className="flex-1">
                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
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

                        <CardTitle className="font-semibold group-hover:text-primary text-sm leading-snug transition-colors">
                          {article.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-muted-foreground text-xs line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          {article.publishedAt && (
                            <span className="text-muted-foreground text-xs">
                              {formatDate(article.publishedAt)}
                            </span>
                          )}
                          <span className="flex items-center gap-1 ml-auto font-medium text-primary text-xs">
                            Đọc tiếp
                            <ChevronRight className="size-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
