'use client';

import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Waves,
  Zap,
  Layers3,
  Fingerprint,
  Cpu,
} from 'lucide-react';

type LeviaLandingPageProps = {
  brand?: string;
  model?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
};

const features = [
  {
    number: '01',
    title: 'MẠNH MẼ',
    english: 'Power without compromise',
    heading: 'Sức mạnh bứt phá.',
    description: (
      <>
        Sở hữu sức mạnh bứt phá với tổng công suất lên tới{' '}
        <strong className="feature-value">5600W</strong> và chế độ đun sôi chớp
        nhoáng Booster <strong className="feature-value">2800W</strong> cho mỗi
        vùng nấu, LV79DI đảm bảo hiệu suất truyền nhiệt tối đa. Tích hợp công
        nghệ Digital Inverter, bếp hoạt động vô cùng êm ái, siêu tiết kiệm điện
        năng và duy trì sự mượt mà ngay cả khi điện áp thấp ở mức{' '}
        <strong className="feature-value">100–265V</strong>.
      </>
    ),
  },
  {
    number: '02',
    title: 'BỀN BỈ',
    english: 'Engineered from within',
    heading: 'Bền bỉ từ bên trong.',
    description: '',
  },
  {
    number: '03',
    title: 'HIỆN ĐẠI',
    english: 'Designed around you',
    heading: 'Mọi thao tác, thật tự nhiên.',
    description: '',
  },
  {
    number: '04',
    title: 'AN TOÀN',
    english: 'Intelligence that protects',
    heading: 'An tâm trong từng khoảnh khắc.',
    description: '',
  },
];

const layers = [
  {
    number: '01',
    name: 'Kính CERAMIC K Nano',
    description:
      'Chịu sốc nhiệt tới 1900°C, chống trầy xước và chịu va đập lực mạnh.',
  },
  {
    number: '02',
    name: 'Mâm đồng nguyên chất',
    description:
      'Tích hợp 2 bộ công suất, linh kiện lớn hơn 25% tối ưu hóa truyền nhiệt.',
  },
  {
    number: '03',
    name: 'Chống nồm ẩm 2 lớp',
    description:
      'Sò công suất IGBT Đức, mạch EMC chống sốc điện, phù hợp khí hậu nhiệt đới.',
  },
];

const safetyFeatures = [
  'Cảm ứng chống tràn mặt kính',
  'Tự động ngắt khi nồi cạn nước',
  'Cảnh báo khi không có nồi trên bếp',
  'Cảnh báo nhiệt dư vùng nấu',
  'Tự động giảm dòng điện khi quá tải',
  'Khóa trẻ em an toàn tuyệt đối',
];

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 font-medium text-[10px] text-white/45 sm:text-xs uppercase tracking-[0.22em]">
      <span className="text-[#c9b38a]">{number}</span>
      <span className="bg-white/20 w-6 h-px" />
      <span>{children}</span>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[#c9b38a] text-[10px] sm:text-xs uppercase tracking-[0.24em]">
      {children}
    </p>
  );
}

/**
 * Temporary CSS product stand-in.
 * Replace this component's internals with your R3F canvas when ready.
 */
function HobVisual({
  className = '',
  exploded = false,
  interactive = false,
  controls = true,
}: {
  className?: string;
  exploded?: boolean;
  interactive?: boolean;
  controls?: boolean;
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({
    x: 0,
    y: 0,
    rotationX: 0,
    rotationY: 0,
  });

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;

    setDragging(true);
    dragOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      rotationX: rotation.x,
      rotationY: rotation.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!interactive) return;

    if (dragging) {
      setRotation({
        x: Math.max(
          -35,
          Math.min(
            35,
            dragOrigin.current.rotationX +
              (e.clientY - dragOrigin.current.y) * -0.25,
          ),
        ),
        y:
          dragOrigin.current.rotationY +
          (e.clientX - dragOrigin.current.x) * 0.35,
      });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setRotation({ x: -y * 5, y: x * 7 });
  }

  function resetTilt() {
    if (!dragging) setRotation({ x: 0, y: 0 });
    setDragging(false);
  }

  const productStyle = {
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
  } as CSSProperties;

  return (
    <div
      className={`relative flex items-center justify-center ${className} ${
        interactive
          ? 'touch-pan-y cursor-grab active:cursor-grabbing'
          : 'pointer-events-none'
      }`}
      style={{ perspective: '1200px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={resetTilt}
      onPointerCancel={resetTilt}
      onPointerLeave={() => {
        if (interactive && !dragging) setRotation({ x: 0, y: 0 });
      }}
      aria-label="Mô hình bếp từ Levia LV79DI"
    >
      <div
        className="relative w-full max-w-[650px] transition-transform duration-300 ease-out"
        style={productStyle}
      >
        {/* Soft studio lighting */}
        <div className="absolute inset-[10%] bg-[#c9b38a]/[0.07] blur-[70px] rounded-full" />

        {/* PCB / bottom layer */}
        <div
          className={`absolute left-[12%] top-[16%] h-[68%] w-[76%] rounded-[5%] border border-[#c9b38a]/20 bg-[#292a28] shadow-[0_30px_80px_#00000080] transition-transform duration-700 ${
            exploded ? 'translate-y-24 sm:translate-y-32' : 'translate-y-2'
          }`}
        >
          <div className="absolute inset-[5%] border border-white/[0.07]" />
          <div className="bottom-[8%] left-[8%] absolute flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="bg-[#c9b38a]/60 rounded-full w-1 h-1" />
            ))}
          </div>
        </div>

        {/* Copper coil / middle layer */}
        <div
          className={`absolute left-[10%] top-[13%] z-[1] grid h-[68%] w-[80%] grid-cols-2 gap-[8%] rounded-[5%] border border-[#c9b38a]/25 bg-[#242321] p-[7%] shadow-[0_25px_55px_#00000070] transition-transform duration-700 ${
            exploded ? 'translate-y-12 sm:translate-y-16' : 'translate-y-1'
          }`}
        >
          {[0, 1, 2, 3].map((n) => (
            <div
              key={n}
              className="relative self-center p-[9%] border border-[#b98d50]/50 rounded-full aspect-square"
              style={{
                background:
                  'repeating-radial-gradient(circle, transparent 0 5px, #9c774a55 6px 7px)',
              }}
            >
              <div className="border border-[#b98d50]/30 rounded-full w-full h-full" />
            </div>
          ))}
        </div>

        {/* Ceramic glass top */}
        <div
          className={`relative z-[2] aspect-[1.3/1] w-full overflow-hidden rounded-[3%] border border-white/20 bg-[#171817] shadow-[0_40px_100px_#000000a0,inset_0_1px_1px_#ffffff25] transition-transform duration-700 ${
            exploded ? '-translate-y-10 sm:-translate-y-14' : ''
          }`}
          style={{
            background:
              'linear-gradient(135deg, #292a28 0%, #141514 40%, #20211f 100%)',
          }}
        >
          {/* Glass reflections */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#ffffff0b,transparent_30%,transparent_65%,#ffffff05)]" />
          <div className="top-0 left-0 absolute bg-white/20 w-full h-px" />

          {/* Four cooking zones */}
          <div className="absolute inset-[10%] gap-[7%] grid grid-cols-2 grid-rows-2">
            {[0, 1, 2, 3].map((n) => (
              <div
                key={n}
                className="relative flex justify-center items-center border border-white/[0.13] rounded-full aspect-square"
              >
                <div className="absolute inset-[7%] border border-white/[0.10] rounded-full" />
                <div className="absolute inset-[14%] border border-white/[0.08] rounded-full" />
                <div className="absolute inset-[23%] border border-white/[0.06] rounded-full" />
                <div className="absolute inset-[31%] border border-white/[0.05] rounded-full" />
                {n === 3 && (
                  <div className="absolute bg-[#c9b38a]/60 shadow-[0_0_12px_#c9b38a] rounded-full w-1 h-1" />
                )}
              </div>
            ))}
          </div>

          {/* Minimal touch controls */}
          {controls && (
            <div className="bottom-[5%] left-0 absolute flex justify-center items-center gap-[3%] w-full text-white/45">
              <span className="text-[clamp(6px,0.8vw,10px)] tracking-[0.2em]">
                LEVIA
              </span>
              <span className="bg-white/20 mx-[2%] w-[8%] h-px" />
              <span className="text-[clamp(6px,0.8vw,10px)]">−</span>
              <span className="text-[#c9b38a] text-[clamp(7px,0.9vw,12px)]">
                08
              </span>
              <span className="text-[clamp(6px,0.8vw,10px)]">+</span>
              <span className="ml-[3%] text-[clamp(6px,0.8vw,10px)]">◉</span>
              <span className="text-[clamp(6px,0.8vw,10px)]">◌</span>
            </div>
          )}
        </div>

        {/* Layer connector accents */}
        {exploded && (
          <div className="top-[48%] right-[10%] z-[3] absolute bg-gradient-to-b from-[#c9b38a]/60 to-transparent w-px h-20" />
        )}
      </div>
    </div>
  );
}

function SceneHeading({ feature }: { feature: (typeof features)[number] }) {
  return (
    <div className="flex flex-col gap-3 mb-10 sm:mb-14">
      <SectionLabel number={feature.number}>{feature.english}</SectionLabel>
      <h2 className="font-heading font-medium text-white text-4xl sm:text-6xl lg:text-7xl tracking-[-0.065em]">
        {feature.title}
        <span className="text-[#c9b38a]">.</span>
      </h2>
    </div>
  );
}

export default function LeviaLandingPage({
  brand = 'LEVIA',
  model = 'LV79DI',
  heroTitle = 'Công nghệ hiểu bạn.',
  heroSubtitle = 'Được thiết kế từ hàng triệu dữ liệu người dùng, kết hợp công suất vượt trội và công nghệ giám sát an toàn 24/7. Thấu hiểu mọi thói quen, làm chủ mọi giới hạn không gian bếp.',
  primaryCta = 'Tìm hiểu sản phẩm',
  secondaryCta = 'Trải nghiệm tại showroom',
}: LeviaLandingPageProps) {
  return (
    <main className="bg-[#111210] selection:bg-[#c9b38a] overflow-clip text-white selection:text-[#111210]">
      {/* HERO */}
      <section
        id="hero"
        className="isolate relative flex flex-col border-white/10 border-b min-h-dvh"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.17] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#8b8981 0.65px, transparent 0.65px)',
            backgroundSize: '20px 20px',
            maskImage:
              'linear-gradient(to right, black, transparent 90%), linear-gradient(to bottom, black, transparent)',
          }}
        />
        <div className="top-[10%] right-[-15%] absolute bg-[#c9b38a]/[0.045] blur-[100px] rounded-full w-[70vw] max-w-[900px] h-[70vw] pointer-events-none" />

        {/* Header */}
        <header className="z-10 relative flex justify-between items-center mx-auto px-5 sm:px-10 lg:px-16 py-6 lg:py-8 w-full max-w-[1600px]">
          <a href="#hero" className="font-semibold text-sm tracking-[0.3em]">
            {brand}
            <span className="text-[#c9b38a]">.</span>
          </a>

          <div className="hidden sm:flex items-center gap-8 text-[10px] text-white/50 uppercase tracking-[0.18em]">
            <a href="#features" className="hover:text-white transition-colors">
              Công nghệ
            </a>
            <a href="#product" className="hover:text-white transition-colors">
              Sản phẩm
            </a>
            <a href="#agency" className="hover:text-white transition-colors">
              Showroom
            </a>
          </div>

          <a
            href="#product"
            className="flex items-center gap-2 text-[#c9b38a] text-[10px] hover:text-white uppercase tracking-[0.15em] transition-colors"
          >
            Khám phá <ArrowUpRight size={14} />
          </a>
        </header>

        {/* Hero composition */}
        <div className="relative flex-1 items-center grid grid-cols-1 lg:grid-cols-12 mx-auto px-5 sm:px-10 lg:px-16 lg:py-10 pt-8 pb-12 w-full max-w-[1600px]">
          <div className="z-[3] relative order-2 lg:order-1 col-span-1 lg:col-span-6 -mt-4 lg:mt-0">
            <Eyebrow>Kitchen intelligence / 01</Eyebrow>

            <h1 className="mt-6 lg:mt-8 max-w-4xl font-heading font-medium text-[clamp(3.6rem,11vw,9.5rem)] sm:text-[clamp(5rem,10vw,9rem)] leading-[0.84] tracking-[-0.085em]">
              Công nghệ
              <br />
              <span className="text-[#c9b38a]">hiểu bạn.</span>
            </h1>

            <p className="mt-7 sm:mt-9 max-w-[440px] text-white/55 text-sm sm:text-base leading-7 sm:leading-8">
              {heroSubtitle}
            </p>

            <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
              <a
                href="#product"
                className="group inline-flex items-center gap-8 bg-[#c9b38a] hover:bg-white px-5 min-h-12 font-medium text-[#151511] text-xs transition-colors"
              >
                {primaryCta}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#agency"
                className="group inline-flex items-center gap-3 py-3 text-white/65 hover:text-white text-xs transition-colors"
              >
                {secondaryCta}
                <ArrowUpRight
                  size={14}
                  className="text-[#c9b38a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="flex items-center gap-5 mt-12 sm:mt-16 pt-5 border-white/10 border-t">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
                Designed for living
              </span>
              <span className="bg-white/20 w-8 h-px" />
              <span className="text-[10px] text-white/50 tracking-[0.12em]">
                {model} / Induction series
              </span>
            </div>
          </div>

          {/* Object floats across the right side and behind the title on mobile */}
          <div className="relative flex justify-center items-center order-1 lg:order-2 col-span-1 lg:col-span-6 -mx-3 lg:mx-0 mt-2 mb-2 lg:mb-0 min-h-[270px] sm:min-h-[380px] lg:min-h-[600px]">
            <div className="top-1/2 left-1/2 absolute border border-white/[0.06] rounded-full w-[90%] max-w-[620px] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="top-1/2 left-1/2 absolute border border-white/[0.05] rounded-full w-[72%] max-w-[500px] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <HobVisual
              interactive
              className="z-[2] w-[105%] sm:w-[100%] lg:w-[115%] max-w-[680px] lg:translate-x-[-4%]"
            />

            <div className="hidden right-[7%] bottom-[6%] z-[3] absolute xl:flex items-center gap-3 text-[9px] text-white/30 uppercase tracking-[0.18em]">
              <span className="bg-[#c9b38a]/50 w-8 h-px" />
              Interactive object
              <span className="text-[#c9b38a]">↗</span>
            </div>

            <div className="hidden top-[14%] left-[4%] lg:left-0 absolute sm:flex flex-col gap-1 text-[9px] text-white/30 uppercase tracking-[0.18em]">
              <span>01 — 04</span>
              <span className="text-white/15">Induction</span>
            </div>
          </div>

          <a
            href="#features"
            className="lg:bottom-8 lg:left-16 z-[3] lg:absolute relative flex items-center self-start gap-3 mt-8 sm:mt-12 lg:mt-0 text-[10px] text-white/35 hover:text-white uppercase tracking-[0.18em] transition-colors"
          >
            <ArrowDown size={13} className="text-[#c9b38a]" />
            Cuộn để khám phá
          </a>
        </div>

        <div className="hidden lg:block top-0 bottom-0 left-1/2 absolute bg-white/[0.035] w-px pointer-events-none" />
      </section>

      {/* FEATURES INTRO */}
      <section
        id="features"
        className="relative px-5 sm:px-10 lg:px-16 py-16 sm:py-24 lg:py-28 border-white/10 border-b"
      >
        <div className="gap-8 lg:gap-10 grid grid-cols-1 lg:grid-cols-12 mx-auto max-w-[1440px]">
          <div className="lg:col-span-3">
            <SectionLabel number="02">Inside Levia</SectionLabel>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-4xl font-heading text-white/85 text-3xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.055em]">
              Không chỉ là một chiếc bếp.
              <span className="text-white/35">
                {' '}
                Đó là cách công nghệ hiện diện trong từng thói quen nhỏ nhất.
              </span>
            </p>
          </div>
          <div className="flex lg:justify-end items-end lg:col-span-2">
            <span className="text-[10px] text-white/35 uppercase tracking-[0.18em]">
              04 principles
            </span>
          </div>
        </div>
      </section>

      {/* SCENE 01 — POWER */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 border-white/10 border-b min-h-dvh">
        <div className="flex-1 items-center gap-10 lg:gap-8 grid grid-cols-1 lg:grid-cols-12 mx-auto w-full max-w-[1440px]">
          <div className="relative flex justify-center items-center order-2 lg:order-1 lg:col-span-7 min-h-[280px] lg:min-h-[520px]">
            <div className="absolute inset-[10%] bg-[#c9b38a]/[0.04] blur-3xl rounded-full" />
            <HobVisual className="z-[1] w-full max-w-[680px]" />

            <div className="hidden sm:block bottom-[2%] left-0 absolute text-[9px] text-white/25 uppercase tracking-[0.2em]">
              <span className="text-[#c9b38a]">Fig. 01</span> / Power
              distribution
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <SceneHeading feature={features[0]} />

            <h3 className="mb-5 font-heading text-white/90 text-xl sm:text-2xl tracking-[-0.04em]">
              {features[0].heading}
            </h3>

            <p className="max-w-xl text-white/55 text-sm sm:text-base leading-7 sm:leading-8">
              {features[0].description}
            </p>

            <div className="gap-4 sm:gap-6 grid grid-cols-2 mt-9 sm:mt-12 pt-5 border-white/10 border-t">
              <div>
                <p className="font-heading text-[#c9b38a] text-4xl sm:text-5xl tracking-[-0.06em]">
                  5600<span className="ml-1 text-lg">W</span>
                </p>
                <p className="mt-2 text-[9px] text-white/35 sm:text-[10px] uppercase tracking-[0.17em]">
                  Total power
                </p>
              </div>
              <div>
                <p className="font-heading text-white text-4xl sm:text-5xl tracking-[-0.06em]">
                  100–265
                  <span className="ml-1 text-base">V</span>
                </p>
                <p className="mt-2 text-[9px] text-white/35 sm:text-[10px] uppercase tracking-[0.17em]">
                  Voltage stability
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mx-auto mt-10 pt-4 border-white/[0.07] border-t w-full max-w-[1440px]">
          <span className="text-[9px] text-white/25 uppercase tracking-[0.2em]">
            Levia / Performance
          </span>
          <span className="text-[9px] text-white/25 tracking-[0.16em]">
            01 — 04
          </span>
        </div>
      </section>

      {/* SCENE 02 — MATERIALS */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 border-white/10 border-b min-h-dvh overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="gap-8 lg:gap-8 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SceneHeading feature={features[1]} />
              <p className="max-w-sm text-white/45 text-sm sm:text-base leading-7 sm:leading-8">
                Mỗi lớp cấu thành đều có một nhiệm vụ riêng. Cùng tạo nên nền
                tảng bền bỉ, ổn định và sẵn sàng cho nhịp sống mỗi ngày.
              </p>
              <div className="hidden sm:flex items-center gap-3 mt-8 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                <Layers3 size={14} className="text-[#c9b38a]" />
                Three-layer architecture
              </div>
            </div>

            <div className="relative flex justify-center items-center lg:col-span-8 min-h-[300px] sm:min-h-[430px] lg:min-h-[540px]">
              <div className="top-1/2 left-1/2 absolute bg-white/[0.07] w-[90%] h-px -translate-x-1/2" />
              <HobVisual exploded className="z-[1] w-full max-w-[650px]" />

              <span className="right-0 bottom-2 absolute text-[9px] text-white/25 uppercase tracking-[0.2em]">
                Exploded view / LV79DI
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 mt-12 border-white/10 border-t">
            {layers.map((layer, index) => (
              <article
                key={layer.number}
                className={`group py-6 sm:px-5 sm:py-8 ${
                  index !== 0
                    ? 'border-t border-white/10 sm:border-l sm:border-t-0'
                    : ''
                } ${index === 0 ? 'sm:pl-0' : ''}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#c9b38a] text-[10px] tracking-[0.2em]">
                    {layer.number}
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-white/20 group-hover:text-[#c9b38a] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <h3 className="max-w-xs font-heading text-white text-xl sm:text-2xl tracking-[-0.04em]">
                  {layer.name}
                </h3>
                <p className="mt-3 max-w-sm text-white/45 text-sm leading-6">
                  {layer.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SCENE 03 — CONTROL */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 border-white/10 border-b min-h-dvh">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="items-center gap-8 lg:gap-8 grid grid-cols-1 lg:grid-cols-12">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <SceneHeading feature={features[2]} />

              <div className="flex items-start gap-4 py-6 border-white/10 border-t">
                <div className="mt-1 text-[#c9b38a]">
                  <Fingerprint size={19} strokeWidth={1.3} />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl tracking-[-0.035em]">
                    Điều khiển Slider Control điện cực
                  </h3>
                  <p className="mt-2 max-w-md text-white/45 text-sm leading-7">
                    Cảm ứng siêu nhạy bén, cho phép bạn trượt nhẹ ngón tay để
                    điều chỉnh nhiệt độ chính xác trong chớp mắt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-6 border-white/10 border-t">
                <div className="mt-1 text-[#c9b38a]">
                  <Cpu size={19} strokeWidth={1.3} />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl tracking-[-0.035em]">
                    Bố cục phím tối ưu bằng AI
                  </h3>
                  <p className="mt-2 max-w-md text-white/45 text-sm leading-7">
                    Vị trí các nút chức năng được định hình dựa trên thuật toán
                    phân tích hàng triệu thói quen nấu nướng, mang lại giao diện
                    thân thiện, chuẩn công thái học và dễ dàng thao tác.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center order-1 lg:order-2 lg:col-span-7 min-h-[280px] sm:min-h-[400px] lg:min-h-[550px]">
              <div className="absolute inset-[10%] bg-[#c9b38a]/[0.04] blur-3xl rounded-full" />
              <HobVisual className="z-[1] w-full max-w-[720px]" />

              <div className="hidden top-[5%] right-[2%] absolute sm:flex flex-col gap-2 text-right">
                <span className="text-[9px] text-white/25 uppercase tracking-[0.2em]">
                  Touch interface
                </span>
                <span className="font-heading text-[#c9b38a] text-xl">
                  01 — 09
                </span>
              </div>

              <div className="bottom-[2%] left-[5%] absolute flex items-center gap-2 text-[9px] text-white/25 uppercase tracking-[0.2em]">
                <Waves size={13} className="text-[#c9b38a]" />
                Precision in every touch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 04 — SAFETY */}
      <section className="relative flex flex-col justify-center px-5 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 border-white/10 border-b min-h-dvh overflow-hidden">
        <div className="top-[10%] right-[-15%] absolute bg-[#c9b38a]/[0.035] blur-[100px] rounded-full w-[60%] aspect-square pointer-events-none" />

        <div className="relative mx-auto w-full max-w-[1440px]">
          <SceneHeading feature={features[3]} />

          <div className="items-center gap-10 lg:gap-12 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-6 lg:mb-8 max-w-2xl lg:text-left text-center">
                <ShieldCheck
                  size={22}
                  strokeWidth={1.2}
                  className="mx-auto lg:mx-0 mb-4 text-[#c9b38a]"
                />
                <h3 className="font-heading text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-[-0.055em]">
                  AI giám sát an toàn
                  <span className="text-[#c9b38a]"> 24/7.</span>
                </h3>
                <p className="mt-3 text-white/45 text-sm sm:text-base leading-7">
                  Dự đoán và ngăn chặn mọi rủi ro.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[700px]">
                <HobVisual className="w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111210]/35 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="flex justify-center lg:justify-start items-center gap-3 mt-5 text-[9px] text-white/25 uppercase tracking-[0.2em]">
                <span className="bg-[#c9b38a]/50 w-8 h-px" />
                Protection by design
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex justify-between items-center mb-5 pb-4 border-white/10 border-b">
                <Eyebrow>Safety systems</Eyebrow>
                <span className="text-[10px] text-white/30">06 safeguards</span>
              </div>

              <ul>
                {safetyFeatures.map((item, index) => (
                  <li
                    key={item}
                    className="group flex items-center gap-4 py-5 border-white/[0.08] border-b"
                  >
                    <span className="flex justify-center items-center border border-white/10 group-hover:border-[#c9b38a]/50 rounded-full w-7 h-7 text-[9px] text-white/35 group-hover:text-[#c9b38a] transition-colors shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-white/65 group-hover:text-white text-sm sm:text-base leading-6 transition-colors">
                      {item}
                    </span>
                    <ShieldCheck
                      size={15}
                      strokeWidth={1.4}
                      className="text-[#c9b38a]/50 group-hover:text-[#c9b38a] transition-colors shrink-0"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center mt-14 pt-5 border-white/10 border-t">
            <span className="text-[9px] text-white/25 uppercase tracking-[0.2em]">
              Levia / Intelligent safety
            </span>
            <a
              href="#product"
              className="group flex items-center gap-2 text-[#c9b38a] text-[10px] hover:text-white uppercase tracking-[0.16em] transition-colors"
            >
              Khám phá LV79DI
              <ArrowDownRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCT + AGENCY placeholders for the next half */}
      <section
        id="product"
        className="relative px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36 border-white/10 border-b"
      >
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-12 mx-auto max-w-[1440px]">
          <div className="lg:col-span-3">
            <SectionLabel number="03">The collection</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <Eyebrow>Induction series / {model}</Eyebrow>
            <h2 className="mt-5 max-w-4xl font-heading text-5xl sm:text-7xl lg:text-8xl tracking-[-0.075em]">
              Tối giản trong thiết kế.
              <span className="text-white/35">
                {' '}
                Vượt trội trong trải nghiệm.
              </span>
            </h2>
            <a
              href="#agency"
              className="inline-flex items-center gap-6 mt-8 pb-3 border-[#c9b38a]/50 hover:border-white border-b text-[#c9b38a] hover:text-white text-xs transition-colors"
            >
              Khám phá bộ sưu tập <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section
        id="agency"
        className="relative px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-36"
      >
        <div className="gap-10 grid grid-cols-1 lg:grid-cols-12 mx-auto max-w-[1440px]">
          <div className="lg:col-span-3">
            <SectionLabel number="04">Visit Levia</SectionLabel>
          </div>
          <div className="lg:col-span-6">
            <Eyebrow>Experience it in person</Eyebrow>
            <h2 className="mt-5 font-heading text-5xl sm:text-7xl tracking-[-0.075em]">
              Cảm nhận sự khác biệt.
            </h2>
            <p className="mt-6 max-w-md text-white/45 text-sm sm:text-base leading-7">
              Khám phá trải nghiệm bếp Levia tại showroom gần bạn.
            </p>
          </div>
          <div className="flex lg:justify-end items-end lg:col-span-3">
            <a
              href="/agency"
              className="group flex items-center gap-8 px-5 border border-white/20 hover:border-[#c9b38a] min-h-12 hover:text-[#c9b38a] text-xs transition-colors"
            >
              Tìm showroom
              <ArrowUpRight
                size={15}
                className="text-[#c9b38a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      <footer className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 px-5 sm:px-10 lg:px-16 py-6 border-white/10 border-t text-[9px] text-white/30 uppercase tracking-[0.18em]">
        <span>{brand} / Kitchen intelligence</span>
        <span>Designed for living · Vietnam</span>
        <a href="#hero" className="hover:text-white transition-colors">
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
