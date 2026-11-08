import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSceneReady } from '../scene-ready';

const raf = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export function SceneReady() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setReady = useSceneReady((s) => s.setReady);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await gl.compileAsync(scene, camera); // avoid shader-compile jank
      } catch {}
      await raf();
      await raf(); // ensure at least one real frame has been drawn
      if (!cancelled) setReady();
    })();
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, setReady]);

  return null;
}
