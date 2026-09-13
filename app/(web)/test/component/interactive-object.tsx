'use client';

import { useStore } from '@/lib/store';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import { Hotspots } from './hotspots';
import { Object } from './object';
import { useMouseTilt } from './use-mouse-tilt';
import { useOrbitDrag } from './use-orbit-drag';
import { StageAnnotations } from './annotations';
import { PresentationControls } from '@react-three/drei';

export function InteractiveObject() {
  const outerGroupRef = useRef<Group>(null); // universal pose target — tweenToPose writes here
  const tiltLayerRef = useRef<Group>(null); // passive mouse tilt
  const orbitLayerRef = useRef<Group>(null); // drag orbit — self-owned, replacing PresentationControls
  const meshRef = useRef<Mesh>(null);

  const setModelRef = useStore((s) => s.setModelRef);
  const setTiltLayerRef = useStore((s) => s.setTiltLayerRef);
  const setOrbitLayerRef = useStore((s) => s.setOrbitLayerRef);
  const orbitEnabled = useStore((s) => s.orbit);
  const isDragging = useStore((s) => s.dragging);

  const tilt = useMouseTilt(orbitEnabled);
  useOrbitDrag(orbitLayerRef, meshRef, orbitEnabled);

  useEffect(() => {
    setModelRef(outerGroupRef.current);
    setTiltLayerRef(tiltLayerRef.current);
    setOrbitLayerRef(orbitLayerRef.current);
    return () => {
      setModelRef(null);
      setTiltLayerRef(null);
      setOrbitLayerRef(null);
    };
  }, [setModelRef, setTiltLayerRef, setOrbitLayerRef]);

  useFrame(() => {
    if (!tiltLayerRef.current || !orbitEnabled || isDragging) return;
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
          <StageAnnotations />
        </group>
      </group>
    </group>
  );
}
