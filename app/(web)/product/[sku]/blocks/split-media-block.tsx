import { ArrowDownRight } from 'lucide-react';

import { SanityImage } from '@/sanity/lib/image';
import { BlockMedia } from './block-media';
import { SectionLabel } from './section-label';

export interface ProductSplitMediaBlock {
  _key: string;
  _type: 'productSplitMedia';

  label: string;
  title: string;
  description: string;
  note: string | null;

  image: SanityImage;
  layout: 'mediaRight' | 'mediaLeft' | 'mediaBottom';
}

export function ProductSplitMediaBlock({
  block,
}: {
  block: ProductSplitMediaBlock;
}) {
  if (block.layout === 'mediaBottom') {
    return (
      <section className="border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <div className="border-border border-x">
            <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12 p-6 sm:p-10 lg:p-14 xl:p-16">
              <div className="col-span-12 lg:col-span-3">
                <SectionLabel>{block.label}</SectionLabel>
              </div>

              <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                <h2 className="max-w-4xl font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
                  {block.title}
                </h2>

                <div className="gap-8 grid md:grid-cols-2 mt-8">
                  <p className="max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]">
                    {block.description}
                  </p>

                  {block.note && (
                    <div className="flex md:justify-end items-end">
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                        {block.note}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <BlockMedia
              image={block.image}
              className="border-border border-t aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]"
            />
          </div>
        </div>
      </section>
    );
  }

  const mediaLeft = block.layout === 'mediaLeft';

  return (
    <section className="border-border border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
        <div className="grid lg:grid-cols-12 border-border border-x">
          {/* Always first on mobile */}
          <div
            className={[
              'flex flex-col justify-between',
              'lg:col-span-5',
              'p-6 sm:p-10 lg:p-12 xl:p-16',
              mediaLeft
                ? 'lg:order-2 lg:border-border lg:border-l'
                : 'lg:order-1',
            ].join(' ')}
          >
            <div>
              <SectionLabel>{block.label}</SectionLabel>

              <h2 className="mt-14 max-w-lg font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
                {block.title}
              </h2>

              <p className="mt-6 max-w-md text-muted-foreground text-sm sm:text-base leading-[1.8]">
                {block.description}
              </p>
            </div>

            {block.note && (
              <div className="flex justify-between items-end gap-6 mt-14 pt-5 border-border border-t">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
                  {block.note}
                </span>

                <ArrowDownRight className="size-4 text-primary" />
              </div>
            )}
          </div>

          <BlockMedia
            image={block.image}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={[
              'min-h-[420px] lg:min-h-[700px]',
              'lg:col-span-7',
              mediaLeft
                ? 'lg:order-1'
                : 'lg:order-2 lg:border-border lg:border-l',
            ].join(' ')}
          />
        </div>
      </div>
    </section>
  );
}
