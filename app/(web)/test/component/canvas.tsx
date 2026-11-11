'use client';

import {
  Environment,
  Lightformer,
  OrbitControls,
  useProgress,
} from '@react-three/drei';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { useSceneReady } from '../scene-ready';
import { AnnotationLayer } from './annotations/annotation-layer';
import { CameraRig } from './camera/camera-rig';
import { Object } from './object/object';
import { ObjectControls } from './object/object-controls';
import { ObjectTilt } from './object/object-tilt';
import { ResponsiveScale } from './responsive-scale';
import { SceneReady } from './scene-ready';

function ProgressBridge() {
  const { progress } = useProgress();
  useEffect(() => {
    useSceneReady.getState().setProgress(progress);
  }, [progress]);
  return null;
}

function useTouchOnly() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return touch;
}

function Canvas() {
  const touch = useTouchOnly();

  return (
    <>
      <ProgressBridge />
      <R3FCanvas
        style={{
          width: '100%',
          height: '100%',
          ...(touch && { pointerEvents: 'none' }),
        }}
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
