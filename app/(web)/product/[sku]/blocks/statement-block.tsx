export interface ProductStatementBlock {
  _key: string;
  _type: 'productStatement';

  label: string;
  title: string;
  description: string;
  secondary: string | null;

  image: SanityImage | null;

  layout: 'mediaRight' | 'mediaLeft' | 'mediaBottom';
}

import { MoveRight } from 'lucide-react';

import { BlockMedia } from './block-media';
import { SectionLabel } from './section-label';
import { SanityImage } from '@/sanity/lib/image';

export function ProductStatementBlock({
  block,
}: {
  block: ProductStatementBlock;
}) {
  return (
    <section className="bg-card/30 border-border border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 container">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel>{block.label}</SectionLabel>
          </div>

          <div className="lg:col-span-9 mt-12 lg:mt-0">
            <h2 className="max-w-5xl font-heading font-medium text-[clamp(2.75rem,6vw,6rem)] leading-[0.94] tracking-[-0.05em]">
              {block.title}
            </h2>

            {block.layout === 'mediaBottom' ? (
              <MediaBottom block={block} />
            ) : (
              <MediaSide block={block} />
            )}

            {block.secondary && (
              <p className="mt-6 ml-auto max-w-xl text-muted-foreground text-sm leading-relaxed">
                {block.secondary}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MediaSide({ block }: { block: ProductStatementBlock }) {
  const mediaLeft = block.layout === 'mediaLeft';

  return (
    <div className="gap-px grid md:grid-cols-2 mt-14 bg-border border border-border">
      {/* Always copy first on mobile */}
      <div
        className={[
          'flex flex-col justify-between',
          'bg-background p-7 sm:p-10 min-h-[360px]',
          mediaLeft ? 'md:order-2' : 'md:order-1',
        ].join(' ')}
      >
        <p className="max-w-lg text-muted-foreground text-base sm:text-lg leading-[1.8]">
          {block.description}
        </p>

        <div className="flex justify-between items-end gap-6 mt-12 pt-5 border-border border-t">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
            Levia / Kitchen Intelligence
          </span>

          <MoveRight className="size-4 text-primary" />
        </div>
      </div>

      <BlockMedia
        image={block.image}
        className={[
          'min-h-[360px]',
          mediaLeft ? 'md:order-1' : 'md:order-2',
        ].join(' ')}
      />
    </div>
  );
}

function MediaBottom({ block }: { block: ProductStatementBlock }) {
  return (
    <div className="mt-14 border border-border">
      <div className="bg-background p-7 sm:p-10 lg:p-12">
        <p className="max-w-2xl text-muted-foreground text-base sm:text-lg leading-[1.8]">
          {block.description}
        </p>

        <div className="flex justify-between items-center mt-10 pt-5 border-border border-t">
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.18em]">
            Levia / Kitchen Intelligence
          </span>

          <MoveRight className="size-4 text-primary" />
        </div>
      </div>

      <BlockMedia
        image={block.image}
        className="border-border border-t aspect-[4/3] sm:aspect-[16/8]"
      />
    </div>
  );
}
