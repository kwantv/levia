import gsap from 'gsap';
import { useStore } from '@/lib/store';
import { Pose, SHOWCASE_STAGES } from './section/showcase-stages';

const TAU = Math.PI * 2;

/**
 * Given a current angle (which may be arbitrarily wound up, e.g. from
 * manual drag) and a desired target angle, returns the numeric target
 * closest to `current` that is angularly equivalent to `target` — so a
 * tween from current -> that value always takes the shortest path,
 * never unwinding through full extra turns.
 */
export function shortestEquivalentAngle(current: number, target: number) {
  const delta = ((((target - current + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
  return current + delta;
}

/**
 * Universal object-pose tween, usable from any section (showcase, future
 * products/kitchen sections, hero's reset-on-leave, etc). Killing existing
 * tweens first means calling this repeatedly in quick succession (fast
 * scroll through several stages) always redirects toward the latest
 * target instead of queueing a backlog.
 */
export function movePoseTo(pose: Pose, duration = 0.6, ease = 'power2.inOut') {
  const { modelRef, setPendingPose } = useStore.getState();

  if (!modelRef) {
    // Object hasn't mounted inside the Canvas yet (e.g. ScrollTrigger's
    // synchronous initial-position check on page load, firing before
    // R3F has set modelRef). Remember the request; InteractiveObject
    // applies it the instant the ref becomes real.
    setPendingPose(pose);
    return;
  }

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
    x: shortestEquivalentAngle(modelRef.rotation.x, pose.rotation[0]),
    y: shortestEquivalentAngle(modelRef.rotation.y, pose.rotation[1]),
    z: shortestEquivalentAngle(modelRef.rotation.z, pose.rotation[2]),
    duration,
    ease,
  });
}

const TOP_OFFSET = 128;
const TITLE_HEIGHT = 56;

// Single source of truth for the offset math — ScrollTrigger's `start()`
// in showcase-section.tsx must stay in sync with this.
export function getStickyOffset(index: number) {
  return TOP_OFFSET + index * TITLE_HEIGHT;
}

export function scrollToStage(id: string) {
  const index = SHOWCASE_STAGES.findIndex((s) => s.id === id);
  if (index === -1) return; // unknown id, e.g. stale hotspot after a rename

  const section = document.getElementById(`stage-${id}`);
  if (!section) return;

  const { lenis } = useStore.getState();

  if (lenis) {
    lenis.scrollTo(section, {
      offset: -getStickyOffset(index) + 32, // additional 32px to account for header
      duration: 0.7,
    });
  } else {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
