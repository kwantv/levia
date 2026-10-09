import { ArrowUpRight, Flame, Gauge, Soup, Waves } from 'lucide-react';
import Link from 'next/link';
import HeroSection from './hero-section';
import SectionLabel from './section-label';
import StatementSection from './statement-section';
import IntelligenceSection from './intelligence-section';
import DesignSection from './design-section';
import LivingSection from './living-section';

export const metadata = {
  title: 'Về Levia — Kitchen Intelligence',
  description:
    'Levia ứng dụng dữ liệu và AI để tạo nên những thiết bị bếp thông minh, được thiết kế dựa trên cách người Việt thực sự nấu ăn.',
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen text-foreground">
      <HeroSection />
      <IntelligenceSection />
      <StatementSection />
      <DesignSection />
      <LivingSection />

      {/* ───────────────── MANIFESTO ───────────────── */}

      <section className="relative bg-card/25 border-y overflow-hidden">
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
