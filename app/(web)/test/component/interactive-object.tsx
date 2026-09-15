'use client';

import { useStore } from '@/lib/store';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import { shortestEquivalentAngle } from '../utils';
import { Annotations } from './annotations';
import { Hotspots } from './hotspots';
import { Object } from './object';
import { useMouseTilt } from './use-mouse-tilt';
import { useOrbitDrag } from './use-orbit-drag';
import { ObjectDocking } from './object-docking';

export function InteractiveObject() {
  const outerGroupRef = useRef<Group>(null); // universal pose target — tweenToPose writes here
  const tiltLayerRef = useRef<Group>(null); // passive mouse tilt
  const orbitLayerRef = useRef<Group>(null); // drag orbit — self-owned, replacing PresentationControls
  const meshRef = useRef<Mesh>(null);

  const orbitEnabled = useStore((s) => s.orbit);
  const isDragging = useStore((s) => s.dragging);
  const setModelRef = useStore((s) => s.setModelRef);

  const tilt = useMouseTilt();
  const orbit = useOrbitDrag(meshRef, orbitEnabled);

  useEffect(() => {
    setModelRef(outerGroupRef.current);

    // Check incoming pose request on model load
    const { pendingPose, setPendingPose } = useStore.getState();
    if (pendingPose && outerGroupRef.current) {
      outerGroupRef.current.position.set(...pendingPose.position);
      outerGroupRef.current.rotation.set(...pendingPose.rotation);
      setPendingPose(null);
    }

    // Everything reset needs to touch — tween targets and the raw
    // accumulator — lives in this closure. Nothing outside this
    // component needs to know these exist separately.
    const { setResetInteraction } = useStore.getState();
    const reset = (duration = 0.6) => {
      if (tiltLayerRef.current) {
        gsap.to(tiltLayerRef.current.rotation, {
          x: shortestEquivalentAngle(tiltLayerRef.current.rotation.x, 0),
          y: shortestEquivalentAngle(tiltLayerRef.current.rotation.y, 0),
          duration,
        });
      }
      if (orbitLayerRef.current) {
        gsap.to(orbitLayerRef.current.rotation, {
          x: shortestEquivalentAngle(orbitLayerRef.current.rotation.x, 0),
          y: shortestEquivalentAngle(orbitLayerRef.current.rotation.y, 0),
          duration,
        });
      }

      // Gating useFrame
      orbit.current.x = 0;
      orbit.current.y = 0;
    };
    setResetInteraction(reset);

    return () => {
      setModelRef(null);
      setResetInteraction(null);
    };
  }, [setModelRef]);

  useFrame(() => {
    // Orbit drag: applied directly, 1:1 with pointer — it's already an
    // accumulator, not a target to ease toward.
    if (orbitEnabled && orbitLayerRef.current) {
      orbitLayerRef.current.rotation.x = orbit.current.x;
      orbitLayerRef.current.rotation.y = orbit.current.y;
    }

    // Passive tilt: eased toward the raw mouse reading, on a separate layer.
    if (!tiltLayerRef.current || isDragging) return;
    const g = tiltLayerRef.current;
    g.rotation.x += (tilt.current.y * 0.15 - g.rotation.x) * 0.05;
    g.rotation.y += (tilt.current.x * 0.15 - g.rotation.y) * 0.05;
  });

  return (
    <group ref={outerGroupRef} position={[1.6, 0, 0]}>
      <group ref={tiltLayerRef}>
        <group ref={orbitLayerRef}>
          <Object ref={meshRef} position={[0, 0, 0]} />
          <Hotspots />
          <Annotations />
          <ObjectDocking />
        </group>
      </group>
    </group>
  );
}
