import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { JSX } from 'react'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube_1: THREE.Mesh
    Cube_2: THREE.Mesh
    Cube001: THREE.Mesh
  }
  materials: {
    Black: THREE.MeshStandardMaterial
    Front: THREE.MeshStandardMaterial
  }
}

const glassProps = {
  roughness: 0.2,
  ior: 1.2,
  transmission: 1,
  backside: true,
  resolution: 1980,
}

export function Object(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d/lv79di.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        position={[0, 0, 0.044]}
      >
        <MeshTransmissionMaterial {...glassProps}/>
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Cube_1.geometry} material={materials.Black} />
      <mesh castShadow receiveShadow geometry={nodes.Cube_2.geometry} material={materials.Front} />
    </group>
  )
}

useGLTF.preload('/3d/lv79di.glb')