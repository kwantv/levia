'use client';

import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Environment } from '@react-three/drei';
import { InteractiveObject } from '../component/interactive-object';
import { Canvas } from '@react-three/fiber';

export type SceneMorphState = {
  progress: number;

  // viewport pixel coordinates
  targetX: number;
  targetY: number;

  targetScale: number;
};

export type SceneMorphRef = RefObject<SceneMorphState>;

const ProductSection = () => {
  const morph = useRef<SceneMorphState>({
    progress: 0,
    targetX: 0,
    targetY: 0,
    targetScale: 0.8,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const styleCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = firstCardRef.current;
    const space = spaceRef.current;
    const styleCard = styleCardRef.current;

    const frame = document.getElementById('scene-frame');
    const viewport = document.getElementById('scene-viewport');

    if (!section || !card || !space || !styleCard || !frame || !viewport)
      return;

    const getTargetRect = () => {
      const sectionRect = section.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const cardTopInSection = cardRect.top - sectionRect.top;
      const finalSectionTop = window.innerHeight - sectionRect.height;

      return {
        left: cardRect.left,
        top: finalSectionTop + cardTopInSection,
        width: cardRect.width,
        height: cardRect.height,
      };
    };

    const getTargetStyle = () => {
      const style = getComputedStyle(styleCard);

      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor,
      };
    };

    const dockIntoStickyStage = () => {
      gsap.set(frame, {
        position: 'absolute',
        inset: 'auto',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      });

      gsap.set(frame, {
        backgroundColor: targetStyle.backgroundColor,
        borderColor: targetStyle.borderColor,
      });

      gsap.set(space, {
        backgroundColor: 'black',
      });
    };

    const undockFromStickyStage = () => {
      gsap.set(frame, {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });

      gsap.set(viewport, {
        left: 0,
        top: 0,
      });

      gsap.set(space, {
        clearProps: 'backgroundColor, borderColor',
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

      onEnter: dockIntoStickyStage,
      // onLeave: () => {},
      // onEnterBack: () => {},
      onLeaveBack: () => {
        morph.current.progress = 0;
        undockFromStickyStage();
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

        gsap.set(frame, {
          left,
          top,
          width,
          height,
        });

        // Keep the R3F viewport globally aligned while its frame shrinks.
        gsap.set(viewport, {
          left: -left,
          top: -top,
        });

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
    <section ref={sectionRef} className="relative bg-black h-[200dvh]">
      <div className="top-0 z-1 sticky w-full h-dvh pointer-events-none">
        <div
          id="scene-frame"
          className="top-0 left-0 z-1 box-border fixed border border-transparent overflow-hidden pointer-events-none"
          style={{
            width: '100vw',
            height: '100dvh',
            backgroundColor: 'transparent',
          }}
        >
          <div
            id="scene-viewport"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100vw',
              height: '100dvh',
            }}
          >
            <Canvas
              gl={{ alpha: true }}
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, 2]}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 4, 2]} intensity={1.2} />
              <Environment preset="city" />
              <InteractiveObject morph={morph} />
            </Canvas>
          </div>
        </div>
      </div>

      <div
        ref={spaceRef}
        className="top-0 left-0 absolute bg-background w-full h-dvh"
      />

      <div className="top-[100dvh] left-0 absolute content-center grid px-24 w-full h-dvh">
        <div className="items-center gap-6 grid grid-cols-3">
          <div ref={firstCardRef} className="aspect-square" />
          <div
            ref={styleCardRef}
            className="flex flex-col justify-end bg-background backdrop-blur-sm p-6 border rounded-2xl aspect-square"
          >
            <h4 className="font-heading text-xl">Companion Dock</h4>
            <p className="text-muted-foreground text-sm">$49</p>
          </div>

          <div className="flex flex-col justify-end bg-background backdrop-blur-sm p-6 border rounded-2xl aspect-square">
            <h4 className="font-heading text-xl">Travel Case</h4>
            <p className="text-muted-foreground text-sm">$39</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
