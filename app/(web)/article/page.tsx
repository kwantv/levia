import { formatDate } from '@/lib/utils';
import { getImageUrl } from '@/sanity/lib/image';
import { getAllArticles, getArticleTags } from './action';
import ArticleBrowser from './article-browser';
import DotGridBackground from '@/components/dot-grid-background';

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

  const browserArticles = articles.map((article) => ({
    _id: article._id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverSrc: getImageUrl(article.coverImage ?? undefined, 1400),
    coverAlt: article.coverImage?.alt || article.title,
    publishedAt: article.publishedAt ? formatDate(article.publishedAt) : null,
    tags:
      article.tags?.map((tag) => ({
        _id: tag._id,
        title: tag.title,
      })) ?? [],
  }));

  return (
    <>
      <section className="relative bg-background border-border border-b overflow-hidden">
        <DotGridBackground />

        {/* Ambient gold accent */}
        <div className="top-[-15%] right-[-10%] absolute bg-primary/5 blur-[140px] rounded-full size-150 pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                <span className="block bg-primary size-1.5" />
                Knowledge / 01
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h1 className="max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.055em]">
                Cẩm nang <span className="text-primary">bếp</span>
              </h1>

              <div className="gap-8 grid sm:grid-cols-2 mt-12 lg:mt-16 pt-6 border-border border-t">
                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Kiến thức, công nghệ và những góc nhìn chuyên sâu giúp bạn
                  hiểu rõ hơn về căn bếp hiện đại.
                </p>

                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Từ công nghệ bếp từ, hiệu suất nhiệt đến kinh nghiệm lựa chọn
                  thiết bị phù hợp cho không gian sống.
                </p>
              </div>
            </div>
          </div>

          <div className="gap-px grid grid-cols-2 md:grid-cols-4 mt-20 bg-border border border-border">
            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Bài viết
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(articles.length).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Chủ đề
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(tags.length).padStart(2, '0')}
              </span>
            </div>

            <div className="hidden md:block md:col-span-2 bg-background p-6">
              <div className="flex justify-end items-end h-full">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Levia / Kitchen Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArticleBrowser articles={browserArticles} tags={tags} />
    </>
  );
}
