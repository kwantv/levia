import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
import { groq } from 'next-sanity';

// ─── Types ───────────────────────────────────────────────────

export interface ProductListItem {
  _id: string;
  sku: string;
  title: string;
  category: {
    title: string;
    slug: string;
  } | null;
  price: number | null;
  desc: string;
  heroImage: SanityImage | null;
}

export interface CategoryGroup {
  slug: string;
  label: string;
  description: string | null;
  count: number;
}

// ─── Queries ─────────────────────────────────────────────────

const allProductsQuery = groq`*[_type == "product"] | order(title asc) {
  _id,
  sku,
  title,
  category-> { title, "slug": slug.current },
  price,
  desc,
  "heroImage": gallery[0]
}`;

const categoriesQuery = groq`*[_type == "category"] | order(title asc) {
  "slug": slug.current,
  "label": title,
  description,
  "count": count(*[_type == "product" && references(^._id)])
}`;

// ─── Actions ─────────────────────────────────────────────────

export async function getAllProducts(): Promise<ProductListItem[]> {
  return await client.fetch<ProductListItem[]>(allProductsQuery);
}

export async function getCategories(): Promise<CategoryGroup[]> {
  return await client.fetch<CategoryGroup[]>(categoriesQuery);
}
