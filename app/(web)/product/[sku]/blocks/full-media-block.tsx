import { SanityImage } from '@/sanity/lib/image';
import { BlockMedia } from './block-media';
import { SectionLabel } from './section-label';

export interface ProductFullMediaBlock {
  _key: string;
  _type: 'productFullMedia';

  label: string;
  title: string;
  description: string | null;

  image: SanityImage;

  layout: 'bottomLeft' | 'bottomCenter' | 'center';
}

export function ProductFullMediaBlock({
  block,
}: {
  block: ProductFullMediaBlock;
}) {
  const desktopPosition = {
    bottomLeft: 'lg:items-end lg:justify-start',
    bottomCenter: 'lg:items-end lg:justify-center lg:text-center',
    center: 'lg:items-center lg:justify-center lg:text-center',
  }[block.layout];

  return (
    <section className="relative border-border border-b min-h-[650px] lg:min-h-[850px] overflow-hidden">
      <BlockMedia image={block.image} className="absolute inset-0" />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />

      {/*
       * Mobile always anchors content to the bottom.
       * Desktop respects configured layout.
       */}
      <div
        className={['absolute inset-0 flex items-end', desktopPosition].join(
          ' ',
        )}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full container">
          <div
            className={[
              'max-w-4xl',
              block.layout !== 'bottomLeft' ? 'lg:mx-auto' : 'lg:ml-[33.333%]',
            ].join(' ')}
          >
            <SectionLabel>{block.label}</SectionLabel>

            <h2 className="mt-6 font-heading font-medium text-3xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.05em]">
              {block.title}
            </h2>

            {block.description && (
              <p
                className={[
                  'mt-6 max-w-xl text-white/60 text-sm sm:text-base leading-[1.8]',
                  block.layout !== 'bottomLeft' ? 'lg:mx-auto' : '',
                ].join(' ')}
              >
                {block.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
