import { getImageUrl } from '@/sanity/lib/image';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';

import { getAllRecipeSlugs, getRecipeBySlug } from './action';
import RecipeHeader from './recipe-header';
import RecipeMethod from './recipe-method';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type TextBlock = PortableTextBlock & {
  children?: {
    text?: string;
  }[];
  style?: string;
};

export type RecipeStepGroup = {
  title: string;
  blocks: PortableTextBlock[];
};

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: 'Không tìm thấy — Levia',
    };
  }

  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1200);

  return {
    title: `${recipe.name} — Levia`,
    description: recipe.description,

    openGraph: {
      title: `${recipe.name} — Levia`,
      description: recipe.description,
      type: 'article',

      images: coverSrc
        ? [
            {
              url: coverSrc,
            },
          ]
        : undefined,
    },
  };
}

function toIsoDuration(minutes: number) {
  return `PT${minutes}M`;
}

function getBlockText(block: PortableTextBlock) {
  const textBlock = block as TextBlock;

  if (textBlock._type !== 'block' || !Array.isArray(textBlock.children)) {
    return '';
  }

  return textBlock.children
    .map((child) => child.text ?? '')
    .join('')
    .trim();
}

/**
 * Every H3 starts a new recipe step.
 *
 * The H3 itself becomes the step title.
 * Remaining Portable Text blocks remain untouched and
 * are rendered normally below the title.
 */
function getRecipeStepGroups(
  steps: PortableTextBlock[] | null,
): RecipeStepGroup[] {
  if (!steps?.length) return [];

  const groups: RecipeStepGroup[] = [];

  for (const block of steps) {
    const textBlock = block as TextBlock;

    const text = getBlockText(block);

    if (textBlock._type === 'block' && textBlock.style === 'h3' && text) {
      groups.push({
        title: text,
        blocks: [],
      });

      continue;
    }

    let current = groups.at(-1);

    if (!current) {
      current = {
        title: 'Bắt đầu',
        blocks: [],
      };

      groups.push(current);
    }

    current.blocks.push(block);
  }

  return groups;
}

function getRecipeInstructions(steps: PortableTextBlock[] | null) {
  return getRecipeStepGroups(steps).map((step) => ({
    '@type': 'HowToStep' as const,
    name: step.title,
    text: step.blocks.map(getBlockText).filter(Boolean).join(' '),
  }));
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1800);
  const totalTime = recipe.prepTime + recipe.cookTime;
  const stepGroups = getRecipeStepGroups(recipe.steps);

  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: coverSrc ? [coverSrc] : undefined,
    recipeYield: `${recipe.servings} khẩu phần`,
    prepTime: toIsoDuration(recipe.prepTime),
    cookTime: toIsoDuration(recipe.cookTime),
    totalTime: toIsoDuration(totalTime),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: getRecipeInstructions(recipe.steps),
  };

  return (
    <main className="bg-background min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* ───────────────── HERO ───────────────── */}
      <RecipeHeader recipe={recipe} coverSrc={coverSrc} />

      {/* ───────────────── METHOD ───────────────── */}
      <RecipeMethod recipe={recipe} stepGroups={stepGroups} />

      {/* ───────────────── ENDING ───────────────── */}
      <section className="relative border-t overflow-hidden">
        <div className="-bottom-80 -left-40 absolute bg-primary/5 blur-[160px] rounded-full size-150" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <Link
            href="/cook"
            className="group flex justify-between items-center gap-8 py-12 sm:py-16"
          >
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Tiếp tục vào bếp
              </span>
              <p className="mt-2 font-heading text-2xl sm:text-3xl tracking-[-0.03em]">
                Khám phá món tiếp theo
              </p>
              <p className="mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
                Tiếp tục khám phá những công thức được thiết kế để bạn hiểu món
                ăn và cách làm chủ căn bếp tốt hơn.
              </p>
            </div>

            <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 sm:size-14 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
