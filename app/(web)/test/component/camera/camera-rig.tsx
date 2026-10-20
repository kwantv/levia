import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera, Spherical, Vector3 } from 'three';
import {
  CAMERA_LIMITS,
  EASINGS,
  useCameraStore,
  type CameraDelta,
  type CameraHandle,
  type CameraView,
  type EasingName,
  type MoveOptions,
} from './camera-store';
import { cn } from '@/lib/utils';

const DEG = Math.PI / 180;
const clamp = (v: number, [min, max]: readonly [number, number]) =>
  Math.min(max, Math.max(min, v));

const _offset = new Vector3();
const _sph = new Spherical();

/** Read the real camera back into CameraView form. */
function readView(camera: PerspectiveCamera, target: Vector3): CameraView {
  _offset.copy(camera.position).sub(target);
  _sph.setFromVector3(_offset);
  return {
    azimuth: _sph.theta / DEG,
    polar: _sph.phi / DEG,
    distance: _sph.radius,
    fov: camera.fov,
    target: [target.x, target.y, target.z],
  };
}

function lerpView(a: CameraView, b: CameraView, t: number): CameraView {
  const l = (x: number, y: number) => x + (y - x) * t;
  return {
    azimuth: l(a.azimuth, b.azimuth),
    polar: l(a.polar, b.polar),
    distance: l(a.distance, b.distance),
    fov: l(a.fov, b.fov),
    target: [
      l(a.target[0], b.target[0]),
      l(a.target[1], b.target[1]),
      l(a.target[2], b.target[2]),
    ],
  };
}

/** Clamp to limits and take the shortest way around for azimuth. */
function normalize(to: CameraView, from: CameraView): CameraView {
  return {
    ...to,
    polar: clamp(to.polar, CAMERA_LIMITS.polar),
    distance: clamp(to.distance, CAMERA_LIMITS.distance),
    fov: clamp(to.fov, CAMERA_LIMITS.fov),
    azimuth: to.azimuth + 360 * Math.round((from.azimuth - to.azimuth) / 360),
    target: [...to.target],
  };
}

type Tween = {
  from: CameraView;
  to: CameraView;
  elapsed: number;
  duration: number;
  ease: EasingName;
};

/**
 * Drives the camera. Mount once inside <Canvas>, after <OrbitControls makeDefault />.
 * Control it through `useCameraStore.getState().animate(...)`.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const controls = useThree((s) => s.controls) as any; // OrbitControls (makeDefault)

  const tween = useRef<Tween | null>(null);
  const initial = useRef<CameraView | null>(null);
  const sinceSync = useRef(0);

  const applyView = useCallback(
    (v: CameraView) => {
      if (!controls) return;
      controls.target.set(...v.target);
      _sph.set(
        clamp(v.distance, CAMERA_LIMITS.distance),
        clamp(v.polar, CAMERA_LIMITS.polar) * DEG,
        v.azimuth * DEG,
      );
      camera.position.setFromSpherical(_sph).add(controls.target);
      camera.fov = clamp(v.fov, CAMERA_LIMITS.fov);
      camera.updateProjectionMatrix();
      controls.update();
    },
    [camera, controls],
  );

  const current = useCallback(
    () => readView(camera, controls.target),
    [camera, controls],
  );

  // ---- internal: move to a fully resolved view ----
  const moveTo = useCallback(
    (target: CameraView, options?: MoveOptions) => {
      if (!controls) return;

      const { transition } = useCameraStore.getState();
      const from = current();
      const to = normalize(target, from);
      const duration = options?.duration ?? transition.duration;

      if (options?.immediate || duration <= 0) {
        tween.current = null;
        applyView(to);
        return;
      }

      tween.current = {
        from,
        to,
        elapsed: 0,
        duration,
        ease: options?.ease ?? transition.ease,
      };
    },
    [applyView, controls, current],
  );

  // ---- public handle (degrees) ----
  const animateTo = useCallback(
    (view: Partial<CameraView>, options?: MoveOptions) => {
      if (!controls) return;
      moveTo({ ...current(), ...view }, options);
    },
    [controls, current, moveTo],
  );

  const animateBy = useCallback(
    (d: CameraDelta, options?: MoveOptions) => {
      if (!controls) return;
      const c = current();
      moveTo(
        {
          ...c,
          azimuth: c.azimuth + (d.azimuth ?? 0),
          polar: c.polar + (d.polar ?? 0),
          distance: c.distance + (d.distance ?? 0),
          fov: c.fov + (d.fov ?? 0),
        },
        options,
      );
    },
    [controls, current, moveTo],
  );

  const setView = useCallback(
    (view: Partial<CameraView>) => animateTo(view, { immediate: true }),
    [animateTo],
  );

  const reset = useCallback(
    (options?: MoveOptions) => {
      if (initial.current) moveTo(initial.current, options);
    },
    [moveTo],
  );

  const handle = useMemo<CameraHandle>(
    () => ({ animateTo, animateBy, setView, reset }),
    [animateTo, animateBy, setView, reset],
  );

  // Capture the initial view (reset target) and mirror it into the store
  useEffect(() => {
    if (!controls) return;
    initial.current ??= readView(camera, controls.target);
    useCameraStore.getState().setLive(readView(camera, controls.target));
  }, [controls, camera]);

  // Register only when usable. Flushes any queued calls.
  useEffect(() => {
    if (!controls) return;

    const { registerHandle } = useCameraStore.getState();
    registerHandle(handle);

    return () => {
      if (useCameraStore.getState().handle === handle) registerHandle(null);
    };
  }, [controls, handle]);

  // User grabs the camera -> cancel running animation
  useEffect(() => {
    if (!controls) return;
    const onStart = () => {
      tween.current = null;
    };
    controls.addEventListener('start', onStart);
    return () => controls.removeEventListener('start', onStart);
  }, [controls]);

  useFrame((_, delta) => {
    if (!controls) return;

    // 1) Advance the tween
    const tw = tween.current;
    let finished = false;
    if (tw) {
      tw.elapsed += delta;
      const p = Math.min(1, tw.elapsed / tw.duration);
      applyView(lerpView(tw.from, tw.to, EASINGS[tw.ease](p)));
      if (p >= 1) {
        tween.current = null;
        finished = true;
      }
    }

    // 2) Sync live values to the store (~15 Hz so React isn't flooded)
    const store = useCameraStore.getState();
    if (!store.telemetryEnabled) return;

    sinceSync.current += delta;
    if (sinceSync.current > 1 / 15 || finished) {
      sinceSync.current = 0;
      store.setLive(readView(camera, controls.target));
    }
  });

  return null;
}

const buttonClass =
  'border border-white/20 px-2 py-1 transition-colors hover:bg-white/10 active:bg-white/15';

const f = (n: number, d = 1) => n.toFixed(d);

export function CameraDebugHUD({ className }: { className?: string }) {
  const live = useCameraStore((s) => s.live);
  const transition = useCameraStore((s) => s.transition);
  const telemetryEnabled = useCameraStore((s) => s.telemetryEnabled);

  const animate = useCameraStore((s) => s.animate);
  const reset = useCameraStore((s) => s.reset);
  const setConfig = useCameraStore((s) => s.setConfig);
  const setTelemetryEnabled = useCameraStore((s) => s.setTelemetryEnabled);

  const by = (delta: CameraDelta) => animate({ by: delta });

  const rows: [string, string][] = [
    ['azimuth', `${f(live.azimuth)}°`],
    ['polar', `${f(live.polar)}°`],
    ['distance', f(live.distance, 2)],
    ['fov', `${f(live.fov)}°`],
    ['target', `[${live.target.map((n) => f(n)).join(', ')}]`],
  ];

  return (
    <aside
      className={cn(
        'flex gap-8 font-mono text-xs pointer-events-auto',
        className,
      )}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <section>
        <div className="mb-2 font-semibold">Camera controls</div>

        <div className="gap-1 grid grid-cols-3">
          <button className={buttonClass} onClick={() => by({ distance: -1 })}>
            Zoom +
          </button>
          <button className={buttonClass} onClick={() => by({ azimuth: 45 })}>
            Rotate →
          </button>
          <button className={buttonClass} onClick={() => by({ polar: -20 })}>
            Tilt ↑
          </button>
          <button className={buttonClass} onClick={() => by({ distance: 1 })}>
            Zoom −
          </button>
          <button className={buttonClass} onClick={() => by({ azimuth: -45 })}>
            Rotate ←
          </button>
          <button className={buttonClass} onClick={() => by({ polar: 20 })}>
            Tilt ↓
          </button>
          <span />
          <button className={buttonClass} onClick={() => reset()}>
            Reset
          </button>
        </div>

        <div className="space-y-1 mt-2">
          <label className="flex justify-between gap-1">
            <span className="flex-1">Duration</span>
            <input
              className="flex-2 w-50"
              type="range"
              min={0}
              max={4}
              step={0.1}
              value={transition.duration}
              onChange={(e) =>
                setConfig({ transition: { duration: Number(e.target.value) } })
              }
            />
            <span className="flex-1 text-right">
              {transition.duration.toFixed(1)}s
            </span>
          </label>

          <label className="flex justify-between gap-1">
            <span className="flex-1">Easing</span>
            <select
              className="bg-transparent px-1 py-0.5 border border-white/20"
              value={transition.ease}
              onChange={(e) =>
                setConfig({
                  transition: { ease: e.target.value as EasingName },
                })
              }
            >
              {Object.keys(EASINGS).map((k) => (
                <option key={k} value={k} className="text-black">
                  {k}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <div className="mb-2 font-semibold">Camera debug</div>

        <div className="space-y-1">
          {rows.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-white/50">{key}</span>
              <span className="w-40 tabular-nums text-right">{value}</span>
            </div>
          ))}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={telemetryEnabled}
              onChange={(e) => setTelemetryEnabled(e.target.checked)}
            />
            Live update
          </label>
        </div>
      </section>
    </aside>
  );
}
