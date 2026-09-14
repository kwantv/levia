'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { Object3D } from 'three';
import { useStore } from '@/lib/store';

/**
 * Tracks pointer-drag rotation against a hit-tested object. Returns a ref
 * so consumers can apply it inside useFrame — mirrors useMouseTilt's
 * pattern: this hook calculates, it never touches the scene graph itself.
 */
export function useOrbitDrag(
  hitTargetRef: React.RefObject<Object3D | null>,
  enabled: boolean,
) {
  const { camera, gl } = useThree();
  const setDragging = useStore((s) => s.setDragging);
  const raycaster = useRef(new THREE.Raycaster());
  const last = useRef({ x: 0, y: 0 });
  const isDown = useRef(false);
  const rotation = useRef({ x: 0, y: 0 }); // accumulated drag rotation

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
      if (!isDown.current) return;
      e.preventDefault();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      rotation.current.y += dx * 0.005;
      rotation.current.x += dy * 0.005;
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
  }, [enabled, hitTargetRef, camera, gl, setDragging]);

  return rotation;
}
