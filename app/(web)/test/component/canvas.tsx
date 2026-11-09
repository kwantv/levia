'use client';

import {
  Environment,
  Grid,
  Lightformer,
  OrbitControls,
  useProgress,
} from '@react-three/drei';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { AnnotationLayer } from './annotations/annotation-layer';
import { CameraDebugHUD, CameraRig } from './camera/camera-rig';
import { Object } from './object/object';
import { ObjectControls, ObjectDebugHUD } from './object/object-controls';
import { ObjectTilt } from './object/object-tilt';
import { ResponsiveScale } from './responsive-scale';
import { Suspense, useEffect } from 'react';
import { SceneReady } from './scene-ready';
import { useSceneReady } from '../scene-ready';

function ProgressBridge() {
  const { progress } = useProgress();
  useEffect(() => {
    useSceneReady.getState().setProgress(progress);
  }, [progress]);
  return null;
}

function Canvas() {
  return (
    <>
      <ProgressBridge />
      <R3FCanvas
        style={{ width: '100%', height: '100%' }}
        camera={{ fov: 30 }}
        gl={{ alpha: true }}
        dpr={[1, 2]}
        resize={{ offsetSize: true, scroll: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <spotLight
            position={[4, 5, 4]}
            angle={0.4}
            penumbra={1}
            intensity={80}
            castShadow
          />
          <pointLight position={[-4, -2, -3]} intensity={20} color="#d5c09e" />

          <Environment resolution={512}>
            <Lightformer
              form="rect"
              intensity={2.5}
              position={[0, 5, -5]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[-5, 1, 2]}
              rotation-y={Math.PI / 2}
              scale={[8, 3, 1]}
            />
          </Environment>

          <ResponsiveScale>
            <CameraRig />
            <OrbitControls
              makeDefault
              enableDamping
              enableZoom={false}
              enableRotate={false}
              enabled={false}
            />
            <Grid args={[10, 10]} />

            <ObjectTilt>
              <ObjectControls>
                <Object />
                <AnnotationLayer />
              </ObjectControls>
            </ObjectTilt>
          </ResponsiveScale>

          <SceneReady />
        </Suspense>
      </R3FCanvas>
    </>
  );
}

export default Canvas;
