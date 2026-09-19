import { defineField, defineType } from 'sanity';

export const productSplitMedia = defineType({
  name: 'productSplitMedia',
  title: 'Nội dung + hình ảnh',
  type: 'object',

  fields: [
    defineField({
      name: 'label',
      title: 'Nhãn',
      description: 'Ví dụ: Technology / 01',
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

    defineField({
      name: 'layout',
      title: 'Bố cục',
      type: 'string',
      initialValue: 'mediaRight',
      options: {
        layout: 'radio',
        list: [
          {
            title: 'Ảnh bên phải',
            value: 'mediaRight',
          },
          {
            title: 'Ảnh bên trái',
            value: 'mediaLeft',
          },
          {
            title: 'Ảnh phía dưới',
            value: 'mediaBottom',
          },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
      media: 'image',
    },
  },
});
