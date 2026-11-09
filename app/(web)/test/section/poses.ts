import { useEffect } from 'react';
import {
  useCameraStore,
  AnimateOptions as CameraAnimate,
} from '../component/camera/camera-store';
import {
  useObjectStore,
  AnimateOptions as ObjectAnimate,
} from '../component/object/object-store';
import { useTiltStore } from '../component/object/object-tilt';
import { useAnnotationStore } from '../component/annotations/annotation-store';
import { AnnotationId } from '../component/annotations/annotation-layer';

export const MOBILE_QUERY = '(max-width: 767px), (max-aspect-ratio: 1/1)';

export const POSES = {
  hero: {
    camera: {
      view: {
        azimuth: 0,
        polar: 140,
        distance: 9,
        target: [-2, -0.6, 0],
      },
    },
    object: 'reset',
    interact: true,
  },

  power: {
    camera: {
      view: {
        azimuth: 0,
        polar: 140,
        distance: 9,
        target: [-2, -0.4, 0],
      },
    },
    object: {
      rotation: [-5, -15, -45],
    },
    interact: false,
    annotation: 'ruler',
    explode: 0,
  },

  durability: {
    camera: {
      view: {
        azimuth: 0,
        polar: 140,
        distance: 9,
        target: [-2, -0.4, 0],
      },
      ease: 'easeInOutQuart',
      duration: 0.7,
    },
    object: {
      rotation: [-5, -15, -45],
    },
    interact: false,
    explode: 1,
    annotation: 'explodedLabels',
  },

  modern: {
    camera: {
      view: {
        azimuth: 0,
        polar: 140,
        distance: 5,
        target: [-1.3, -0.4, 0],
      },
    },
    object: { rotation: [0, 0, 20] },
    interact: false,
    explode: 0,
  },

  safety: {
    camera: {
      view: {
        azimuth: 0,
        polar: 140,
        distance: 9,
        target: [-2.1, -0.2, 0.1],
      },
      ease: 'easeInOutCubic',
      duration: 0.8,
    },
    object: { rotation: [0, 0, 20] },
    interact: false,
  },
} satisfies Record<string, ScenePose>;

export type PoseName = keyof typeof POSES;

export const MOBILE_POSES: Partial<Record<PoseName, ScenePose>> = {
  hero: {
    camera: 'reset',
  },
  // hero: {
  //   camera: 'reset',
  //   object: 'reset',
  // },
  // power: {
  //   camera: {
  //     view: { azimuth: 0, polar: 90, distance: 4, target: [0, 0, 0] },
  //   },
  //   object: 'reset',
  // },
  // durability: {
  //   camera: {
  //     view: { azimuth: 15, polar: 142, distance: 4, target: [0, 0, 0] },
  //   },
  //   object: {
  //     rotation: [0, 0, -15],
  //   },
  // },
  // modern: {
  //   camera: {
  //     view: {
  //       azimuth: 4.5,
  //       polar: 140,
  //       distance: 2,
  //       target: [-0.4, -0.3, 0],
  //     },
  //   },
  //   object: {
  //     rotation: [0, 0, 20],
  //   },
  // },
  // safety: {
  //   camera: {
  //     view: { azimuth: 0, polar: 117, distance: 4, target: [0, -0.2, 0] },
  //   },
  //   object: {
  //     rotation: [0, 0, 0],
  //   },
  // },
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
    annotation: mobile?.annotation ?? base.annotation,
    explode: mobile?.explode ?? base.explode,
    interact: mobile?.interact ?? base.interact,
    tilt: mobile?.tilt ?? base.tilt,
  };
}

let currentPose: PoseName | null = null;

export function goToPose(name: PoseName, shared?: SharedOptions) {
  currentPose = name;
  animateScene(resolvePose(name), shared);
}

export type ScenePose = {
  camera?: CameraAnimate | 'reset';
  object?: ObjectAnimate | 'reset';
  annotation?: AnnotationId;

  interact?: boolean;
  tilt?: boolean;
  explode?: number;
};

export type SharedOptions = {
  /** Forces an instant jump on both camera and object. */
  immediate?: boolean;
};

export function animateScene(pose: ScenePose, shared: SharedOptions = {}) {
  const { camera, object, interact, tilt, annotation, explode } = pose;
  const cam = useCameraStore.getState();
  const obj = useObjectStore.getState();

  if (camera === 'reset') cam.reset({ immediate: shared.immediate });
  else if (camera)
    cam.animate({
      ...camera,
      immediate: shared.immediate ?? camera.immediate,
    });

  if (object === 'reset') obj.reset({ immediate: shared.immediate });
  else if (object)
    obj.animate({
      ...object,
      immediate: shared.immediate ?? object.immediate,
    });

  if (interact !== undefined) {
    obj.setConfig({ enabled: interact });
  }

  if (tilt !== undefined) {
    useTiltStore.getState().setEnabled(tilt);
  }

  if (explode !== undefined) {
    obj.explode(explode, { immediate: shared.immediate });
  }

  useAnnotationStore.getState().show(annotation);
}

export function resetScene() {
  animateScene({ camera: 'reset', object: 'reset', explode: 0 });
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
