import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getImageUrl } from '@/sanity/lib/image';
import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProductSkus, getProductBySku } from './action';

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
  if (!product) return { title: 'Không tìm thấy — Levia' };
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
    <>
      {/* ──────── HERO ──────── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="items-start gap-12 grid lg:grid-cols-2">
            {/* Product image */}
            <div className="relative flex justify-center items-center">
              <div className="relative bg-muted/30 p-8 border border-border w-full aspect-square">
                {product.gallery ? (
                  <Image
                    src={getImageUrl(product.gallery[0])!}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-4 h-full text-muted-foreground">
                    <div className="bg-primary/5 p-6 border border-primary/20">
                      <span className="font-bold text-primary text-lg">
                        {product.sku.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-sm">{product.title}</span>
                    <span className="text-xs">Ảnh render sản phẩm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <p className="mb-1 font-medium text-primary text-sm">
                  {product.sku}
                </p>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                  {product.title}
                </h1>
              </div>

              {product.price != null && (
                <p className="font-bold text-foreground text-2xl">
                  {product.price.toLocaleString('vi-VN')}₫
                </p>
              )}

              {/* Key specs as features */}
              <ul className="space-y-2.5">
                {product.specs.map(({ label, value }, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-muted-foreground text-sm"
                  >
                    <ChevronRight className="mt-0.5 size-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">
                      {label}:
                    </span>{' '}
                    {value}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/agency">
                  <Button size="lg" className="gap-2">
                    <MapPin className="size-4" />
                    Tìm đại lý gần bạn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── GALLERY ──────── */}
      {product.gallery && product.gallery.length > 1 && (
        <section className="bg-background py-12 border-border border-t">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="mb-8 font-heading text-2xl sm:text-3xl text-center tracking-tight">
              Thư viện ảnh
            </h2>
            <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {product.gallery.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="relative bg-muted/30 aspect-4/3 overflow-hidden"
                >
                  {getImageUrl(img, 600) && (
                    <Image
                      src={getImageUrl(img, 600)!}
                      alt={img.alt || `${product.title} ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────── SPECS ──────── */}
      <section className="bg-background py-16 sm:py-24 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
              Thông số
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
              Thông số kỹ thuật
            </h2>
          </div>

          <div className="border border-border overflow-hidden">
            <Table>
              <TableBody>
                {product.specs.map(({ label, value }, i) => (
                  <TableRow
                    key={label}
                    className={i % 2 === 0 ? 'bg-card' : 'bg-background'}
                  >
                    <TableCell className="px-6 py-3.5 font-medium text-foreground">
                      {label}
                    </TableCell>
                    <TableCell className="px-6 py-3.5 font-mono text-muted-foreground">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* ──────── DETAILED CONTENT (Portable Text) ──────── */}
      {product.content && product.content.length > 0 && (
        <section className="bg-card py-16 sm:py-24 border-border border-t">
          <div className="prose-invert dark:prose-invert mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose">
            <PortableText value={product.content} components={components} />
          </div>
        </section>
      )}

      {/* ──────── CTA ──────── */}
      <section className="bg-card py-16 sm:py-20 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <MapPin className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="font-heading text-2xl sm:text-3xl tracking-tight">
            Trải nghiệm {product.title} tại đại lý
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground text-sm">
            Tìm cửa hàng gần nhất để xem và dùng thử sản phẩm trực tiếp.
          </p>
          <div className="mt-6">
            <Link href="/agency">
              <Button size="lg" className="gap-2">
                <MapPin className="size-4" />
                Tìm đại lý gần bạn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
