import { ListingHero as Hero } from '@/components/listing-page-hero';
import { getAllRecipes } from './action';
import RecipeBrowser from './recipe-browser';

export const metadata = {
  title: 'Công thức món Việt — Levia',
  description:
    'Khám phá công thức món Việt với thời gian chuẩn bị, thời gian nấu và từng bước thực hiện rõ ràng trên bếp từ.',
};

export default async function CookPage() {
  const recipes = await getAllRecipes();

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}
      <Hero
        label="Cook / 05"
        title="Hiểu căn bếp"
        accent="Việt"
        descriptions={[
          'Công thức món Việt được trình bày rõ ràng theo từng bước, giúp bạn chủ động chuẩn bị, kiểm soát thời gian và hoàn thiện món ăn dễ dàng hơn.',
          'Không chỉ là công thức — đây còn là cách hiểu nhiệt, thời gian và cách bếp từ phản hồi trong từng món ăn.',
        ]}
        stats={[
          {
            label: 'Công thức',
            value: String(recipes.length).padStart(2, '0'),
            scramble: true,
          },
          {
            label: 'Chủ đề',
            value: 'Việt',
            scramble: true,
          },
        ]}
      />

      <RecipeBrowser recipes={recipes} />
    </main>
  );
}
