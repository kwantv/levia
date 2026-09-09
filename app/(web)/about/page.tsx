import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ChevronRight, Flame, MapPin, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Về Levia — Thông minh từ bên trong',
  description:
    'Levia là bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu Âu, làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê công nghệ.',
};

const pillars = [
  {
    title: 'Trí tuệ — Thiết kế bằng AI',
    description:
      'Bố cục vùng nấu & trải nghiệm tối ưu từ dữ liệu thói quen nấu; menu tự động, inverter tiết kiệm ~30%, nhận diện nồi.',
    icon: Brain,
  },
  {
    title: 'Vị Việt — Nấu đúng cách người Việt',
    description:
      'Liu riu ổn định cho món kho, Turbo cho món xào, menu lẩu; mâm từ chống nồm ẩm.',
    icon: Flame,
  },
  {
    title: 'Tinh gọn — Thẩm mỹ châu Âu',
    description:
      'Viền inox, mặt kính ceramic, tông đen ánh kim và ngôn ngữ tối giản — sang mà không phô.',
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            Về Levia
          </p>
          <h1 className="max-w-3xl font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Thông minh từ bên trong.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg leading-relaxed">
            Levia là bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu Âu,
            làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê công nghệ.
          </p>
        </div>
      </section>

      <section className="bg-card py-16 sm:py-24 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
            Câu chuyện thương hiệu
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
            Hiểu căn bếp Việt.
          </h2>

          <div className="space-y-6 mt-8 text-muted-foreground leading-relaxed">
            <p>
              Levia ra đời từ một câu hỏi đơn giản: một chiếc bếp từ sẽ như thế
              nào nếu được thiết kế bằng chính dữ liệu về cách con người nấu ăn?
            </p>
            <p>
              Chúng tôi ứng dụng AI để phân tích thói quen nấu nướng thực tế, từ
              đó tinh chỉnh từng vùng nhiệt, từng thao tác điều khiển — để chiếc
              bếp phản hồi đúng như phản xạ của người đứng bếp. Thiết kế theo tinh
              thần tối giản châu Âu: viền inox, mặt kính ceramic, tông đen ánh kim
              sang trọng mà không phô trương.
            </p>
            <p>
              Nhưng điều Levia tự hào nhất là hiểu căn bếp Việt. Chế độ liu riu
              ổn định để kho cá không cháy đáy, công suất Turbo cho chảo xào bốc
              lửa, menu tự động cho nồi lẩu sum vầy, mâm từ phủ hai lớp chống nồm
              ẩm hợp khí hậu nhiệt đới. Mỗi chi tiết được làm ra cho bữa cơm Việt,
              cho gian bếp của những gia đình trẻ đang dựng xây tổ ấm đầu tiên.
            </p>
            <p className="text-foreground">
              Levia — thông minh từ bên trong, để mỗi ngày vào bếp là một ngày dễ
              dàng và trọn vẹn hơn.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-24 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 font-medium text-primary text-sm uppercase tracking-widest">
              Ba trụ giá trị
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
              Điều tạo nên Levia
            </h2>
          </div>

          <div className="gap-6 grid md:grid-cols-3">
            {pillars.map(({ title, description, icon: Icon }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex justify-center items-center bg-primary/10 mb-4 size-10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="font-semibold text-base leading-snug">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20 border-border border-t">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="font-heading text-3xl sm:text-4xl tracking-tight">
            Khám phá Levia trong căn bếp Việt
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Xem các dòng sản phẩm hoặc tìm đại lý gần bạn để trải nghiệm trực
            tiếp.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/product">
              <Button variant="outline" size="lg" className="gap-2">
                Xem sản phẩm
                <ChevronRight className="size-4" />
              </Button>
            </Link>
            <Link href="/agency">
              <Button size="lg" className="gap-2">
                <MapPin className="size-4" />
                Tìm đại lý gần bạn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
