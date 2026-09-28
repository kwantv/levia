import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SanityLive } from '@/sanity/lib/live';
import StudioLink from '@/sanity/lib/studio-link';

export default function WebLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      {process.env.NODE_ENV === 'development' && <StudioLink />}
      <SanityLive />
    </>
  );
}
