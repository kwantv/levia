import { SectionLabel } from './section-label';

export interface ProductMetricItem {
  _key: string;

  value: string;
  label: string;
  description: string;
}

export interface ProductMetricsBlock {
  _key: string;
  _type: 'productMetrics';

  label: string;
  title: string;
  description: string | null;

  layout: 'grid' | 'rows' | 'featured';

  items: ProductMetricItem[];
}

export function ProductMetricsBlock({ block }: { block: ProductMetricsBlock }) {
  return (
    <section className="bg-card/30 border-border border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
        <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel>{block.label}</SectionLabel>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="gap-8 grid lg:grid-cols-2">
              <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
                {block.title}
              </h2>

              {block.description && (
                <p className="max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]">
                  {block.description}
                </p>
              )}
            </div>

            {block.layout === 'rows' ? (
              <Rows block={block} />
            ) : block.layout === 'featured' ? (
              <Featured block={block} />
            ) : (
              <Grid block={block} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Grid({ block }: { block: ProductMetricsBlock }) {
  return (
    <div className="gap-px grid sm:grid-cols-2 mt-14 bg-border border border-border">
      {block.items.map((item) => (
        <MetricItem key={item._key} item={item} />
      ))}
    </div>
  );
}

function Rows({ block }: { block: ProductMetricsBlock }) {
  return (
    <div className="mt-14 border-border border-t">
      {block.items.map((item) => (
        <div
          key={item._key}
          className="gap-5 grid sm:grid-cols-[4rem_12rem_1fr] py-6 border-border border-b"
        >
          <span className="font-mono text-[10px] text-primary">
            {item.value}
          </span>

          <h3 className="font-heading font-medium text-lg tracking-[-0.02em]">
            {item.label}
          </h3>

          <p className="max-w-lg text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function Featured({ block }: { block: ProductMetricsBlock }) {
  const [first, ...rest] = block.items;

  if (!first) return null;

  return (
    <div className="gap-px grid lg:grid-cols-2 mt-14 bg-border border border-border">
      <div className="flex flex-col justify-between bg-background p-7 sm:p-10 min-h-[340px]">
        <span className="font-mono text-primary text-4xl sm:text-5xl tracking-[-0.05em]">
          {first.value}
        </span>

        <div>
          <h3 className="font-heading font-medium text-2xl sm:text-3xl tracking-[-0.03em]">
            {first.label}
          </h3>

          <p className="mt-4 max-w-md text-muted-foreground text-sm leading-relaxed">
            {first.description}
          </p>
        </div>
      </div>

      <div className="gap-px grid bg-border">
        {rest.map((item) => (
          <MetricItem key={item._key} item={item} />
        ))}
      </div>
    </div>
  );
}

function MetricItem({ item }: { item: ProductMetricsBlock['items'][number] }) {
  return (
    <div className="bg-background p-6 sm:p-8">
      <span className="font-mono text-[10px] text-primary">{item.value}</span>

      <h3 className="mt-10 font-heading font-medium text-xl tracking-[-0.025em]">
        {item.label}
      </h3>

      <p className="mt-3 max-w-sm text-muted-foreground text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
  );
}
