// lib/pose.ts
import gsap from 'gsap';
import type { Object3D } from 'three';

export interface Pose {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
}

/**
 * Universal transition primitive. Killing existing tweens before starting
 * new ones is what makes fast scrolling through several stage boundaries
 * "just work" — each new call redirects mid-flight toward the latest
 * target instead of queuing up a backlog of animations to play out.
 */
export function tweenToPose(
  target: Object3D,
  pose: Pose,
  opts: { duration?: number; ease?: string; onComplete?: () => void } = {},
) {
  const { duration = 1, ease = 'power2.inOut', onComplete } = opts;

  gsap.killTweensOf(target.position);
  gsap.killTweensOf(target.rotation);

  gsap.to(target.position, {
    x: pose.position[0],
    y: pose.position[1],
    z: pose.position[2],
    duration,
    ease,
  });
  gsap.to(target.rotation, {
    x: pose.rotation[0],
    y: pose.rotation[1],
    z: pose.rotation[2],
    duration,
    ease,
    onComplete,
  });
}
