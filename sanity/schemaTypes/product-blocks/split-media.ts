import {
  productDetailBlockPreview,
  ProductDetailBlockPreview,
} from '@/sanity/components/product-detail-blocks/detail-block-preview';
import { defineField, defineType } from 'sanity';
import { defineLayoutField } from './layout-field';

export const productSplitMedia = defineType({
  name: 'productSplitMedia',
  title: 'Nội dung + hình ảnh',
  type: 'object',
  components: { preview: ProductDetailBlockPreview },

  fields: [
    defineField({
      name: 'label',
      title: 'Nhãn',
      description: 'Ví dụ: Technology',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Tiêu đề',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Mô tả',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'note',
      title: 'Ghi chú kỹ thuật',
      description: 'Ví dụ: Precision heating / Intelligent control',
      type: 'string',
    }),

    defineField({
      name: 'image',
      title: 'Hình ảnh',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineLayoutField('productSplitMedia'),
  ],

  preview: productDetailBlockPreview,
});
