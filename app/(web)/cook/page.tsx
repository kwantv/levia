import { getImageUrl } from '@/sanity/lib/image';
import { ArrowUpRight, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import DotGridBackground from '@/components/dot-grid-background';
import { getAllRecipes } from './action';

export const metadata = {
  title: 'Công thức món Việt — Levia',
  description:
    'Khám phá công thức món Việt với thời gian chuẩn bị, thời gian nấu và từng bước thực hiện rõ ràng trên bếp từ.',
};

type Recipe = Awaited<ReturnType<typeof getAllRecipes>>[number];

function formatMinutes(minutes: number) {
  return `${minutes} phút`;
}

export default async function CookPage() {
  const recipes = await getAllRecipes();

  const featured = recipes.slice(0, 3);
  const remaining = recipes.slice(3);

  const leadRecipe = featured[0];
  const supportingRecipes = featured.slice(1);

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-[700px] pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Cook / 01
                </span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h1 className="max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.055em]">
                Cook <span className="text-primary">now</span>
              </h1>

              <div className="gap-8 grid sm:grid-cols-2 mt-12 lg:mt-16 pt-6 border-border border-t">
                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Công thức món Việt được trình bày rõ ràng theo từng bước, giúp
                  bạn chủ động chuẩn bị, kiểm soát thời gian và hoàn thiện món
                  ăn dễ dàng hơn.
                </p>

                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Không chỉ là công thức — đây còn là cách hiểu nhiệt, thời gian
                  và cách bếp từ phản hồi trong từng món ăn.
                </p>
              </div>
            </div>
          </div>

          <div className="gap-px grid grid-cols-2 md:grid-cols-4 mt-20 bg-border border border-border">
            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Công thức
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(recipes.length).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Chủ đề
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                Việt
              </span>
            </div>

            <div className="hidden md:block md:col-span-2 bg-background p-6">
              <div className="flex justify-end items-end h-full">
                <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                  Levia / Cook Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {recipes.length === 0 ? (
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center mx-auto border border-border min-h-[400px] container">
            <p className="text-muted-foreground text-sm">
              Chưa có công thức nào.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* ───────────────── FEATURED ───────────────── */}
          <section className="border-border border-b">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 container">
              <div className="gap-y-8 lg:gap-x-8 grid grid-cols-12 mb-10 sm:mb-14">
                <div className="col-span-12 lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary size-1.5" />

                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                      Featured / 01
                    </span>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em]">
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
                <div className="gap-px grid md:grid-cols-2 mt-px bg-border border-border border-x border-b">
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
          </section>

          {/* ───────────────── ALL RECIPES ───────────────── */}
          {remaining.length > 0 && (
            <section>
              <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-6 mb-8 pb-5 border-border border-b">
                  <div>
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                      Recipe Index
                    </span>

                    <h2 className="mt-3 font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                      Tất cả công thức
                    </h2>
                  </div>

                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                    {String(remaining.length).padStart(2, '0')} công thức
                  </span>
                </div>

                <div className="gap-px grid sm:grid-cols-2 lg:grid-cols-3 bg-border border border-border">
                  {remaining.map((recipe, index) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      index={index + featured.length}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function FeaturedRecipe({ recipe, index }: { recipe: Recipe; index: number }) {
  const coverSrc = getImageUrl(recipe.coverImage ?? undefined, 1600);

  return (
    <Link
      href={`/cook/${recipe.slug}`}
      className="group block border border-border"
    >
      <article className="grid lg:grid-cols-12 min-h-[560px]">
        {/* Content */}
        <div className="flex flex-col justify-between lg:col-span-5 p-6 sm:p-8 lg:p-10 xl:p-12">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-primary uppercase tracking-[0.2em]">
                {String(index + 1).padStart(2, '0')} / Featured
              </span>

              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.16em]">
                Cook now
              </span>
            </div>

            <h3 className="mt-10 max-w-xl font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1] tracking-[-0.045em]">
              {recipe.name}
            </h3>

            <p className="mt-6 max-w-md text-muted-foreground text-sm sm:text-base leading-[1.8]">
              {recipe.description}
            </p>
          </div>

          <div className="mt-14">
            <RecipeMeta recipe={recipe} />

            <div className="flex justify-between items-center mt-8 pt-5 border-border border-t font-mono text-muted-foreground">
              <span className="font-medium text-sm">Xem công thức</span>

              <ActionSquare />
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative lg:col-span-7 bg-card min-h-[360px] lg:min-h-full overflow-hidden">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={recipe.coverImage?.alt || recipe.name}
              fill
              priority
              className="object-cover group-hover:scale-[1.025] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <RecipeImagePlaceholder />
          )}

          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background/30 via-transparent to-transparent pointer-events-none" />

          <span className="top-5 left-5 absolute bg-primary size-1.5" />
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
    <Link href={`/cook/${recipe.slug}`} className="group bg-background">
      <article>
        <div className="relative bg-card aspect-[16/10] overflow-hidden">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={recipe.coverImage?.alt || recipe.name}
              fill
              className="object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
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
      href={`/cook/${recipe.slug}`}
      className="group flex flex-col bg-background"
    >
      <article className="flex flex-col h-full">
        <div className="relative bg-card aspect-[4/3] overflow-hidden">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={recipe.coverImage?.alt || recipe.name}
              fill
              className="object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
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

          <h3 className="mt-6 font-heading font-medium group-hover:text-primary text-xl sm:text-2xl leading-[1.1] tracking-[-0.025em] transition-colors">
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

function ActionSquare() {
  return (
    <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
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
