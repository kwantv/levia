import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-1 justify-center items-center bg-background px-4 py-24 min-h-screen">
      <div className="max-w-xl text-center">
        <p className="font-mono font-medium text-primary text-sm uppercase tracking-widest">
          404
        </p>
        <h1 className="mt-3 font-heading text-4xl sm:text-5xl tracking-tight">
          Không tìm thấy trang
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground leading-relaxed">
          Trang bạn đang tìm có thể đã được chuyển, đổi địa chỉ hoặc không còn
          tồn tại. Hãy quay về trang chủ hoặc tiếp tục khám phá sản phẩm Levia.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="size-4" />
              Về trang chủ
            </Button>
          </Link>
          <Link href="/product">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="size-4" />
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
