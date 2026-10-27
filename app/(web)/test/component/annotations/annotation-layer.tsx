import { ExplodedLabels } from './components/exploded-labels';
import { Ruler } from './components/ruler';

export const ANNOTATIONS = {
  ruler: Ruler,
  explodedLabels: ExplodedLabels,
};
export type AnnotationId = keyof typeof ANNOTATIONS;

export function AnnotationLayer() {
  return Object.entries(ANNOTATIONS).map(([id, C]) => <C key={id} />);
}
