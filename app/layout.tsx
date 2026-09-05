import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const lora = Lora({ subsets: ['vietnamese'], variable: '--font-heading' });

const geist = Geist({ subsets: ['vietnamese'], variable: '--font-sans' });

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: 'Levia',
  description:
    'Bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu Âu, làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê công nghệ.',
  appleWebApp: { title: 'Levia' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="vi"
      className={cn(
        'dark',
        'h-full',
        'antialiased',
        'font-sans',
        geistMono.variable,
        geist.variable,
        lora.variable,
      )}
    >
      <body className="flex flex-col min-h-full">{children}</body>
    </html>
  );
}
