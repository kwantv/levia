import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
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
  return await client.fetch<ArticleDetail | null>(articleBySlugQuery, { slug });
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return await client.fetch<string[]>(allArticleSlugsQuery);
}
