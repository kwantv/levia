export const PRODUCT_DETAIL_BLOCKS = {
  productSplitMedia: {
    title: 'Nội dung + hình ảnh',
    description:
      'Kết hợp nội dung và hình ảnh trong bố cục chia đôi hoặc xếp dọc.',
    defaultLayout: 'mediaRight',

    layouts: [
      {
        value: 'mediaRight',
        title: 'Phải',
        description: 'Nội dung bên trái, hình ảnh bên phải.',
      },
      {
        value: 'mediaLeft',
        title: 'Trái',
        description: 'Hình ảnh bên trái, nội dung bên phải.',
      },
      {
        value: 'mediaBottom',
        title: 'Dưới',
        description: 'Nội dung phía trên, hình ảnh trải rộng phía dưới.',
      },
    ],
  },

  productMetrics: {
    title: 'Danh sách',
    description: 'Trình bày các chỉ số, lợi ích hoặc tính năng nổi bật.',
    defaultLayout: 'grid',

    layouts: [
      {
        value: 'grid',
        title: 'Lưới',
        description: 'Các chỉ số có trọng số tương đương trong lưới.',
      },
      {
        value: 'rows',
        title: 'Danh sách',
        description: 'Thông tin được trình bày tuần tự theo từng hàng.',
      },
      {
        value: 'featured',
        title: 'Nổi bật',
        description:
          'Mục đầu tiên được nhấn mạnh, các mục còn lại đóng vai trò hỗ trợ.',
      },
    ],
  },

  productFullMedia: {
    title: 'Hình ảnh (fulscreen)',
    description: 'Hình ảnh lớn với nội dung được đặt trực tiếp trên hình.',
    defaultLayout: 'bottomLeft',

    layouts: [
      {
        value: 'bottomLeft',
        title: 'Trái',
        description: 'Nội dung được neo ở góc dưới bên trái.',
      },
      {
        value: 'bottomCenter',
        title: 'Dưới',
        description: 'Nội dung được căn giữa phía dưới.',
      },
      {
        value: 'center',
        title: 'Chính giữa',
        description: 'Nội dung nằm chính giữa hình ảnh.',
      },
    ],
  },

  productFeatureRail: {
    title: 'Danh sách + hình ảnh',
    description: 'Hình ảnh kết hợp danh sách công nghệ hoặc chi tiết.',
    defaultLayout: 'mediaLeft',

    layouts: [
      {
        value: 'mediaLeft',
        title: 'Trái',
        description: 'Hình ảnh bên trái, nội dung bên phải.',
      },
      {
        value: 'mediaRight',
        title: 'Phải',
        description: 'Nội dung bên trái, hình ảnh sticky bên phải.',
      },
    ],
  },

  productStatement: {
    title: 'Thông điệp',
    description:
      'Khối nội dung lớn dành cho thông điệp thương hiệu hoặc kết luận.',
    defaultLayout: 'mediaRight',

    layouts: [
      {
        value: 'mediaRight',
        title: 'Ảnh bên phải',
        description: 'Thông điệp bên trái, hình ảnh bên phải.',
      },
      {
        value: 'mediaLeft',
        title: 'Ảnh bên trái',
        description: 'Hình ảnh bên trái, thông điệp bên phải.',
      },
      {
        value: 'mediaBottom',
        title: 'Ảnh phía dưới',
        description: 'Thông điệp phía trên, hình ảnh trải rộng phía dưới.',
      },
    ],
  },
} as const;

export type ProductDetailBlockType = keyof typeof PRODUCT_DETAIL_BLOCKS;

export const PRODUCT_DETAIL_BLOCK_TYPES = Object.keys(
  PRODUCT_DETAIL_BLOCKS,
) as ProductDetailBlockType[];

export function getProductDetailBlockDefinition(type?: string) {
  if (!type || !(type in PRODUCT_DETAIL_BLOCKS)) {
    return undefined;
  }

  return PRODUCT_DETAIL_BLOCKS[type as ProductDetailBlockType];
}

export function getProductDetailLayoutDefinition(
  type?: string,
  layout?: string,
) {
  const block = getProductDetailBlockDefinition(type);

  if (!block || !layout) return undefined;

  return block.layouts.find((item) => item.value === layout);
}

export function getProductDetailLayoutOptions(type: ProductDetailBlockType) {
  return PRODUCT_DETAIL_BLOCKS[type].layouts.map(({ title, value }) => ({
    title,
    value,
  }));
}
