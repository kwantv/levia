import { useEffect, useRef } from 'react';

// Fixed dot background. Dots get smaller toward the left
// and grow near the pointer. Put <DotBackground /> once in your layout.
export default function DotBackground({
  spacing = 48,
  minRadius = 0,
  maxRadius = 2,
  hoverRadius = 360, // reach of the pointer effect, in px
  hoverBoost = 5, // extra dot radius at the pointer, in px
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = { x: -9999, y: -9999, tx: -9999, ty: -9999, s: 0, target: 0 };
    let raf = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(canvas).color;

      for (let x = spacing / 2; x < w; x += spacing) {
        const base = minRadius + (maxRadius - minRadius) * (x / w);
        for (let y = spacing / 2; y < h; y += spacing) {
          const d = Math.hypot(x - p.x, y - p.y);
          const f = Math.max(0, 1 - d / hoverRadius);
          const r = base + hoverBoost * f * f * p.s;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Ease toward the pointer; stop looping once everything has settled.
    const tick = () => {
      p.x += (p.tx - p.x) * 0.2;
      p.y += (p.ty - p.y) * 0.2;
      p.s += (p.target - p.s) * 0.12;
      draw();
      const settled =
        Math.abs(p.tx - p.x) < 0.5 &&
        Math.abs(p.ty - p.y) < 0.5 &&
        Math.abs(p.target - p.s) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (p.s < 0.01) {
        p.x = e.clientX;
        p.y = e.clientY;
      } // no sweep on first entry
      p.tx = e.clientX;
      p.ty = e.clientY;
      p.target = 1;
      start();
    };
    const onLeave = () => {
      p.target = 0;
      start();
    };
    const onResize = () => draw();

    draw();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointercancel', onLeave);
    window.addEventListener(
      'pointerup',
      (e) => e.pointerType === 'touch' && onLeave(),
    );
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [spacing, minRadius, maxRadius, hoverRadius, hoverBoost]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 size-full text-muted-foreground/30"
    />
  );
}
