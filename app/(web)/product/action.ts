import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
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
  const { data } = await sanityFetch({ query: allProductsQuery });
  return data as ProductListItem[];
}

export async function getCategories(): Promise<CategoryGroup[]> {
  const { data } = await sanityFetch({ query: categoriesQuery });
  return data as CategoryGroup[];
}
