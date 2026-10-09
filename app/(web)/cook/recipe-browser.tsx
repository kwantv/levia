'use client';

import { ViewTransition } from 'react';
import { getAllRecipes, RecipeListItem } from './action';
import { getImageUrl } from '@/sanity/lib/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import Image from 'next/image';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Recipe = Awaited<ReturnType<typeof getAllRecipes>>[number];

function formatMinutes(minutes: number) {
  return `${minutes} phút`;
}

function RecipeBrowser({ recipes }: { recipes: RecipeListItem[] }) {
  const featured = recipes.slice(0, 3);
  const remaining = recipes.slice(3);

  const leadRecipe = featured[0];
  const supportingRecipes = featured.slice(1);

  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      const featured = root.querySelector<HTMLElement>(
        '[data-reveal-featured]',
      );

      const supporting = gsap.utils.toArray<HTMLElement>(
        '[data-reveal-supporting]',
        root,
      );

      const cards = gsap.utils.toArray<HTMLElement>('[data-reveal-card]', root);

      if (prefersReducedMotion) {
        gsap.set([featured, ...supporting, ...cards].filter(Boolean), {
          opacity: 1,
          y: 0,
        });

        return;
      }

      if (featured) {
        gsap.fromTo(
          featured,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: featured,
              start: 'top 86%',
              once: true,
            },
          },
        );
      }

      if (supporting.length) {
        gsap.fromTo(
          supporting,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: supporting[0],
              start: 'top 86%',
              once: true,
            },
          },
        );
      }

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            delay: (index % 4) * 0.045,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    },
    {
      scope: rootRef,
    },
  );

  return (
    <section ref={rootRef}>
      {recipes.length === 0 ? (
        <div className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center mx-auto border border-border min-h-100 container">
            <p className="text-muted-foreground text-sm">
              Chưa có công thức nào.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ───────────────── FEATURED ───────────────── */}
          <div className="border-border border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 container">
              <div className="gap-y-8 grid grid-cols-12 mb-10 sm:mb-14">
                <div className="col-span-12 lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary size-1.5" />

                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                      Recipe / 00
                    </span>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                    Gợi ý hôm nay
                  </h2>

                  <p className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Những món ăn nổi bật để bắt đầu — dễ theo dõi, rõ thời gian
                    và phù hợp với nhịp nấu ăn hàng ngày.
                  </p>
                </div>
              </div>

              {/* Lead feature */}
              {leadRecipe && <FeaturedRecipe recipe={leadRecipe} index={0} />}

              {/* Supporting features */}
              {supportingRecipes.length > 0 && (
                <div className="gap-px grid md:grid-cols-2 mt-px border-l">
                  {supportingRecipes.map((recipe, index) => (
                    <SupportingRecipe
                      key={recipe._id}
                      recipe={recipe}
                      index={index + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ───────────────── ALL RECIPES ───────────────── */}
          {remaining.length > 0 && (
            <div>
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-6 mb-8 pb-5 border-border border-b">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-primary size-1.5" />

                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                        Recipe / 00
                      </span>
                    </div>

                    <h2 className="mt-3 font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                      Tất cả công thức
                    </h2>
                  </div>

                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                    {String(remaining.length).padStart(2, '0')} công thức
                  </span>
                </div>

                <div className="gap-px grid sm:grid-cols-2 lg:grid-cols-4 border-l">
                  {remaining.map((recipe, index) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      index={index + featured.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function FeaturedRecipe({ recipe, index }: { recipe: Recipe; index: number }) {
  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1600);

  return (
    <Link
      data-reveal-featured
      href={`/cook/${recipe.slug}`}
      className="group block border border-border"
    >
      <article className="grid lg:grid-cols-12 min-h-140">
        {/* Content */}
        <div className="flex flex-col justify-between lg:col-span-6 p-6 sm:p-8 lg:p-10 xl:p-12">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Featured
                </span>
              </div>

              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.16em]">
                Cook now
              </span>
            </div>

            <h3 className="mt-10 max-w-xl font-heading font-medium group-hover:text-primary text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em] transition-colors">
              {recipe.name}
            </h3>

            <p className="mt-6 max-w-md text-muted-foreground text-sm sm:text-base leading-[1.8]">
              {recipe.description}
            </p>
          </div>

          <div className="mt-14">
            <RecipeMeta recipe={recipe} />

            <div className="flex justify-between items-center mt-8 pt-5 border-border border-t">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                Xem công thức
              </span>

              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:col-span-6 bg-card min-h-90 lg:min-h-full overflow-hidden">
          {coverSrc ? (
            <ViewTransition
              name={`recipe-${recipe._id}-cover`}
              share="image-clip"
              default="none"
            >
              <Image
                src={coverSrc}
                alt={recipe.coverImage?.alt || recipe.name}
                fill
                priority
                className="brightness-80 group-hover:brightness-100 object-cover transition-[filter] duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </ViewTransition>
          ) : (
            <RecipeImagePlaceholder />
          )}

          <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-background/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </article>
    </Link>
  );
}

function SupportingRecipe({
  recipe,
  index,
}: {
  recipe: Recipe;
  index: number;
}) {
  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1000);

  return (
    <Link
      data-reveal-supporting
      href={`/cook/${recipe.slug}`}
      className="group bg-background border-r border-b"
    >
      <article>
        <div className="relative bg-card aspect-16/10 overflow-hidden">
          {coverSrc ? (
            <ViewTransition
              name={`recipe-${recipe._id}-cover`}
              share="image-clip"
              default="none"
            >
              <Image
                src={coverSrc}
                alt={recipe.coverImage?.alt || recipe.name}
                fill
                className="brightness-80 group-hover:brightness-100 object-cover transition-[filter] duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </ViewTransition>
          ) : (
            <RecipeImagePlaceholder />
          )}

          <span className="top-4 left-4 absolute bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[9px] text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <RecipeMeta recipe={recipe} />

          <h3 className="mt-7 max-w-xl font-heading font-medium group-hover:text-primary text-2xl sm:text-3xl leading-[1.05] tracking-[-0.035em] transition-colors">
            {recipe.name}
          </h3>

          <p className="mt-4 max-w-lg text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          <div className="flex justify-between items-center mt-8 pt-5 border-border border-t">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              Xem công thức
            </span>

            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}

function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 800);

  return (
    <Link
      data-reveal-card
      href={`/cook/${recipe.slug}`}
      className="group flex flex-col bg-background border-y border-r"
    >
      <article className="flex flex-col h-full">
        <div className="relative bg-card aspect-4/3 overflow-hidden">
          {coverSrc ? (
            <ViewTransition
              name={`recipe-${recipe._id}-cover`}
              share="image-clip"
              default="none"
            >
              <Image
                src={coverSrc}
                alt={recipe.coverImage?.alt || recipe.name}
                fill
                className="brightness-80 group-hover:brightness-100 object-cover transition-[filter] duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </ViewTransition>
          ) : (
            <RecipeImagePlaceholder />
          )}

          <span className="top-4 left-4 absolute bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[9px] text-muted-foreground">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="bottom-0 left-0 absolute bg-primary w-0 group-hover:w-full h-px transition-[width] duration-500" />
        </div>

        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <RecipeMeta recipe={recipe} />

          <h3 className="mt-6 font-heading font-medium group-hover:text-primary text-xl sm:text-2xl leading-[1.1] tracking-tight transition-colors">
            {recipe.name}
          </h3>

          <p className="mt-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>

          <div className="flex justify-between items-end mt-auto pt-8">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              Xem công thức
            </span>

            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </article>
    </Link>
  );
}

function RecipeMeta({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] text-muted-foreground uppercase tracking-[0.14em]">
      <span className="flex items-center gap-1.5">
        <Users className="size-3 text-primary" />
        {recipe.servings} khẩu phần
      </span>

      <span className="flex items-center gap-1.5">
        <Clock className="size-3 text-primary" />
        {formatMinutes(recipe.cookTime)} nấu
      </span>
    </div>
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

export default RecipeBrowser;
