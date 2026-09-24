import DotGridBackground from '@/components/dot-grid-background';
import { getImageUrl } from '@/sanity/lib/image';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllProductSkus, getProductBySku } from './action';
import { ProductDetailBlocks } from './product-detail-blocks';
import { ProductGallery } from './product-gallery';

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

  const heroImage = product.gallery?.[0]
    ? getImageUrl(product.gallery[0], 1600)
    : null;

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
            <div className="top-16 lg:sticky flex flex-col self-start col-span-12 lg:col-span-5 lg:py-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="bg-primary size-1.5" />

                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Product / {product.sku}
                  </span>
                </div>

                {product.category && (
                  <p className="mt-12 font-mono text-[9px] text-primary uppercase tracking-[0.18em]">
                    {product.category.title}
                  </p>
                )}

                <h1 className="mt-4 max-w-xl font-heading font-medium text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.055em]">
                  {product.title}
                </h1>

                <p className="mt-7 max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]">
                  {product.desc}
                </p>
              </div>

              {/* Key specs */}
              <div className="hidden lg:block">
                {product.specs.length > 0 && (
                  <div className="mt-12 border-border border-t">
                    {product.specs.slice(0, 4).map((spec, index) => (
                      <div
                        key={spec.label}
                        className="gap-4 grid grid-cols-[2rem_minmax(0,1fr)_auto] py-4 border-border border-b"
                      >
                        <span className="font-mono text-[9px] text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="text-muted-foreground text-sm">
                          {spec.label}
                        </span>

                        <span className="font-mono text-sm text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mt-12">
                {product.price != null && (
                  <div>
                    <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                      Giá niêm yết
                    </span>

                    <span className="block mt-2 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.03em]">
                      {product.price.toLocaleString('vi-VN')}
                      <span className="ml-1 text-muted-foreground text-lg">
                        ₫
                      </span>
                    </span>
                  </div>
                )}

                <Link
                  href="/agency"
                  className="group flex justify-between items-center gap-6 mt-8 pt-5 border-border border-t"
                >
                  <div>
                    <span className="font-medium text-sm">
                      Tìm đại lý gần bạn
                    </span>

                    <p className="mt-1 text-muted-foreground text-xs">
                      Trải nghiệm sản phẩm trực tiếp tại showroom Levia.
                    </p>
                  </div>

                  <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
                  </div>
                </Link>
              </div>
            </div>

            {/* GALLERY */}
            <div className="col-span-12 lg:col-span-7">
              <ProductGallery gallery={product.gallery} title={product.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── CUSTOM PRODUCT BLOCKS ───────────────── */}

      {/*
        product.content is deliberately ignored here.

        For now we render five mocked layout blocks.
        Later these can become Sanity custom objects.
      */}
      {product.detailBlocks.length > 0 && (
        <ProductDetailBlocks blocks={product.detailBlocks} />
      )}

      {/* ───────────────── TECHNICAL SPECIFICATIONS ───────────────── */}
      {product.specs.length > 0 && (
        <section className="border-border border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
            <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
              <div className="col-span-12 lg:col-span-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary size-1.5" />

                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                    Specification / 06
                  </span>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-5 mb-10">
                  <div>
                    <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em]">
                      Thông số kỹ thuật
                    </h2>

                    <p className="mt-4 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Thông tin chi tiết về kích thước, công suất và các thông
                      số vận hành của {product.title}.
                    </p>
                  </div>

                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                    {String(product.specs.length).padStart(2, '0')} thông số
                  </span>
                </div>

                <div className="border-border border-t">
                  {product.specs.map((spec, index) => (
                    <div
                      key={spec.label}
                      className="gap-4 grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] py-5 border-border border-b"
                    >
                      <span className="font-mono text-[9px] text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="font-medium text-sm">{spec.label}</span>

                      <span className="font-mono text-muted-foreground text-sm sm:text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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

function GalleryMeta({ index, count }: { index: number; count: number }) {
  return (
    <>
      <span className="top-5 left-5 absolute bg-primary size-1.5" />

      <div className="right-5 bottom-5 left-5 absolute flex justify-between items-center">
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
          Product / Gallery
        </span>

        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(count).padStart(2, '0')}
        </span>
      </div>
    </>
  );
}

function ProductPlaceholder({ sku, title }: { sku: string; title: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
      <span className="bg-primary/5 px-5 py-3 border border-primary/10 font-mono text-primary text-sm uppercase tracking-[0.18em]">
        {sku}
      </span>

      <span className="text-muted-foreground text-sm">{title}</span>

      <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.18em]">
        Product / Render
      </span>
    </div>
  );
}
