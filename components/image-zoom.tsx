'use client';

import gsap from 'gsap';
import Image, { type ImageProps } from 'next/image';
import { createRoot } from 'react-dom/client';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ZoomPadding =
  number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

type Props = {
  src: ImageProps['src'];
  zoomSrc?: ImageProps['src'];
  alt: string;
  padding?: ZoomPadding;
};

// `props` is a ref so the entry always sees the latest values
// without needing to re-register on every render.
type Entry = { el: HTMLImageElement; props: { current: Props } };

// Room for the header (top) and the nav buttons (left/right).
const DEFAULT_PADDING = { top: 80, right: 72, bottom: 40, left: 72 };

// -----------------------------------------------------------------------------
// Store: galleries + the currently open image
// -----------------------------------------------------------------------------

const groups = new Map<string, Map<string, Entry>>();
const listeners = new Set<() => void>();
let active: { group: string; id: string } | null = null;

function setActive(next: typeof active) {
  active = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Entries of a group in DOM order, so arrow keys follow the page layout. */
function ordered(group: string) {
  return [...(groups.get(group) ?? [])].sort(([, a], [, b]) =>
    a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1,
  );
}

// -----------------------------------------------------------------------------
// Geometry
// -----------------------------------------------------------------------------

/** Where the thumbnail's image really is on screen, plus the clip for object-fit crops. */
function thumbGeometry(el: HTMLImageElement) {
  const b = el.getBoundingClientRect();
  const nw = el.naturalWidth || b.width || 1;
  const nh = el.naturalHeight || b.height || 1;
  const fit = getComputedStyle(el).objectFit;

  const scale =
    fit === 'cover'
      ? Math.max(b.width / nw, b.height / nh)
      : fit === 'contain'
        ? Math.min(b.width / nw, b.height / nh)
        : null;

  const width = scale ? nw * scale : b.width;
  const height = scale ? nh * scale : b.height;
  // Assumes object-position: center.
  const left = b.left - (width - b.width) / 2;
  const top = b.top - (height - b.height) / 2;

  const inset = (n: number) => `${Math.max(0, n)}px`;
  const clip = `inset(${inset(b.top - top)} ${inset(left + width - b.right)} ${inset(
    top + height - b.bottom,
  )} ${inset(b.left - left)})`;

  return { rect: { top, left, width, height }, clip };
}

/** Final fullscreen rect: the image fitted and centered inside the padded area. */
function zoomRect({ el, props }: Entry) {
  const raw = props.current.padding ?? DEFAULT_PADDING;
  const p =
    typeof raw === 'number'
      ? { top: raw, right: raw, bottom: raw, left: raw }
      : { top: 0, right: 0, bottom: 0, left: 0, ...raw };

  const availW = Math.max(1, window.innerWidth - p.left - p.right);
  const availH = Math.max(1, window.innerHeight - p.top - p.bottom);
  const nw = el.naturalWidth || el.clientWidth || 1;
  const nh = el.naturalHeight || el.clientHeight || 1;

  const scale = Math.min(availW / nw, availH / nh);
  const width = nw * scale;
  const height = nh * scale;

  return {
    width,
    height,
    left: p.left + (availW - width) / 2,
    top: p.top + (availH - height) / 2,
  };
}

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// -----------------------------------------------------------------------------
// Lightbox
// -----------------------------------------------------------------------------

function Lightbox() {
  const state = useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
  const [navigatedId, setNavigatedId] = useState<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const UIRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const currentId = navigatedId ?? state?.id ?? null;
  const entry =
    state && currentId ? groups.get(state.group)?.get(currentId) : undefined;

  const list = state ? ordered(state.group) : [];
  const index = list.findIndex(([id]) => id === currentId);

  // Duration helper that respects prefers-reduced-motion.
  const dur = (n: number) => (reducedMotion() ? 0 : n);

  // Open: thumbnail -> fullscreen -------------------------------------------
  useLayoutEffect(() => {
    if (!state) return;

    const first = groups.get(state.group)?.get(state.id);
    if (!first || !boxRef.current || !backdropRef.current || !UIRef.current)
      return;

    const from = thumbGeometry(first.el);
    first.el.style.visibility = 'hidden';
    busy.current = true;

    gsap.set(boxRef.current, {
      ...from.rect,
      clipPath: from.clip,
      x: 0,
      opacity: 1,
    });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(UIRef.current, {
      opacity: 0,
      y: -8,
    });

    const tl = gsap.timeline({ onComplete: () => (busy.current = false) });
    tl.to(backdropRef.current, { opacity: 1, duration: dur(0.2) }, 0)
      .to(
        boxRef.current,
        {
          ...zoomRect(first),
          clipPath: 'inset(0px)',
          duration: dur(0.42),
          ease: 'power3.inOut',
        },
        0,
      )
      .to(UIRef.current, { opacity: 1, y: 0, duration: dur(0.3) }, 0.2);

    return () => {
      tl.kill();
      busy.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Scroll lock ---------------------------------------------------------------
  useEffect(() => {
    if (!state) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [Boolean(state)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close: fullscreen -> current thumbnail -------------------------------------
  function close() {
    if (!state || !entry || busy.current) return;
    busy.current = true;

    const el = entry.el;
    const to = thumbGeometry(el);
    const r = el.getBoundingClientRect();
    const onScreen =
      r.bottom > 0 &&
      r.top < window.innerHeight &&
      r.right > 0 &&
      r.left < window.innerWidth;

    const tl = gsap.timeline({
      onComplete: () => {
        el.style.visibility = '';
        setNavigatedId(null);
        setActive(null);
        busy.current = false;
      },
    });

    if (onScreen) {
      tl.to(UIRef.current, {
        opacity: 0,
        duration: dur(0.2),
      })
        .to(
          boxRef.current,
          {
            ...to.rect,
            clipPath: to.clip,
            duration: dur(0.42),
            ease: 'power3.inOut',
          },
          0,
        )
        .to(backdropRef.current, { opacity: 0, duration: dur(0.15) }, 0.27);
    } else {
      // Thumbnail is scrolled out of view (after navigating): just fade.
      tl.to(
        [boxRef.current, backdropRef.current, UIRef.current],
        { opacity: 0, duration: dur(0.25) },
        0,
      );
    }
  }

  // Previous / next -------------------------------------------------------------
  function step(dir: -1 | 1) {
    if (!state || !entry || busy.current || list.length < 2) return;

    const [nextId, next] = list[(index + dir + list.length) % list.length];
    busy.current = true;

    gsap.to(boxRef.current, {
      x: -dir * 18,
      opacity: 0,
      duration: dur(0.14),
      ease: 'power2.in',
      onComplete: () => {
        entry.el.style.visibility = '';
        next.el.style.visibility = 'hidden';

        gsap.set(boxRef.current, {
          ...zoomRect(next),
          clipPath: 'inset(0px)',
          x: dir * 18,
        });
        setNavigatedId(nextId);

        requestAnimationFrame(() =>
          gsap.to(boxRef.current, {
            x: 0,
            opacity: 1,
            duration: dur(0.2),
            ease: 'power2.out',
            onComplete: () => (busy.current = false),
          }),
        );
      },
    });
  }

  // Keyboard (re-bound each render so it always sees fresh state) -----------------
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Resize ---------------------------------------------------------------------------
  useEffect(() => {
    if (!entry) return;
    const onResize = () => {
      if (busy.current || !boxRef.current) return;
      gsap.set(boxRef.current, { ...zoomRect(entry), clipPath: 'inset(0px)' });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [entry]);

  // Render -------------------------------------------------------------------------------
  if (!state || !entry) return null;

  const { src, zoomSrc, alt } = entry.props.current;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="z-1000 fixed inset-0"
    >
      {/* Sibling of the image, so fading it never fades the image. */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={close}
      />

      {/* Position, size and clip are set by GSAP only. */}
      <div ref={boxRef} className="fixed will-change-transform">
        <Image
          key={currentId}
          src={zoomSrc ?? src}
          alt={alt}
          fill
          fetchPriority="high"
          draggable={false}
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* UI */}
      <div ref={UIRef} className="absolute inset-0 pointer-events-none">
        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => step(-1)}
              className="group top-1/2 left-4 sm:left-6 absolute flex justify-center items-center bg-background/50 hover:bg-background backdrop-blur-sm border size-11 sm:size-12 transition-colors -translate-y-1/2 cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => step(1)}
              className="group top-1/2 right-4 sm:right-6 absolute flex justify-center items-center bg-background/50 hover:bg-background backdrop-blur-sm border size-11 sm:size-12 transition-colors -translate-y-1/2 cursor-pointer pointer-events-auto"
            >
              <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        )}

        {/* Header */}
        <div className="top-0 absolute inset-x-0 flex justify-between items-center px-4 sm:px-6 h-16 pointer-events-none">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
            Levia / Gallery
          </span>

          <div className="flex items-center gap-5 pointer-events-auto">
            <button
              type="button"
              aria-label="Close image preview"
              onClick={close}
              className="flex justify-center items-center hover:bg-foreground border size-10 text-foreground hover:text-background transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="right-0 bottom-0 left-0 absolute flex justify-between px-4 sm:px-6 pb-5 pointer-events-none">
          <span className="hidden sm:block font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
            {list.length > 1 && '← → Chuyển ảnh · '}
            ESC Đóng
          </span>

          {list.length > 1 && (
            <span className="font-mono text-[9px] text-muted-foreground">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(list.length).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Mount the lightbox once, on first use
// -----------------------------------------------------------------------------

let mounted = false;

function ensureMounted() {
  if (mounted || typeof document === 'undefined') return;
  mounted = true;

  const host = document.createElement('div');
  host.id = 'image-zoom-lightbox-root';
  document.body.appendChild(host);
  createRoot(host).render(<Lightbox />);
}

// -----------------------------------------------------------------------------
// Public component
// -----------------------------------------------------------------------------

export type ImageZoomProps = Omit<ImageProps, 'onClick'> & {
  /** Higher-resolution image shown in the lightbox. */
  zoomSrc?: ImageProps['src'];
  /** Images sharing a group can be navigated with the arrows / keys. */
  group?: string;
  /** Stable id within a group. */
  id?: string;
  /**
   * Space kept around the zoomed image, in px.
   * A number applies to all sides; an object sets sides individually.
   * @default { top: 80, right: 72, bottom: 40, left: 72 }
   */
  zoomPadding?: ZoomPadding;
};

export default function ImageZoom({
  src,
  zoomSrc,
  group,
  id,
  alt,
  zoomPadding,
  className = '',
  ...rest
}: ImageZoomProps) {
  const autoId = useId();
  const imageId = id ?? autoId;
  const groupKey = group ?? `solo:${imageId}`;

  const ref = useRef<HTMLImageElement>(null);
  const props = useRef<Props>({ src, zoomSrc, alt, padding: zoomPadding });
  props.current = { src, zoomSrc, alt, padding: zoomPadding };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ensureMounted();

    if (!groups.has(groupKey)) groups.set(groupKey, new Map());
    groups.get(groupKey)!.set(imageId, { el, props });

    return () => {
      const entries = groups.get(groupKey);
      entries?.delete(imageId);
      if (entries?.size === 0) groups.delete(groupKey);
    };
  }, [groupKey, imageId]);

  return (
    <Image
      {...rest}
      ref={ref}
      src={src}
      alt={alt}
      className={`cursor-zoom-in ${className}`}
      onClick={() => setActive({ group: groupKey, id: imageId })}
    />
  );
}
