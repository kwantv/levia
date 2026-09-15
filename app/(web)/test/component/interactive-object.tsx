'use client';

import { useStore } from '@/lib/store';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import {
  MathUtils,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
} from 'three';
import { shortestEquivalentAngle } from '../utils';
import { Annotations } from './annotations';
import { Hotspots } from './hotspots';
import { Object } from './object';
import { useMouseTilt } from './use-mouse-tilt';
import { useOrbitDrag } from './use-orbit-drag';
import { SceneMorphRef } from '../page';

export function InteractiveObject({ morph }: { morph: SceneMorphRef }) {
  const outerGroupRef = useRef<Group>(null); // universal pose target — tweenToPose writes here
  const morphLayerRef = useRef<Group>(null); // morph
  const tiltLayerRef = useRef<Group>(null); // passive mouse tilt
  const orbitLayerRef = useRef<Group>(null); // drag orbit — self-owned, replacing PresentationControls
  const meshRef = useRef<Mesh>(null);

  const orbitEnabled = useStore((s) => s.orbit);
  const isDragging = useStore((s) => s.dragging);
  const setModelRef = useStore((s) => s.setModelRef);

  const tilt = useMouseTilt();
  const orbit = useOrbitDrag(meshRef, orbitEnabled);

  const { camera, size } = useThree();

  const raycaster = useMemo(() => new Raycaster(), []);

  const ndc = useMemo(() => new Vector2(), []);

  const targetWorld = useMemo(() => new Vector3(), []);

  const targetLocal = useMemo(() => new Vector3(), []);

  /*
   * Plane passing through z = 0.
   *
   * This is the same depth where your object
   * approximately lives.
   */
  const objectPlane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);

  useFrame(() => {
    const outerGroup = outerGroupRef.current;
    const morphLayer = morphLayerRef.current;

    if (!outerGroup || !morphLayer) {
      return;
    }

    const { progress, targetX, targetY, targetScale } = morph.current;

    /*
     * Viewport pixels -> NDC.
     *
     * browser:
     *
     * 0,0 ---------------- width
     * |
     * |
     * height
     *
     * becomes Three.js:
     *
     * -1,+1 -------- +1,+1
     *   |
     *   |
     * -1,-1 -------- +1,-1
     */
    ndc.set((targetX / size.width) * 2 - 1, -(targetY / size.height) * 2 + 1);

    /*
     * Shoot a ray through that screen coordinate.
     */
    raycaster.setFromCamera(ndc, camera);

    const hit = raycaster.ray.intersectPlane(objectPlane, targetWorld);

    if (!hit) {
      return;
    }

    /*
     * targetWorld is in scene/world coordinates.
     *
     * morphLayer is a child of outerGroup,
     * so convert destination into outerGroup's
     * local coordinate system.
     */
    outerGroup.updateWorldMatrix(true, false);

    targetLocal.copy(targetWorld);

    outerGroup.worldToLocal(targetLocal);

    /*
     * At p = 0:
     *
     * morph layer position = 0
     *
     * therefore your existing:
     *
     * outerGroup position={[1.6, 0, 0]}
     *
     * behaves exactly as before.
     *
     * At p = 1, morphLayer moves the object
     * into the product card center.
     */
    morphLayer.position.set(
      MathUtils.lerp(0, targetLocal.x, progress),

      MathUtils.lerp(0, targetLocal.y, progress),

      MathUtils.lerp(0, targetLocal.z, progress),
    );

    const scale = MathUtils.lerp(1, targetScale, progress);

    morphLayer.scale.setScalar(scale);
    // outerGroup.updateWorldMatrix(true, true);
  });

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
      <group ref={morphLayerRef}>
        <group ref={tiltLayerRef}>
          <group ref={orbitLayerRef}>
            <Object ref={meshRef} position={[0, 0, 0]} />
            <Hotspots />
            <Annotations />
          </group>
        </group>
      </group>
    </group>
  );
}
