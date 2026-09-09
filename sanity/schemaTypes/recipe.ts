import { CookingPot } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const recipe = defineType({
  name: 'recipe',
  title: 'Công thức',
  type: 'document',
  icon: CookingPot,

  fieldsets: [
    {
      name: 'recipeInfo',
      title: ' ',
      options: { columns: 3 },
    },
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Tên món',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Dùng làm đường dẫn /cook/[slug]',
      type: 'slug',
      options: { source: 'name', maxLength: 120 },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Mô tả',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'servings',
      title: 'Khẩu phần',
      type: 'number',
      fieldset: 'recipeInfo',
      validation: (rule) => rule.required().integer().positive(),
    }),

    defineField({
      name: 'prepTime',
      title: 'Chuẩn bị (phút)',
      type: 'number',
      fieldset: 'recipeInfo',
      validation: (rule) => rule.required().integer().min(0),
    }),

    defineField({
      name: 'cookTime',
      title: 'Thời gian nấu (phút)',
      type: 'number',
      fieldset: 'recipeInfo',
      validation: (rule) => rule.required().integer().positive(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Ảnh bìa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'ingredients',
      title: 'Nguyên liệu',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1),
    }),

    defineField({
      name: 'steps',
      title: 'Các bước thực hiện',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Đoạn văn', value: 'normal' },
            { title: 'Tên bước', value: 'h3' },
            { title: 'Ghi chú', value: 'blockquote' },
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
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      servings: 'servings',
      cookTime: 'cookTime',
      media: 'coverImage',
    },
    prepare({ title, servings, cookTime, media }) {
      const details = [
        servings ? `${servings} khẩu phần` : undefined,
        cookTime ? `${cookTime} phút nấu` : undefined,
      ];

      return {
        title,
        subtitle: details.filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
