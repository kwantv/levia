'use client';

import Canvas from './component/canvas';
import { HeroSection } from './section/hero-section';
import ProductSection from './section/product-section';
import TestSection from './section/test-section';

const Page = () => {
  return (
    <>
      <HeroSection />
      <TestSection />
      <ProductSection />
    </>
  );
};

export default Page;
