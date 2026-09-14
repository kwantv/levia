import gsap from 'gsap';
import { useStore } from '@/lib/store';
import type { Pose } from './showcase-stages';

/**
 * Universal object-pose tween, usable from any section (showcase, future
 * products/kitchen sections, hero's reset-on-leave, etc). Killing existing
 * tweens first means calling this repeatedly in quick succession (fast
 * scroll through several stages) always redirects toward the latest
 * target instead of queueing a backlog.
 */
export function movePoseTo(pose: Pose, duration = 0.6, ease = 'power2.inOut') {
  const { modelRef } = useStore.getState();
  if (!modelRef) return;

  gsap.killTweensOf(modelRef.position);
  gsap.killTweensOf(modelRef.rotation);

  gsap.to(modelRef.position, {
    x: pose.position[0],
    y: pose.position[1],
    z: pose.position[2],
    duration,
    ease,
  });
  gsap.to(modelRef.rotation, {
    x: pose.rotation[0],
    y: pose.rotation[1],
    z: pose.rotation[2],
    duration,
    ease,
  });
}
