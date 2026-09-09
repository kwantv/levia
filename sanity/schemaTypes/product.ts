import { Package } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';
import LabelValueListInput from '../components/label-value-list-input';

export const product = defineType({
  name: 'product',
  title: 'Sản phẩm',
  type: 'document',
  icon: Package,

  groups: [
    { name: 'content', title: 'Nội dung', default: true },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Tên sản phẩm',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().error('Tên sản phẩm bắt buộc'),
    }),

    defineField({
      name: 'sku',
      title: 'Mã sản phẩm (SKU)',
      description:
        'Chỉ chữ thường, số, dấu gạch ngang. Dùng làm đường dẫn URL (vd: "lv79di" → /product/lv79di)',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule
          .required()
          .lowercase()
          .regex(/^[a-z0-9-]+$/, {
            name: 'lowercase alphanumeric with hyphens',
          })
          .error('SKU chỉ chứa chữ thường, số và dấu gạch ngang'),
    }),

    defineField({
      name: 'category',
      title: 'Danh mục sản phẩm',
      type: 'reference',
      group: 'content',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Giá niêm yết (VNĐ)',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.positive(),
    }),

    defineField({
      name: 'desc',
      title: 'Mô tả ngắn',
      description:
        'Khoảng 40-60 chữ. Khối trả lời đầu bài cho GEO/AEO (AI trích dẫn)',
      type: 'text',
      group: 'content',
      rows: 4,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'gallery',
      title: 'Thư viện ảnh',
      description: 'Ảnh đầu tiên được sử dụng làm ảnh thumbnail',
      type: 'array',
      group: 'content',
      options: { layout: 'grid' },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'specs',
      title: 'Thông số kỹ thuật',
      type: 'array',
      group: 'content',
      components: { input: LabelValueListInput },
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Tên thông số',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Giá trị',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'content',
      title: 'Nội dung chi tiết',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Đoạn văn', value: 'normal' },
            { title: 'Tiêu đề 2', value: 'h2' },
            { title: 'Tiêu đề 3', value: 'h3' },
            { title: 'Tiêu đề 4', value: 'h4' },
            { title: 'Trích dẫn', value: 'blockquote' },
          ],
        }),
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Chú thích',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO tiêu đề',
      description: 'Nếu để trống sẽ dùng tên sản phẩm',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(70),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO mô tả',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(160),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'gallery.0',
    },
  },
});
