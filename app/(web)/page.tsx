import Link from 'next/link';
import {
  Brain,
  Zap,
  Flame,
  Sparkles,
  Shield,
  ScanSearch,
  MapPin,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  products,
  categories,
  featuredRecipes,
  techBlocks,
} from '@/lib/mock-data';

const techIcons: Record<string, React.ReactNode> = {
  Brain: <Brain className="size-6" />,
  Zap: <Zap className="size-6" />,
  Flame: <Flame className="size-6" />,
  Sparkles: <Sparkles className="size-6" />,
  Shield: <Shield className="size-6" />,
  ScanSearch: <ScanSearch className="size-6" />,
};

export default function Home() {
  const hero = products[0]; // LV79DI

  return (
    <>
      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div className="space-y-6">
              <Badge variant="outline" className="gap-2 border-primary/30 bg-primary/10 text-primary">
                <Brain className="size-3.5" />
                Ai Design
              </Badge>
              <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Bếp từ được
                <br />
                <span className="text-primary">thiết kế bằng AI</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Levia là bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu
                Âu, làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê
                công nghệ.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/agency">
                  <Button size="lg" className="gap-2">
                    <MapPin className="size-4" />
                    Tìm đại lý gần bạn
                  </Button>
                </Link>
                <Link href="/product/lv79di">
                  <Button variant="outline" size="lg" className="gap-2">
                    Xem LV79DI
                    <ChevronRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="relative flex items-center justify-center">
              <div className="aspect-square w-full max-w-lg border border-border bg-muted/30 p-8">
                <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                  <div className="border border-primary/20 bg-primary/5 p-4">
                    <Brain className="size-12 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{hero.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Ảnh sản phẩm render — 730 × 430 mm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── QUICK TECH STRIP ──────── */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: <Zap className="size-5 text-primary" />, text: 'Menu nấu tự động' },
            { icon: <Flame className="size-5 text-primary" />, text: 'Inverter ~30% tiết kiệm' },
            { icon: <ScanSearch className="size-5 text-primary" />, text: '9 mức nhiệt · Nhận diện nồi' },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center justify-center gap-3 px-6 py-5 text-sm text-foreground"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── TECHNOLOGY SECTION ──────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Công nghệ
            </p>
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
              Hiểu căn bếp Việt.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mỗi chi tiết trên bếp Levia được tối ưu từ dữ liệu thực tế — để
              bữa cơm Việt mỗi ngày dễ dàng và trọn vẹn hơn.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {techBlocks.map((block) => (
              <Card key={block.number} className="group transition-colors hover:ring-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                      {techIcons[block.icon]}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {block.number}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {block.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {block.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety note */}
          <Card className="mt-8">
            <CardContent className="flex items-start gap-4 pt-4">
              <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">An toàn</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Khoá trẻ em · Cảm biến nồi · Quá nhiệt tự ngắt · Chống tràn
                  tự ngắt · Hẹn giờ · CO/CQ.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/product">
              <Button variant="outline" size="lg" className="gap-2">
                Xem sản phẩm
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── PRODUCT CATEGORIES ──────── */}
      <section className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Sản phẩm
            </p>
            <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
              Danh mục sản phẩm
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/product?category=${cat.slug}`}
                className="group"
              >
                <Card className="transition-colors hover:ring-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold transition-colors group-hover:text-primary">
                      {cat.label}
                    </CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-1 text-xs font-medium text-primary">
                      {cat.count} sản phẩm
                      <ChevronRight className="size-3.5" />
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FEATURED RECIPES (COOK NOW) ──────── */}
      <section className="border-t border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                Cook
              </p>
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                Nấu chuẩn vị Việt.
              </h2>
            </div>
            <Link
              href="/cook"
              className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/cook/${recipe.slug}`}
                className="group"
              >
                <Card className="overflow-hidden transition-colors hover:ring-primary/30">
                  {/* Image placeholder */}
                  <div className="relative aspect-4/3 bg-muted/30">
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Ảnh {recipe.title}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-background/90 text-primary backdrop-blur-sm">
                        {recipe.heatLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold transition-colors group-hover:text-primary">
                      {recipe.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      {recipe.cookTime}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/cook">
              <Button variant="outline" size="lg" className="gap-2">
                Xem tất cả công thức
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── FIND DEALER CTA ──────── */}
      <section className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <MapPin className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
            Tìm đại lý gần bạn
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Levia có mặt tại hệ thống đại lý trên toàn quốc. Tìm cửa hàng gần
            nhất để trải nghiệm sản phẩm trực tiếp.
          </p>
          <div className="mt-8">
            <Link href="/agency">
              <Button size="lg" className="gap-2">
                <MapPin className="size-4" />
                Tìm đại lý
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
