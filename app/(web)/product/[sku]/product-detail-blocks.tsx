import { ProductSplitMediaBlock } from './blocks/split-media-block';
import { ProductMetricsBlock } from './blocks/metrics-block';
import { ProductFullMediaBlock } from './blocks/full-media-block';
import { ProductFeatureRailBlock } from './blocks/feature-rail-block';
import { ProductStatementBlock } from './blocks/statement-block';

export type ProductDetailBlock =
  | ProductSplitMediaBlock
  | ProductMetricsBlock
  | ProductFullMediaBlock
  | ProductFeatureRailBlock
  | ProductStatementBlock;

export function ProductDetailBlocks({
  blocks,
}: {
  blocks: ProductDetailBlock[];
}) {
  return blocks.map((block) => {
    switch (block._type) {
      case 'productSplitMedia':
        return <ProductSplitMediaBlock key={block._key} block={block} />;

      case 'productMetrics':
        return <ProductMetricsBlock key={block._key} block={block} />;

      case 'productFullMedia':
        return <ProductFullMediaBlock key={block._key} block={block} />;

      case 'productFeatureRail':
        return <ProductFeatureRailBlock key={block._key} block={block} />;

      case 'productStatement':
        return <ProductStatementBlock key={block._key} block={block} />;

      default:
        return null;
    }
  });
}
