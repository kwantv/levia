import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex items-center bg-background min-h-[80vh] text-foreground">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full container">
        <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="bg-primary size-1.5" />

              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                Error / 404
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <span className="font-mono text-[9px] text-primary uppercase tracking-[0.2em]">
              Levia / Not Found
            </span>

            <h1 className="mt-6 max-w-4xl font-heading font-medium text-[clamp(4rem,7vw,7rem)] leading-[0.82]">
              404
            </h1>

            <p className="mt-8 max-w-lg text-muted-foreground text-sm sm:text-base leading-[1.8]">
              Nội dung bạn đang tìm có thể đã được di chuyển hoặc đường dẫn
              không còn chính xác.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 bg-primary px-5 h-12 font-medium text-primary-foreground text-sm"
              >
                <Home className="size-4" />
                Về trang chủ
              </Link>

              <Link
                href="/product"
                className="group inline-flex items-center gap-3 px-5 border border-border hover:border-primary h-12 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
