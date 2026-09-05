import { Package } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Sản phẩm',
  type: 'document',
  icon: Package,

  fields: [
    defineField({
      name: 'title',
      title: 'Tên sản phẩm',
      description: 'Vd: "Bếp từ đôi LV79DI"',
      type: 'string',
      validation: (rule) => rule.required().error('Tên sản phẩm bắt buộc'),
    }),

    defineField({
      name: 'sku',
      title: 'Mã sản phẩm (SKU)',
      description:
        'Dùng làm đường dẫn URL (vd: "lv79di" → /product/lv79di). Chỉ chữ thường, số, dấu gạch ngang.',
      type: 'string',
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
      title: 'Danh mục',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'price',
      title: 'Giá niêm yết (VNĐ)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),

    defineField({
      name: 'desc',
      title: 'Mô tả ngắn (40–60 chữ)',
      description:
        'Khối trả lời đầu bài cho GEO/AEO — đủ ngắn để AI trích nguyên khối',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'gallery',
      title: 'Thư viện ảnh',
      type: 'array',
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
      description: 'Mỗi dòng là một cặp thông số (tên — giá trị)',
      type: 'array',
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
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),

    defineField({
      name: 'content',
      title: 'Nội dung chi tiết',
      description:
        'Nội dung tự do: tính năng, vì sao hợp món Việt, thiết kế AI, an toàn, chứng nhận…',
      type: 'array',
      of: [
        { type: 'block' },
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
      validation: (rule) => rule.max(70),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO mô tả',
      type: 'string',
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
