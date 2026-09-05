import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/sanity/lib/image';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts, getCategories } from './action';

export const metadata = {
  title: 'Sản phẩm — Levia',
  description:
    'Khám phá các dòng bếp từ và máy hút mùi Levia — thiết kế bằng AI, nấu chuẩn vị Việt.',
};

export default async function ProductPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* ──────── HERO ──────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            Product
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight">
            Sản phẩm Levia
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground text-lg">
            Bếp từ thế hệ AI và phụ kiện — thiết kế tinh gọn theo thẩm mỹ châu
            Âu, làm ra để nấu chuẩn vị Việt.
          </p>
        </div>
      </section>

      {/* ──────── CATEGORIES ──────── */}
      <section className="bg-card py-12 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="bg-background px-4 py-2 border border-border hover:border-primary/30 font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {cat.label}
                <span className="ml-1.5 text-primary text-xs">
                  {cat.count}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── PRODUCT GRID BY CATEGORY ──────── */}
      {categories.map((cat) => {
        const catProducts = products.filter(
          (p) => p.category?.slug === cat.slug,
        );

        return (
          <section
            key={cat.slug}
            id={cat.slug}
            className="bg-background py-16 sm:py-20 border-border border-t"
          >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <h2 className="mb-2 font-heading text-2xl sm:text-3xl tracking-tight">
                {cat.label}
              </h2>
              {cat.description && (
                <p className="mb-8 text-muted-foreground text-sm">
                  {cat.description}
                </p>
              )}

              <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
                {catProducts.map((product) => {
                  const heroSrc = getImageUrl(
                    product.heroImage ?? undefined,
                    600,
                  );

                  return (
                    <Link
                      key={product.sku}
                      href={`/product/${product.sku}`}
                      className="group"
                    >
                      <Card className="hover:ring-primary/30 overflow-hidden transition-colors">
                        {/* Product image */}
                        <div className="relative bg-muted/30 aspect-4/3 overflow-hidden">
                          {heroSrc ? (
                            <Image
                              src={heroSrc}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex flex-col justify-center items-center gap-2 h-full text-muted-foreground">
                              <div className="bg-primary/5 p-3">
                                <span className="font-medium text-primary text-xs">
                                  {product.sku.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs">Ảnh sản phẩm</span>
                            </div>
                          )}
                        </div>

                        <CardHeader>
                          <CardTitle className="font-semibold group-hover:text-primary text-sm transition-colors">
                            {product.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-xs">
                            {product.desc}
                          </p>
                          <div className="flex justify-between items-center mt-4">
                            {product.price != null && (
                              <span className="font-semibold text-foreground text-sm">
                                {product.price.toLocaleString('vi-VN')}₫
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-medium text-primary text-xs">
                              Chi tiết
                              <ChevronRight className="size-3.5" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
