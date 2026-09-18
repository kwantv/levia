import { AgencyLocator } from '@/components/agency-locator';
import { Building2, MapPin, MapPinOff, PhoneCall } from 'lucide-react';
import { getAgencies } from './action';

export const metadata = {
  title: 'Hệ thống đại lý — Levia',
  description:
    'Tìm đại lý Levia gần bạn, xem địa chỉ, giờ mở cửa, số điện thoại và chỉ đường đến điểm bán.',
};

export default async function AgencyPage() {
  const agencies = await getAgencies();

  return (
    <>
      <section className="bg-background py-16 sm:py-24">
        <div className="grid-layout mx-auto container">
          <span className="mb-2 font-mono font-medium text-muted-foreground text-sm uppercase tracking-widest">
            [Agency]
          </span>
          <div className="col-span-4">
            <h1 className="max-w-3xl font-heading text-primary text-4xl sm:text-5xl tracking-tight">
              Tìm đại lý Levia gần bạn
            </h1>
            <p className="mt-4 max-w-[40ch] text-muted-foreground">
              Chọn tỉnh/thành để xem điểm bán Levia, số điện thoại, giờ mở cửa
              và vị trí trên bản đồ. Nút Chỉ đường mở trực tiếp Google Maps để
              bạn dễ dàng đến đại lý gần nhất.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto">
          {agencies.length > 0 ? (
            <AgencyLocator agencies={agencies} />
          ) : (
            <div className="p-8 text-center">
              <MapPinOff className="mx-auto size-7 text-primary" />
              <h2 className="mt-4 font-heading text-2xl">
                Dữ liệu đại lý đang được cập nhật
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground text-sm">
                Danh sách các đại lý sẽ xuất hiện tại đây sau khi dữ liệu được
                cập nhật.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
