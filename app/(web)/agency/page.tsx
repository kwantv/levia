import { MapPinOff } from 'lucide-react';

import { ListingHero as Hero } from '@/components/listing-page-hero';
import { getAgencies } from './action';
import { AgencyLocator } from './agency-locator';

export const metadata = {
  title: 'Hệ thống đại lý — Levia',
  description:
    'Tìm đại lý Levia gần bạn, xem địa chỉ, giờ mở cửa, số điện thoại và chỉ đường đến điểm bán.',
};

export default async function AgencyPage() {
  const agencies = await getAgencies();

  const provinces = new Set(agencies.map((agency) => agency.province));

  return (
    <main className="bg-background">
      {/* ───────────────── HERO ───────────────── */}
      <Hero
        label="Agency / 04"
        title="Trải nghiệm Levia"
        accent="gần bạn hơn"
        breakBeforeAccent
        descriptions={[
          'Tìm đại lý Levia gần bạn để trực tiếp trải nghiệm sản phẩm, nhận tư vấn và khám phá giải pháp phù hợp cho căn bếp.',
          'Chọn khu vực hoặc tìm theo tên, địa chỉ. Bản đồ sẽ giúp bạn nhanh chóng xác định vị trí và đường đi đến từng đại lý.',
        ]}
        stats={[
          {
            label: 'Đại lý',
            value: String(agencies.length).padStart(2, '0'),
            scramble: true,
          },
          {
            label: 'Khu vực',
            value: String(provinces.size).padStart(2, '0'),
            scramble: true,
          },
        ]}
      />

      {/* ───────────────── LOCATOR ───────────────── */}

      {agencies.length > 0 ? (
        <AgencyLocator agencies={agencies} />
      ) : (
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col justify-center items-center mx-auto border border-border min-h-[420px] text-center container">
            <MapPinOff className="size-7 text-primary" />

            <h2 className="mt-6 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.03em]">
              Dữ liệu đại lý đang được cập nhật
            </h2>

            <p className="mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">
              Danh sách đại lý Levia sẽ xuất hiện tại đây sau khi dữ liệu được
              cập nhật.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
