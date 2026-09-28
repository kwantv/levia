import { ListingHero as Hero } from '@/components/listing-page-hero';
import { getAllProducts, getCategories } from './action';
import { ProductBrowser } from './product-browser';

export const metadata = {
  title: 'Sản phẩm — Levia',
  description:
    'Khám phá các dòng bếp từ và máy hút mùi Levia — công nghệ hiện đại, thiết kế tinh gọn cho căn bếp Việt.',
};

export default async function ProductPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}
      <Hero
        label="Product / 01"
        title="Công nghệ cho"
        accent="căn bếp hiện đại"
        breakBeforeAccent
        descriptions={[
          'Khám phá hệ sinh thái thiết bị bếp Levia — nơi công nghệ, hiệu suất và thiết kế được phát triển để phù hợp với nhịp sống của gia đình Việt.',
          'Từ bếp từ đến các thiết bị hỗ trợ, mỗi sản phẩm đều hướng đến trải nghiệm sử dụng trực quan, chính xác và bền bỉ.',
        ]}
        stats={[
          {
            label: 'Sản phẩm',
            value: String(products.length).padStart(2, '0'),
            scramble: true,
          },
          {
            label: 'Danh mục',
            value: String(categories.length).padStart(2, '0'),
            scramble: true,
          },
        ]}
        footerLabel="Levia / Kitchen Intelligence"
      />

      <ProductBrowser products={products} categories={categories} />
    </main>
  );
}
