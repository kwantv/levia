import { ArrowUpRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo/logo-text.svg';

const navigation = [
  {
    title: 'Khám phá',
    links: [
      {
        label: 'Sản phẩm',
        href: '/product',
      },
      {
        label: 'Hệ thống đại lý',
        href: '/agency',
      },
      {
        label: 'Cook now',
        href: '/cook',
      },
    ],
  },
  {
    title: 'Levia',
    links: [
      {
        label: 'Về Levia',
        href: '/about',
      },
      {
        label: 'Kitchen Intelligence',
        href: '/about#intelligence',
      },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-border border-t overflow-hidden text-foreground">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 container">
        {/* ───────────────── NAVIGATION ───────────────── */}

        <div className="grid lg:grid-cols-12 border-border border-b">
          {/* Brand */}
          <div className="lg:col-span-6 py-10 sm:py-12 lg:pr-12 lg:border-border lg:border-r">
            <Link
              href="/"
              className="inline-block font-heading font-medium text-4xl sm:text-5xl tracking-[-0.055em]"
            >
              <Image src={logo} className="w-auto h-12" alt="Levia logo" />
            </Link>

            <p className="mt-5 max-w-sm text-muted-foreground text-sm leading-[1.8]">
              Công nghệ bếp dành cho nhịp sống hiện đại — được thiết kế để hiểu
              người dùng và trở thành một phần tự nhiên của căn bếp.
            </p>

            <div className="flex items-start gap-3 mt-8 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 text-primary shrink-0" />

              <p className="max-w-xs text-xs leading-relaxed">
                Khám phá hệ thống đại lý và không gian trải nghiệm Levia trên
                toàn quốc.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-6">
            <div className="gap-px grid grid-cols-2 bg-border h-full">
              {navigation.map((group) => (
                <div
                  key={group.title}
                  className="bg-background p-6 sm:p-8 lg:p-10"
                >
                  <span className="font-mono text-[8px] text-primary uppercase tracking-[0.2em]">
                    {group.title}
                  </span>

                  <nav className="mt-7">
                    <ul className="space-y-4">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group/link inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
                          >
                            <span>{link.label}</span>

                            <ArrowUpRight className="opacity-0 group-hover/link:opacity-100 size-3 transition-all -translate-x-1 translate-y-1 group-hover/link:translate-x-0 group-hover/link:translate-y-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────── BOTTOM ───────────────── */}

        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-5 py-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[8px] text-muted-foreground uppercase tracking-[0.16em]">
            <span>© {year} Levia</span>

            <span className="hidden sm:inline text-border">/</span>

            <span>Kitchen Intelligence</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="font-mono text-[8px] text-muted-foreground hover:text-foreground uppercase tracking-[0.16em] transition-colors"
            >
              Chính sách bảo mật
            </Link>

            <Link
              href="/terms"
              className="font-mono text-[8px] text-muted-foreground hover:text-foreground uppercase tracking-[0.16em] transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
