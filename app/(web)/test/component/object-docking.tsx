// components/object-docking.tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '@/lib/store';

const DOCK_PLANE_Z = 0; // world-space depth the object settles onto once docked
const DOCK_SCALE = 0.4;

export function ObjectDocking() {
  const { camera } = useThree();
  const raycastVector = useRef(new THREE.Vector3());
  const wasDocked = useRef(false);

  useFrame(() => {
    const { modelRef, dockTargetId } = useStore.getState();
    if (!modelRef) return;

    if (!dockTargetId) {
      // Transition OUT of docking: restore scale once, then hand control
      // back to whatever normal showcase/hero pose logic owns position.
      if (wasDocked.current) {
        gsap.killTweensOf(modelRef.scale);
        gsap.to(modelRef.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.6,
          ease: 'power2.inOut',
        });
        wasDocked.current = false;
      }
      return;
    }

    const el = document.getElementById(dockTargetId);
    if (!el) return;

    if (!wasDocked.current) {
      // Transition INTO docking: scale down once via tween. Position is
      // NOT tweened here — it's tracked continuously below, every frame,
      // so a one-shot gsap.to(position) would immediately go stale the
      // moment the card's screen position shifts even slightly.
      gsap.killTweensOf(modelRef.position);
      gsap.killTweensOf(modelRef.rotation);
      gsap.killTweensOf(modelRef.scale);
      gsap.to(modelRef.scale, {
        x: DOCK_SCALE,
        y: DOCK_SCALE,
        z: DOCK_SCALE,
        duration: 0.6,
        ease: 'power2.inOut',
      });
      gsap.to(modelRef.rotation, {
        x: 0,
        y: Math.PI * 0.15,
        z: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      });
      wasDocked.current = true;
    }

    // Continuous screen-to-world tracking: recomputed every frame so it
    // stays correct through resize, scroll, or a responsive layout reflow.
    const rect = el.getBoundingClientRect();
    const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const ndcY = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;

    raycastVector.current.set(ndcX, ndcY, 0.5).unproject(camera);
    const dir = raycastVector.current.sub(camera.position).normalize();
    const distance = (DOCK_PLANE_Z - camera.position.z) / dir.z;
    const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));

    // Lerp, not a hard set — smooths out any per-frame jitter from
    // getBoundingClientRect (e.g. during a scroll-driven layout reflow).
    modelRef.position.lerp(targetPos, 0.15);
  });

  return null;
}
