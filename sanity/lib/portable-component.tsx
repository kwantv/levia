import Image from 'next/image';
import { getImageUrl } from './image';

export const components = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value.asset?._ref) return null;
      const src = getImageUrl(value, 800);
      return (
        <figure className="my-8">
          <Image
            src={src!}
            alt={value.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ aspectRatio: '16/9' }}
          />
          {value.caption && (
            <figcaption className="mt-2 text-muted-foreground text-sm text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
