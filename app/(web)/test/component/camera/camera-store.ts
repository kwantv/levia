import { create } from 'zustand';

/* ----------------------------- Types ----------------------------- */

type Vec3 = [number, number, number];

/** Camera described in orbit (spherical) coordinates around `target`. */
export interface CameraView {
  azimuth: number; // deg – horizontal orbit. 0 = +Z axis (front)
  polar: number; // deg – 0 = top, 90 = horizon, 180 = bottom
  distance: number; // distance from target (this is "zoom")
  fov: number; // deg – lens zoom
  target: Vec3; // point the camera looks at
}

export type CameraDelta = Partial<Omit<CameraView, 'target'>>;

/* ----------------------------- Easing ---------------------------- */

export const EASINGS = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
} as const;

export type EasingName = keyof typeof EASINGS;

/* ----------------------------- Limits ---------------------------- */

export const CAMERA_LIMITS = {
  polar: [1, 179] as const,
  distance: [1.5, 15] as const,
  fov: [15, 90] as const,
};

/* ----------------------------- Handle ---------------------------- */

export type Transition = {
  duration: number; // seconds
  ease: EasingName;
};

export type MoveOptions = Partial<Transition> & {
  /** Skip the tween and jump straight to the target. */
  immediate?: boolean;
};

export type AnimateOptions = MoveOptions & {
  /** Absolute target. Omitted fields stay as-is. */
  view?: Partial<CameraView>;
  /** Relative to the current camera. Ignored if `view` is set. */
  by?: CameraDelta;
};

/** Registered by <CameraRig />. Angles in degrees. */
export type CameraHandle = {
  animateTo: (view: Partial<CameraView>, options?: MoveOptions) => void;
  animateBy: (delta: CameraDelta, options?: MoveOptions) => void;
  setView: (view: Partial<CameraView>) => void;
  reset: (options?: MoveOptions) => void;
};

/* ----------------------------- Store ----------------------------- */

type CameraConfig = {
  transition: Transition;
};

type Job = (handle: CameraHandle) => void;

type CameraState = CameraConfig & {
  live: CameraView;
  telemetryEnabled: boolean;
  handle: CameraHandle | null;
  pending: Job[];

  setConfig: (config: { transition?: Partial<Transition> }) => void;
  setLive: (live: CameraView) => void;
  setTelemetryEnabled: (value: boolean) => void;

  registerHandle: (handle: CameraHandle | null) => void;
  animate: (options: AnimateOptions) => void;
  reset: (options?: MoveOptions) => void;
};

const EPSILON = 0.001;

export const useCameraStore = create<CameraState>((set, get) => ({
  transition: { duration: 1.2, ease: 'easeInOutCubic' },

  live: { azimuth: 0, polar: 90, distance: 5, fov: 45, target: [0, 0, 0] },
  telemetryEnabled: true,

  handle: null,
  pending: [],

  setConfig: (config) =>
    set((state) => ({
      transition: config.transition
        ? { ...state.transition, ...config.transition }
        : state.transition,
    })),

  setLive: (live) =>
    set((state) => {
      const p = state.live;
      if (
        Math.abs(p.azimuth - live.azimuth) < EPSILON &&
        Math.abs(p.polar - live.polar) < EPSILON &&
        Math.abs(p.distance - live.distance) < EPSILON &&
        Math.abs(p.fov - live.fov) < EPSILON &&
        p.target.every((v, i) => Math.abs(v - live.target[i]) < EPSILON)
      ) {
        return state;
      }
      return { live };
    }),

  setTelemetryEnabled: (telemetryEnabled) => set({ telemetryEnabled }),

  registerHandle: (handle) => {
    set({ handle });
    if (!handle) return;

    const jobs = get().pending;
    if (!jobs.length) return;

    set({ pending: [] });
    jobs.forEach((job) => job(handle));
  },

  animate: ({ view, by, ...move }) => {
    const { handle } = get();

    if (handle) {
      if (view) handle.animateTo(view, move);
      else if (by) handle.animateBy(by, move);
      return;
    }

    const opts = { ...move, immediate: true };

    if (view) {
      set({ pending: [(h) => h.animateTo(view, opts)] }); // supersedes
    } else if (by) {
      set((s) => ({ pending: [...s.pending, (h) => h.animateBy(by, opts)] }));
    }
  },

  reset: (options) => {
    const { handle } = get();
    if (handle) return handle.reset(options);

    set({ pending: [(h) => h.reset({ ...options, immediate: true })] });
  },
}));
