import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';

// ─── Types ───────────────────────────────────────────────────

export interface Agency {
  _id: string;
  name: string;
  slug: string;
  address: string;
  province: string;
  zip?: string;
  phone?: string;
  hours?: string;
  mapLink?: string;
  lat: number;
  lng: number;
  photos?: SanityImage[];
}

// ─── Queries ─────────────────────────────────────────────────

const agencyBySlugQuery = groq`*[_type == "agency" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  address,
  province,
  zip,
  phone,
  hours,
  mapLink,
  lat,
  lng,
  photos
}`;

const agencySlugsQuery = groq`*[_type == "agency" && defined(slug.current)].slug.current`;

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  if (!slug) return null;

  const { data } = await sanityFetch({
    query: agencyBySlugQuery,
    params: { slug },
  });
  return data as Agency | null;
}

export async function getAllAgencySlugs(): Promise<string[]> {
  const data = await client.fetch(agencySlugsQuery);
  return data as string[];
}
