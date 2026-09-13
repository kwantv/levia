import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import SmoothScrollProvider from '@/components/provider/smooth-scroll';
import { SanityLive } from '@/sanity/lib/live';
import StudioLink from '@/sanity/lib/studio-link';

export default function WebLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SmoothScrollProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'development' && <StudioLink />}
        <SanityLive />
      </SmoothScrollProvider>
    </>
  );
}
