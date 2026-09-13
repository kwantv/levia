'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  ...(process.env.NODE_ENV === 'development'
    ? [{ href: '/test', label: 'Test' }]
    : []),
  { href: '/about', label: 'About' },
  { href: '/product', label: 'Product' },
  { href: '/agency', label: 'Agency' },
  { href: '/article', label: 'Article' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-border border-b">
      <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-foreground text-xl tracking-tight">
            LEVIA
          </span>
          <span className="hidden sm:inline text-muted-foreground text-xs">
            Thông minh từ bên trong.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cook">
            <Button size="sm" className="ml-2">
              Cook Now
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex justify-center items-center p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden border-border border-t overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-80' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-muted px-3 py-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cook" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="mt-1 w-full">
              Cook Now
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
