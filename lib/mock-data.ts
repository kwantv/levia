// ─── Products ────────────────────────────────────────────────
export interface Product {
  sku: string;
  name: string;
  category: 'bep-tu-doi' | 'bep-tu-don' | 'may-hut-mui';
  categoryLabel: string;
  tagline: string;
  price: string; // niêm yết, chuỗi hiển thị
  badge?: string;
  features: string[];
  specs: Record<string, string>;
  heroImage: string; // placeholder path
}

export const products: Product[] = [
  {
    sku: 'lv79di',
    name: 'Bếp từ đôi LV79DI',
    category: 'bep-tu-doi',
    categoryLabel: 'Bếp từ đôi',
    tagline: 'Bếp từ AI flagship — thiết kế cho bữa cơm Việt.',
    price: '12.900.000₫', // TODO(client-confirm)
    badge: 'Ai Design',
    features: [
      'Digital Inverter tiết kiệm ~30% điện',
      '9 mức nhiệt, chế độ liu riu & Turbo 2800W',
      'Menu nấu tự động (Kho · Lẩu · Xào)',
      'Mâm từ phủ 2 lớp chống nồm ẩm',
      'Nhận diện nồi thông minh',
      'Mặt kính Ceramic, viền inox',
    ],
    specs: {
      'Công suất': '2500W + 2500W', // TODO(client-confirm) poster ghi 5600W
      'Boost': '2800W',
      'Inverter': 'Digital Inverter (~30%)',
      'Mặt kính': 'Ceramic', // TODO(client-confirm) Eurokera hay Kanger
      'Kích thước': '730 × 430 mm',
      'Kích thước khoét': '680 × 385 mm',
      'Điện áp': '220–240V / 50–60Hz',
      'Trọng lượng': '11 kg',
      'Bảo hành': '24 tháng chính hãng',
    },
    heroImage: '/images/lv79di-hero.webp',
  },
  {
    sku: 'lv68pro',
    name: 'Bếp từ đôi LV68PRO',
    category: 'bep-tu-doi',
    categoryLabel: 'Bếp từ đôi',
    tagline: 'Hiệu năng cao, thiết kế tinh gọn.',
    price: '9.900.000₫', // TODO(client-confirm)
    features: [
      'Digital Inverter tiết kiệm ~30% điện',
      '9 mức nhiệt',
      'Mặt kính Ceramic, viền inox',
      'Cảm biến nhận diện nồi',
    ],
    specs: {
      'Công suất': '2200W + 2200W',
      'Mặt kính': 'Ceramic',
      'Kích thước': '730 × 430 mm',
      'Điện áp': '220–240V / 50–60Hz',
      'Bảo hành': '24 tháng chính hãng',
    },
    heroImage: '/images/lv68pro-hero.webp',
  },
  {
    sku: 'lv39',
    name: 'Bếp từ đơn LV39',
    category: 'bep-tu-don',
    categoryLabel: 'Bếp từ đơn',
    tagline: 'Nhỏ gọn, tiện lợi cho không gian hẹp.',
    price: '3.900.000₫', // TODO(client-confirm)
    features: [
      'Inverter tiết kiệm điện',
      '9 mức nhiệt',
      'Mặt kính Ceramic',
      'Cảm biến nhận diện nồi',
    ],
    specs: {
      'Công suất': '2200W',
      'Mặt kính': 'Ceramic',
      'Kích thước': '380 × 290 mm',
      'Điện áp': '220–240V / 50–60Hz',
      'Bảo hành': '24 tháng chính hãng',
    },
    heroImage: '/images/lv39-hero.webp',
  },
  {
    sku: 'lv-hood-a90',
    name: 'Máy hút mùi LV-A90',
    category: 'may-hut-mui',
    categoryLabel: 'Máy hút mùi',
    tagline: 'Hút khói mạnh mẽ, vận hành êm ái.',
    price: '6.900.000₫', // TODO(client-confirm)
    features: [
      'Công suất hút 1000 m³/h',
      'Động cơ DC Inverter',
      '3 tốc độ + Turbo',
      'Bộ lọc nhôm đa lớp',
    ],
    specs: {
      'Công suất hút': '1000 m³/h',
      'Động cơ': 'DC Inverter',
      'Tốc độ': '3 + Turbo',
      'Kích thước': '900 × 500 × 50 mm',
      'Điện áp': '220V / 50Hz',
      'Bảo hành': '24 tháng chính hãng',
    },
    heroImage: '/images/lv-hood-a90-hero.webp',
  },
];

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}

// ─── Categories ──────────────────────────────────────────────
export interface Category {
  slug: Product['category'];
  label: string;
  description: string;
  count: number;
}

export const categories: Category[] = [
  {
    slug: 'bep-tu-doi',
    label: 'Bếp từ đôi',
    description: 'Hai vùng nấu linh hoạt, phù hợp mọi gia đình.',
    count: products.filter((p) => p.category === 'bep-tu-doi').length,
  },
  {
    slug: 'bep-tu-don',
    label: 'Bếp từ đơn',
    description: 'Nhỏ gọn, tiện lợi cho không gian bếp hẹp.',
    count: products.filter((p) => p.category === 'bep-tu-don').length,
  },
  {
    slug: 'may-hut-mui',
    label: 'Máy hút mùi',
    description: 'Hút khói mạnh mẽ, giữ bếp luôn sạch sẽ.',
    count: products.filter((p) => p.category === 'may-hut-mui').length,
  },
];

// ─── Featured Recipes (teaser for homepage) ──────────────────
export interface RecipeTeaser {
  slug: string;
  title: string;
  heatLevel: string;
  cookTime: string;
  image: string;
}

export const featuredRecipes: RecipeTeaser[] = [
  {
    slug: 'ca-kho-to',
    title: 'Cá kho tộ',
    heatLevel: 'Mức 3 — Liu riu',
    cookTime: '45 phút',
    image: '/images/recipes/ca-kho-to.webp',
  },
  {
    slug: 'bo-luc-lac',
    title: 'Bò lúc lắc',
    heatLevel: 'Turbo — Mức 9',
    cookTime: '15 phút',
    image: '/images/recipes/bo-luc-lac.webp',
  },
  {
    slug: 'lau-thai-hai-san',
    title: 'Lẩu thái hải sản',
    heatLevel: 'Menu Lẩu',
    cookTime: '30 phút',
    image: '/images/recipes/lau-thai.webp',
  },
];

// ─── Technology blocks (homepage section) ────────────────────
export interface TechBlock {
  number: string;
  title: string;
  description: string;
  icon: string; // lucide icon name hint
}

export const techBlocks: TechBlock[] = [
  {
    number: '01',
    title: 'Thiết kế bằng AI',
    description:
      'Bố cục vùng nấu và trải nghiệm được tối ưu từ dữ liệu thói quen nấu ăn thực tế của người Việt.',
    icon: 'Brain',
  },
  {
    number: '02',
    title: 'Digital Inverter',
    description:
      'Công nghệ biến tần tiết kiệm đến ~30% điện năng so với bếp từ truyền thống.',
    icon: 'Zap',
  },
  {
    number: '03',
    title: 'Điều khiển nhiệt cho món Việt',
    description:
      '9 mức nhiệt chính xác — liu riu ổn định cho món kho, Turbo 2800W cho chảo xào bốc lửa.',
    icon: 'Flame',
  },
  {
    number: '04',
    title: 'Mặt kính Ceramic & viền inox',
    description:
      'Bề mặt chịu nhiệt cao, dễ vệ sinh. Viền inox tạo điểm nhấn tinh tế, sang trọng.',
    icon: 'Sparkles',
  },
  {
    number: '05',
    title: 'Mâm từ chống nồm ẩm',
    description:
      'Phủ hai lớp chống ẩm, phù hợp khí hậu nhiệt đới — kéo dài tuổi thọ mâm từ.',
    icon: 'Shield',
  },
  {
    number: '06',
    title: 'Cảm biến thông minh',
    description:
      'Nhận diện nồi, vật liệu và kích thước — tự điều chỉnh công suất phù hợp.',
    icon: 'ScanSearch',
  },
];
