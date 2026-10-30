const R = 180; // outline radius (svg units, viewBox is 1000)
const TEXT_R = 200; // text baseline radius, just outside the outline
const GAP_DEG = 70; // arc left empty for the object to cover

// starts at 9 o'clock (facing the object), runs clockwise: the gap is centered on the start/end point
const PATH = `M ${-TEXT_R} 0 A ${TEXT_R} ${TEXT_R} 0 1 1 ${TEXT_R} 0 A ${TEXT_R} ${TEXT_R} 0 1 1 ${-TEXT_R} 0`;
const f0 = GAP_DEG / 2 / 360;

const ITEMS = [
  'Cảm ứng chống tràn mặt kính',
  'Tự động ngắt khi nồi cạn nước',
  'Cảnh báo khi không có nồi trên bếp',
  'Cảnh báo nhiệt dư vùng nấu',
  'Tự động giảm dòng điện khi quá tải',
  'Khóa trẻ em an toàn tuyệt đối',
];

export function OrbitCircle({
  layer,
}: {
  layer: React.RefObject<HTMLDivElement | null>;
}) {
  const offsets = ITEMS.map(
    (_, i) => (f0 + ((i + 0.5) / ITEMS.length) * (1 - 2 * f0)) * 100,
  );

  return (
    // fixed + invisible: nothing is drawn until the section's trigger reveals it
    <div
      ref={layer}
      className="invisible z-0 fixed inset-0 overflow-hidden text-foreground pointer-events-none"
    >
      <div className="top-1/2 left-2/3 absolute -translate-x-1/2 -translate-y-1/2">
        <div data-spin className="h-[130vh] aspect-square">
          <svg viewBox="-500 -500 1000 1000" className="size-full">
            <path id="orbit-path" d={PATH} fill="none" />
            <circle
              data-circle
              r={R}
              fill="none"
              stroke="currentColor"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
            {ITEMS.map((t, i) => (
              <text
                key={t}
                data-text
                textAnchor="middle"
                className="fill-current text-[18px]"
              >
                <textPath href="#orbit-path" startOffset={`${offsets[i]}%`}>
                  {t}
                </textPath>
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
