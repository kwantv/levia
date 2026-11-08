import { useEffect, useState } from 'react';

export function useAfterTransition() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const p: Promise<void> = (window as any).__vtDone ?? Promise.resolve();
    p.then(() => {
      if (!alive) return;
      // Don't start heavy work in the same frame the transition ended
      const idle = (window as any).requestIdleCallback as
        ((cb: () => void, o?: { timeout: number }) => void) | undefined;
      const go = () => alive && setReady(true);
      idle ? idle(go, { timeout: 300 }) : setTimeout(go, 50);
    });
    return () => {
      alive = false;
    };
  }, []);

  return ready;
}
