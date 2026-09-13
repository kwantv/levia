'use client';

import { useEffect, useRef } from 'react';

/**
 * Tracks normalized mouse position (-1 to 1) for use as a passive tilt
 * input. Returns a ref so consumers can read it inside useFrame without
 * triggering React re-renders on every mousemove.
 */
export function useMouseTilt(enabled: boolean) {
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      tilt.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled]);

  return tilt;
}
