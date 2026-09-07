import { Tag } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const tag = defineType({
  name: 'tag',
  title: 'Thẻ (Tag)',
  type: 'document',
  icon: Tag,

  fields: [
    defineField({
      name: 'title',
      title: 'Tên thẻ',
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
  ],
});
