'use client';

import { getImageUrl } from '@/sanity/lib/image';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState, ViewTransition } from 'react';
import type { CategoryGroup, ProductListItem } from './action';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ProductBrowserProps = {
  products: ProductListItem[];
  categories: CategoryGroup[];
};

const ALL_CATEGORIES = 'all';

export function ProductBrowser({ products, categories }: ProductBrowserProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

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

  const currentIndex =
    activeCategory === 'all'
      ? -1
      : categories.findIndex((c) => c.slug === activeCategory);

  const prevIndexRef = useRef<number>(currentIndex);
  const prevLabelRef = useRef(selectedCategory?.label ?? 'Tất cả sản phẩm');
  const prevDescRef = useRef(
    selectedCategory?.description ?? 'Công nghệ cho căn bếp hiện đại',
  );

  useGSAP(
    () => {
      const root = headerRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      if (prefersReducedMotion) return;

      // Grab the wrappers and the actual text elements
      const labelWrapper = root.querySelector<HTMLElement>(
        '[data-label-wrapper]',
      );
      const label = labelWrapper?.querySelector<HTMLElement>('h2');

      const descWrapper = root.querySelector<HTMLElement>(
        '[data-desc-wrapper]',
      );
      const desc = descWrapper?.querySelector<HTMLElement>('p');

      if (!labelWrapper || !label || !descWrapper || !desc) return;

      const currentLabelText = label.innerText;
      const currentDescText = desc.innerText;

      // Bail out if text hasn't actually changed (prevents React StrictMode double-fire issues)
      if (currentLabelText === prevLabelRef.current) return;

      const isNext = currentIndex > prevIndexRef.current;
      const yOffset = 30; // Pixel distance for the roll

      // 1. Dynamically create clones of the OLD text
      const cloneLabel = document.createElement('h2');
      cloneLabel.className = `${label.className} absolute top-0 left-0 w-full`;
      cloneLabel.innerText = prevLabelRef.current;
      labelWrapper.appendChild(cloneLabel);

      const cloneDesc = document.createElement('p');
      cloneDesc.className = `${desc.className} absolute top-0 left-0 w-full`;
      cloneDesc.innerText = prevDescRef.current;
      descWrapper.appendChild(cloneDesc);

      // 2. Set the NEW text to its starting offset
      gsap.set([label, desc], {
        y: isNext ? yOffset : -yOffset,
        opacity: 0,
      });

      gsap.set([labelWrapper, descWrapper], { overflow: 'hidden' });

      const tl = gsap.timeline({
        onComplete: () => {
          // Destroy the clones when done
          cloneLabel.remove();
          cloneDesc.remove();
          labelWrapper.style.overflow = 'visible';
          descWrapper.style.overflow = 'visible';
        },
      });

      const duration = 0.35;
      const ease = 'power3.inOut';

      // 3. Roll the Title
      tl.to(
        cloneLabel,
        {
          y: isNext ? -yOffset : yOffset,
          opacity: 0,
          duration,
          ease,
        },
        0,
      );

      tl.to(
        label,
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
        },
        0,
      );

      // 4. Roll the Description (with a 0.05s stagger for polish)
      tl.to(
        cloneDesc,
        {
          y: isNext ? -yOffset : yOffset,
          opacity: 0,
          duration,
          ease,
        },
        0,
      );

      tl.to(
        desc,
        {
          y: 0,
          opacity: 1,
          duration,
          ease,
        },
        0,
      );

      // 5. Update refs synchronously so rapid clicking calculates correctly
      prevIndexRef.current = currentIndex;
      prevLabelRef.current = currentLabelText;
      prevDescRef.current = currentDescText;

      // Cleanup in case user rapid clicks before animation finishes
      return () => {
        tl.kill();
        cloneLabel.remove();
        cloneDesc.remove();
      };
    },
    { dependencies: [activeCategory], scope: headerRef },
  );

  useGSAP(
    () => {
      const root = productsRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        '[data-product-card]',
        root,
      );

      if (!cards.length) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(cards, {
          opacity: 1,
          y: 0,
        });

        return;
      }

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
          overwrite: true,
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            once: true,
          },
        },
      );
    },
    {
      dependencies: [activeCategory],
      scope: productsRef,
      revertOnUpdate: true,
    },
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 container">
      {/* HEADER */}
      <section ref={headerRef} className="gap-y-6 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-3">
          <div className="flex items-center gap-3">
            <span className="bg-primary size-1.5" />

            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
              Collection / {String(currentIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-5 pb-6 border-b">
            <div className="space-y-3">
              <div
                data-label-wrapper
                key={`label-${activeCategory}`}
                className="relative"
              >
                <h2 className="font-heading font-medium text-3xl sm:text-4xl tracking-[-0.035em]">
                  {selectedCategory?.label ?? 'Tất cả sản phẩm'}
                </h2>
              </div>

              <div
                data-desc-wrapper
                key={`desc-${activeCategory}`}
                className="relative"
              >
                <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
                  {selectedCategory?.description ??
                    'Công nghệ cho căn bếp hiện đại'}
                </p>
              </div>
            </div>

            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
              {String(filteredProducts.length).padStart(2, '0')} sản phẩm
            </span>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-12 mb-10 sm:mb-14 py-5">
        <div className="lg:col-span-9 lg:col-start-4 overflow-hidden">
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

      {/* PRODUCTS */}
      {filteredProducts.length > 0 ? (
        <section
          ref={productsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 border-border border-t border-l"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center border border-border min-h-100 text-center">
          <span className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
            00 / Empty
          </span>

          <p className="mt-4 text-muted-foreground text-sm">
            Chưa có sản phẩm trong danh mục này.
          </p>
        </section>
      )}
    </div>
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
        'transition-colors duration-300 cursor-pointer',
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-background text-muted-foreground hover:bg-primary/5 hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function ProductCard({ product }: { product: ProductListItem }) {
  const imageSrc = getImageUrl(product.heroImage ?? undefined, 1000);

  return (
    <Link
      data-product-card
      href={`/product/${product.sku}`}
      className="group flex flex-col bg-background border-border border-r border-b min-w-0"
    >
      <article className="flex flex-col flex-1">
        {/* IMAGE */}
        <div className="relative bg-card aspect-4/3 overflow-hidden">
          {imageSrc ? (
            <ViewTransition
              name={`product-${product.sku}-hero`}
              share="image-clip"
              default="none"
            >
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="brightness-80 group-hover:brightness-100 object-cover transition-[filter] duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </ViewTransition>
          ) : (
            <ProductPlaceholder product={product} />
          )}

          <span className="right-4 bottom-4 absolute bg-background/80 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] text-foreground uppercase tracking-[0.16em]">
            {product.sku}
          </span>

          <div className="bottom-0 left-0 absolute bg-primary w-0 group-hover:w-full h-px transition-[width] duration-500 ease-out" />
        </div>

        {/* INFO */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
            {product.category?.title ?? 'Levia'}
          </span>

          <h3 className="mt-2 font-heading font-medium group-hover:text-primary text-xl sm:text-2xl tracking-tight transition-colors duration-300">
            {product.title}
          </h3>

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
      <span className="font-mono text-[8px] text-muted-foreground/40 uppercase tracking-[0.18em]">
        Levia / {product.sku}
      </span>
    </div>
  );
}
