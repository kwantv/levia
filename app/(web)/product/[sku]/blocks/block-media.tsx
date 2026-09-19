import { getImageUrl, SanityImage } from '@/sanity/lib/image';
import Image from 'next/image';

type BlockMediaProps = {
  image: SanityImage | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function BlockMedia({
  image,
  className = '',
  sizes = '100vw',
  priority = false,
}: BlockMediaProps) {
  const src = getImageUrl(image ?? undefined, 1800);

  return (
    <div className={['relative bg-card overflow-hidden', className].join(' ')}>
      {src ? (
        <Image
          src={src}
          alt={image?.alt || ''}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            Levia / Product Image
          </span>
        </div>
      )}

      <span className="top-5 left-5 absolute bg-primary size-1.5" />
    </div>
  );
}
