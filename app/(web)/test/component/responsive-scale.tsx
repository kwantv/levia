// responsive-scale.tsx
import { useThree } from '@react-three/fiber';
import type { ReactNode } from 'react';

/**
 * Aspect ratio at (and above) which the object is shown at full size.
 * Below it, the object shrinks proportionally so its width still fits.
 */
const FIT_ASPECT = 0.8;
const MIN_SCALE = 0.4;

export function ResponsiveScale({ children }: { children: ReactNode }) {
  const aspect = useThree((s) => s.size.width / s.size.height);
  const scale = Math.min(1, Math.max(MIN_SCALE, aspect / FIT_ASPECT));

  return <group scale={scale}>{children}</group>;
}
