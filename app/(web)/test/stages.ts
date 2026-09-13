export interface Annotation {
  position: readonly [number, number, number]; // local to the object
  label: string;
}

export interface Stage {
  id: string;
  pose: {
    position: readonly [number, number, number];
    rotation: readonly [number, number, number];
  };
  annotations?: Annotation[];
}

// Reordering this array is the entire "future-proof reordering" story —
// nothing else references stage order, only stage id.
export const STAGES: Stage[] = [
  { id: 'hero', pose: { position: [1.6, 0, 0], rotation: [0, 0, 0] } },
  {
    id: 'material',
    pose: { position: [0, 0, 2.5], rotation: [0, 0, 0] },
    annotations: [{ position: [0.6, 0.3, 0.5], label: 'CNC-milled aluminum' }],
  },
  {
    id: 'sensor',
    pose: { position: [0, 0, 2.5], rotation: [0, Math.PI * 0.4, 0] },
    annotations: [{ position: [-0.4, 0.2, 0.5], label: '9-axis IMU' }],
  },
  {
    id: 'battery',
    pose: { position: [0, 0, 2.8], rotation: [0, Math.PI * 0.8, 0] },
  },
  {
    id: 'chip',
    pose: { position: [0, 0, 2.8], rotation: [0, Math.PI * 1.2, 0] },
  },
  {
    id: 'display',
    pose: { position: [0, 0, 2.5], rotation: [0, Math.PI * 1.6, 0] },
  },
];

export function getStage(id: string) {
  return STAGES.find((s) => s.id === id);
}
export function getStagePose(id: string) {
  return getStage(id)?.pose;
}
export function getStageAnnotations(id: string) {
  return getStage(id)?.annotations ?? [];
}
