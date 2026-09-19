import { type SchemaTypeDefinition } from 'sanity';
import { agency } from './agency';
import { article } from './article';
import { category } from './category';
import { product } from './product';
import { recipe } from './recipe';
import { tag } from './tag';

import { productSplitMedia } from './product-blocks/split-media';
import { productMetrics } from './product-blocks/metrics';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    tag,
    article,

    category,
    productSplitMedia,
    productMetrics,
    product,

    recipe,

    agency,
  ],
};
