import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
import { groq } from 'next-sanity';

// ─── Types ───────────────────────────────────────────────────

export interface ArticleListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: SanityImage | null;
  tags: { _id: string; title: string; slug: string }[];
  publishedAt: string | null;
  author: string | null;
}

export interface TagGroup {
  _id: string;
  slug: string;
  title: string;
  count: number;
}

// ─── Queries ─────────────────────────────────────────────────

const allArticlesQuery = groq`*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  tags[]-> { _id, title, "slug": slug.current },
  publishedAt,
  author
}`;

const articleTagsQuery = groq`*[_type == "tag" && count(*[_type == "article" && references(^._id)]) > 0] | order(title asc) {
  _id,
  "slug": slug.current,
  title,
  "count": count(*[_type == "article" && references(^._id)])
}`;

// ─── Actions ─────────────────────────────────────────────────

export async function getAllArticles(): Promise<ArticleListItem[]> {
  return await client.fetch<ArticleListItem[]>(allArticlesQuery);
}

export async function getArticleTags(): Promise<TagGroup[]> {
  return await client.fetch<TagGroup[]>(articleTagsQuery);
}
