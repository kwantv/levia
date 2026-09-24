import { MapPinOff } from 'lucide-react';

import { getAgencies } from './action';
import { AgencyLocator } from './agency-locator';
import DotGridBackground from '@/components/dot-grid-background';

export const metadata = {
  title: 'Hệ thống đại lý — Levia',
  description:
    'Tìm đại lý Levia gần bạn, xem địa chỉ, giờ mở cửa, số điện thoại và chỉ đường đến điểm bán.',
};

export default async function AgencyPage() {
  const agencies = await getAgencies();

  const provinces = new Set(agencies.map((agency) => agency.province));

  return (
    <>
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative bg-background border-border border-b overflow-hidden">
        <DotGridBackground />

        {/* Ambient gold accent */}
        <div className="top-[-15%] right-[-10%] absolute bg-primary/5 blur-[140px] rounded-full size-150 pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                <span className="block bg-primary size-1.5" />
                Agency / 01
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h1 className="max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,8rem)] leading-[0.86] tracking-[-0.055em]">
                Trải nghiệm Levia
                <br />
                <span className="text-primary">gần bạn hơn.</span>
              </h1>

              <div className="gap-8 grid sm:grid-cols-2 mt-12 lg:mt-16 pt-6 border-border border-t">
                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Tìm đại lý Levia gần bạn để trực tiếp trải nghiệm sản phẩm,
                  nhận tư vấn và khám phá giải pháp phù hợp cho căn bếp.
                </p>

                <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Chọn khu vực hoặc tìm theo tên, địa chỉ. Bản đồ sẽ giúp bạn
                  nhanh chóng xác định vị trí và đường đi đến từng đại lý.
                </p>
              </div>
            </div>
          </div>

          <div className="gap-px grid grid-cols-2 md:grid-cols-4 mt-20 bg-border border border-border">
            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Đại lý
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(agencies.length).padStart(2, '0')}
              </span>
            </div>

            <div className="bg-background p-5 sm:p-6">
              <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Khu vực
              </span>

              <span className="block mt-3 font-heading font-light text-3xl">
                {String(provinces.size).padStart(2, '0')}
              </span>
            </div>

            <div className="hidden md:block md:col-span-2 bg-background p-6">
              <div className="flex justify-end items-end h-full">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Levia / Store Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}
