'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/public/logo/logo-text.svg';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/about', label: 'Giới thiệu' },
  { href: '/product', label: 'Sản phẩm' },
  { href: '/article', label: 'Cẩm nang bếp' },
  { href: '/agency', label: 'Đại lý' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-md">
      <div className="items-center grid-layout mx-auto h-16 container">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="logo" className="w-auto h-8" />
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center md:col-span-6 lg:col-span-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-1 text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          className="hidden md:inline-block justify-self-end -col-end-1"
          href="/cook"
        >
          <Button size="sm" className="ml-2 uppercase tracking-wider">
            Cook Now
          </Button>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex justify-center justify-self-end items-center -col-end-1 p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden border-border border-b overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-80' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col gap-1 mx-auto p-3 container">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:bg-muted px-4 py-2 font-semibold text-muted-foreground hover:text-foreground text-2xl transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cook"
            className="bg-primary px-4 py-2 font-semibold text-background text-2xl transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Cook Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
