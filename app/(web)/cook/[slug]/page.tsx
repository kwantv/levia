import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { ChevronLeft, ChevronRight, Clock, CookingPot, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from 'sanity';
import { getAllRecipeSlugs, getRecipeBySlug } from './action';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type TextBlock = PortableTextBlock & {
  children?: { text?: string }[];
  style?: string;
};

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: 'Không tìm thấy — Levia' };

  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1200);

  return {
    title: `${recipe.name} — Levia`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.name} — Levia`,
      description: recipe.description,
      type: 'article',
      images: coverSrc ? [{ url: coverSrc }] : undefined,
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

function getRecipeInstructions(steps: PortableTextBlock[] | null) {
  if (!steps) return [];

  const instructions: { '@type': 'HowToStep'; name: string; text: string }[] = [];

  for (const block of steps) {
    const textBlock = block as TextBlock;
    const text = getBlockText(block);
    if (!text) continue;

    if (textBlock.style === 'h3') {
      instructions.push({
        '@type': 'HowToStep',
        name: text,
        text: '',
      });
      continue;
    }

    const currentStep = instructions.at(-1);
    if (currentStep) {
      currentStep.text = [currentStep.text, text].filter(Boolean).join(' ');
    } else {
      instructions.push({
        '@type': 'HowToStep',
        name: `Bước ${instructions.length + 1}`,
        text,
      });
    }
  }

  return instructions;
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1200);
  const recipeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: coverSrc ? [coverSrc] : undefined,
    recipeYield: `${recipe.servings} khẩu phần`,
    prepTime: toIsoDuration(recipe.prepTime),
    cookTime: toIsoDuration(recipe.cookTime),
    totalTime: toIsoDuration(recipe.prepTime + recipe.cookTime),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: getRecipeInstructions(recipe.steps),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            href="/cook"
            className="inline-flex items-center gap-1 mb-8 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ChevronLeft className="size-4" />
            Tất cả công thức
          </Link>

          <div className="items-center gap-12 grid lg:grid-cols-2">
            <div className="relative bg-muted/30 aspect-video overflow-hidden">
              {coverSrc ? (
                <Image
                  src={coverSrc}
                  alt={recipe.coverImage?.alt || recipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  <span className="text-sm">Ảnh món ăn</span>
                </div>
              )}
            </div>

            <div>
              <Badge variant="secondary" className="mb-4 font-normal">
                Hiểu căn bếp Việt.
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                {recipe.name}
              </h1>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                {recipe.description}
              </p>

              <div className="gap-3 grid grid-cols-3 mt-8">
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <Users className="size-5 text-primary" />
                    <span className="text-muted-foreground text-xs">Khẩu phần</span>
                    <span className="font-medium text-sm">{recipe.servings} người</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <Clock className="size-5 text-primary" />
                    <span className="text-muted-foreground text-xs">Chuẩn bị</span>
                    <span className="font-medium text-sm">
                      {formatMinutes(recipe.prepTime)}
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <CookingPot className="size-5 text-primary" />
                    <span className="text-muted-foreground text-xs">Nấu</span>
                    <span className="font-medium text-sm">
                      {formatMinutes(recipe.cookTime)}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl sm:text-3xl tracking-tight">
                Nguyên liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex items-start gap-2.5 text-muted-foreground text-sm"
                  >
                    <ChevronRight className="mt-0.5 size-4 text-primary shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {recipe.steps && recipe.steps.length > 0 && (
        <section className="bg-background py-16 sm:py-20 border-border border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="mb-8 font-heading text-2xl sm:text-3xl tracking-tight">
              Các bước thực hiện
            </h2>
            <div className="prose-invert dark:prose-invert max-w-none prose">
              <PortableText value={recipe.steps} components={components} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-card py-12 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <Link
            href="/cook"
            className="inline-flex items-center gap-1 font-medium text-primary text-sm hover:underline"
          >
            <ChevronLeft className="size-4" />
            Xem tất cả công thức
          </Link>
        </div>
      </section>
    </>
  );
}
