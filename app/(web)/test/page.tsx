'use client';

import HeroSection from './section/hero-section';
import ShowcaseSection from './section/showcase-section';
import ProductSection from './section/product-section';
import { useEffect } from 'react';
import { useSceneReady } from './scene-ready';
import PageLoader from './page-loader';
import { preload } from 'react-dom';
import { GridBackground } from '@/components/grid-background';
import { ObjectDebugHUD } from './component/object/object-controls';
import { CameraDebugHUD } from './component/camera/camera-rig';

const Page = () => {
  preload('/3d/lv79di.glb', { as: 'fetch', crossOrigin: 'anonymous' });
  useEffect(() => () => useSceneReady.getState().reset(), []);

  return (
    <div>
      <link rel="expect" href="#page-loader" blocking="render" />
      <PageLoader />
      <HeroSection />
      <ShowcaseSection />
      <ProductSection />
      <GridBackground />

      {/* {process.env.NODE_ENV === 'development' && (
        <div className="right-4 bottom-4 z-40 fixed flex gap-16 pointer-events-auto">
          <ObjectDebugHUD />
          <CameraDebugHUD />
        </div>
      )} */}
    </div>
  );
};

export default Page;
