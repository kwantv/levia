export interface Pose {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
}

export interface StageAnnotation {
  id: string;
  point: readonly [number, number, number]; // anchor on the object, local space
  label: string;
  labelOffset?: readonly [number, number, number]; // override auto-placement if it collides
}

export interface ShowcaseStage {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  pose: Pose;
  annotations: StageAnnotation[];
}

// Reordering this array is the entire reordering story — nothing else
// references index or position, only this list's order.
export const SHOWCASE_STAGES: ShowcaseStage[] = [
  {
    id: 'material',
    eyebrow: '01 / 05',
    title: 'Aerospace-grade shell',
    description:
      'Milled from a single billet of 6061 aluminum, then anodized for a surface that resists scratching without adding weight.',
    pose: { position: [0, 0, 2.5], rotation: [0, 0, 0] },
    annotations: [
      {
        id: 'material-edge',
        point: [0.6, 0.3, 0.5],
        label: 'CNC-milled aluminum',
      },
      {
        id: 'material-anodize',
        point: [-0.5, -0.2, 0.4],
        label: 'Anodized finish',
      },
    ],
  },
  {
    id: 'sensor',
    eyebrow: '02 / 05',
    title: 'Precision sensor array',
    description:
      'A 9-axis IMU tracks orientation to within a tenth of a degree, recalibrating in real time against thermal drift.',
    pose: { position: [0, 0, 2.5], rotation: [0, Math.PI * 0.4, 0] },
    annotations: [
      { id: 'sensor-imu', point: [-0.4, 0.2, 0.5], label: '9-axis IMU' },
    ],
  },
  {
    id: 'battery',
    eyebrow: '03 / 05',
    title: 'Cell architecture',
    description:
      'Stacked pouch cells trade a little manufacturing complexity for a meaningfully denser pack in the same footprint.',
    pose: { position: [0, 0, 2.8], rotation: [0, Math.PI * 0.8, 0] },
    annotations: [
      {
        id: 'material-edge',
        point: [0.6, 0.3, 0.5],
        label: 'CNC-milled aluminum',
      },
      {
        id: 'material-anodize',
        point: [-0.5, -0.2, 0.4],
        label: 'Anodized finish',
      },
    ],
  },
  {
    id: 'chip',
    eyebrow: '04 / 05',
    title: 'Custom silicon',
    description:
      'A dedicated coprocessor handles sensor fusion on-die, freeing the main chip to stay idle — and cool — the rest of the time.',
    pose: { position: [0, 0, 2.8], rotation: [0, Math.PI * 1.2, 0] },
    annotations: [],
  },
  {
    id: 'display',
    eyebrow: '05 / 05',
    title: 'Optical stack',
    description:
      'Four bonded layers eliminate the air gaps that usually cause glare, so the display stays legible even in direct sun.',
    pose: { position: [0, 0, 2.5], rotation: [0, Math.PI * 1.6, 0] },
    annotations: [
      { id: 'sensor-imu', point: [-0.4, 0.2, 0.5], label: '9-axis IMU' },
    ],
  },
];
