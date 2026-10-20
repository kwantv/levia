import { useEffect } from 'react';
import {
  animateScene,
  type ScenePose,
  type SharedOptions,
} from './scene-animate';

export const MOBILE_QUERY = '(max-width: 767px), (max-aspect-ratio: 1/1)';

export const POSES = {
  intro: {
    camera: {
      view: { azimuth: 0, polar: 90, distance: 5, target: [-1, -0.3, 0] },
    },
    object: 'reset',
    interact: true,
  },

  hero: {
    camera: {
      view: { azimuth: 0, polar: 90, distance: 4, target: [0, 0, 0] },
    },
    object: 'reset',
    interact: false,
  },

  detail: {
    camera: {
      view: { azimuth: 15, polar: 142, distance: 4, target: [0, 0, 0] },
    },
    object: {
      rotation: [0, 0, -15],
    },
    interact: false,
  },

  cut: {
    camera: {
      view: {
        azimuth: 4.5,
        polar: 140,
        distance: 2,
        target: [-0.7, -0.4, -0.1],
      },
    },
    object: {
      rotation: [0, 0, 20],
    },
    interact: false,
  },

  wide: {
    camera: {
      view: { azimuth: 0, polar: 117, distance: 4, target: [0.5, 0, 0] },
    },
    object: {
      rotation: [0, 0, 0],
    },
    interact: false,
  },
} satisfies Record<string, ScenePose>;

export type PoseName = keyof typeof POSES;

export const MOBILE_POSES: Partial<Record<PoseName, ScenePose>> = {
  intro: {
    camera: 'reset',
    object: 'reset',
  },

  hero: {
    camera: {
      view: { azimuth: 0, polar: 90, distance: 4, target: [0, 0, 0] },
    },
    object: 'reset',
  },

  detail: {
    camera: {
      view: { azimuth: 15, polar: 142, distance: 4, target: [0, 0, 0] },
    },
    object: {
      rotation: [0, 0, -15],
    },
  },

  cut: {
    camera: {
      view: {
        azimuth: 4.5,
        polar: 140,
        distance: 2,
        target: [-0.4, -0.3, 0],
      },
    },
    object: {
      rotation: [0, 0, 20],
    },
  },

  wide: {
    camera: {
      view: { azimuth: 0, polar: 117, distance: 4, target: [0, -0.2, 0] },
    },
    object: {
      rotation: [0, 0, 0],
    },
  },
};

/* ------------------------------ Resolve ------------------------------ */

export function isMobile() {
  return (
    typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
}

export function resolvePose(name: PoseName): ScenePose {
  const base: ScenePose = POSES[name];
  const mobile = isMobile() ? MOBILE_POSES[name] : undefined;

  return {
    camera: mobile?.camera ?? base.camera,
    object: mobile?.object ?? base.object,
    interact: mobile?.interact ?? base.interact,
    tilt: mobile?.tilt ?? base.tilt,
  };
}

let currentPose: PoseName | null = null;

export function goToPose(name: PoseName, shared?: SharedOptions) {
  currentPose = name;
  animateScene(resolvePose(name), shared);
}

/** Re-applies the current pose when the mobile/desktop breakpoint flips. */
export function usePoseBreakpointSync() {
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (currentPose) goToPose(currentPose);
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
}
