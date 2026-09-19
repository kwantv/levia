'use client';

import { getImageUrl } from '@/sanity/lib/image';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { CategoryGroup, ProductListItem } from './action';

type ProductBrowserProps = {
  products: ProductListItem[];
  categories: CategoryGroup[];
};

const ALL_CATEGORIES = 'all';

export function ProductBrowser({ products, categories }: ProductBrowserProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

  const filteredProducts = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) {
      return products;
    }

    return products.filter(
      (product) => product.category?.slug === activeCategory,
    );
  }, [activeCategory, products]);

  const selectedCategory = categories.find(
    (category) => category.slug === activeCategory,
  );

  return (
    <>
      {/* CATEGORY FILTER */}
      <section className="top-0 z-30 sticky bg-background/90 backdrop-blur-xl border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <div className="gap-6 grid lg:grid-cols-12 py-5">
            <div className="hidden lg:flex items-center lg:col-span-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Danh mục sản phẩm
              </span>
            </div>

            <div className="lg:col-span-9 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-none">
                <CategoryButton
                  active={activeCategory === ALL_CATEGORIES}
                  onClick={() => setActiveCategory(ALL_CATEGORIES)}
                >
                  <span>Tất cả</span>

                  <span className="opacity-40">
                    {String(products.length).padStart(2, '0')}
                  </span>
                </CategoryButton>

                {categories.map((category) => (
                  <CategoryButton
                    key={category.slug}
                    active={activeCategory === category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                  >
                    <span>{category.label}</span>

                    <span className="opacity-40">
                      {String(category.count).padStart(2, '0')}
                    </span>
                  </CategoryButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 container">
          <div className="gap-y-6 lg:gap-x-8 grid grid-cols-12 mb-10 sm:mb-14">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Collection / 01
                </span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-5 pb-6 border-border border-b">
                <div>
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                    {selectedCategory?.label ?? 'Tất cả sản phẩm'}
                  </h2>

                  {selectedCategory?.description && (
                    <p className="mt-3 max-w-xl text-muted-foreground text-sm leading-relaxed">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                  {String(filteredProducts.length).padStart(2, '0')} sản phẩm
                </span>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="gap-px grid sm:grid-cols-2 lg:grid-cols-4 bg-border border border-border">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center border border-border min-h-100 text-center">
              <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                00 / Empty
              </span>

              <p className="mt-4 text-muted-foreground text-sm">
                Chưa có sản phẩm trong danh mục này.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'shrink-0 flex items-center gap-3',
        'h-10 px-4 sm:px-5',
        'border-y border-l border-border last:border-r',
        'font-mono text-[10px] uppercase tracking-[0.14em]',
        'transition-colors duration-300',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background text-muted-foreground hover:bg-primary/5 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: ProductListItem;
  index: number;
}) {
  const imageSrc = getImageUrl(product.heroImage ?? undefined, 1000);

  return (
    <Link
      href={`/product/${product.sku}`}
      className="group flex flex-col bg-background min-w-0"
    >
      <article className="flex flex-col flex-1">
        {/* IMAGE */}
        <div className="relative bg-card aspect-4/3 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-[1.035] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <ProductPlaceholder product={product} />
          )}

          <div className="top-4 left-4 absolute flex justify-center items-center bg-background/80 backdrop-blur-md border border-border size-8">
            <span className="font-mono text-[9px] text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <span className="right-4 bottom-4 absolute bg-background/80 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] text-foreground uppercase tracking-[0.16em]">
            {product.sku}
          </span>

          <div className="bottom-0 left-0 absolute bg-primary w-0 group-hover:w-full h-px transition-[width] duration-500 ease-out" />
        </div>

        {/* INFO */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <div className="flex justify-between items-center gap-4">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              {product.category?.title ?? 'Levia'}
            </span>

            <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.16em]">
              {product.sku}
            </span>
          </div>

          <h3 className="mt-6 font-heading font-medium group-hover:text-primary text-xl sm:text-2xl tracking-tight transition-colors duration-300">
            {product.title}
          </h3>

          {product.desc && (
            <p className="mt-3 text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {product.desc}
            </p>
          )}

          <div className="flex justify-between items-end gap-6 mt-auto pt-8">
            <div>
              <span className="block mb-1 font-mono text-[8px] text-muted-foreground/50 uppercase tracking-[0.18em]">
                Giá tham khảo
              </span>

              {product.price != null ? (
                <span className="font-medium text-base">
                  {product.price.toLocaleString('vi-VN')}
                  <span className="ml-0.5 text-sm">₫</span>
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">Liên hệ</span>
              )}
            </div>

            <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-11 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300">
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ProductPlaceholder({ product }: { product: ProductListItem }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center gap-3">
      <span className="bg-primary/5 px-4 py-2 border border-primary/10 font-mono text-[10px] text-primary uppercase tracking-[0.16em]">
        {product.sku}
      </span>

      <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.18em]">
        Product / Image
      </span>
    </div>
  );
}
