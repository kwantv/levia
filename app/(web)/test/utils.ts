import gsap from 'gsap';
import { useStore } from '@/lib/store';
import { Pose, SHOWCASE_STAGES } from './section/showcase-stages';

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
      offset: -getStickyOffset(index) + 16, // additional 16px to account for header
      duration: 0.7,
    });
  } else {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
