import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-lg font-bold tracking-tight text-foreground">
              LEVIA
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu Âu, làm ra
              để nấu chuẩn vị Việt.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Khám phá</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/product" className="transition-colors hover:text-foreground">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/cook" className="transition-colors hover:text-foreground">
                  Công thức nấu
                </Link>
              </li>
              <li>
                <Link href="/article" className="transition-colors hover:text-foreground">
                  Cẩm nang bếp
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/agency" className="transition-colors hover:text-foreground">
                  Tìm đại lý
                </Link>
              </li>
              <li>
                <span className="transition-colors hover:text-foreground">
                  Chính sách bảo hành
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>1800 xxxx {/* TODO(client-confirm) */}</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4" />
                <span>Zalo OA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Levia. Thông minh từ bên trong.
        </div>
      </div>
    </footer>
  );
}
