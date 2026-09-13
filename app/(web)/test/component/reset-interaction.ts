// lib/reset-hero-layers.ts
import gsap from 'gsap';
import { useStore } from '@/lib/store';

export function resetHeroLayers(duration = 0.6) {
  const { tiltLayerRef, orbitLayerRef } = useStore.getState();
  if (tiltLayerRef) gsap.to(tiltLayerRef.rotation, { x: 0, y: 0, duration });
  if (orbitLayerRef) gsap.to(orbitLayerRef.rotation, { x: 0, y: 0, duration });
}
