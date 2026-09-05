import { Tag } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Danh mục',
  type: 'document',
  icon: Tag,

  fields: [
    defineField({
      name: 'title',
      title: 'Tên danh mục',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Mô tả',
      description: 'Mô tả ngắn hiển thị trên trang danh sách sản phẩm',
      type: 'text',
      rows: 2,
    }),
  ],
});
