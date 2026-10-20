'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';
import { create } from 'zustand';
import { useObjectStore } from './object-store';

/* ------------------------------ Store ------------------------------ */

/**
 * unsupported: no gyro API
 * prompt:      iOS, waiting for a user gesture to ask permission
 * denied:      user refused
 * active:      listening to deviceorientation
 */
type GyroStatus = 'unsupported' | 'prompt' | 'denied' | 'active';

type TiltState = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;

  gyro: GyroStatus;
  /** Must be called from a user gesture on iOS (e.g. a button click). */
  requestGyro: () => Promise<void>;
};

export const useTiltStore = create<TiltState>((set) => ({
  enabled: true,
  setEnabled: (enabled) => set({ enabled }),
  toggle: () => set((s) => ({ enabled: !s.enabled })),

  gyro: 'unsupported',
  requestGyro: async () => {
    const DOE = (window as any).DeviceOrientationEvent;
    if (!DOE) return set({ gyro: 'unsupported' });

    // Android and desktop: no permission step
    if (typeof DOE.requestPermission !== 'function') {
      return set({ gyro: 'active' });
    }

    try {
      const res = await DOE.requestPermission();
      set({ gyro: res === 'granted' ? 'active' : 'denied' });
    } catch {
      // Thrown when not called from a user gesture, so it's not a refusal
      set({ gyro: 'prompt' });
    }
  },
}));

/* ---------------------------- Constants ---------------------------- */

/** Seconds for the neutral pose to drift toward how the phone is held. */
const DRIFT_SECONDS = 6;

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/* ---------------------------- Component ---------------------------- */

type Props = {
  children: ReactNode;
  /** Initial state. Change it later with `useTiltStore`. */
  enabled?: boolean;
  /** Max tilt in degrees. A number applies to both axes. */
  maxAngle?: number | { x: number; y: number };
  /** Higher = snappier follow. Roughly 2 (floaty) to 10 (tight). */
  damping?: number;
  /** Flip direction so the object turns away from the input. */
  invert?: boolean;
  /** Use the device gyro on phones and tablets. */
  gyro?: boolean;
  /** Device tilt (degrees) from neutral that gives full deflection. */
  gyroRange?: number;
  /** Disable tilt when the OS asks for reduced motion. */
  respectReducedMotion?: boolean;
};

export function ObjectTilt({
  children,
  enabled = true,
  maxAngle = 6,
  damping = 4,
  invert = false,
  gyro = true,
  gyroRange = 25,
  respectReducedMotion = true,
}: Props) {
  const group = useRef<Group>(null);
  const input = useRef({ x: 0, y: 0 }); // -1..1, y down
  const reduced = useRef(false);
  const gyroLive = useRef(false); // true once real sensor data arrives
  const baseline = useRef<{
    x: number;
    y: number;
    angle: number;
    t: number;
  } | null>(null);

  const gyroStatus = useTiltStore((s) => s.gyro);

  // Props seed the store once on mount
  useEffect(() => {
    useTiltStore.getState().setEnabled(enabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reduced motion: read now, and follow live changes
  useEffect(() => {
    if (!respectReducedMotion) {
      reduced.current = false;
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reduced.current = mq.matches;
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [respectReducedMotion]);

  // Pointer input (mouse, or touch when there's no gyro)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && gyroLive.current) return;
      input.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      if (gyroLive.current) return;
      input.current.x = 0;
      input.current.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Gyro setup: auto-start where no permission is needed, otherwise
  // ask on the first tap. Call `requestGyro()` yourself from a button
  // if you'd rather show an explicit prompt.
  useEffect(() => {
    if (!gyro) return;

    const { requestGyro } = useTiltStore.getState();
    const DOE = (window as any).DeviceOrientationEvent;

    if (!DOE) {
      useTiltStore.setState({ gyro: 'unsupported' });
      return;
    }

    if (typeof DOE.requestPermission === 'function') {
      useTiltStore.setState({ gyro: 'prompt' });
      const onTap = () => void requestGyro();
      window.addEventListener('click', onTap, { once: true });
      return () => window.removeEventListener('click', onTap);
    }

    void requestGyro();
  }, [gyro]);

  // Gyro input
  useEffect(() => {
    if (!gyro || gyroStatus !== 'active') return;

    const onOrient = (e: DeviceOrientationEvent) => {
      // Desktop browsers fire one event with null values
      if (e.beta == null || e.gamma == null) return;

      const raw = screen.orientation?.angle ?? (window as any).orientation ?? 0;
      const angle = ((raw % 360) + 360) % 360;

      // Map device axes into screen axes (x = right, y = down)
      let x = e.gamma;
      let y = e.beta;
      if (angle === 90) [x, y] = [e.beta, -e.gamma];
      else if (angle === 270) [x, y] = [-e.beta, e.gamma];
      else if (angle === 180) [x, y] = [-e.gamma, -e.beta];

      // Neutral = how the phone was first held, drifting slowly toward
      // the current pose. Resets when the screen rotates.
      const now = performance.now();
      let b = baseline.current;
      if (!b || b.angle !== angle) {
        b = baseline.current = { x, y, angle, t: now };
      } else {
        const k = 1 - Math.exp(-(now - b.t) / 1000 / DRIFT_SECONDS);
        b.t = now;
        b.x += (x - b.x) * k;
        b.y += (y - b.y) * k;
      }

      gyroLive.current = true;
      input.current.x = clamp1((x - b.x) / gyroRange);
      input.current.y = clamp1((y - b.y) / gyroRange);
    };

    window.addEventListener('deviceorientation', onOrient);
    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      gyroLive.current = false;
      baseline.current = null;
    };
  }, [gyro, gyroStatus, gyroRange]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    // Ease back to neutral when disabled, reduced motion is on,
    // or while the user drags the object
    const active =
      useTiltStore.getState().enabled &&
      !reduced.current &&
      !useObjectStore.getState().dragging;

    const max =
      typeof maxAngle === 'number' ? { x: maxAngle, y: maxAngle } : maxAngle;
    const k = (invert ? -1 : 1) * MathUtils.DEG2RAD;

    // right -> turn about Y, down -> turn about X
    const targetX = active ? input.current.y * max.x * k : 0;
    const targetY = active ? input.current.x * max.y * k : 0;

    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, damping, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, damping, delta);
  });

  return <group ref={group}>{children}</group>;
}
