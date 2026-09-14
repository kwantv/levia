'use client';

import { useStore } from '@/lib/store';
import { Html, Line } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { SHOWCASE_STAGES } from '../section/showcase-stages';

function resolveLabelAnchor(
  point: readonly [number, number, number],
  offset?: readonly [number, number, number],
) {
  if (offset) {
    return [
      point[0] + offset[0],
      point[1] + offset[1],
      point[2] + offset[2],
    ] as const;
  }
  const dir = new THREE.Vector3(...point);
  if (dir.lengthSq() === 0) dir.set(0, 1, 0);
  dir.normalize().multiplyScalar(0.35);
  return [point[0] + dir.x, point[1] + dir.y, point[2] + dir.z] as const;
}

function AnnotationLabel({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`-translate-x-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-mono text-nowrap transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {label}
    </div>
  );
}

export function Annotations() {
  const activeStage = useStore((s) => s.stage);
  const stage = SHOWCASE_STAGES.find((s) => s.id === activeStage);

  if (!stage) return null;

  return (
    <>
      {stage.annotations.map((a) => {
        const labelAnchor = resolveLabelAnchor(a.point, a.labelOffset);
        return (
          <group key={a.id}>
            <Line
              points={[a.point, labelAnchor]}
              color="white"
              lineWidth={1}
              transparent
              opacity={0.6}
            />
            <mesh position={a.point}>
              <sphereGeometry args={[0.009, 16, 16]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Html position={labelAnchor} occlude="blending">
              <AnnotationLabel label={a.label} />
            </Html>
          </group>
        );
      })}
    </>
  );
}
