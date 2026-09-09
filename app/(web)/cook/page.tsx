import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/sanity/lib/image';
import { ChevronRight, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllRecipes } from './action';

export const metadata = {
  title: 'Công thức món Việt — Levia',
  description:
    'Khám phá công thức món Việt với thời gian chuẩn bị, thời gian nấu và từng bước thực hiện rõ ràng trên bếp từ.',
};

function formatMinutes(minutes: number) {
  return `${minutes} phút`;
}

export default async function CookPage() {
  const recipes = await getAllRecipes();

  return (
    <>
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            Hiểu căn bếp Việt.
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight">
            Công thức món Việt
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground text-lg">
            Mỗi công thức món Việt được trình bày theo từng bước, kèm khẩu phần,
            thời gian chuẩn bị và thời gian nấu. Bạn có thể dễ theo dõi, chủ động
            sắp xếp bữa ăn và hoàn thiện món ngon bằng bếp từ cho cả gia đình.
          </p>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {recipes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Chưa có công thức nào.
            </p>
          ) : (
            <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => {
                const coverSrc = getImageUrl(
                  recipe.coverImage ?? undefined,
                  600,
                );

                return (
                  <Link
                    key={recipe._id}
                    href={`/cook/${recipe.slug}`}
                    className="group"
                  >
                    <Card className="hover:ring-primary/30 overflow-hidden transition-colors h-full flex flex-col">
                      <div className="relative bg-muted/30 aspect-video overflow-hidden">
                        {coverSrc ? (
                          <Image
                            src={coverSrc}
                            alt={recipe.coverImage?.alt || recipe.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full text-muted-foreground">
                            <span className="text-xs">Ảnh món ăn</span>
                          </div>
                        )}
                      </div>

                      <CardHeader className="flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge variant="secondary" className="gap-1 font-normal text-xs">
                            <Users className="size-3" />
                            {recipe.servings} khẩu phần
                          </Badge>
                          <Badge variant="secondary" className="gap-1 font-normal text-xs">
                            <Clock className="size-3" />
                            {formatMinutes(recipe.cookTime)} nấu
                          </Badge>
                        </div>
                        <CardTitle className="font-semibold group-hover:text-primary text-sm transition-colors leading-snug">
                          {recipe.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-muted-foreground text-xs line-clamp-3">
                          {recipe.description}
                        </p>
                        <div className="flex justify-between items-center mt-4 text-xs">
                          <span className="text-muted-foreground">
                            Chuẩn bị {formatMinutes(recipe.prepTime)}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-primary">
                            Xem công thức
                            <ChevronRight className="size-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
