import InteractiveMap from '@/components/map/interactive-map';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getImageUrl } from '@/sanity/lib/image';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Agency, getAgencyBySlug, getAllAgencySlugs } from './action';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllAgencySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) return { title: 'Không tìm thấy đại lý — Levia' };

  return {
    title: `${agency.name} — Đại lý Levia`,
    description: `${agency.name} tại ${agency.address}, ${agency.province}. Xem giờ mở cửa, số điện thoại và chỉ đường đến đại lý Levia.`,
  };
}

export default async function AgencyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);
  if (!agency) notFound();

  const images =
    agency.photos
      ?.map((photo) => ({
        photo,
        src: getImageUrl(photo, 1000),
      }))
      .filter((image): image is { photo: typeof image.photo; src: string } =>
        Boolean(image.src),
      ) ?? [];

  const localBusinessJsonLd = createLocalBusinessJsonLd(agency);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />

      <section className="bg-background py-16 sm:py-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            href="/agency"
            className="inline-flex items-center mb-8 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Tất cả đại lý
          </Link>

          <div className="items-start gap-10 grid lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div>
              <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
                {agency.province}
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl tracking-tight">
                {agency.name}
              </h1>
              <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
                Điểm trải nghiệm và tư vấn sản phẩm Levia tại {agency.province}.
                Xem thông tin liên hệ, giờ mở cửa và chỉ đường đến cửa hàng.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin đại lý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin className="mt-0.5 size-4 text-primary shrink-0" />
                  <span>{agency.address}</span>
                </p>

                {agency.hours && (
                  <p className="flex items-start gap-3 text-muted-foreground text-sm">
                    <Clock className="mt-0.5 size-4 text-primary shrink-0" />
                    <span>{agency.hours}</span>
                  </p>
                )}

                {agency.phone && (
                  <p className="flex items-start gap-3 text-muted-foreground text-sm">
                    <Phone className="mt-0.5 size-4 text-primary shrink-0" />
                    <span>{agency.phone}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {agency.mapLink && (
                    <a href={agency.mapLink} target="_blank" rel="noreferrer">
                      <Button>
                        <Navigation className="size-4" />
                        Chỉ đường
                      </Button>
                    </a>
                  )}

                  {agency.phone && (
                    <a href={`tel:${agency.phone.replace(/\s/g, '')}`}>
                      <Button variant="outline">
                        <Phone className="size-4" />
                        Gọi đại lý
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-card py-12 sm:py-16 border-border border-y">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
              Bản đồ
            </p>
            <h2 className="font-heading text-3xl tracking-tight">
              Vị trí cửa hàng
            </h2>
          </div>
          <div className="border border-border w-full aspect-video overflow-hidden">
            <InteractiveMap agencies={[agency]} selectedAgencyId={agency._id} />
          </div>
        </div>
      </section>

      {images.length > 0 && (
        <section className="bg-background py-16 sm:py-20 border-border border-b">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="mb-8 font-heading text-3xl tracking-tight">
              Hình ảnh cửa hàng
            </h2>
            <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
              {images.map(({ photo, src }, index) => (
                <div
                  key={`${photo.asset._ref}-${index}`}
                  className="relative bg-muted/30 aspect-4/3 overflow-hidden"
                >
                  <Image
                    src={src}
                    alt={photo.alt || `${agency.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <Link
            href="/agency"
            className="font-medium text-primary text-sm hover:underline"
          >
            Xem tất cả đại lý Levia
          </Link>
        </div>
      </section>
    </>
  );
}

function createLocalBusinessJsonLd(agency: Agency) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: agency.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: agency.address,
      addressRegion: agency.province,
      postalCode: agency.zip,
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: agency.lat,
      longitude: agency.lng,
    },
    telephone: agency.phone,
    hasMap: agency.mapLink,
    image: agency.photos
      ?.map((photo) => getImageUrl(photo, 1200))
      .filter(Boolean),
  };
}
