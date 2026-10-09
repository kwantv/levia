import { getImageUrl } from '@/sanity/lib/image';
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import DotGridBackground from '@/components/dot-grid-background';
import { Agency, getAgencyBySlug, getAllAgencySlugs } from './action';
import { AgencyDetailMap } from './agency-detail-map';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type AgencyPR = {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  quote?: string;
};

/**
 * Temporary content only.
 *
 * Later this can become something like:
 *
 * agency.story {
 *   eyebrow
 *   title
 *   lead
 *   body
 *   quote
 * }
 */
function getMockAgencyPR(agency: Agency): AgencyPR {
  return {
    eyebrow: 'Levia / Local Experience',

    title: `Không gian trải nghiệm Levia tại ${agency.province}.`,

    lead: `${agency.name} là điểm đến dành cho khách hàng muốn trực tiếp cảm nhận cách các thiết bị Levia vận hành trong một không gian bếp thực tế.`,

    paragraphs: [
      'Thay vì chỉ lựa chọn sản phẩm qua thông số kỹ thuật, khách hàng có thể quan sát vật liệu, cách bố trí vùng nấu, thao tác điều khiển và cảm giác sử dụng trực tiếp tại showroom.',

      'Đội ngũ tư vấn tại đại lý có thể hỗ trợ lựa chọn sản phẩm dựa trên diện tích bếp, thói quen nấu ăn và phong cách thiết kế của từng gia đình.',

      'Levia hướng đến một trải nghiệm mua sắm đơn giản hơn: hiểu sản phẩm trước khi lựa chọn, và tìm được giải pháp thực sự phù hợp với căn bếp.',
    ],

    quote:
      'Một thiết bị tốt không chỉ phù hợp với căn bếp — nó phải phù hợp với cách bạn sử dụng căn bếp mỗi ngày.',
  };
}

export async function generateStaticParams() {
  const slugs = await getAllAgencySlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    return {
      title: 'Không tìm thấy đại lý — Levia',
    };
  }

  const cover = agency.photos?.[0]
    ? getImageUrl(agency.photos[0], 1400)
    : undefined;

  return {
    title: `${agency.name} — Đại lý Levia`,
    description: `${agency.name} tại ${agency.address}, ${agency.province}. Xem thông tin liên hệ, giờ mở cửa và chỉ đường đến đại lý Levia.`,

    openGraph: {
      title: `${agency.name} — Đại lý Levia`,
      description: `${agency.address}, ${agency.province}`,
      images: cover
        ? [
            {
              url: cover,
            },
          ]
        : undefined,
    },
  };
}

export default async function AgencyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  const story = getMockAgencyPR(agency);

  const cover = agency.photos?.[0]
    ? getImageUrl(agency.photos[0], 1800)
    : undefined;

  const gallery = agency.photos?.slice(1) ?? [];

  const directionsHref =
    agency.mapLink ||
    `https://www.google.com/maps/dir/?api=1&destination=${agency.lat},${agency.lng}`;

  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}

      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-[700px] pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pb-20 container">
          <div className="flex justify-between items-center">
            <Link
              href="/agency"
              className="group inline-flex items-center gap-2 font-mono text-[9px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              Hệ thống đại lý
            </Link>

            <span className="hidden sm:block font-mono text-[9px] text-muted-foreground/50 uppercase tracking-[0.2em]">
              Levia / Store Network
            </span>
          </div>

          <div className="gap-y-12 lg:gap-x-10 grid grid-cols-12 mt-14 sm:mt-20">
            {/* Information */}
            <div className="flex flex-col justify-between col-span-12 lg:col-span-5 lg:py-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="bg-primary size-1.5" />

                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                    Agency / {agency.province}
                  </span>
                </div>

                <h1 className="mt-12 max-w-2xl font-heading font-medium text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.055em]">
                  {agency.name}
                </h1>

                <p className="mt-7 max-w-md text-muted-foreground text-sm sm:text-base leading-[1.8]">
                  Trải nghiệm trực tiếp các sản phẩm Levia, nhận tư vấn và tìm
                  giải pháp phù hợp cho không gian bếp của bạn.
                </p>
              </div>

              <div className="mt-14 border-border border-t">
                <AgencyInfoRow icon={MapPin} label="Địa chỉ">
                  {agency.address}
                  {agency.zip ? `, ${agency.zip}` : ''}, {agency.province}
                </AgencyInfoRow>

                {agency.hours && (
                  <AgencyInfoRow icon={Clock} label="Giờ hoạt động">
                    {agency.hours}
                  </AgencyInfoRow>
                )}

                {agency.phone && (
                  <AgencyInfoRow icon={Phone} label="Điện thoại">
                    <a
                      href={`tel:${agency.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {agency.phone}
                    </a>
                  </AgencyInfoRow>
                )}
              </div>

              <div className="gap-3 grid sm:grid-cols-2 mt-8">
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex justify-between items-center gap-6 bg-primary px-5 h-14 text-primary-foreground"
                >
                  <span className="font-medium text-sm">Chỉ đường</span>

                  <Navigation className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>

                {agency.phone && (
                  <a
                    href={`tel:${agency.phone}`}
                    className="group flex justify-between items-center gap-6 px-5 border border-border hover:border-primary h-14 transition-colors"
                  >
                    <span className="font-medium text-sm">Liên hệ đại lý</span>

                    <Phone className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Main image */}
            <div className="relative col-span-12 lg:col-span-7 bg-card border border-border aspect-[4/3] lg:aspect-[5/6] overflow-hidden">
              {cover ? (
                <Image
                  src={cover}
                  alt={agency.photos[0]?.alt || agency.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <AgencyImagePlaceholder />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

              <span className="top-5 left-5 absolute bg-primary size-1.5" />

              <div className="right-5 bottom-5 left-5 absolute flex justify-between items-end">
                <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.18em]">
                  Showroom / {agency.province}
                </span>

                <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.18em]">
                  Levia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── GALLERY ───────────────── */}

      {gallery.length > 0 && (
        <section className="border-border border-b">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 container">
            <SectionHeading
              label="Space / 02"
              title="Không gian trải nghiệm."
              description="Một vài góc nhìn tại showroom để bạn hình dung rõ hơn về không gian trưng bày và trải nghiệm sản phẩm."
            />

            <div className="gap-px grid sm:grid-cols-2 mt-12 bg-border border border-border">
              {gallery.map((image, index) => {
                const src = getImageUrl(image, index === 0 ? 1400 : 900);

                if (!src) return null;

                return (
                  <div
                    key={image.asset?._ref ?? index}
                    className={`
                        group relative bg-card overflow-hidden
                        ${
                          index === 0 && gallery.length >= 3
                            ? 'sm:col-span-2 aspect-[16/8]'
                            : 'aspect-[4/3]'
                        }
                      `}
                  >
                    <Image
                      src={src}
                      alt={image.alt || `${agency.name} ${index + 2}`}
                      fill
                      className="object-cover group-hover:scale-[1.025] transition-transform duration-700 ease-out"
                      sizes={
                        index === 0 ? '100vw' : '(max-width: 640px) 100vw, 50vw'
                      }
                    />

                    <span className="top-4 left-4 absolute bg-background/80 backdrop-blur-sm px-2 py-1 font-mono text-[8px] text-muted-foreground">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────── PR / STORY ───────────────── */}

      <section className="relative bg-card/25 border-border border-b overflow-hidden">
        <div className="-bottom-72 -left-48 absolute bg-primary/5 blur-[160px] rounded-full size-[600px]" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
          <div className="gap-y-12 lg:gap-x-10 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary size-1.5" />

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  {story.eyebrow}
                </span>
              </div>
            </div>

            <article className="col-span-12 lg:col-span-8 lg:col-start-5">
              <h2 className="max-w-4xl font-heading font-medium text-[clamp(2.75rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.05em]">
                {story.title}
              </h2>

              <p className="mt-10 max-w-2xl font-heading text-xl sm:text-2xl leading-[1.4] tracking-[-0.02em]">
                {story.lead}
              </p>

              <div className="gap-y-6 lg:gap-x-12 grid md:grid-cols-2 mt-12 pt-8 border-border border-t">
                {story.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground text-sm sm:text-base leading-[1.9]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {story.quote && (
                <blockquote className="mt-16 pl-6 sm:pl-8 border-primary border-l">
                  <p className="max-w-3xl font-heading font-medium text-2xl sm:text-3xl lg:text-4xl leading-[1.15] tracking-[-0.035em]">
                    “{story.quote}”
                  </p>

                  <span className="block mt-6 font-mono text-[8px] text-primary uppercase tracking-[0.2em]">
                    Levia / Kitchen Intelligence
                  </span>
                </blockquote>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* ───────────────── LOCATION ───────────────── */}

      <section className="border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
          <SectionHeading
            label="Location / 03"
            title="Đến và trải nghiệm."
            description="Xem vị trí chính xác của đại lý và mở chỉ đường trực tiếp khi bạn sẵn sàng ghé showroom."
          />

          <div className="gap-px grid lg:grid-cols-[minmax(280px,360px)_1fr] mt-12 bg-border border border-border">
            {/* Address */}
            <div className="flex flex-col justify-between bg-background p-6 sm:p-8">
              <div>
                <span className="font-mono text-[8px] text-primary uppercase tracking-[0.18em]">
                  {agency.province}
                </span>

                <h3 className="mt-4 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
                  {agency.name}
                </h3>

                <p className="mt-5 text-muted-foreground text-sm leading-[1.8]">
                  {agency.address}
                  {agency.zip ? `, ${agency.zip}` : ''}, {agency.province}
                </p>

                {agency.hours && (
                  <div className="flex items-start gap-3 mt-7 pt-5 border-border border-t">
                    <Clock className="mt-0.5 size-4 text-primary shrink-0" />

                    <div>
                      <span className="block font-mono text-[8px] text-muted-foreground uppercase tracking-[0.16em]">
                        Giờ hoạt động
                      </span>

                      <span className="block mt-2 text-sm">{agency.hours}</span>
                    </div>
                  </div>
                )}
              </div>

              <a
                href={directionsHref}
                target="_blank"
                rel="noreferrer"
                className="group flex justify-between items-center gap-8 mt-12 pt-5 border-border hover:border-primary border-t transition-colors"
              >
                <span className="font-medium text-sm">Mở chỉ đường</span>

                <ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Map */}
            <div className="bg-background h-[480px] sm:h-[580px] lg:h-[680px]">
              <AgencyDetailMap agency={agency} />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── ENDING CTA ───────────────── */}

      <section className="relative overflow-hidden">
        <div className="-bottom-80 -left-40 absolute bg-primary/5 blur-[160px] rounded-full size-[600px]" />

        <Link
          href="/agency"
          className="group block mx-auto px-4 sm:px-6 lg:px-8 border-border border-y container"
        >
          <div className="gap-8 grid lg:grid-cols-12 py-10 sm:py-14">
            <div className="lg:col-span-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Agency / Explore
              </span>
            </div>

            <div className="lg:col-span-9">
              <div className="flex justify-between items-end gap-8">
                <div>
                  <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl tracking-[-0.045em]">
                    Khám phá hệ thống đại lý.
                  </h2>

                  <p className="mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
                    Tìm thêm điểm trải nghiệm Levia tại các tỉnh và thành phố
                    khác.
                  </p>
                </div>

                <div className="flex justify-center items-center group-hover:bg-primary border border-border group-hover:border-primary size-12 text-muted-foreground group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

function AgencyInfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gap-5 grid grid-cols-[2rem_minmax(0,1fr)] py-5 border-border border-b">
      <Icon className="mt-0.5 size-4 text-primary" />

      <div>
        <span className="block font-mono text-[8px] text-muted-foreground uppercase tracking-[0.16em]">
          {label}
        </span>

        <div className="mt-2 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="gap-y-8 lg:gap-x-8 grid grid-cols-12">
      <div className="col-span-12 lg:col-span-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary size-1.5" />

          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
            {label}
          </span>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 lg:col-start-5">
        <h2 className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]">
          {title}
        </h2>

        <p className="mt-5 max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.8]">
          {description}
        </p>
      </div>
    </div>
  );
}

function AgencyImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="text-center">
        <MapPin className="mx-auto size-6 text-primary/60" />

        <span className="block mt-3 font-mono text-[8px] text-muted-foreground/50 uppercase tracking-[0.2em]">
          Levia / Showroom
        </span>
      </div>
    </div>
  );
}
