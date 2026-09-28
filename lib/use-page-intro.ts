'use client';

import { playAfterPageTransition } from './page-transition';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';
import type { RefObject } from 'react';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type UsePageIntroOptions = {
  scope: RefObject<HTMLElement | null>;

  delay?: number;

  titleSelector?: string;
  subtitleSelector?: string;
  labelSelector?: string;
  scrambleSelector?: string;
};

export function usePageIntro({
  scope,
  delay = 0,

  titleSelector = '[data-intro-title]',
  subtitleSelector = '[data-intro-subtitle]',
  scrambleSelector = '[data-intro-scramble]',
}: UsePageIntroOptions) {
  useGSAP(
    () => {
      const root = scope.current;

      if (!root) return;

      const title = root.querySelector<HTMLElement>(titleSelector);

      const subtitles = gsap.utils.toArray<HTMLElement>(subtitleSelector, root);

      const scrambleElements = gsap.utils.toArray<HTMLElement>(
        scrambleSelector,
        root,
      );

      /**
       * Accessibility:
       * don't run decorative motion when reduced
       * motion is requested.
       */
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReducedMotion) return;

      const titleSplit = title
        ? new SplitText(title, {
            type: 'words,chars',
            wordsClass: 'intro-word',
            charsClass: 'intro-char',
          })
        : null;

      const subtitleSplits = subtitles.map(
        (element) =>
          new SplitText(element, {
            type: 'lines',
            linesClass: 'intro-line',
            autoSplit: true,
            mask: 'lines',
          }),
      );

      const subtitleLines = subtitleSplits.flatMap((split) => split.lines);

      /*
       * Initial states
       *
       * Intentionally small translation.
       * No overflow masking, so Vietnamese
       * diacritics don't get clipped.
       */
      if (titleSplit) {
        gsap.set(titleSplit.chars, {
          y: 24,
          opacity: 0,
        });
      }

      gsap.set(subtitleLines, {
        y: 16,
        opacity: 0,
      });

      const timeline = gsap.timeline({
        paused: true,
      });

      if (titleSplit) {
        timeline.to(titleSplit.chars, {
          y: 0,
          opacity: 1,

          duration: 0.34,

          stagger: {
            each: 0.01,
            from: 'start',
          },

          ease: 'power3.out',
        });
      }

      if (subtitleLines.length) {
        timeline.to(
          subtitleLines,
          {
            y: 0,
            opacity: 1,

            duration: 0.32,
            stagger: 0.04,

            ease: 'power2.out',
          },
          '-=0.15',
        );
      }

      scrambleElements.forEach((element, index) => {
        const chars = element.dataset.introScrambleChars || '0123456789';

        timeline.to(
          element,
          {
            duration: 0.45,

            scrambleText: {
              text: '{original}',
              chars,
              speed: 1.4,
              revealDelay: 0.08,
              tweenLength: false,
            },

            ease: 'none',
          },
          index === 0 ? '<' : '<+0.06',
        );
      });

      const cancelPlayback = playAfterPageTransition(timeline, delay);

      return () => {
        cancelPlayback();

        timeline.kill();

        titleSplit?.revert();

        subtitleSplits.forEach((split) => split.revert());
      };
    },
    {
      scope,
    },
  );
}
