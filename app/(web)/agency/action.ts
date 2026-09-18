import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';

// ─── Types ───────────────────────────────────────────────────

export interface AgencyListItem {
  _id: string;
  name: string;
  slug: string;
  address: string;
  province: string;
  phone?: string;
  hours?: string;
  mapLink?: string;
  lat: number;
  lng: number;
  photos: SanityImage[];
}

// ─── Queries ─────────────────────────────────────────────────

const agenciesQuery = groq`*[_type == "agency" && defined(slug.current)] | order(province asc, name asc) {
  _id,
  name,
  "slug": slug.current,
  address,
  province,
  phone,
  hours,
  mapLink,
  lat,
  lng,
  photos,
}`;

export async function getAgencies(): Promise<AgencyListItem[]> {
  const { data } = await sanityFetch({ query: agenciesQuery });
  return data as AgencyListItem[];
}
