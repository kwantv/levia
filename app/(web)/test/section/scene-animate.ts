import { AnnotationId } from '../component/annotations/annotation-layer';
import { useAnnotationStore } from '../component/annotations/annotation-store';
import {
  useCameraStore,
  type AnimateOptions as CameraAnimate,
} from '../component/camera/camera-store';
import {
  useObjectStore,
  type AnimateOptions as ObjectAnimate,
} from '../component/object/object-store';
import { useTiltStore } from '../component/object/object-tilt';

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
