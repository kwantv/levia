import { create } from 'zustand';
import gsap from 'gsap';

export type Rotation = [number, number, number];
export type Vec3 = [number, number, number];
export type Bounds = { min: Vec3; max: Vec3; size: Vec3; center: Vec3 };

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export const degToRad = (deg: number) => deg * DEG_TO_RAD;
export const radToDeg = (rad: number) => rad * RAD_TO_DEG;

export const rotationToRad = (r: Rotation): Rotation => [
  r[0] * DEG_TO_RAD,
  r[1] * DEG_TO_RAD,
  r[2] * DEG_TO_RAD,
];

export const rotationToDeg = (r: Rotation): Rotation => [
  r[0] * RAD_TO_DEG,
  r[1] * RAD_TO_DEG,
  r[2] * RAD_TO_DEG,
];

export type SpringSettings = {
  tension?: number;
  friction?: number;
  mass?: number;
  precision?: number;
};

export type MoveOptions = {
  /** Skip the spring and jump straight to the target. */
  immediate?: boolean;
  /** Spring overrides for this move only. */
  config?: SpringSettings;
};

export type ExplodeOptions = {
  duration?: number;
  ease?: string;
  immediate?: boolean;
};

export type AnimateOptions = MoveOptions & {
  /** Absolute target, in degrees. */
  rotation?: Rotation;
  /** Relative to the current target, in degrees. Ignored if `rotation` is set. */
  rotateBy?: Rotation;
};

/** All rotation inputs are in degrees. */
export type ObjectHandle = {
  rotateTo: (rotation: Rotation, options?: MoveOptions) => void;
  rotateBy: (delta: Rotation, options?: MoveOptions) => void;
  setRotation: (rotation: Rotation) => void;
  reset: (options?: MoveOptions) => void;
};

type Job = (handle: ObjectHandle) => void;

type ObjectConfig = {
  enabled: boolean;
  snap: boolean;
  dragSpeed: number;
  springConfig: SpringSettings;
};

type ObjectState = ObjectConfig & {
  rotation: Rotation;
  dragging: boolean;
  hovered: boolean;
  telemetryEnabled: boolean;
  handle: ObjectHandle | null;
  pending: Job[];
  overrides: Partial<ObjectConfig>;
  bounds: Bounds | null;
  exploded: number; // 0 = assembled, 1 = fully exploded

  initialize: (config: ObjectConfig) => void;
  setConfig: (config: Partial<ObjectConfig>) => void;
  setRotation: (rotation: Rotation) => void;
  setDragging: (dragging: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setTelemetryEnabled: (value: boolean) => void;
  setBounds: (bounds: Bounds | null) => void;

  registerHandle: (handle: ObjectHandle | null) => void;
  animate: (options: AnimateOptions) => void;
  explode: (to: number, options?: ExplodeOptions) => void;
  reset: (options?: MoveOptions) => void;
};

const EPSILON = 0.0005;
let explodeTween: gsap.core.Tween | null = null;

export const useObjectStore = create<ObjectState>((set, get) => ({
  enabled: true,
  snap: false,
  dragSpeed: 0.008,
  springConfig: { tension: 170, friction: 26 },
  overrides: {},

  rotation: [0, 0, 0],
  dragging: false,
  hovered: false,
  exploded: 0,
  telemetryEnabled: true,
  bounds: null,

  handle: null,
  pending: [],

  initialize: (config) =>
    set((state) => ({
      ...config,
      ...state.overrides, // explicit writes (poses, HUD) win over props
      springConfig: { ...config.springConfig, ...state.overrides.springConfig },
      rotation: [0, 0, 0],
      dragging: false,
      hovered: false,
    })),

  setConfig: (config) =>
    set((state) => ({
      ...config,
      springConfig: config.springConfig
        ? { ...state.springConfig, ...config.springConfig }
        : state.springConfig,
      overrides: { ...state.overrides, ...config },
    })),

  setRotation: (rotation) =>
    set((state) => {
      const p = state.rotation;
      if (
        Math.abs(p[0] - rotation[0]) < EPSILON &&
        Math.abs(p[1] - rotation[1]) < EPSILON &&
        Math.abs(p[2] - rotation[2]) < EPSILON
      ) {
        return state;
      }
      return { rotation: [...rotation] as Rotation };
    }),

  setDragging: (dragging) => set({ dragging }),
  setHovered: (hovered) => set({ hovered }),
  setTelemetryEnabled: (telemetryEnabled) => set({ telemetryEnabled }),
  setBounds: (bounds) => set({ bounds }),

  registerHandle: (handle) => {
    set({ handle });
    if (!handle) return;

    const jobs = get().pending;
    if (!jobs.length) return;

    set({ pending: [] });
    jobs.forEach((job) => job(handle));
  },

  animate: ({ rotation, rotateBy, ...move }) => {
    const { handle } = get();

    if (handle) {
      if (rotation) handle.rotateTo(rotation, move);
      else if (rotateBy) handle.rotateBy(rotateBy, move);
      return;
    }

    // not mounted yet: queue, applied instantly on mount
    const opts = { ...move, immediate: true };

    if (rotation) {
      set({ pending: [(h) => h.rotateTo(rotation, opts)] }); // supersedes
    } else if (rotateBy) {
      set((s) => ({
        pending: [...s.pending, (h) => h.rotateBy(rotateBy, opts)],
      }));
    }
  },

  reset: (options) => {
    const { handle } = get();
    if (handle) return handle.reset(options);

    set({ pending: [(h) => h.reset({ ...options, immediate: true })] });
  },

  explode: (
    to,
    { duration = 0.8, ease = 'power4.inOut', immediate }: ExplodeOptions = {},
  ) => {
    explodeTween?.kill();

    if (immediate) return set({ exploded: to });

    const proxy = { v: get().exploded };
    explodeTween = gsap.to(proxy, {
      v: to,
      duration,
      ease,
      onUpdate: () => set({ exploded: proxy.v }),
    });
  },
}));
