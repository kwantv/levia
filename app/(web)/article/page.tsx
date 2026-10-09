import { formatDate } from '@/lib/utils';
import { getImageUrl } from '@/sanity/lib/image';
import { getAllArticles, getArticleTags } from './action';
import ArticleBrowser from './article-browser';
import { ListingHero as Hero } from '@/components/listing-page-hero';

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
    <main className="bg-background">
      <Hero
        label="Article / 03"
        title="Cẩm nang"
        accent="bếp"
        descriptions={[
          'Kiến thức, công nghệ và những góc nhìn chuyên sâu giúp bạn hiểu rõ hơn về căn bếp hiện đại.',
          'Từ công nghệ bếp từ, hiệu suất nhiệt đến kinh nghiệm lựa chọn thiết bị phù hợp cho không gian sống.',
        ]}
        stats={[
          {
            label: 'Bài viết',
            value: String(articles.length).padStart(2, '0'),
            scramble: true,
          },
          {
            label: 'Chủ đề',
            value: String(tags.length).padStart(2, '0'),
            scramble: true,
          },
        ]}
      />

      <ArticleBrowser articles={browserArticles} tags={tags} />
    </main>
  );
}
