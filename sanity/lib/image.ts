import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

import { dataset, projectId } from '../env';

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export function getImageUrl(
  image: SanityImage | undefined,
  width?: number,
): string | undefined {
  if (!image?.asset?._ref) return undefined;
  let builder = urlFor(image).auto('format');
  if (width) builder = builder.width(width);
  return builder.url();
}
