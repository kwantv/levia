import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';
import { PortableTextBlock } from 'sanity';

// ─── Types ───────────────────────────────────────────────────

export interface ProductDetail {
  _id: string;
  sku: string;
  title: string;
  category: {
    title: string;
    slug: string;
  } | null;
  price: number | null;
  desc: string;
  specs: { label: string; value: string }[];
  gallery: SanityImage[];
  content: PortableTextBlock[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

// ─── Queries ─────────────────────────────────────────────────

const productBySkuQuery = groq`*[_type == "product" && sku == $sku][0] {
  _id,
  sku,
  title,
  category-> { title, "slug": slug.current },
  price,
  desc,
  specs,
  gallery,
  content,
  seoTitle,
  seoDescription
}`;

const allProductSkusQuery = groq`*[_type == "product" && defined(sku)].sku`;

// ─── Actions ─────────────────────────────────────────────────

export async function getProductBySku(
  sku: string,
): Promise<ProductDetail | null> {
  if (!sku) return null;
  const { data } = await sanityFetch({
    query: productBySkuQuery,
    params: { sku },
  });
  return data as ProductDetail | null;
}

export async function getAllProductSkus(): Promise<string[]> {
  const { data } = await sanityFetch({ query: allProductSkusQuery });
  return data as string[];
}
