import {
  productDetailBlockPreview,
  ProductDetailBlockPreview,
} from '@/sanity/components/product-detail-blocks/detail-block-preview';
import { defineField, defineType } from 'sanity';
import { defineLayoutField } from './layout-field';

export const productStatement = defineType({
  name: 'productStatement',
  title: 'Thông điệp',
  type: 'object',
  components: { preview: ProductDetailBlockPreview },

  fields: [
    defineField({
      name: 'label',
      title: 'Nhãn',
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
      title: 'Nội dung chính',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'secondary',
      title: 'Nội dung phụ',
      type: 'text',
      rows: 4,
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
    }),

    defineLayoutField('productStatement'),
  ],

  preview: productDetailBlockPreview,
});
