import { PenTool } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const article = defineType({
  name: 'article',
  title: 'Bài viết',
  type: 'document',
  icon: PenTool,

  groups: [
    { name: 'content', title: 'Nội dung', default: true },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    // ── Content ────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Tiêu đề',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 120 },
      group: 'content',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Tóm tắt (40–60 chữ)',
      description: 'Khối trả lời đầu bài cho GEO/AEO',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Ảnh bìa',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'content',
      title: 'Nội dung bài viết',
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
        defineArrayMember({
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
        }),
        defineArrayMember({
          name: 'richTableBlock',
          title: 'Bảng',
          type: 'richTableBlock',
        }),
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Thẻ (Tags)',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'tag' }],
        }),
      ],
    }),

    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Hỏi', type: 'string' }),
            defineField({
              name: 'answer',
              title: 'Đáp',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { title: 'question' },
          },
        }),
      ],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Ngày đăng',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Ngày cập nhật',
      description: 'Cập nhật mỗi lần chỉnh bài',
      type: 'datetime',
      group: 'content',
    }),

    defineField({
      name: 'author',
      title: 'Tác giả',
      type: 'string',
      group: 'content',
      initialValue: 'Đội ngũ Levia',
      hidden: true,
    }),

    // ── SEO ────────────────────────────────────────────────────

    defineField({
      name: 'seoTitle',
      title: 'SEO tiêu đề',
      description: 'Để trống sẽ dùng tiêu đề bài viết',
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

    defineField({
      name: 'seoKeywords',
      title: 'Từ khóa SEO',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
  ],

  orderings: [
    {
      title: 'Mới nhất',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'coverImage',
    },
  },
});
