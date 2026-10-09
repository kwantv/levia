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
    <header
      className={cn(
        'top-0 z-50 sticky [view-transition-name:header]',

        // Mobile: entire navbar is one glass surface.
        mobileOpen && 'bg-background/55 backdrop-blur-xl border-b',

        // Desktop: header itself becomes transparent again.
        'md:bg-transparent md:backdrop-blur-none md:border-b-0',
      )}
    >
      <div className="items-center gap-2 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 mx-auto px-4 md:px-6 lg:px-8 h-16 container">
        {/* Logo island */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center col-span-1 bg-background/80 backdrop-blur-md px-2 md:px-0 h-11 pointer-events-auto"
        >
          <Image src={logo} alt="Levia" className="w-auto h-7" priority />
        </Link>

        {/* Desktop nav island */}
        <nav className="hidden md:flex justify-self-start items-center md:col-span-5 lg:col-span-6 bg-background/80 backdrop-blur-md -ml-2 px-2 h-11 pointer-events-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="after:right-3 after:bottom-1 after:left-3 after:absolute relative after:bg-primary px-3 py-2 after:h-px font-mono text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-[0.16em] after:scale-x-0 hover:after:scale-x-100 after:origin-left transition-colors after:transition-transform"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA island */}
        <Link
          href="/cook"
          className="hidden md:block justify-self-end md:col-span-2 lg:col-span-2 lg:col-start-11 pointer-events-auto"
        >
          <Button size="sm" className="px-5 h-11 uppercase tracking-[0.14em]">
            Cook Now
          </Button>
        </Link>

        {/* Mobile menu button island */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={mobileOpen}
          className="md:hidden flex justify-center justify-self-end items-center col-start-4 bg-background/80 backdrop-blur-md border border-border/70 size-11 text-muted-foreground hover:text-foreground transition-colors pointer-events-auto"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden mx-auto px-4 container',
          'grid transition-[grid-template-rows,opacity] duration-300',
          mobileOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col items-start pt-1 pb-4 pointer-events-auto">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="group flex justify-between items-center gap-8 px-5 border-border/70 border-y hover:border-primary/50 w-full min-h-14 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[9px] text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="font-heading font-medium text-xl tracking-tight">
                    {link.label}
                  </span>
                </div>

                <span className="bg-primary opacity-0 group-hover:opacity-100 size-1.5 transition-opacity" />
              </Link>
            ))}

            <Link
              href="/cook"
              onClick={() => setMobileOpen(false)}
              className="flex justify-between items-center bg-primary mt-4 px-5 w-full min-h-14 text-primary-foreground"
            >
              <span className="font-heading font-medium text-xl tracking-tight">
                Cook Now
              </span>

              <span className="opacity-70 font-mono text-[8px] uppercase tracking-[0.18em]">
                Cook / Explore
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
