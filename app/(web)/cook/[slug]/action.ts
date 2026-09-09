import { client } from '@/sanity/lib/client';
import { SanityImage } from '@/sanity/lib/image';
import { sanityFetch } from '@/sanity/lib/live';
import { groq } from 'next-sanity';
import { PortableTextBlock } from 'sanity';

export interface RecipeDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: SanityImage | null;
  servings: number;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  steps: PortableTextBlock[] | null;
}

const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  coverImage,
  servings,
  prepTime,
  cookTime,
  ingredients,
  steps
}`;

const allRecipeSlugsQuery = groq`*[_type == "recipe" && defined(slug.current)].slug.current`;

export async function getRecipeBySlug(
  slug: string,
): Promise<RecipeDetail | null> {
  if (!slug) return null;
  const { data } = await sanityFetch({
    query: recipeBySlugQuery,
    params: { slug },
  });
  return data as RecipeDetail | null;
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const data = await client.fetch(allRecipeSlugsQuery);
  return data as string[];
}
