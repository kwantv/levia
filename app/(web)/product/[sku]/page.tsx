import DotGridBackground from '@/components/dot-grid-background';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllProductSkus, getProductBySku } from './action';
import { ProductDetailBlocks } from './product-detail-blocks';
import { ProductGallery } from './product-gallery';
import { ProductMeta } from './product-meta';
import ProductSpecs from './product-specs';

type PageProps = {
  params: Promise<{ sku: string }>;
};

export async function generateStaticParams() {
  const skus = await getAllProductSkus();

  return skus.map((sku) => ({ sku }));
}

export async function generateMetadata({ params }: PageProps) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return {
      title: 'Không tìm thấy — Levia',
    };
  }

  return {
    title: product.seoTitle || `${product.title} — Levia`,
    description: product.seoDescription || product.desc,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { sku } = await params;

  const product = await getProductBySku(sku);

  if (!product) notFound();

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative border-border border-b">
        <DotGridBackground />

        {/* <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-[700px] pointer-events-none" /> */}

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pb-20 container">
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link
              href="/product"
              className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Tất cả sản phẩm
            </Link>

            <span className="hidden sm:block font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
              Levia / Kitchen Intelligence
            </span>
          </div>

          <div className="gap-y-12 lg:gap-x-10 grid grid-cols-12 mt-12 sm:mt-16">
            {/* PRODUCT INFO */}
            <div className="col-span-12 lg:col-span-5">
              <ProductMeta product={product} />
            </div>

            {/* GALLERY */}
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <ProductGallery
                productSKU={product.sku}
                gallery={product.gallery}
                title={product.title}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CUSTOM PRODUCT BLOCKS ───────────────── */}
      {product.detailBlocks.length > 0 && (
        <ProductDetailBlocks blocks={product.detailBlocks} />
      )}

      {/* ───────────────── TECHNICAL SPECIFICATIONS ───────────────── */}
      {product.specs.length > 0 && <ProductSpecs product={product} />}

      {/* ───────────────── DEALER CTA ───────────────── */}
      <section className="border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <Link
            href="/agency"
            className="group grid lg:grid-cols-12 border-border border-x"
          >
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10 lg:border-border lg:border-r">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Experience / 07
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end gap-8 lg:col-span-9 p-6 sm:p-8 lg:p-10">
              <div>
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                  Trải nghiệm trực tiếp
                </span>

                <h2 className="mt-3 max-w-3xl font-heading font-medium text-2xl sm:text-3xl lg:text-4xl tracking-[-0.035em]">
                  Trải nghiệm {product.title} tại đại lý Levia
                </h2>

                <p className="mt-4 max-w-lg text-muted-foreground text-sm leading-relaxed">
                  Tìm showroom gần bạn để xem sản phẩm, trải nghiệm trực tiếp và
                  nhận tư vấn phù hợp với không gian bếp.
                </p>
              </div>

              <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 sm:size-14 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                <MapPin className="size-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
