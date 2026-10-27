'use client';

import {
  Environment,
  Grid,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { AnnotationLayer } from './annotations/annotation-layer';
import { CameraDebugHUD, CameraRig } from './camera/camera-rig';
import { Object } from './object/object';
import { ObjectControls, ObjectDebugHUD } from './object/object-controls';
import { ObjectTilt } from './object/object-tilt';
import { ResponsiveScale } from './responsive-scale';

function Canvas() {
  return (
    <div className="relative size-full pointer-events-none">
      <R3FCanvas
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        camera={{ fov: 45 }}
        gl={{ alpha: true }}
        dpr={[1, 2]}
      >
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
          <OrbitControls makeDefault enabled={false} enableDamping />

          <ObjectTilt>
            <ObjectControls>
              <Object />
              {/* <Hotspots /> */}
              <AnnotationLayer />
            </ObjectControls>
          </ObjectTilt>

          <Grid
            infiniteGrid
            fadeDistance={10}
            cellColor={'#303030'}
            sectionColor={'#303030'}
            cellSize={0.2}
            position={-0.1}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </ResponsiveScale>
      </R3FCanvas>

      {process.env.NODE_ENV === 'development' && (
        <div className="bottom-4 left-4 absolute flex gap-16 pointer-events-auto">
          <ObjectDebugHUD />
          <CameraDebugHUD />
        </div>
      )}
    </div>
  );
}

export default Canvas;
