import { useRef } from 'react';
import gsap from 'gsap';
import { Group } from 'three';
import { Html, Line } from '@react-three/drei';
import { useAnnotationStore } from '../annotation-store';
import { useObjectStore } from '../../object/object-store';
import { useGSAP } from '@gsap/react';

const GAP = 0.05; // distance from the object
const TICK = 0.02; // end tick length
const UNIT = 1; // display units per scene unit (1000 for mm if the model is in metres)

type Ref<T> = React.RefObject<T | null>;

function Registrar({
  root,
  wGroup,
  hGroup,
  wLabel,
  hLabel,
  wNum,
  hNum,
  w,
  h,
}: {
  root: Ref<HTMLDivElement>;
  wGroup: Ref<Group>;
  hGroup: Ref<Group>;
  wLabel: Ref<HTMLDivElement>;
  hLabel: Ref<HTMLDivElement>;
  wNum: Ref<HTMLSpanElement>;
  hNum: Ref<HTMLSpanElement>;
  w: number;
  h: number;
}) {
  useGSAP(
    () =>
      useAnnotationStore.getState().register('ruler', {
        root,
        enter: () => {
          const c = { w: 0, h: 0 };
          wGroup.current!.visible = true;
          hGroup.current!.visible = true;

          return gsap
            .timeline()
            .to(wGroup.current!.scale, {
              x: 1,
              duration: 0.7,
              ease: 'power3.out',
            })
            .to(
              hGroup.current!.scale,
              { y: 1, duration: 0.7, ease: 'power3.out' },
              '<0.15',
            )
            .fromTo(
              [wLabel.current, hLabel.current],
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.3 },
              '<0.2',
            )
            .to(
              c,
              {
                w: w * UNIT,
                h: h * UNIT,
                duration: 0.9,
                onUpdate: () => {
                  wNum.current!.textContent = `${c.w.toFixed(1)} mm`;
                  hNum.current!.textContent = `${c.h.toFixed(1)} mm`;
                },
              },
              '<',
            );
        },
        exit: () =>
          gsap
            .timeline({
              onComplete: () => {
                wGroup.current!.visible = false;
                hGroup.current!.visible = false;
              },
            })
            .to([wLabel.current, hLabel.current], {
              autoAlpha: 0,
              duration: 0.15,
            })
            .to(wGroup.current!.scale, { x: 0, duration: 0.25 }, '<')
            .to(hGroup.current!.scale, { y: 0, duration: 0.25 }, '<'),
      }),
    [root, wGroup, hGroup, wLabel, hLabel, wNum, hNum, w, h],
  );

  // the store needs a DOM root; visibility is handled inside enter/exit
  return <div ref={root} className="invisible absolute" />;
}

export function Ruler() {
  const bounds = useObjectStore((s) => s.bounds);

  const root = useRef<HTMLDivElement>(null);
  const wGroup = useRef<Group>(null);
  const hGroup = useRef<Group>(null);
  const wLabel = useRef<HTMLDivElement>(null);
  const hLabel = useRef<HTMLDivElement>(null);
  const wNum = useRef<HTMLSpanElement>(null);
  const hNum = useRef<HTMLSpanElement>(null);

  if (!bounds) return null; // mounts (and registers) once the model is measured

  const { min, max, size } = bounds;
  const [w, h] = size;

  return (
    <>
      {/* width: under the object, collapsed along x */}
      <group
        ref={wGroup}
        position={[min[0], min[1] - GAP, max[2]]}
        scale={[0, 1, 1]}
        visible={false}
      >
        <Line
          points={[
            [0, TICK, 0],
            [0, 0, 0],
            [w, 0, 0],
            [w, TICK, 0],
          ]}
          color="gray"
        />
        <group position={[w / 2, -GAP, 0]}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div ref={wLabel} className="invisible whitespace-nowrap">
              <span ref={wNum} className="font-mono tabular-nums text-sm">
                0.0 mm
              </span>
            </div>
          </Html>
        </group>
      </group>

      {/* height: left of the object, collapsed along y */}
      <group
        ref={hGroup}
        position={[min[0] - GAP, min[1], max[2]]}
        scale={[1, 0, 1]}
        visible={false}
      >
        <Line
          points={[
            [TICK, 0, 0],
            [0, 0, 0],
            [0, h, 0],
            [TICK, h, 0],
          ]}
          color="gray"
        />
        <group position={[GAP, h / 2, 0]}>
          <Html
            center
            style={{ pointerEvents: 'none' }}
            className="-translate-x-full"
          >
            <Registrar
              root={root}
              wGroup={wGroup}
              hGroup={hGroup}
              wLabel={wLabel}
              hLabel={hLabel}
              wNum={wNum}
              hNum={hNum}
              w={w}
              h={h}
            />
            <div ref={hLabel} className="invisible whitespace-nowrap">
              <span ref={hNum} className="font-mono tabular-nums text-sm">
                0.0 mm
              </span>
            </div>
          </Html>
        </group>
      </group>
    </>
  );
}
