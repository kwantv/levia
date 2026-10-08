'use client';

import { components } from '@/sanity/lib/portable-component';
import { PortableText } from '@portabletext/react';
import { useRef } from 'react';
import { RecipeDetail } from './action';
import { RecipeStepGroup } from './page';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

function RecipeMethod({
  recipe,
  stepGroups,
}: {
  recipe: RecipeDetail;
  stepGroups: RecipeStepGroup[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const methodTitle = root.querySelector<HTMLElement>(
        '[data-recipe-method-title]',
      );

      const methodDescription = root.querySelector<HTMLElement>(
        '[data-recipe-method-description]',
      );

      let methodTitleSplit: SplitText | null = null;
      let methodDescriptionSplit: SplitText | null = null;

      if (methodTitle) {
        methodTitleSplit = SplitText.create(methodTitle, {
          type: 'lines,chars',
          mask: 'lines',
          autoSplit: true,
        });

        gsap.set(methodTitleSplit.chars, {
          yPercent: 100,
          opacity: 0,
        });
      }

      if (methodDescription) {
        methodDescriptionSplit = SplitText.create(methodDescription, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
        });

        gsap.set(methodDescriptionSplit.lines, {
          yPercent: 100,
          opacity: 0,
        });
      }

      if (methodTitle) {
        ScrollTrigger.create({
          trigger: methodTitle,
          start: 'top 70%',
          once: true,

          onEnter: () => {
            const timeline = gsap.timeline({
              defaults: {
                ease: 'power3.out',
              },
            });

            if (methodTitleSplit) {
              timeline.to(methodTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 0.38,
                stagger: 0.01,
                onComplete: () => methodTitleSplit.revert(),
              });
            }

            if (methodDescriptionSplit) {
              timeline.to(
                methodDescriptionSplit.lines,
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.34,
                  stagger: 0.05,
                  onComplete: () => methodDescriptionSplit.revert(),
                },
                '-=0.16',
              );
            }
          },
        });
      }

      /*
       * ─────────────────────────────
       * INGREDIENTS
       * ─────────────────────────────
       *
       */
      const ingredients = gsap.utils.toArray<HTMLElement>(
        '[data-recipe-ingredient]',
        root,
      );

      if (ingredients.length) {
        gsap.fromTo(
          ingredients,
          {
            opacity: 0,
            x: -14,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.045,
            ease: 'power2.out',

            scrollTrigger: {
              trigger: ingredients[0],
              start: 'top 70%',
              once: true,
            },
          },
        );
      }

      return () => {
        methodTitleSplit?.revert();
        methodDescriptionSplit?.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="recipe-method" className="scroll-mt-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 container">
        {/* Section header */}
        <div className="gap-y-8 lg:gap-x-8 grid grid-cols-12 pb-12 lg:pb-16">
          <div className="col-span-12 lg:col-span-3">
            <div className="flex items-center gap-3">
              <span className="bg-primary size-1.5" />

              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Recipe / Method
              </span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <h2
              data-recipe-method-title
              className="font-heading font-medium text-3xl sm:text-4xl lg:text-5xl leading-none tracking-[-0.045em]"
            >
              Chuẩn bị và thực hiện.
            </h2>

            <p
              data-recipe-method-description
              className="mt-5 max-w-xl text-muted-foreground text-sm sm:text-base leading-relaxed"
            >
              Chuẩn bị đầy đủ nguyên liệu trước khi bắt đầu để quá trình nấu
              diễn ra liền mạch và dễ kiểm soát hơn.
            </p>
          </div>
        </div>

        <div className="gap-y-14 lg:gap-x-10 grid grid-cols-12">
          {/* ───────── INGREDIENTS ───────── */}

          <aside className="col-span-12 lg:col-span-4 pt-12 lg:pt-16">
            <div className="top-24 lg:sticky">
              <div className="flex justify-between items-center pb-5 border-b">
                <h3 className="font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
                  Nguyên liệu
                </h3>

                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.16em]">
                  {String(recipe.ingredients.length).padStart(2, '0')} mục
                </span>
              </div>

              <div>
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    data-recipe-ingredient
                    key={`${ingredient}-${index}`}
                    className="gap-5 grid grid-cols-[2rem_1fr] py-4 border-b border-dashed"
                  >
                    <span className="font-mono text-[9px] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-sm leading-relaxed">
                      {ingredient}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ───────── STEPS ───────── */}

          <div className="col-span-12 lg:col-span-7 lg:col-start-6 pt-12 lg:pt-16">
            {stepGroups.length > 0 ? (
              <div>
                {stepGroups.map((step, index) => (
                  <RecipeStep
                    key={`${step.title}-${index}`}
                    step={step}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 border-border border-y">
                <p className="text-muted-foreground text-sm">
                  Chưa có hướng dẫn thực hiện.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecipeStep({ step, index }: { step: RecipeStepGroup; index: number }) {
  return (
    <section className="group py-10 sm:py-12 first:pt-0 border-border border-b">
      <div className="gap-6 grid sm:grid-cols-[5rem_1fr]">
        <div>
          <span className="font-mono text-primary text-2xl sm:text-3xl tracking-tighter">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div>
          <h3 className="font-heading font-medium text-2xl sm:text-3xl tracking-[-0.035em]">
            {step.title}
          </h3>

          {step.blocks.length > 0 && (
            <div className="prose-invert dark:prose-invert mt-6 max-w-2xl prose-a:text-primary prose-li:text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-p:leading-[1.8] prose">
              <PortableText
                value={step.blocks}
                components={{
                  ...components,
                  block: {
                    ...components.block,
                    blockquote: ({ children }) => (
                      <aside className="bg-primary/3 my-8 p-5 sm:p-6 border border-primary/20">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary size-1.5 shrink-0" />

                          <span className="font-mono text-[8px] text-primary uppercase tracking-[0.18em]">
                            Kitchen note
                          </span>
                        </div>

                        <div className="[&>p]:m-0 mt-4 text-muted-foreground text-sm leading-[1.8]">
                          {children}
                        </div>
                      </aside>
                    ),
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecipeMethod;
