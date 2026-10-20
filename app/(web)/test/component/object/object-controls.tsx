'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Html } from '@react-three/drei';
import {
  useFrame,
  useThree,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import type { SpringConfig } from '@react-spring/core';
import {
  degToRad,
  rotationToDeg,
  rotationToRad,
  useObjectStore,
  type MoveOptions,
  type ObjectHandle,
  type Rotation,
  type SpringSettings,
} from './object-store';
import { cn } from '@/lib/utils';

type RotationLimits = {
  x?: [number, number];
  y?: [number, number];
  z?: [number, number];
};

export type { ObjectHandle };

type Props = Omit<
  ThreeElements['group'],
  | 'rotation'
  | 'children'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onLostPointerCapture'
  | 'onPointerOver'
  | 'onPointerOut'
> & {
  children: ReactNode;
  enabled?: boolean;
  cursor?: boolean;
  snap?: boolean;
  dragSpeed?: number;
  initialRotation?: Rotation;
  rotationLimits?: RotationLimits;
  config?: SpringSettings;
  debug?: boolean;
  onInteractionChange?: (active: boolean) => void;
  onDraggingChange?: (dragging: boolean) => void;
};

const DEFAULT_CONFIG: SpringSettings = {
  tension: 170,
  friction: 26,
  mass: 1,
};

function limitsToRad(limits?: RotationLimits): RotationLimits | undefined {
  if (!limits) return undefined;

  const conv = (range?: [number, number]): [number, number] | undefined =>
    range && [degToRad(range[0]), degToRad(range[1])];

  return { x: conv(limits.x), y: conv(limits.y), z: conv(limits.z) };
}

function clampRotation(rotation: Rotation, limits?: RotationLimits): Rotation {
  return [
    Math.max(
      limits?.x?.[0] ?? -Infinity,
      Math.min(limits?.x?.[1] ?? Infinity, rotation[0]),
    ),
    Math.max(
      limits?.y?.[0] ?? -Infinity,
      Math.min(limits?.y?.[1] ?? Infinity, rotation[1]),
    ),
    Math.max(
      limits?.z?.[0] ?? -Infinity,
      Math.min(limits?.z?.[1] ?? Infinity, rotation[2]),
    ),
  ];
}

type DragState = {
  pointerId: number;
  x: number;
  y: number;
  target: ThreeEvent<PointerEvent>['target'];
};

export const ObjectControls = forwardRef<ObjectHandle, Props>(
  function ObjectControls(
    {
      children,
      enabled = true,
      cursor = true,
      snap = false,
      dragSpeed = 0.008,
      initialRotation = [0, 0, 0],
      rotationLimits,
      config = DEFAULT_CONFIG,
      debug = false,
      onInteractionChange,
      onDraggingChange,
      ...groupProps
    },
    ref,
  ) {
    const { gl } = useThree();

    // Props seed the store once on mount. Debug-panel changes take precedence.
    const initial = useRef<Rotation>(rotationToRad(initialRotation));
    const limits = useMemo(() => limitsToRad(rotationLimits), [rotationLimits]);

    const initialConfig = useRef({
      enabled,
      snap,
      dragSpeed,
      springConfig: { ...config },
    });

    const liveEnabled = useObjectStore((s) => s.enabled);
    const liveDragSpeed = useObjectStore((s) => s.dragSpeed);
    const springConfig = useObjectStore((s) => s.springConfig);

    const setLiveRotation = useObjectStore((s) => s.setRotation);
    const setDragging = useObjectStore((s) => s.setDragging);
    const setHovered = useObjectStore((s) => s.setHovered);

    const drag = useRef<DragState | null>(null);
    const targetRotation = useRef<Rotation>([...initial.current]);
    const originalCursor = useRef('');

    const [spring, api] = useSpring(() => ({
      from: {
        rx: initial.current[0],
        ry: initial.current[1],
        rz: initial.current[2],
      },
      config: config as SpringConfig,
    }));

    useEffect(() => {
      useObjectStore.getState().initialize(initialConfig.current);

      originalCursor.current = gl.domElement.style.cursor;

      return () => {
        gl.domElement.style.cursor = originalCursor.current;
      };
    }, [gl]);

    const scrollLock = useRef<{
      overflow: string;
      overscrollBehavior: string;
    } | null>(null);

    const lockScroll = useCallback(() => {
      if (scrollLock.current) return;

      const body = document.body;
      const html = document.documentElement;

      scrollLock.current = {
        overflow: body.style.overflow,
        overscrollBehavior: html.style.overscrollBehavior,
      };

      body.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
    }, []);

    const unlockScroll = useCallback(() => {
      if (!scrollLock.current) return;

      document.body.style.overflow = scrollLock.current.overflow;
      document.documentElement.style.overscrollBehavior =
        scrollLock.current.overscrollBehavior;

      scrollLock.current = null;
    }, []);

    useEffect(() => {
      return () => {
        unlockScroll();
      };
    }, [unlockScroll]);

    const setCursor = useCallback(
      (value: string) => {
        if (cursor) gl.domElement.style.cursor = value;
      },
      [cursor, gl],
    );

    const finishDrag = useCallback(
      (allowSnap = true) => {
        const currentDrag = drag.current;
        if (!currentDrag) return;

        drag.current = null;
        setDragging(false);
        onDraggingChange?.(false);
        unlockScroll();

        try {
          // @ts-ignore
          currentDrag?.target?.releasePointerCapture(currentDrag.pointerId);
        } catch {
          // Capture may already have been released.
        }

        setCursor(
          liveEnabled && useObjectStore.getState().hovered
            ? 'grab'
            : originalCursor.current,
        );

        if (allowSnap && useObjectStore.getState().snap) {
          targetRotation.current = [...initial.current];
          api.start({
            rx: initial.current[0],
            ry: initial.current[1],
            rz: initial.current[2],
          });
        }
      },
      [api, liveEnabled, setCursor, setDragging],
    );

    // ---- internal (radians) ----
    const moveTo = useCallback(
      (rad: Rotation, options?: MoveOptions) => {
        finishDrag(false);

        const target = clampRotation(rad, limits);
        targetRotation.current = [...target];

        const values = { rx: target[0], ry: target[1], rz: target[2] };

        if (options?.immediate) {
          api.stop();
          api.set(values);
          return;
        }

        api.start({
          ...values,
          config: {
            ...useObjectStore.getState().springConfig,
            ...options?.config,
          } as SpringConfig,
        });
      },
      [api, finishDrag, limits],
    );

    // ---- public (degrees) ----
    const rotateTo = useCallback(
      (deg: Rotation, options?: MoveOptions) =>
        moveTo(rotationToRad(deg), options),
      [moveTo],
    );

    const rotateBy = useCallback(
      (deltaDeg: Rotation, options?: MoveOptions) => {
        const d = rotationToRad(deltaDeg);
        const c = targetRotation.current;
        moveTo([c[0] + d[0], c[1] + d[1], c[2] + d[2]], options);
      },
      [moveTo],
    );

    const setRotation = useCallback(
      (deg: Rotation) => {
        finishDrag(false);

        const target = clampRotation(rotationToRad(deg), limits);
        targetRotation.current = [...target];

        api.set({ rx: target[0], ry: target[1], rz: target[2] });
      },
      [api, finishDrag, limits],
    );

    const reset = useCallback(
      (options?: MoveOptions) => moveTo(initial.current, options),
      [moveTo],
    );

    const handle = useMemo<ObjectHandle>(
      () => ({ rotateTo, rotateBy, setRotation, reset }),
      [rotateTo, rotateBy, setRotation, reset],
    );

    useImperativeHandle(ref, () => handle, [handle]);

    useEffect(() => {
      const t = targetRotation.current;
      api.set({ rx: t[0], ry: t[1], rz: t[2] });
    }, [api]);

    useEffect(() => {
      api.start({ config: springConfig as SpringConfig });
    }, [api, springConfig]);

    useEffect(() => {
      const { registerHandle } = useObjectStore.getState();
      registerHandle(handle);

      return () => {
        // Only clear if nobody replaced us
        if (useObjectStore.getState().handle === handle) registerHandle(null);
      };
    }, [handle]);

    useFrame(() => {
      if (!useObjectStore.getState().telemetryEnabled) return;
      setLiveRotation([spring.rx.get(), spring.ry.get(), spring.rz.get()]);
    });

    useEffect(() => {
      if (liveEnabled) return;

      finishDrag(false);
      setHovered(false);
      setCursor(originalCursor.current);
    }, [liveEnabled, finishDrag, setHovered, setCursor]);

    const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
      if (!liveEnabled || event.button !== 0) return;

      event.stopPropagation();
      finishDrag(false);
      api.stop();

      targetRotation.current = [
        spring.rx.get(),
        spring.ry.get(),
        spring.rz.get(),
      ];

      drag.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        target: event.target,
      };

      setDragging(true);
      setCursor('grabbing');
      onDraggingChange?.(true);

      lockScroll();

      try {
        // @ts-ignore
        event?.target?.setPointerCapture(event.pointerId);
      } catch {
        // Some event targets may not support pointer capture.
      }
    };

    const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
      const currentDrag = drag.current;

      if (!currentDrag || currentDrag.pointerId !== event.pointerId) return;

      event.stopPropagation();

      const dx = event.clientX - currentDrag.x;
      const dy = event.clientY - currentDrag.y;

      currentDrag.x = event.clientX;
      currentDrag.y = event.clientY;

      const next = clampRotation(
        [
          targetRotation.current[0] + dy * liveDragSpeed,
          targetRotation.current[1] + dx * liveDragSpeed,
          targetRotation.current[2],
        ],
        limits,
      );

      targetRotation.current = [...next];

      api.start({
        rx: next[0],
        ry: next[1],
        rz: next[2],
      });
    };

    const onPointerOver = (event: ThreeEvent<PointerEvent>) => {
      if (!liveEnabled) return;

      event.stopPropagation();
      setHovered(true);
      onInteractionChange?.(true);

      if (!drag.current) setCursor('grab');
    };

    const onPointerOut = () => {
      setHovered(false);
      onInteractionChange?.(false);

      if (!drag.current) setCursor(originalCursor.current);
    };

    const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
      if (drag.current?.pointerId === event.pointerId) finishDrag();
    };

    return (
      <>
        <animated.group
          {...groupProps}
          rotation-x={spring.rx}
          rotation-y={spring.ry}
          rotation-z={spring.rz}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => finishDrag()}
          onLostPointerCapture={() => finishDrag()}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          {children}
        </animated.group>

        {debug && (
          <Html fullscreen style={{ pointerEvents: 'none' }}>
            <ObjectDebugHUD />
          </Html>
        )}
      </>
    );
  },
);

export function ObjectDebugHUD({ className }: { className?: string }) {
  const enabled = useObjectStore((s) => s.enabled);
  const snap = useObjectStore((s) => s.snap);
  const dragSpeed = useObjectStore((s) => s.dragSpeed);
  const springConfig = useObjectStore((s) => s.springConfig);
  const rotation = useObjectStore((s) => s.rotation);
  const dragging = useObjectStore((s) => s.dragging);
  const hovered = useObjectStore((s) => s.hovered);
  const setConfig = useObjectStore((s) => s.setConfig);
  const setTelemetryEnabled = useObjectStore((s) => s.setTelemetryEnabled);

  const animate = useObjectStore((s) => s.animate);
  const reset = useObjectStore((s) => s.reset);

  const tension = springConfig.tension ?? 170;
  const friction = springConfig.friction ?? 26;
  const telemetryEnabled = useObjectStore((s) => s.telemetryEnabled);

  const buttonClass =
    'border border-white/20 px-2 py-1 transition-colors hover:bg-white/10 active:bg-white/15';

  const formatRotation = (value: Rotation) =>
    rotationToDeg(value)
      .map((a) => a.toFixed(1))
      .join(', ');

  const rotate = (axis: 0 | 1 | 2, degrees: number) => {
    const delta: Rotation = [0, 0, 0];
    delta[axis] = degrees;
    animate({ rotateBy: delta });
  };

  return (
    <aside
      className={cn(
        'flex gap-8 font-mono text-xs pointer-events-auto',
        className,
      )}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <section>
        <div className="mb-2 font-semibold">Object controls</div>

        <div className="gap-1 grid grid-cols-3">
          <button className={buttonClass} onClick={() => rotate(1, -45)}>
            Y −45°
          </button>
          <button className={buttonClass} onClick={() => rotate(1, 45)}>
            Y +45°
          </button>
          <button className={buttonClass} onClick={() => rotate(0, -15)}>
            X −15°
          </button>
          <button className={buttonClass} onClick={() => rotate(0, 15)}>
            X +15°
          </button>
          <button className={buttonClass} onClick={() => rotate(2, -15)}>
            Z −15°
          </button>
          <button className={buttonClass} onClick={() => rotate(2, 15)}>
            Z +15°
          </button>
        </div>

        <div className="space-y-1">
          <div className="gap-1 grid grid-cols-2">
            <button className={buttonClass} onClick={() => reset()}>
              Reset
            </button>
            <button
              className={buttonClass}
              onClick={() => animate({ rotation: [0, 0, 0], immediate: true })}
            >
              Set zero
            </button>
          </div>

          <span className="flex justify-between gap-1">
            <span className="flex-1">Sentivity</span>
            <input
              className="flex-2 w-50"
              type="range"
              min={0.001}
              max={0.025}
              step={0.001}
              value={dragSpeed}
              onChange={(event) =>
                setConfig({ dragSpeed: Number(event.target.value) })
              }
            />
            <span className="flex-1 text-right">{dragSpeed.toFixed(3)}</span>
          </span>

          <label className="flex justify-between gap-1">
            <span className="flex-1">Tension</span>
            <input
              className="flex-2 w-50"
              type="range"
              min={40}
              max={400}
              step={10}
              value={tension}
              onChange={(event) =>
                setConfig({
                  springConfig: {
                    tension: Number(event.target.value),
                  },
                })
              }
            />
            <span className="flex-1 text-right">{tension}</span>
          </label>

          <label className="flex justify-between gap-1">
            <span className="flex-1">Friction</span>
            <input
              className="flex-2 w-50"
              type="range"
              min={5}
              max={80}
              step={1}
              value={friction}
              onChange={(event) =>
                setConfig({
                  springConfig: {
                    friction: Number(event.target.value),
                  },
                })
              }
            />
            <span className="flex-1 text-right">{friction}</span>
          </label>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Object debug</span>
          <span
            className={
              dragging
                ? 'text-emerald-300'
                : enabled
                  ? 'text-white/60'
                  : 'text-rose-300'
            }
          >
            {dragging ? 'DRAGGING' : enabled ? 'IDLE' : 'DISABLED'}
          </span>
        </div>

        <div className="space-y-1">
          {[
            ['hover', hovered ? 'yes' : 'no'],
            ['snap', snap ? 'on' : 'off'],
            ['rotation', formatRotation(rotation)],
          ].map(([key, value]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-white/50">{key}</span>
              <span className="w-40 tabular-nums text-right">{value}</span>
            </div>
          ))}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={telemetryEnabled}
              onChange={(event) => setTelemetryEnabled(event.target.checked)}
            />
            Live update
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setConfig({ enabled: event.target.checked })}
            />
            Interactable
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={snap}
              onChange={(event) => setConfig({ snap: event.target.checked })}
            />
            Snap back
          </label>
        </div>
      </section>
    </aside>
  );
}
