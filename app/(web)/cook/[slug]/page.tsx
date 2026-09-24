import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  CookingPot,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';

import { getAllRecipeSlugs, getRecipeBySlug } from './action';
import DotGridBackground from '@/components/dot-grid-background';

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

type RecipeStepGroup = {
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

function formatMinutes(minutes: number) {
  return `${minutes} phút`;
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

      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-[700px] pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pb-20 container">
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link
              href="/cook"
              className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Tất cả công thức
            </Link>

            <span className="hidden sm:block font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
              Levia / Cook Intelligence
            </span>
          </div>

          {/* Intro */}
          <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12 mt-14 sm:mt-20">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Recipe / Cook
                </span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h1 className="max-w-5xl font-heading font-medium text-[clamp(3.25rem,7vw,7rem)] leading-[0.88] tracking-[-0.055em]">
                {recipe.name}
              </h1>

              <div className="gap-y-8 md:gap-x-10 grid md:grid-cols-2 mt-10 sm:mt-12 pt-6 border-border border-t">
                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.8]">
                  {recipe.description}
                </p>

                <div className="flex md:justify-end items-end">
                  <a
                    href="#recipe-method"
                    className="group inline-flex justify-between items-center gap-10 pb-3 border-border hover:border-primary border-b min-w-56 transition-colors"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                      Bắt đầu nấu
                    </span>

                    <ArrowDownRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative bg-card mt-14 sm:mt-20 border border-border aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7] overflow-hidden">
            {coverSrc ? (
              <Image
                src={coverSrc}
                alt={recipe.coverImage?.alt || recipe.name}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <RecipeImagePlaceholder />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            <span className="top-5 left-5 absolute bg-primary size-1.5" />

            <div className="right-5 bottom-5 left-5 absolute flex justify-between items-end">
              <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.2em]">
                Vietnamese Kitchen
              </span>

              <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.2em]">
                Levia / Recipe
              </span>
            </div>
          </div>

          {/* Meta strip */}
          <div className="gap-px grid grid-cols-2 lg:grid-cols-4 bg-border border-border border-x border-b">
            <RecipeMetaItem
              icon={Users}
              label="Khẩu phần"
              value={`${recipe.servings} người`}
            />

            <RecipeMetaItem
              icon={Clock}
              label="Chuẩn bị"
              value={formatMinutes(recipe.prepTime)}
            />

            <RecipeMetaItem
              icon={CookingPot}
              label="Nấu"
              value={formatMinutes(recipe.cookTime)}
            />

            <RecipeMetaItem
              icon={Clock}
              label="Tổng thời gian"
              value={formatMinutes(totalTime)}
            />
          </div>
        </div>
      </section>

      {/* ───────────────── METHOD ───────────────── */}

      <section
        id="recipe-method"
        className="border-border border-b scroll-mt-20"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
          {/* Section header */}
          <div className="gap-y-8 lg:gap-x-8 grid grid-cols-12 pb-12 lg:pb-16 border-border border-b">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Recipe / Method
                </span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
                Chuẩn bị và thực hiện.
              </h2>

              <p className="mt-5 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                Chuẩn bị đầy đủ nguyên liệu trước khi bắt đầu để quá trình nấu
                diễn ra liền mạch và dễ kiểm soát hơn.
              </p>
            </div>
          </div>

          <div className="gap-y-14 lg:gap-x-10 grid grid-cols-12">
            {/* ───────── INGREDIENTS ───────── */}

            <aside className="col-span-12 lg:col-span-4 pt-12 lg:pt-16">
              <div className="top-24 lg:sticky">
                <div className="flex justify-between items-center pb-5 border-border border-b">
                  <h3 className="font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
                    Nguyên liệu
                  </h3>

                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.16em]">
                    {String(recipe.ingredients.length).padStart(2, '0')} mục
                  </span>
                </div>

                <div>
                  {recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={`${ingredient}-${index}`}
                      className="gap-5 grid grid-cols-[2rem_1fr] py-4 border-border border-b"
                    >
                      <span className="font-mono text-[9px] text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="text-sm leading-relaxed">
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ───────── STEPS ───────── */}

            <div className="col-span-12 lg:col-span-7 lg:col-start-6 pt-12 lg:pt-16">
              {stepGroups.length > 0 ? (
                <div>
                  {stepGroups.map((step, index) => (
                    <RecipeStep
                      key={`${step.title}-${index}`}
                      step={step}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 border-border border-y">
                  <p className="text-muted-foreground text-sm">
                    Chưa có hướng dẫn thực hiện.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── ENDING ───────────────── */}

      <section className="relative overflow-hidden">
        <div className="-bottom-80 -left-40 absolute bg-primary/5 blur-[160px] rounded-full size-[600px]" />

        <Link
          href="/cook"
          className="group block mx-auto px-4 sm:px-6 lg:px-8 border-border border-y container"
        >
          <div className="gap-8 grid lg:grid-cols-12 py-10 sm:py-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Cook / Explore
              </span>
            </div>

            <div className="lg:col-span-9">
              <div className="flex justify-between items-end gap-8">
                <div>
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.045em]">
                    Khám phá món tiếp theo.
                  </h2>

                  <p className="mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
                    Tiếp tục khám phá những công thức được thiết kế để bạn hiểu
                    món ăn và cách làm chủ căn bếp tốt hơn.
                  </p>
                </div>

                <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

function RecipeMetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-primary" />

        <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <span className="block mt-4 font-heading font-medium text-xl sm:text-2xl tracking-[-0.03em]">
        {value}
      </span>
    </div>
  );
}

function RecipeStep({ step, index }: { step: RecipeStepGroup; index: number }) {
  return (
    <section className="group py-10 sm:py-12 first:pt-0 border-border border-b">
      <div className="gap-6 grid sm:grid-cols-[5rem_1fr]">
        <div>
          <span className="font-mono text-primary text-3xl sm:text-4xl tracking-[-0.05em]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div>
          <h3 className="max-w-2xl font-heading font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.05] tracking-[-0.04em]">
            {step.title}
          </h3>

          {step.blocks.length > 0 && (
            <div className="prose-invert dark:prose-invert mt-6 max-w-2xl prose-a:text-primary prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-p:leading-[1.8] prose">
              <PortableText
                value={step.blocks}
                components={{
                  ...components,
                  block: {
                    ...components.block,
                    blockquote: ({ children }) => (
                      <aside className="bg-primary/3 my-8 p-5 sm:p-6 border border-primary/20">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary size-1.5 shrink-0" />

                          <span className="font-mono text-[8px] text-primary uppercase tracking-[0.18em]">
                            Kitchen note
                          </span>
                        </div>

                        <div className="[&>p]:m-0 mt-4 text-muted-foreground text-sm leading-[1.8]">
                          {children}
                        </div>
                      </aside>
                    ),
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RecipeImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
        Levia / Recipe Image
      </span>
    </div>
  );
}
