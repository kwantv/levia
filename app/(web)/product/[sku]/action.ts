import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';
import { PortableTextBlock } from 'sanity';
import { ProductSplitMediaBlock } from './blocks/split-media-block';
import { ProductMetricsBlock } from './blocks/metrics-block';

// ─── Types ───────────────────────────────────────────────────

export type ProductDetailBlock = ProductSplitMediaBlock | ProductMetricsBlock;
// | ProductFullMediaBlock
// | ProductFeatureRailBlock
// | ProductStatementBlock;

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

  specs: {
    label: string;
    value: string;
  }[];

  gallery: SanityImage[];

  detailBlocks: ProductDetailBlock[];

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
  "specs": coalesce(specs, []),
  "gallery": coalesce(gallery, []),
  "detailBlocks": coalesce(detailBlocks, []),
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
  const data = await client.fetch(allProductSkusQuery);
  return data as string[];
}
