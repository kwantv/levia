import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
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
  return await client.fetch<ProductDetail | null>(productBySkuQuery, { sku });
}

export async function getAllProductSkus(): Promise<string[]> {
  return await client.fetch<string[]>(allProductSkusQuery);
}
