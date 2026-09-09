import { AgencyLocator } from '@/components/agency-locator';
import { Building2, MapPin, PhoneCall } from 'lucide-react';
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
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            Agency
          </p>
          <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl tracking-tight">
            Tìm đại lý Levia gần bạn
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
            Chọn tỉnh/thành để xem điểm bán Levia, số điện thoại, giờ mở cửa và
            vị trí trên bản đồ. Nút Chỉ đường mở trực tiếp Google Maps để bạn dễ
            dàng đến đại lý gần nhất.
          </p>
        </div>
      </section>

      <section className="bg-card py-8 border-border border-y">
        <div className="gap-px grid sm:grid-cols-3 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-start gap-3 py-4 sm:pr-6">
            <MapPin className="size-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Vị trí trực quan</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Xem toàn bộ điểm bán trên bản đồ.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:px-6 py-4 sm:border-border sm:border-x">
            <PhoneCall className="size-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Liên hệ trực tiếp</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Gọi đại lý để được tư vấn sản phẩm.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-4 sm:pl-6">
            <Building2 className="size-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">Trải nghiệm tại cửa hàng</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Xem sản phẩm Levia trước khi lựa chọn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {agencies.length > 0 ? (
            <AgencyLocator agencies={agencies} />
          ) : (
            <div className="bg-card p-8 border border-border text-center">
              <MapPin className="mx-auto size-7 text-primary" />
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
