import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Group } from 'three';
import { Html, Line } from '@react-three/drei';
import { useObjectStore } from '../../object/object-store';
import { useAnnotationStore } from '../annotation-store';
import { cn } from '@/lib/utils';

type Vec3 = [number, number, number];

const STEM = [0.3, 0.2]; // stem run (x, y) away from the corner

const PARTS = [
  {
    title: 'Kính CERAMIC K Nano',
    sub: 'Chịu sốc nhiệt tới 1900°C, chống trầy xước và chịu va đập lực mạnh.',
    z: 0.444,
    corner: [1, 1], // top right
  },
  {
    title: 'Mâm đồng nguyên chất',
    sub: 'Tích hợp 2 bộ công suất, linh kiện lớn hơn 25% tối ưu hóa truyền nhiệt.',
    z: 0,
    corner: [-1, -1], // bottom left
  },
  {
    title: 'Chống nồm ẩm 2 lớp',
    sub: 'Sò công suất IGBT Đức, mạch EMC chống sốc điện, hoàn toàn miễn nhiễm khí hậu nhiệt đới.',
    z: -0.4,
    corner: [1, -1], // bottom right
  },
] as const;

function Registrar({
  root,
  groups,
  dots,
  labels,
}: {
  root: React.RefObject<HTMLDivElement | null>;
  groups: React.RefObject<(Group | null)[]>;
  dots: React.RefObject<(HTMLDivElement | null)[]>;
  labels: React.RefObject<(HTMLDivElement | null)[]>;
}) {
  useEffect(
    () =>
      useAnnotationStore.getState().register('explodedLabels', {
        root,
        enter: () => {
          const g = groups.current as Group[];
          const scales = g.map((x) => x.scale);

          return gsap
            .timeline({ delay: 0.5 })
            .set(g, { visible: true })
            .fromTo(
              dots.current,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.1 },
            )
            .to(scales, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.5,
              ease: 'power3.out',
              stagger: 0.15,
            })
            .fromTo(
              labels.current,
              { autoAlpha: 0, y: 6 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.15,
                pointerEvents: 'auto',
              },
              '<0.25',
            );
        },

        exit: () => {
          const g = groups.current as Group[];
          const scales = g.map((x) => x.scale);

          return gsap
            .timeline()
            .to([...labels.current, ...dots.current], {
              autoAlpha: 0,
              duration: 0.15,
              pointerEvents: 'none',
            })
            .to(scales, { x: 0, y: 0, z: 0, duration: 0.25 }, '<')
            .set(g, { visible: false });
        },
      }),
    [root, groups, dots, labels],
  );

  return <div ref={root} className="invisible absolute" />;
}

export function ExplodedLabels() {
  const bounds = useObjectStore((s) => s.bounds);
  const root = useRef<HTMLDivElement>(null);
  const groups = useRef<(Group | null)[]>([]);
  const stems = useRef<(HTMLDivElement | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);

  if (!bounds) return null; // mounts (and registers) once the model is measured
  const { min, max } = bounds;

  return (
    <>
      {PARTS.map((p, i) => {
        const [sx, sy] = p.corner;
        const anchor: Vec3 = [
          sx > 0 ? max[0] : min[0],
          sy > 0 ? max[1] : min[1],
          p.z,
        ];
        const end: Vec3 = [sx * STEM[0], sy * STEM[1], 0]; // relative to the anchor
        const right = sx > 0;

        return (
          <group
            key={p.title}
            ref={(g) => {
              groups.current[i] = g;
            }}
            position={anchor}
            scale={0}
            visible={false}
          >
            <Html center className="pointer-events-none">
              <div
                ref={(el) => {
                  stems.current[i] = el;
                }}
                className="invisible bg-foreground rounded-full size-3"
              />
            </Html>

            <Line points={[[0, 0, 0], end]} color="gray" />

            <group position={end}>
              <Html className="pointer-events-none">
                {i === 2 && (
                  <Registrar
                    root={root}
                    groups={groups}
                    dots={stems}
                    labels={labels}
                  />
                )}
                <div
                  ref={(el) => {
                    labels.current[i] = el;
                  }}
                  className={cn(
                    'invisible bg-foreground p-4 py-3 w-3xs font-mono text-background text-justify -translate-y-1/2',
                    right ? '' : '-translate-x-full',
                  )}
                >
                  <p className="mb-2 font-medium text-sm">{p.title}</p>
                  <p className="text-muted-background text-xs">{p.sub}</p>
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </>
  );
}
