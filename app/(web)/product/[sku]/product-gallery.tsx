'use client';

import { getImageUrl, SanityImage } from '@/sanity/lib/image';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type SourceRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ProductGalleryProps = {
  gallery: SanityImage[];
  title: string;
};

export function ProductGallery({ gallery, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);

  function open(index: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    setSourceRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    setActiveIndex(index);
  }

  function finishClose() {
    setActiveIndex(null);
    setSourceRect(null);
  }

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) return null;

      return current === 0 ? gallery.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) return null;

      return current === gallery.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <div className="flex gap-3 -mx-4 px-4 pb-2 overflow-x-auto snap-mandatory snap-x scrollbar-none">
          {gallery.map((image, index) => (
            <GalleryItem
              key={image.asset?._ref ?? index}
              image={image}
              title={title}
              index={index}
              count={gallery.length}
              priority={index === 0}
              onClick={(element) => open(index, element)}
              className="flex-[0_0_88%] sm:flex-[0_0_72%] aspect-[4/3] snap-center"
            />
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden gap-px lg:grid grid-cols-2 bg-border border border-border">
        {gallery.map((image, index) => (
          <GalleryItem
            key={image.asset?._ref ?? index}
            image={image}
            title={title}
            index={index}
            count={gallery.length}
            priority={index === 0}
            onClick={(element) => open(index, element)}
            className={
              index === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
            }
          />
        ))}
      </div>

      {activeIndex !== null && sourceRect && (
        <GalleryLightbox
          gallery={gallery}
          title={title}
          activeIndex={activeIndex}
          sourceRect={sourceRect}
          onClose={finishClose}
          onPrevious={showPrevious}
          onNext={showNext}
        />
      )}
    </>
  );
}

function GalleryItem({
  image,
  title,
  index,
  count,
  priority,
  onClick,
  className = '',
}: {
  image: SanityImage;
  title: string;
  index: number;
  count: number;
  priority?: boolean;
  onClick: (element: HTMLElement) => void;
  className?: string;
}) {
  const src = getImageUrl(image, 1600);

  if (!src) return null;

  return (
    <button
      type="button"
      onClick={(event) => onClick(event.currentTarget)}
      aria-label={`Xem ảnh ${index + 1} của ${title}`}
      className={[
        'group relative block hover:opacity-90 bg-card overflow-hidden cursor-zoom-in',
        className,
      ].join(' ')}
    >
      <Image
        src={src}
        alt={image.alt || `${title} ${index + 1}`}
        fill
        priority={priority}
        className="p-5 xl:p-8 object-contain transition-transform duration-700 ease-out"
        sizes={
          index === 0
            ? '(max-width: 1024px) 90vw, 60vw'
            : '(max-width: 1024px) 90vw, 30vw'
        }
      />

      <span className="top-5 left-5 absolute bg-primary size-1.5" />

      <div className="right-5 bottom-5 left-5 absolute flex justify-between items-center pointer-events-none">
        <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
          Product / Gallery
        </span>

        <span className="bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[8px] text-muted-foreground">
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(count).padStart(2, '0')}
        </span>
      </div>
    </button>
  );
}

function GalleryLightbox({
  gallery,
  title,
  activeIndex,
  sourceRect,
  onClose,
  onPrevious,
  onNext,
}: {
  gallery: SanityImage[];
  title: string;
  activeIndex: number;
  sourceRect: SourceRect;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);

  const closingRef = useRef(false);

  const image = gallery[activeIndex];
  const src = getImageUrl(image, 2400);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }

      if (event.key === 'ArrowLeft') {
        onPrevious();
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (!imageFrameRef.current) return;

    const frame = imageFrameRef.current;

    const padding = window.innerWidth < 640 ? 20 : 64;

    const targetTop = 72;
    const targetLeft = padding;

    const targetWidth = window.innerWidth - padding * 2;

    const targetHeight = window.innerHeight - 120;

    gsap.set(frame, {
      position: 'fixed',
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
    });

    gsap.set(backdropRef.current, {
      opacity: 0,
    });

    gsap.set(chromeRef.current, {
      opacity: 0,
      y: -8,
    });

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    });

    tl.to(
      backdropRef.current,
      {
        opacity: 1,
        duration: 0.35,
      },
      0,
    );

    tl.to(
      frame,
      {
        top: targetTop,
        left: targetLeft,
        width: targetWidth,
        height: targetHeight,
        duration: 0.55,
        ease: 'power4.inOut',
      },
      0,
    );

    tl.to(
      chromeRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
      },
      0.25,
    );

    return () => {
      tl.kill();
    };
  }, []);

  function close() {
    if (closingRef.current) return;
    if (!imageFrameRef.current) return;

    closingRef.current = true;

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(
      chromeRef.current,
      {
        opacity: 0,
        duration: 0.2,
      },
      0,
    );

    tl.to(
      imageFrameRef.current,
      {
        top: sourceRect.top,
        left: sourceRect.left,
        width: sourceRect.width,
        height: sourceRect.height,
        duration: 0.5,
        ease: 'power4.inOut',
      },
      0,
    );

    tl.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.35,
      },
      0.12,
    );
  }

  if (!src) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Thư viện ảnh ${title}`}
      className="z-[100] fixed inset-0"
    >
      {/* BACKDROP */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={close}
      />

      {/* IMAGE */}
      <div
        ref={imageFrameRef}
        className="z-20 overflow-hidden cursor-zoom-out"
        onClick={close}
      >
        <div className="relative w-full h-full">
          <Image
            key={src}
            src={src}
            alt={image.alt || `${title} ${activeIndex + 1}`}
            fill
            priority
            draggable={false}
            className="object-contain select-none"
            sizes="100vw"
          />
        </div>
      </div>

      {/* UI */}
      <div
        ref={chromeRef}
        className="z-30 absolute inset-0 pointer-events-none"
      >
        <div className="flex justify-between items-center px-4 sm:px-6 border-white/10 border-b h-16 pointer-events-auto">
          <div className="flex items-center gap-4">
            <span className="bg-primary size-1.5" />

            <span className="font-mono text-[9px] text-white/50 uppercase tracking-[0.2em]">
              Levia / Product Gallery
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="font-mono text-[9px] text-white/50">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(gallery.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={close}
              className="flex justify-center items-center hover:bg-white border border-white/15 size-10 text-white/70 hover:text-black transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevious}
              className="top-1/2 left-4 sm:left-6 absolute flex justify-center items-center bg-black/30 hover:bg-white backdrop-blur-sm border border-white/15 size-11 sm:size-12 text-white/70 hover:text-black transition-colors -translate-y-1/2 pointer-events-auto"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={onNext}
              className="top-1/2 right-4 sm:right-6 absolute flex justify-center items-center bg-black/30 hover:bg-white backdrop-blur-sm border border-white/15 size-11 sm:size-12 text-white/70 hover:text-black transition-colors -translate-y-1/2 pointer-events-auto"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <div className="right-0 bottom-0 left-0 absolute flex justify-between px-4 sm:px-6 pb-5 pointer-events-none">
          <span className="font-mono text-[8px] text-white/40 uppercase tracking-[0.18em]">
            Nhấn vào ảnh để đóng
          </span>

          <span className="hidden sm:block font-mono text-[8px] text-white/40 uppercase tracking-[0.18em]">
            ← → Chuyển ảnh · ESC Đóng
          </span>
        </div>
      </div>
    </div>
  );
}
