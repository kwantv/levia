import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function StudioLink() {
  return (
    <Link
      className={cn(
        buttonVariants({ size: 'lg' }),
        'fixed bottom-4 right-4 uppercase',
      )}
      href="/studio"
    >
      Studio
    </Link>
  );
}
