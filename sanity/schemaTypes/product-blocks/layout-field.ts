import { defineField } from 'sanity';

import {
  getProductDetailLayoutOptions,
  PRODUCT_DETAIL_BLOCKS,
  ProductDetailBlockType,
} from '@/sanity/components/product-detail-blocks/detail-block-registry';
import { createProductLayoutInput } from '@/sanity/components/product-detail-blocks/layout-input';

export function defineLayoutField(blockType: ProductDetailBlockType) {
  const definition = PRODUCT_DETAIL_BLOCKS[blockType];

  return defineField({
    name: 'layout',
    title: 'Bố cục',
    type: 'string',

    initialValue: definition.defaultLayout,

    options: {
      list: getProductDetailLayoutOptions(blockType),
    },

    components: {
      input: createProductLayoutInput(blockType),
    },

    validation: (rule) => rule.required(),
  });
}
