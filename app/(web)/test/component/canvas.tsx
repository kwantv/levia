'use client';

import { cn } from '@/lib/utils';
import { Environment, Grid, OrbitControls } from '@react-three/drei';
import { Canvas as R3FCanvas } from '@react-three/fiber';
import { useState } from 'react';
import { CameraDebugHUD, CameraRig } from './camera/camera-rig';
import { Object } from './object';
import { ObjectControls, ObjectDebugHUD } from './object/object-controls';
import { Hotspots } from './hotspots';
import { ResponsiveScale } from './responsive-scale';
import { ObjectTilt } from './object/object-tilt';

function Canvas() {
  return (
    <div className="relative size-full pointer-events-none">
      <R3FCanvas
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />

        <ResponsiveScale>
          <CameraRig />
          <OrbitControls makeDefault enabled={false} enableDamping />

          <ObjectTilt>
            <ObjectControls>
              <Object />
              <Hotspots />
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
