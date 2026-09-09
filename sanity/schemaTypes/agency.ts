import { MapPin } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const agency = defineType({
  name: 'agency',
  title: 'Đại lý',
  type: 'document',
  icon: MapPin,

  fields: [
    defineField({
      name: 'name',
      title: 'Tên đại lý',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Dùng làm đường dẫn /agency/[slug]',
      type: 'slug',
      options: { source: 'name', maxLength: 120 },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'address',
      title: 'Địa chỉ',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'province',
      title: 'Tỉnh/thành',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'zip',
      title: 'Mã bưu chính (zip code)',
      type: 'string',
    }),

    defineField({
      name: 'phone',
      title: 'Số điện thoại',
      type: 'string',
    }),

    defineField({
      name: 'hours',
      title: 'Giờ mở cửa',
      description: 'Vd: Thứ Hai–Chủ Nhật, 08:00–20:00',
      type: 'string',
    }),

    defineField({
      name: 'mapLink',
      title: 'Link Google Maps',
      description:
        'Ưu tiên hồ sơ Google Business của đại lý, hoặc dùng tọa độ thô',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),

    defineField({
      name: 'lat',
      title: 'Vĩ độ',
      type: 'number',
      validation: (rule) => rule.required().min(-90).max(90),
    }),

    defineField({
      name: 'lng',
      title: 'Kinh độ',
      type: 'number',
      validation: (rule) => rule.required().min(-180).max(180),
    }),

    defineField({
      name: 'photos',
      title: 'Ảnh cửa hàng',
      type: 'array',
      of: [
        defineArrayMember({
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
      ],
    }),
  ],

  preview: {
    select: {
      title: 'name',
      province: 'province',
      address: 'address',
      media: 'photos.0',
    },
    prepare({ title, province, address, media }) {
      return {
        title,
        subtitle: [address, province].filter(Boolean).join(', '),
        media,
      };
    },
  },
});
