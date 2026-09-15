'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneMorphRef } from '../page';

type ProductSectionProps = {
  morph: SceneMorphRef;
};

const ProductSection = ({ morph }: ProductSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const styleCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const space = spaceRef.current;
    const card = firstCardRef.current;
    const styleCard = styleCardRef.current;
    const frame = document.getElementById('scene-frame');
    const viewport = document.getElementById('scene-viewport');

    if (!section || !space || !card || !styleCard || !frame || !viewport)
      return;

    // Final card shape
    const getTargetRect = () => {
      const sectionRect = section.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const sectionHeight = sectionRect.height;
      const cardTopInSection = cardRect.top - sectionRect.top;
      const finalSectionTop = window.innerHeight - sectionHeight;

      return {
        left: cardRect.left,
        top: finalSectionTop + cardTopInSection,
        width: cardRect.width,
        height: cardRect.height,
      };
    };

    // Get taiwindcss style
    const getTargetStyle = () => {
      const style = getComputedStyle(styleCard);

      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor,
        borderRadius: style.borderTopLeftRadius,
        boxShadow: style.boxShadow,
      };
    };

    // Swap background illusion
    const activateSurface = () => {
      gsap.set(space, { backgroundColor: 'black' });
      gsap.set(frame, {
        backgroundColor: targetStyle.backgroundColor,
        borderColor: targetStyle.borderColor,
      });
    };

    const deactivateSurface = () => {
      gsap.set(space, { clearProps: 'backgroundColor, borderColor' });
      gsap.set(frame, { backgroundColor: 'transparent' });
    };

    const attachToDocument = () => {
      const rect = frame.getBoundingClientRect();
      gsap.set(frame, {
        position: 'absolute',
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    };

    const attachToViewport = () => {
      const rect = frame.getBoundingClientRect();

      gsap.set(frame, {
        position: 'fixed',
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    let targetRect = getTargetRect();
    let targetStyle = getTargetStyle();

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,

      onEnter: activateSurface,
      onLeave: attachToDocument,
      onEnterBack: attachToViewport,
      onLeaveBack: () => {
        morph.current.progress = 0;

        deactivateSurface();

        gsap.set(frame, {
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100dvh',
        });

        gsap.set(viewport, {
          left: 0,
          top: 0,
        });
      },

      onRefresh: () => {
        targetRect = getTargetRect();
        targetStyle = getTargetStyle();
      },

      onUpdate: (self) => {
        const p = self.progress;
        const left = gsap.utils.interpolate(0, targetRect.left, p);
        const top = gsap.utils.interpolate(0, targetRect.top, p);
        const width = gsap.utils.interpolate(
          window.innerWidth,
          targetRect.width,
          p,
        );
        const height = gsap.utils.interpolate(
          window.innerHeight,
          targetRect.height,
          p,
        );

        // Morph the frame into card
        gsap.set(frame, {
          position: 'fixed',
          left,
          top,
          width,
          height,
        });

        // Canvas remains viewport-sized while morphing.
        gsap.set(viewport, { left: -left, top: -top });

        // Update 3D object
        morph.current.progress = p;
        morph.current.targetX = targetRect.left + targetRect.width / 2;
        morph.current.targetY = targetRect.top + targetRect.height / 2;
        morph.current.targetScale = 0.55;
      },
    });

    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, [morph]);

  return (
    <section ref={sectionRef} className="relative bg-black">
      <div ref={spaceRef} className="bg-background h-dvh" />
      <div ref={contentRef} className="content-center grid px-24 min-h-dvh">
        <div className="items-center gap-6 grid grid-cols-3">
          <div ref={firstCardRef} className="aspect-square" />

          <div
            ref={styleCardRef}
            className="flex flex-col justify-end bg-background p-6 border aspect-square"
          >
            <h4 className="font-heading text-xl">Companion Dock</h4>
            <p className="text-muted-foreground text-sm">$49</p>
          </div>

          <div className="flex flex-col justify-end bg-background p-6 border aspect-square">
            <h4 className="font-heading text-xl">Travel Case</h4>
            <p className="text-muted-foreground text-sm">$39</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
