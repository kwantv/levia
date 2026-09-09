import { getAllAgencySlugs } from '@/app/(web)/agency/[slug]/action';
import { getAllArticleSlugs } from '@/app/(web)/article/[slug]/action';
import { getAllRecipeSlugs } from '@/app/(web)/cook/[slug]/action';
import { getAllProductSkus } from '@/app/(web)/product/[sku]/action';
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

function toUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSkus, articleSlugs, recipeSlugs, agencySlugs] =
    await Promise.all([
      getAllProductSkus(),
      getAllArticleSlugs(),
      getAllRecipeSlugs(),
      getAllAgencySlugs(),
    ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: toUrl('/'), priority: 1 },
    { url: toUrl('/about'), priority: 0.7 },
    { url: toUrl('/product'), priority: 0.9 },
    { url: toUrl('/cook'), priority: 0.8 },
    { url: toUrl('/article'), priority: 0.8 },
    { url: toUrl('/agency'), priority: 0.9 },
  ];

  return [
    ...staticRoutes,
    ...productSkus.map((sku) => ({
      url: toUrl(`/product/${sku}`),
      priority: 0.8,
    })),
    ...articleSlugs.map((slug) => ({
      url: toUrl(`/article/${slug}`),
      priority: 0.7,
    })),
    ...recipeSlugs.map((slug) => ({
      url: toUrl(`/cook/${slug}`),
      priority: 0.7,
    })),
    ...agencySlugs.map((slug) => ({
      url: toUrl(`/agency/${slug}`),
      priority: 0.7,
    })),
  ];
}
