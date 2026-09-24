import DotGridBackground from '@/components/dot-grid-background';
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Flame,
  Gauge,
  Soup,
  Sparkles,
  Waves,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Về Levia — Kitchen Intelligence',
  description:
    'Levia ứng dụng dữ liệu và AI để tạo nên những thiết bị bếp thông minh, được thiết kế dựa trên cách người Việt thực sự nấu ăn.',
};

const vietnamFeatures = [
  {
    icon: Waves,
    index: '01',
    title: 'Liu riu ổn định',
    description:
      'Duy trì mức nhiệt thấp ổn định để những món kho cần thời gian có thể chín đều mà không cháy đáy.',
    note: 'Low Heat / Stability',
  },
  {
    icon: Flame,
    index: '02',
    title: 'Turbo đúng lúc',
    description:
      'Công suất lớn được kích hoạt nhanh khi món ăn cần nhiệt mạnh — từ chảo xào đến những thao tác cần phản hồi tức thời.',
    note: 'Turbo / Response',
  },
  {
    icon: Soup,
    index: '03',
    title: 'Cho bữa ăn sum vầy',
    description:
      'Các chế độ tự động được xây dựng quanh những tình huống quen thuộc như nồi lẩu giữa bàn ăn gia đình.',
    note: 'Vietnamese Dining',
  },
  {
    icon: Gauge,
    index: '04',
    title: 'Phù hợp khí hậu Việt Nam',
    description:
      'Cấu trúc mâm từ được chú trọng khả năng chống nồm ẩm, phù hợp hơn với điều kiện khí hậu nhiệt đới.',
    note: 'Climate / Protection',
  },
];

const materials = [
  ['01', 'Viền inox', 'Cấu trúc chắc chắn, đường nét chính xác.'],
  ['02', 'Kính ceramic', 'Bề mặt liền mạch, dễ làm sạch và bền bỉ.'],
  ['03', 'Đen ánh kim', 'Sang trọng nhưng không phô trương.'],
];

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      {/* ───────────────── HERO ───────────────── */}

      <section className="relative border-border border-b overflow-hidden">
        <DotGridBackground />

        <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-175 pointer-events-none" />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel>About / 01</SectionLabel>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <span className="font-mono text-[9px] text-primary uppercase tracking-[0.2em]">
                Levia / Kitchen Intelligence
              </span>

              <h1 className="mt-6 max-w-5xl font-heading font-medium text-[clamp(3.5rem,8vw,7rem)] leading-[0.86] tracking-[-0.06em]">
                Hiểu cách
                <br />
                <span className="text-primary">người Việt nấu ăn.</span>
              </h1>

              <div className="gap-8 grid md:grid-cols-2 mt-12 sm:mt-16 pt-7 border-border border-t">
                <p className="max-w-lg font-heading text-xl sm:text-2xl leading-[1.45] tracking-tight">
                  Levia ra đời từ một câu hỏi đơn giản:
                </p>

                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.8]">
                  Một chiếc bếp từ sẽ như thế nào nếu được thiết kế bằng chính
                  dữ liệu về cách con người nấu ăn?
                </p>
              </div>
            </div>
          </div>

          {/* Statement */}
          <div className="mt-20 sm:mt-28">
            <div className="gap-y-8 lg:gap-x-8 grid grid-cols-12 py-10 sm:py-14">
              <div className="col-span-12 lg:col-span-3">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                  Origin / Question
                </span>
              </div>

              <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                <p className="max-w-5xl font-heading text-muted-foreground text-3xl sm:text-5xl lg:text-6xl leading-none tracking-tighter">
                  Không bắt đầu từ việc thêm nhiều tính năng hơn.
                  <span className="text-primary">
                    {' '}
                    Chúng tôi bắt đầu từ việc hiểu người đứng bếp hơn.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── INTELLIGENCE ───────────────── */}

      <section className="border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel>Smart / 02</SectionLabel>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <span className="font-mono text-[9px] text-muted-foreground text-primary uppercase tracking-[0.2em]">
                AI driven technology
              </span>

              <h2 className="mt-8 max-w-4xl font-heading font-medium text-[clamp(2.75rem,5vw,4rem)] leading-none tracking-tighter">
                Công nghệ bắt đầu từ{' '}
                <span className="text-primary">hành vi thực tế.</span>
              </h2>

              <div className="gap-10 grid md:grid-cols-2 mt-12 pt-8 border-border border-t">
                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]">
                  Levia ứng dụng AI để phân tích thói quen nấu nướng thực tế, từ
                  cách người dùng tăng giảm nhiệt đến những khoảng thời gian một
                  món ăn cần được giữ ổn định.
                </p>

                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]">
                  Những dữ liệu đó trở thành cơ sở để tinh chỉnh từng vùng nhiệt
                  và từng thao tác điều khiển — để chiếc bếp phản hồi gần với
                  phản xạ tự nhiên của người đứng bếp hơn.
                </p>
              </div>

              <div className="gap-px grid sm:grid-cols-3 mt-16 bg-border border border-border">
                <Principle
                  number="01"
                  label="Observe"
                  title="Quan sát"
                  description="Hiểu cách người dùng thực sự nấu ăn."
                />

                <Principle
                  number="02"
                  label="Learn"
                  title="Phân tích"
                  description="Tìm ra những mẫu hành vi có ý nghĩa."
                />

                <Principle
                  number="03"
                  label="Respond"
                  title="Phản hồi"
                  description="Biến dữ liệu thành trải nghiệm sử dụng."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── DESIGN ───────────────── */}

      <section className="bg-card/20 border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
          <div className="grid lg:grid-cols-12 border-border lg:border-x">
            {/* Visual */}
            <div className="relative lg:col-span-6 bg-card min-h-[480px] lg:min-h-[760px] overflow-hidden">
              <div className="absolute inset-0">
                <div className="top-[16%] left-[12%] absolute border border-primary/20 w-[76%] aspect-[4/3]">
                  <div className="top-1/2 left-1/2 absolute border border-border rounded-full size-[52%] -translate-x-1/2 -translate-y-1/2" />

                  <div className="top-1/2 left-1/2 absolute border border-primary/20 rounded-full size-[31%] -translate-x-1/2 -translate-y-1/2" />

                  <div className="top-1/2 left-1/2 absolute bg-primary/10 blur-3xl rounded-full size-[30%] -translate-x-1/2 -translate-y-1/2" />
                </div>

                <span className="top-6 left-6 absolute bg-primary size-1.5" />

                <div className="right-6 bottom-6 left-6 absolute flex justify-between">
                  <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                    Form / Material
                  </span>

                  <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                    European Minimalism
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between lg:col-span-6 p-6 sm:p-10 lg:p-12 xl:p-16 lg:border-border lg:border-l">
              <div>
                <SectionLabel>Design / 03</SectionLabel>

                <h2 className="mt-16 max-w-xl font-heading font-medium text-3xl sm:text-4xl lg:text-6xl leading-none tracking-[-0.045em]">
                  <span className="text-primary">Tối giản</span> để công nghệ
                  trở nên tự nhiên.
                </h2>

                <p className="mt-7 max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.9]">
                  Levia theo đuổi tinh thần tối giản châu Âu: ít chi tiết hơn,
                  đường nét rõ hơn và vật liệu được lựa chọn để hòa vào kiến
                  trúc căn bếp thay vì cạnh tranh với nó.
                </p>
              </div>

              <div className="mt-16 border-border border-t">
                {materials.map(([index, title, description]) => (
                  <div
                    key={index}
                    className="gap-5 grid grid-cols-[2.5rem_1fr] py-6 border-border border-b"
                  >
                    <span className="font-mono text-[9px] text-primary">
                      {index}
                    </span>

                    <div>
                      <h3 className="font-heading font-medium text-xl tracking-[-0.025em]">
                        {title}
                      </h3>

                      <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── VIETNAM ───────────────── */}

      <section className="border-border border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel>Living / 04</SectionLabel>
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              <span className="font-mono text-[9px] text-primary uppercase tracking-[0.2em]">
                Designed for Vietnamese Kitchen
              </span>

              <h2 className="mt-6 max-w-4xl font-heading font-medium text-[clamp(3rem,5vw,4rem)] leading-[0.93] tracking-[-0.055em]">
                Mỗi chi tiết được làm ra cho
                <br />
                <span className="text-primary">bữa cơm Việt.</span>
              </h2>

              <div className="gap-10 grid md:grid-cols-2 mt-14 pt-8 border-border border-t">
                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]">
                  Cho gian bếp của những gia đình trẻ đang dựng xây tổ ấm đầu
                  tiên. Cho những bữa cơm thường ngày cần sự đơn giản, nhưng vẫn
                  xứng đáng được chăm chút.
                </p>

                <p className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.9]">
                  Chúng tôi muốn công nghệ hiện diện vừa đủ: thông minh ở bên
                  trong, nhưng tự nhiên và dễ sử dụng ở bên ngoài.
                </p>
              </div>
            </div>
          </div>

          <div className="gap-px grid sm:grid-cols-2 mt-16 lg:mt-20 bg-border border border-border">
            {vietnamFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.index}
                  className="group bg-background p-6 sm:p-8 lg:p-10 min-h-[300px]"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] text-primary">
                      {feature.index}
                    </span>

                    <Icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="mt-16">
                    <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                      {feature.note}
                    </span>

                    <h3 className="mt-4 font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-md text-muted-foreground text-sm leading-[1.8]">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── MANIFESTO ───────────────── */}

      <section className="relative bg-card/25 border-border border-b overflow-hidden">
        <div className="-bottom-72 -left-48 absolute bg-primary/5 blur-[160px] rounded-full size-[650px] pointer-events-none" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 container">
          <div className="gap-y-12 lg:gap-x-8 grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel>Levia / Manifesto</SectionLabel>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <p className="max-w-6xl font-heading font-medium text-[clamp(3.25rem,5vw,4rem)] leading-[0.88] tracking-[-0.06em]">
                Thông minh
                <span className="text-primary"> từ bên trong.</span>
                <br />
                Dễ dàng hơn
                <span className="text-muted-foreground"> mỗi ngày.</span>
              </p>

              <p className="mt-10 max-w-2xl text-muted-foreground text-sm sm:text-base leading-[1.9]">
                Để mỗi ngày vào bếp là một ngày dễ dàng và trọn vẹn hơn.
              </p>

              <div className="gap-px grid sm:grid-cols-2 mt-16 bg-border border border-border max-w-3xl">
                <Link
                  href="/product"
                  className="group flex justify-between items-center bg-background p-5 sm:p-6"
                >
                  <div>
                    <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                      Explore / Product
                    </span>

                    <span className="block mt-2 font-medium text-sm">
                      Khám phá sản phẩm
                    </span>
                  </div>

                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/cook"
                  className="group flex justify-between items-center bg-background p-5 sm:p-6"
                >
                  <div>
                    <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
                      Explore / Cook
                    </span>

                    <span className="block mt-2 font-medium text-sm">
                      Hiểu căn bếp Việt
                    </span>
                  </div>

                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary size-1.5 shrink-0" />

      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}

function Principle({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between bg-background p-6 sm:p-8 min-h-[260px]">
      <div className="flex justify-between">
        <span className="font-mono text-[10px] text-primary">{number}</span>

        <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <div>
        <h3 className="font-heading font-medium text-2xl tracking-[-0.03em]">
          {title}
        </h3>

        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
