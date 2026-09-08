import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
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
  const { data } = await sanityFetch({ query: allArticlesQuery });
  return data as ArticleListItem[];
}

export async function getArticleTags(): Promise<TagGroup[]> {
  const { data } = await sanityFetch({ query: articleTagsQuery });
  return data as TagGroup[];
}
