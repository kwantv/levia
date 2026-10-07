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

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 container">
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link
              href="/product"
              className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Tất cả sản phẩm
            </Link>

            <span className="hidden sm:block font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
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
      <section className="relative border-t overflow-hidden">
        <div className="-bottom-80 -left-40 absolute bg-primary/5 blur-[160px] rounded-full size-[600px]" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <Link
            href="/agency"
            className="group flex justify-between items-center gap-8 py-12 sm:py-16"
          >
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Trải nghiệm trực tiếp
              </span>
              <p className="mt-2 font-heading text-2xl sm:text-3xl tracking-[-0.03em]">
                Trải nghiệm {product.title} tại đại lý Levia
              </p>
              <p className="mt-4 max-w-lg text-muted-foreground text-sm leading-relaxed">
                Tìm showroom gần bạn để xem sản phẩm, trải nghiệm trực tiếp và
                nhận tư vấn phù hợp với không gian bếp.
              </p>
            </div>

            <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 sm:size-14 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
