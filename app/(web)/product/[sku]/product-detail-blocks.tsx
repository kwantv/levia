import type { ProductDetailBlock } from './action';

import { ProductSplitMediaBlock } from './blocks/split-media-block';
import { ProductMetricsBlock } from './blocks/metrics-block';
// import { ProductFeatureRailBlock } from './feature-rail-block';
// import { ProductFullMediaBlock } from './full-media-block';
// import { ProductStatementBlock } from './statement-block';

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

      // case 'productFullMedia':
      //   return (
      //     <ProductFullMediaBlock
      //       key={block._key}
      //       block={block}
      //     />
      //   );

      // case 'productFeatureRail':
      //   return (
      //     <ProductFeatureRailBlock
      //       key={block._key}
      //       block={block}
      //     />
      //   );

      // case 'productStatement':
      //   return (
      //     <ProductStatementBlock
      //       key={block._key}
      //       block={block}
      //     />
      //   );

      default:
        return null;
    }
  });
}
