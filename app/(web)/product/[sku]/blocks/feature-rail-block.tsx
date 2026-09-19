import { SanityImage } from '@/sanity/lib/image';
import { BlockMedia } from './block-media';
import { SectionLabel } from './section-label';

export interface ProductFeatureRailItem {
  _key: string;

  title: string;
  description: string;
}

export interface ProductFeatureRailBlock {
  _key: string;
  _type: 'productFeatureRail';

  label: string;
  title: string;
  description: string | null;

  image: SanityImage;

  layout: 'mediaLeft' | 'mediaRight';

  items: ProductFeatureRailItem[];
}

export function ProductFeatureRailBlock({
  block,
}: {
  block: ProductFeatureRailBlock;
}) {
  const mediaRight = block.layout === 'mediaRight';

  return (
    <section className="border-border border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
        <div className="grid lg:grid-cols-12">
          {/* Always image first on mobile */}
          <div
            className={[
              'lg:col-span-6 py-10 lg:py-24',
              mediaRight
                ? 'lg:order-2 lg:pl-10 lg:border-border lg:border-l'
                : 'lg:order-1 lg:pr-10',
            ].join(' ')}
          >
            <div className="top-24 lg:sticky">
              <BlockMedia
                image={block.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="border border-border aspect-[4/5]"
              />
            </div>
          </div>

          <div
            className={[
              'lg:col-span-6 py-12 lg:py-24',
              mediaRight
                ? 'lg:order-1 lg:pr-10'
                : 'lg:order-2 lg:pl-10 lg:border-border lg:border-l',
            ].join(' ')}
          >
            <SectionLabel>{block.label}</SectionLabel>

            <h2 className="mt-14 max-w-xl font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
              {block.title}
            </h2>

            {block.description && (
              <p className="mt-6 max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]">
                {block.description}
              </p>
            )}

            <div className="mt-16 border-border border-t">
              {block.items.map((item, index) => (
                <div
                  key={item._key}
                  className="gap-6 grid grid-cols-[2.5rem_1fr] py-8 border-border border-b"
                >
                  <span className="font-mono text-[10px] text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3 className="font-heading font-medium text-xl sm:text-2xl tracking-[-0.025em]">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-md text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
