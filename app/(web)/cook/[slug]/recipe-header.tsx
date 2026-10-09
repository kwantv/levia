'use client';

import DotGridBackground from '@/components/dot-grid-background';
import {
  ArrowDownRight,
  ArrowLeft,
  Clock,
  CookingPot,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, ViewTransition } from 'react';
import { RecipeDetail } from './action';

import { playAfterPageTransition } from '@/lib/page-transition';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

const SCRAMBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function formatMinutes(minutes: number) {
  return `${minutes} phút`;
}

export default function RecipeHeader({
  recipe,
  coverSrc,
}: {
  recipe: RecipeDetail;
  coverSrc: string | undefined;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      /*
       * ─────────────────────────────
       * HERO
       * ─────────────────────────────
       */

      const heroTitle = root.querySelector<HTMLElement>(
        '[data-recipe-hero-title]',
      );

      const heroDescription = root.querySelector<HTMLElement>(
        '[data-recipe-hero-description]',
      );

      const heroFade = gsap.utils.toArray<HTMLElement>(
        '[data-recipe-hero-fade]',
        root,
      );

      const heroButton = root.querySelector<HTMLElement>(
        '[data-recipe-hero-button]',
      );

      /*
       * Reduced motion
       */
      if (reducedMotion) {
        gsap.set(
          [heroTitle, heroDescription, ...heroFade, heroButton].filter(Boolean),
          {
            opacity: 1,
            y: 0,
          },
        );

        gsap.set(
          root.querySelectorAll(
            '[data-recipe-meta-value], [data-recipe-method-title], [data-recipe-method-description], [data-recipe-ingredient]',
          ),
          {
            opacity: 1,
            x: 0,
          },
        );

        return;
      }

      /*
       * TITLE
       *
       * Character reveal with line masking.
       */
      let titleSplit: SplitText | null = null;

      if (heroTitle) {
        titleSplit = SplitText.create(heroTitle, {
          type: 'lines,chars',
          mask: 'lines',
          autoSplit: true,
        });

        gsap.set(titleSplit.chars, {
          yPercent: 110,
          opacity: 0,
        });
      }

      /*
       * DESCRIPTION
       *
       * Line-by-line reveal.
       */
      let descriptionSplit: SplitText | null = null;

      if (heroDescription) {
        descriptionSplit = SplitText.create(heroDescription, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
        });

        gsap.set(descriptionSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });
      }

      /*
       * LABEL + START BUTTON
       */
      gsap.set([...heroFade, heroButton].filter(Boolean), {
        opacity: 0,
      });

      /*
       * Hero timeline
       */
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power3.out',
        },
      });

      if (titleSplit) {
        tl.to(
          titleSplit.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.012,
            onComplete: () => titleSplit?.revert(),
          },
          0,
        );
      }

      if (descriptionSplit) {
        tl.to(
          descriptionSplit.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.36,
            stagger: 0.055,
            onComplete: () => descriptionSplit?.revert(),
          },
          '>-0.2',
        );
      }

      tl.to(
        [...heroFade, heroButton].filter(Boolean),
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.045,
        },
        '-=0.15',
      );

      const cancelPlayback = playAfterPageTransition(tl);

      /*
       * ─────────────────────────────
       * META STRIP
       * ─────────────────────────────
       *
       * Scramble only the values.
       * Labels/icons remain stable.
       */
      const metaValues = gsap.utils.toArray<HTMLElement>(
        '[data-recipe-meta-value]',
        root,
      );

      metaValues.forEach((element) => {
        gsap.to(element, {
          duration: 0.7,
          scrambleText: {
            text: '{original}',
            speed: 0.5,
            revealDelay: 0.05,
            tweenLength: false,
          },
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        });
      });

      return () => {
        cancelPlayback();

        titleSplit?.revert();
        descriptionSplit?.revert();

        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger?.closest('[data-recipe-motion]')) {
            trigger.kill();
          }
        });
      };
    },
    {
      scope: rootRef,
    },
  );

  return (
    <section
      ref={rootRef}
      data-recipe-motion
      className="relative border-b overflow-hidden"
    >
      <DotGridBackground />

      <div className="-top-52 -right-48 absolute bg-primary/5 blur-[160px] rounded-full size-175 pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:pb-20 container">
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/cook"
            className="group inline-flex items-center gap-2 font-mono text-[10px] text-muted-foreground hover:text-primary uppercase tracking-[0.18em] transition-colors"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Tất cả công thức
          </Link>

          <span className="hidden sm:block font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
            Levia / Kitchen Intelligence
          </span>
        </div>

        {/* Intro */}
        <div className="gap-y-10 lg:gap-x-8 grid grid-cols-12 mt-14 sm:mt-20">
          <div className="col-span-12 lg:col-span-3">
            <div data-recipe-hero-fade className="flex items-center gap-3">
              <span className="bg-primary size-1.5" />

              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Recipe / Cook
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <h1
              data-recipe-hero-title
              className="max-w-5xl font-heading font-medium text-[clamp(3.25rem,5vw,5rem)] leading-[1.3] tracking-[-0.055em]"
            >
              {recipe.name}
            </h1>

            <div className="gap-y-8 md:gap-x-10 grid md:grid-cols-2 mt-10 sm:mt-12 pt-6 border-border border-t">
              <p
                data-recipe-hero-description
                className="max-w-xl text-muted-foreground text-sm sm:text-base leading-[1.8]"
              >
                {recipe.description}
              </p>

              <div className="flex md:justify-end items-end">
                <a
                  data-recipe-hero-button
                  href="#recipe-method"
                  className="group inline-flex justify-between items-center gap-10 pb-3 border-border hover:border-primary border-b min-w-56 transition-colors"
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                    Bắt đầu nấu
                  </span>

                  <ArrowDownRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mt-14 sm:mt-20 border border-border aspect-4/3 sm:aspect-video lg:aspect-16/7 overflow-hidden">
          {coverSrc ? (
            <ViewTransition
              name={`recipe-${recipe._id}-cover`}
              share="image-clip"
              default="none"
            >
              <Image
                src={coverSrc}
                alt={recipe.coverImage?.alt || recipe.name}
                fill
                fetchPriority="high"
                className="object-cover"
                sizes="100vw"
              />
            </ViewTransition>
          ) : (
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                Levia / Recipe Image
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />

          <span className="top-5 left-5 absolute bg-primary size-1.5" />

          <div className="right-5 bottom-5 left-5 absolute flex justify-between items-end">
            <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.2em]">
              Vietnamese Kitchen
            </span>

            <span className="font-mono text-[8px] text-white/60 uppercase tracking-[0.2em]">
              Levia / Recipe
            </span>
          </div>
        </div>

        {/* Meta strip */}
        <div className="gap-px grid grid-cols-2 lg:grid-cols-4 bg-border">
          <RecipeMetaItem
            icon={Users}
            label="Khẩu phần"
            value={`${recipe.servings} người`}
          />

          <RecipeMetaItem
            icon={Clock}
            label="Chuẩn bị"
            value={formatMinutes(recipe.prepTime)}
          />

          <RecipeMetaItem
            icon={CookingPot}
            label="Nấu"
            value={formatMinutes(recipe.cookTime)}
          />

          <RecipeMetaItem
            icon={Clock}
            label="Tổng thời gian"
            value={formatMinutes(recipe.prepTime + recipe.cookTime)}
          />
        </div>
      </div>
    </section>
  );
}

function RecipeMetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-primary" />

        <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <span
        data-recipe-meta-value
        className="block mt-4 font-heading font-medium text-xl sm:text-2xl tracking-[-0.03em]"
      >
        {value}
      </span>
    </div>
  );
}
