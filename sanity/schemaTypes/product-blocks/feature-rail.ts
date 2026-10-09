import {
  productDetailBlockPreview,
  ProductDetailBlockPreview,
} from '@/sanity/components/product-detail-blocks/detail-block-preview';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { defineLayoutField } from './layout-field';

export const productFeatureRail = defineType({
  name: 'productFeatureRail',
  title: 'Chi tiết kỹ thuật',
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
      title: 'Mô tả',
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
      validation: (rule) => rule.required(),
    }),

    defineLayoutField('productFeatureRail'),

    defineField({
      name: 'items',
      title: 'Chi tiết',
      type: 'array',
      validation: (rule) => rule.required().min(1),

      of: [
        defineArrayMember({
          type: 'object',

          fields: [
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
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],

          preview: {
            select: {
              title: 'title',
            },
          },
        }),
      ],
    }),
  ],

  preview: productDetailBlockPreview,
});
