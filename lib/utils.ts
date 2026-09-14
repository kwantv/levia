import { useStore } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import gsap from 'gsap';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export function resetInteractionLayers(duration = 0.6) {
  const { tiltLayerRef, orbitLayerRef } = useStore.getState();
  if (tiltLayerRef) gsap.to(tiltLayerRef.rotation, { x: 0, y: 0, duration });
  if (orbitLayerRef) gsap.to(orbitLayerRef.rotation, { x: 0, y: 0, duration });
}

let current: gsap.core.Timeline | null = null;

/** Kills whatever timeline is currently running before handing back a
 *  fresh one — guarantees only one section's animation is ever in flight. */
export function startTimeline() {
  current?.kill();
  current = gsap.timeline();
  return current;
}
