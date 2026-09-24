import DotGridBackground from '@/components/dot-grid-background';
import { getImageUrl } from '@/sanity/lib/image';
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
      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        {/* Ambient brand glow */}
        <div className="-top-56 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-175 pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            {/* Label */}
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                  Product / 01
                </span>
              </div>
            </div>

            {/* Main copy */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h1 className="max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.055em]">
                Công nghệ cho
                <br />
                <span className="text-primary">căn bếp hiện đại</span>
              </h1>

              <div className="gap-8 grid sm:grid-cols-2 mt-12 lg:mt-16 pt-6 border-border border-t">
                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Khám phá hệ sinh thái thiết bị bếp Levia — nơi công nghệ, hiệu
                  suất và thiết kế được phát triển để phù hợp với nhịp sống của
                  gia đình Việt.
                </p>

                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Từ bếp từ đến các thiết bị hỗ trợ, mỗi sản phẩm đều hướng đến
                  trải nghiệm sử dụng trực quan, chính xác và bền bỉ.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="gap-px grid grid-cols-2 md:grid-cols-4 mt-20 bg-border border border-border">
            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Sản phẩm
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(products.length).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Danh mục
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(categories.length).padStart(2, '0')}
              </span>
            </div>

            <div className="hidden md:block md:col-span-2 bg-background p-6">
              <div className="flex justify-end items-end h-full">
                <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-[0.2em]">
                  Levia / Kitchen Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductBrowser products={products} categories={categories} />
    </main>
  );
}
