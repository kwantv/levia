import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';
import { PortableTextBlock } from 'sanity';

// ─── Types ───────────────────────────────────────────────────

export interface ArticleDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: SanityImage | null;
  content: PortableTextBlock[] | null;
  tags: { _id: string; title: string; slug: string }[];
  faqs: { _key: string; question: string; answer: string }[] | null;
  publishedAt: string | null;
  updatedAt: string | null;
  author: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[] | null;
}

// ─── Queries ─────────────────────────────────────────────────

const articleBySlugQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  content,
  tags[]-> { _id, title, "slug": slug.current },
  faqs,
  publishedAt,
  updatedAt,
  author,
  seoTitle,
  seoDescription,
  seoKeywords
}`;

const allArticleSlugsQuery = groq`*[_type == "article" && defined(slug.current)].slug.current`;

// ─── Actions ─────────────────────────────────────────────────

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  if (!slug) return null;
  const { data } = await sanityFetch({
    query: articleBySlugQuery,
    params: { slug },
  });
  return data as ArticleDetail | null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({ query: allArticleSlugsQuery });
  return data as string[];
}
