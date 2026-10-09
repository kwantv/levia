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
    <main>
      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative bg-background overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 max-w-7xl">
          <div className="items-center gap-12 grid lg:grid-cols-2">
            {/* Copy */}
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="gap-2 bg-primary/10 border-primary/30 text-primary"
              >
                <Brain className="size-3.5" />
                Ai Design
              </Badge>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
                Bếp từ được
                <br />
                <span className="text-primary">thiết kế bằng AI</span>
              </h1>
              <p className="max-w-lg text-muted-foreground text-lg leading-relaxed">
                Levia là bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu
                Âu, làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê công
                nghệ.
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
            <div className="relative flex justify-center items-center">
              <div className="bg-muted/30 p-8 border border-border w-full max-w-lg aspect-square">
                <div className="flex flex-col justify-center items-center gap-4 h-full text-muted-foreground">
                  <div className="bg-primary/5 p-4 border border-primary/20">
                    <Brain className="size-12 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{hero.name}</span>
                  <span className="text-muted-foreground text-xs">
                    Ảnh sản phẩm render — 730 × 430 mm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── QUICK TECH STRIP ──────── */}
      <section className="bg-card border-border border-y">
        <div className="grid grid-cols-1 sm:grid-cols-3 mx-auto sm:divide-x divide-y sm:divide-y-0 divide-border max-w-7xl">
          {[
            {
              icon: <Zap className="size-5 text-primary" />,
              text: 'Menu nấu tự động',
            },
            {
              icon: <Flame className="size-5 text-primary" />,
              text: 'Inverter ~30% tiết kiệm',
            },
            {
              icon: <ScanSearch className="size-5 text-primary" />,
              text: '9 mức nhiệt · Nhận diện nồi',
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex justify-center items-center gap-3 px-6 py-5 text-foreground text-sm"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── TECHNOLOGY SECTION ──────── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
              Công nghệ
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
              Hiểu căn bếp Việt.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mỗi chi tiết trên bếp Levia được tối ưu từ dữ liệu thực tế — để
              bữa cơm Việt mỗi ngày dễ dàng và trọn vẹn hơn.
            </p>
          </div>

          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {techBlocks.map((block) => (
              <Card
                key={block.number}
                className="group hover:ring-primary/30 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 size-10 text-primary transition-colors">
                      {techIcons[block.icon]}
                    </div>
                    <span className="font-mono text-muted-foreground text-xs">
                      {block.number}
                    </span>
                  </div>
                  <CardTitle className="font-semibold text-sm">
                    {block.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {block.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety note */}
          <Card className="mt-8">
            <CardContent className="flex items-start gap-4 pt-4">
              <Shield className="mt-0.5 size-5 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  An toàn
                </h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  Khoá trẻ em · Cảm biến nồi · Quá nhiệt tự ngắt · Chống tràn tự
                  ngắt · Hẹn giờ · CO/CQ.
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
      <section className="bg-background py-20 sm:py-28 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
              Sản phẩm
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
              Danh mục sản phẩm
            </h2>
          </div>

          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/product?category=${cat.slug}`}
                className="group"
              >
                <Card className="hover:ring-primary/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="font-semibold group-hover:text-primary text-lg transition-colors">
                      {cat.label}
                    </CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center gap-1 font-medium text-primary text-xs">
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
      <section className="bg-card py-20 sm:py-28 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
                Cook
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
                Nấu chuẩn vị Việt.
              </h2>
            </div>
            <Link
              href="/cook"
              className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/cook/${recipe.slug}`}
                className="group"
              >
                <Card className="hover:ring-primary/30 overflow-hidden transition-colors">
                  {/* Image placeholder */}
                  <div className="relative bg-muted/30 aspect-4/3">
                    <div className="flex justify-center items-center h-full text-muted-foreground text-xs">
                      Ảnh {recipe.title}
                    </div>
                    <div className="bottom-3 left-3 absolute">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 backdrop-blur-sm text-primary"
                      >
                        {recipe.heatLevel}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-semibold group-hover:text-primary text-sm transition-colors">
                      {recipe.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Clock className="size-3.5" />
                      {recipe.cookTime}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="sm:hidden mt-8 text-center">
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
      <section className="bg-background py-20 sm:py-28 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <MapPin className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
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
    </main>
  );
}
