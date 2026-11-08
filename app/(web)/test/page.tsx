'use client';

import HeroSection from './section/hero-section';
import ShowcaseSection from './section/showcase-section';
import ProductSection from './section/product-section';
import { useEffect } from 'react';
import { useSceneReady } from './scene-ready';
import PageLoader from './page-loader';
import { preload } from 'react-dom';

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
    </div>
  );
};

export default Page;
