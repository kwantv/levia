import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { JSX, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useObjectStore, Vec3 } from './object-store';
import { useFrame } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Cube_1: THREE.Mesh;
    Cube_2: THREE.Mesh;
    Cube001: THREE.Mesh;
  };
  materials: {
    Black: THREE.MeshStandardMaterial;
    Front: THREE.MeshStandardMaterial;
  };
};

const EXPLODE: Record<'glass' | 'black' | 'front', Vec3> = {
  glass: [0, 0, 0.4],
  front: [0, 0, 0],
  black: [0, 0, -0.4],
};
const GLASS_REST: Vec3 = [0, 0, 0.044];

const glassProps = {
  roughness: 0.2,
  ior: 1.2,
  transmission: 1,
  backside: true,
  resolution: 1980,
};

export function Object(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials, scene } = useGLTF(
    '/3d/lv79di.glb',
  ) as unknown as GLTFResult;

  // register bounds
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);

    const t = (v: { x: number; y: number; z: number }): Vec3 => [v.x, v.y, v.z];
    const size = box.getSize(new (box.min.constructor as any)());
    const center = box.getCenter(new (box.min.constructor as any)());

    useObjectStore.getState().setBounds({
      min: t(box.min),
      max: t(box.max),
      size: t(size),
      center: t(center),
    });
  }, [scene]);

  const glass = useRef<THREE.Mesh>(null);
  const black = useRef<THREE.Mesh>(null);
  const front = useRef<THREE.Mesh>(null);

  // animate exploded view
  useFrame(() => {
    const t = useObjectStore.getState().exploded;
    glass.current?.position.set(
      GLASS_REST[0] + EXPLODE.glass[0] * t,
      GLASS_REST[1] + EXPLODE.glass[1] * t,
      GLASS_REST[2] + EXPLODE.glass[2] * t,
    );
    black.current?.position.set(...(EXPLODE.black.map((v) => v * t) as Vec3));
    front.current?.position.set(...(EXPLODE.front.map((v) => v * t) as Vec3));
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={glass}
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        position={GLASS_REST}
      >
        <MeshTransmissionMaterial {...glassProps} />
      </mesh>
      <mesh
        ref={black}
        castShadow
        receiveShadow
        geometry={nodes.Cube_1.geometry}
        material={materials.Black}
      />
      <mesh
        ref={front}
        castShadow
        receiveShadow
        geometry={nodes.Cube_2.geometry}
        material={materials.Front}
      />
    </group>
  );
}

useGLTF.preload('/3d/lv79di.glb');
