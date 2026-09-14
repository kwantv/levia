// components/use-orbit-drag.ts
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { Group, Object3D } from 'three';
import { useStore } from '@/lib/store';

export function useOrbitDrag(
  groupRef: React.RefObject<Group | null>,
  hitTargetRef: React.RefObject<Object3D | null>,
  enabled: boolean,
) {
  const { camera, gl } = useThree();
  const setDragging = useStore((s) => s.setDragging);
  const raycaster = useRef(new THREE.Raycaster());
  const last = useRef({ x: 0, y: 0 });
  const isDown = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const toNDC = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      return new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };

    const handleDown = (e: PointerEvent) => {
      if (!hitTargetRef.current) return;
      raycaster.current.setFromCamera(toNDC(e), camera);
      // The raycast IS the hit-test — this replaces needing the browser
      // to consider the canvas a valid click target at all.
      const hits = raycaster.current.intersectObject(
        hitTargetRef.current,
        true,
      );
      if (hits.length === 0) return;

      e.preventDefault();
      isDown.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      setDragging(true);
    };

    const handleMove = (e: PointerEvent) => {
      if (!isDown.current || !groupRef.current) return;
      e.preventDefault();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      groupRef.current.rotation.y += dx * 0.005;
      groupRef.current.rotation.x += dy * 0.005;
      last.current = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDown.current = false;
      setDragging(false);
    };

    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [enabled, groupRef, hitTargetRef, camera, gl, setDragging]);
}
