import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';

export interface RecipeListItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: SanityImage | null;
  servings: number;
  prepTime: number;
  cookTime: number;
}

const allRecipesQuery = groq`*[_type == "recipe" && defined(slug.current)] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  coverImage,
  servings,
  prepTime,
  cookTime
}`;

export async function getAllRecipes(): Promise<RecipeListItem[]> {
  const { data } = await sanityFetch({ query: allRecipesQuery });
  return data as RecipeListItem[];
}
