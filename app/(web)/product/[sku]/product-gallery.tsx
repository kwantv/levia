'use client';

import ImageZoom from '@/components/image-zoom';
import { playAfterPageTransition } from '@/lib/page-transition';
import { cn } from '@/lib/utils';
import { getImageUrl, SanityImage } from '@/sanity/lib/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, ViewTransition } from 'react';

type ProductGalleryProps = {
  productSKU: string;
  gallery: SanityImage[];
  title: string;
};

export function ProductGallery({
  productSKU,
  gallery,
  title,
}: ProductGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = galleryRef.current;
      if (!root) return;

      const items = gsap.utils.toArray<HTMLElement>(
        '[data-gallery-item]:not([data-gallery-hero])',
        root,
      );

      if (!items.length) return;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (reducedMotion) {
        gsap.set(items, {
          autoAlpha: 1,
          y: 0,
        });

        return;
      }

      /*
       * Hide secondary images immediately.
       * The hero remains completely untouched because the browser
       * owns its View Transition animation.
       */
      gsap.set(items, {
        autoAlpha: 0,
        y: 16,
      });

      const tween = gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.065,
        ease: 'power2.out',
        clearProps: 'opacity,visibility,transform',
        paused: true,
      });

      const cancelPlayback = playAfterPageTransition(tween);

      return () => {
        cancelPlayback();
        tween?.kill();
      };
    },
    { scope: galleryRef },
  );

  return (
    <div
      ref={galleryRef}
      className="flex gap-3 lg:gap-px lg:grid lg:grid-cols-2 -mx-4 lg:mx-0 lg:p-0 px-4 pb-2 lg:bg-border lg:border lg:border-border lg:overflow-visible overflow-x-auto snap-mandatory snap-x lg:snap-none scrollbar-none"
    >
      {gallery.map((image, index) => (
        <GalleryItem
          productSKU={productSKU}
          key={image.asset?._ref ?? index}
          image={image}
          title={title}
          index={index}
          count={gallery.length}
          priority={index === 0}
          className={`flex-[0_0_88%] sm:flex-[0_0_72%] snap-center aspect-4/3 ${
            index === 0 ? 'lg:col-span-2 lg:aspect-16/10' : 'lg:aspect-square'
          }`}
        />
      ))}
    </div>
  );
}

function GalleryItem({
  productSKU,
  image,
  title,
  index,
  count,
  priority,
  className = '',
}: {
  productSKU: string;
  image: SanityImage;
  title: string;
  index: number;
  count: number;
  priority?: boolean;
  className?: string;
}) {
  const src = getImageUrl(image, 1600);

  if (!src) return null;

  const content = (
    <ImageZoom
      src={src}
      alt={image.alt || `${title} ${index + 1}`}
      fill
      fetchPriority={priority ? 'high' : 'auto'}
      className="object-cover"
      sizes={
        index === 0
          ? '(max-width: 1024px) 90vw, 60vw'
          : '(max-width: 1024px) 90vw, 30vw'
      }
      group="product-gallery"
    />
  );

  return (
    <div
      data-gallery-item
      data-gallery-hero={index === 0 ? '' : undefined}
      className={cn(
        'group block relative bg-card brightness-85 hover:brightness-105 overflow-hidden transition-[filter] duration-700 ease-out',
        className,
      )}
    >
      {index === 0 ? (
        <ViewTransition
          name={`product-${productSKU}-hero`}
          share="image-clip"
          default="none"
        >
          {content}
        </ViewTransition>
      ) : (
        content
      )}

      <span className="top-3 lg:top-5 left-3 lg:left-5 absolute bg-primary size-1.5" />

      <div className="bottom-2 lg:bottom-5 left-2 lg:left-5 absolute flex justify-between items-center pointer-events-none">
        <span className="bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[8px] text-muted-foreground">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(count).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
