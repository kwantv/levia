import {
  productDetailBlockPreview,
  ProductDetailBlockPreview,
} from '@/sanity/components/product-detail-blocks/detail-block-preview';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { defineLayoutField } from './layout-field';

export const productMetrics = defineType({
  name: 'productMetrics',
  title: 'Chỉ số / Tính năng',
  type: 'object',
  components: { preview: ProductDetailBlockPreview },

  fields: [
    defineField({
      name: 'label',
      title: 'Nhãn',
      description: 'Ví dụ: Performance / 02',
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
      rows: 4,
    }),

    defineLayoutField('productMetrics'),

    defineField({
      name: 'items',
      title: 'Nội dung',
      type: 'array',
      validation: (rule) => rule.required().min(1).max(6),

      of: [
        defineArrayMember({
          type: 'object',

          fields: [
            defineField({
              name: 'value',
              title: 'Số / Ký hiệu',
              description: 'Ví dụ: 01, 9+, 7400W',
              type: 'string',
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'label',
              title: 'Tên',
              type: 'string',
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'description',
              title: 'Mô tả',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        }),
      ],
    }),
  ],

  preview: productDetailBlockPreview,
});
