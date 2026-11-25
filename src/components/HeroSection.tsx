import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MagneticWrap, SinergikaMark } from './InteractivePrimitives';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HEADLINE_WORDS = [
  'Menghubungkan',
  'kode,',
  'perangkat,',
  'dan',
  'otomasi',
  'masa',
  'depan.',
];

type MosaicShape =
  | 'circle'
  | 'quarter-br'
  | 'quarter-tl'
  | 'quarter-tr'
  | 'quarter-bl'
  | 'half-bottom'
  | 'half-top'
  | 'half-left'
  | 'half-right'
  | 'triangle-tr'
  | 'ring'
  | 'stripes'
  | 'bars'
  | 'dots'
  | 'arch'
  | 'center-orb';

interface MosaicTile {
  bg: string;
  fg: string;
  accent?: string;
  shape: MosaicShape;
  anim: string;
}

const HERO_MOSAIC_TILES: MosaicTile[] = [
  // Row 1 (7 columns)
  { bg: '#A3E635', fg: '#0A2E5C', shape: 'quarter-br', anim: 'animate-geo-swing' },
  { bg: '#9FC3D6', fg: '#0A2E5C', shape: 'half-bottom', anim: 'animate-geo-drift-y' },
  { bg: '#0A2E5C', fg: '#00A884', accent: '#A3E635', shape: 'stripes', anim: 'animate-geo-drift-x' },
  { bg: '#FFFFFF', fg: '#FB923C', shape: 'triangle-tr', anim: 'animate-geo-swing' },
  { bg: '#00A884', fg: '#A3E635', shape: 'half-left', anim: 'animate-geo-drift-x' },
  { bg: '#9FC3D6', fg: '#FFFFFF', shape: 'quarter-tl', anim: 'animate-geo-spin' },
  { bg: '#FB923C', fg: '#A3E635', shape: 'circle', anim: 'animate-geo-drift-y' },

  // Row 2 (7 columns — index 10 is center circle orb)
  { bg: '#A3E635', fg: '#0A2E5C', shape: 'arch', anim: 'animate-geo-swing' },
  { bg: '#00A884', fg: '#0A2E5C', shape: 'quarter-bl', anim: 'animate-geo-spin-rev' },
  { bg: '#FFFFFF', fg: '#0A2E5C', accent: '#00A884', shape: 'ring', anim: 'animate-geo-spin' },
  { bg: 'transparent', fg: '#0A2E5C', shape: 'center-orb', anim: '' },
  { bg: '#0A2E5C', fg: '#00A884', accent: '#A3E635', shape: 'bars', anim: 'animate-geo-drift-y' },
  { bg: '#A3E635', fg: '#00A884', shape: 'quarter-tr', anim: 'animate-geo-swing' },
  { bg: '#9FC3D6', fg: '#0A2E5C', shape: 'circle', anim: 'animate-geo-drift-x' },

  // Row 3 (7 columns)
  { bg: '#0A2E5C', fg: '#A3E635', shape: 'half-right', anim: 'animate-geo-drift-x' },
  { bg: '#FB923C', fg: '#FFFFFF', shape: 'quarter-br', anim: 'animate-geo-spin' },
  { bg: '#A3E635', fg: '#00A884', shape: 'circle', anim: 'animate-geo-drift-y' },
  { bg: '#FFFFFF', fg: '#0A2E5C', accent: '#FB923C', shape: 'dots', anim: 'animate-geo-spin-rev' },
  { bg: '#00A884', fg: '#FFFFFF', shape: 'half-top', anim: 'animate-geo-swing' },
  { bg: '#9FC3D6', fg: '#A3E635', shape: 'triangle-tr', anim: 'animate-geo-drift-x' },
  { bg: '#0A2E5C', fg: '#FB923C', shape: 'circle', anim: 'animate-geo-drift-y' },
];

function MosaicTileGraphic({ tile }: { tile: MosaicTile }) {
  switch (tile.shape) {
    case 'circle':
      return (
        <div
          className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'quarter-br':
      return (
        <div
          className={`absolute -bottom-1 -right-1 h-4/5 w-4/5 rounded-tl-full origin-bottom-right will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'quarter-tl':
      return (
        <div
          className={`absolute -top-1 -left-1 h-4/5 w-4/5 rounded-br-full origin-top-left will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'quarter-tr':
      return (
        <div
          className={`absolute -top-1 -right-1 h-4/5 w-4/5 rounded-bl-full origin-top-right will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'quarter-bl':
      return (
        <div
          className={`absolute -bottom-1 -left-1 h-4/5 w-4/5 rounded-tr-full origin-bottom-left will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'half-bottom':
      return (
        <div
          className={`absolute bottom-0 inset-x-2 h-1/2 rounded-t-full will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'half-top':
      return (
        <div
          className={`absolute top-0 inset-x-2 h-1/2 rounded-b-full will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'half-left':
      return (
        <div
          className={`absolute left-0 inset-y-2 w-1/2 rounded-r-full will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'half-right':
      return (
        <div
          className={`absolute right-0 inset-y-2 w-1/2 rounded-l-full will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg }}
        />
      );
    case 'triangle-tr':
      return (
        <div
          className={`h-[88%] w-[88%] will-change-transform ${tile.anim}`}
          style={{ backgroundColor: tile.fg, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        />
      );
    case 'ring':
      return (
        <div
          className={`h-14 w-14 rounded-full border-[4px] border-dashed flex items-center justify-center will-change-transform ${tile.anim}`}
          style={{ borderColor: tile.fg }}
        >
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tile.accent ?? tile.fg }} />
        </div>
      );
    case 'stripes':
      return (
        <div className={`flex gap-1.5 will-change-transform ${tile.anim}`}>
          <span className="h-14 w-2.5 -skew-x-12 rounded-sm bg-white" />
          <span className="h-14 w-2.5 -skew-x-12 rounded-sm" style={{ backgroundColor: tile.fg }} />
          <span className="h-14 w-2.5 -skew-x-12 rounded-sm" style={{ backgroundColor: tile.accent ?? '#A3E635' }} />
        </div>
      );
    case 'bars':
      return (
        <div className={`flex items-end gap-1.5 h-14 will-change-transform ${tile.anim}`}>
          <span className="w-2.5 h-1/2 rounded-sm bg-white" />
          <span className="w-2.5 h-full rounded-sm" style={{ backgroundColor: tile.fg }} />
          <span className="w-2.5 h-3/4 rounded-sm" style={{ backgroundColor: tile.accent ?? '#A3E635' }} />
        </div>
      );
    case 'dots':
      return (
        <div className={`grid grid-cols-3 gap-1.5 will-change-transform ${tile.anim}`}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <span
              key={idx}
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  idx === 4 ? tile.accent ?? '#FB923C' : idx % 2 === 0 ? tile.fg : '#00A884',
              }}
            />
          ))}
        </div>
      );
    case 'arch':
      return (
        <div
          className={`h-11 w-14 rounded-t-full border-[9px] border-b-0 will-change-transform ${tile.anim}`}
          style={{ borderColor: tile.fg }}
        />
      );
    default:
      return null;
  }
}

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const mosaicStageRef = useRef<HTMLDivElement>(null);
  const orbBackdropRef = useRef<HTMLDivElement>(null);
  const centerOrbRef = useRef<HTMLDivElement>(null);

  // Zero-rerender pointer tracking using MotionValue + Spring
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 150, damping: 22, mass: 0.45 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 22, mass: 0.45 });

  const shiftXPos = useTransform(smoothX, (v) => v * 0.55);
  const shiftXNeg = useTransform(smoothX, (v) => -v * 0.55);
  const shiftYPos = useTransform(smoothY, (v) => v * 0.55);
  const shiftYNeg = useTransform(smoothY, (v) => -v * 0.55);

  // Scroll choreography: outer tiles collapse inward while center circle expands into full-bleed #0A2E5C bg
  useEffect(() => {
    const stageEl = mosaicStageRef.current;
    const backdropEl = orbBackdropRef.current;
    const orbEl = centerOrbRef.current;
    if (!stageEl || !backdropEl || !orbEl) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const outerTiles = gsap.utils.toArray<HTMLElement>('.hero-mosaic-tile', stageEl);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageEl,
          start: 'top 18%',
          end: '+=105%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
        },
      });

      outerTiles.forEach((tile) => {
        const col = Number(tile.dataset.col || 3);
        const row = Number(tile.dataset.row || 1);
        const dx = (3 - col) * 145;
        const dy = (1 - row) * 110;
        tl.to(
          tile,
          {
            x: dx,
            y: dy,
            scale: 0.14,
            opacity: 0,
            rotation: (3 - col) * 14,
            ease: 'power2.inOut',
          },
          0
        );
      });

      // Center emblem pulses larger first, then yields cleanly as dark circle takes over full screen
      tl.to(
        orbEl,
        {
          scale: 1.32,
          ease: 'power2.out',
          duration: 0.42,
        },
        0
      ).to(
        orbEl,
        {
          scale: 0.72,
          opacity: 0,
          ease: 'power2.in',
          duration: 0.3,
        },
        0.5
      );

      // Expanding round circle fills the entire stage width/height into #0A2E5C for the next section
      tl.fromTo(
        backdropEl,
        { scale: 1 },
        {
          scale: 34,
          ease: 'power2.inOut',
          duration: 0.68,
        },
        0.32
      );

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(normX * 26);
    pointerY.set(normY * 14);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="beranda"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative z-10 overflow-x-clip pt-28 sm:pt-36 pb-0"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Quiet unboxed kicker metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-neutral-600"
        >
          <span>Rekayasa Perangkat Lunak</span>
          <span aria-hidden="true">·</span>
          <span>Sistem IoT</span>
          <span aria-hidden="true">·</span>
          <span>Otomasi Robotika</span>
          <span aria-hidden="true">·</span>
          <span>Jakarta &amp; Bandung</span>
        </motion.div>

        {/* Masked staggered word reveal on Hero Headline */}
        <h1 className="max-w-5xl text-[clamp(2.35rem,5.4vw,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.035em] text-[#0D1B2A] [text-wrap:balance]">
          {HEADLINE_WORDS.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.06em]"
            >
              <motion.span
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.56,
                  delay: 0.44 + idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block will-change-transform"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Sub-headline & primary action row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end"
        >
          <p className="lg:col-span-7 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-700">
            Sinergika merancang dan membangun{' '}
            <strong className="font-semibold text-[#0A2E5C]">custom software</strong>, aplikasi
            mobile/web, jaringan sensor{' '}
            <strong className="font-semibold text-[#0A2E5C]">IoT</strong>, serta sistem{' '}
            <strong className="font-semibold text-[#0A2E5C]">robotika presisi</strong> yang bekerja
            dalam satu ekosistem terpadu untuk industri dan bisnis modern.
          </p>

          <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
            <MagneticWrap>
              <button
                type="button"
                onClick={onOpenModal}
                data-cursor-label="Mulai"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0A2E5C] px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-150 hover:bg-[#072247] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
              >
                <span>Konsultasi Proyek</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00A884] text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </MagneticWrap>

            <a
              href="#simulasi"
              data-cursor-label="Uji"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3.5 text-sm sm:text-base font-semibold text-[#0D1B2A] transition-colors duration-150 hover:border-[#0A2E5C] hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C]"
            >
              <span>Coba Simulasi</span>
              <ArrowDownRight className="h-4 w-4 text-[#00A884]" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Full-width Seamless 3×7 Continuous-Motion Geometric Mosaic (No card wrapper, no corner labels) */}
      <div
        ref={mosaicStageRef}
        aria-hidden="true"
        className="relative mt-14 sm:mt-16 w-full overflow-hidden py-8 sm:py-12 px-2 sm:px-5"
      >
        <div className="relative grid grid-cols-3 sm:grid-cols-7 gap-2 sm:gap-3 w-full">
          {HERO_MOSAIC_TILES.map((tile, idx) => {
            const col = idx % 7;
            const row = Math.floor(idx / 7);

            if (tile.shape === 'center-orb') {
              return (
                <div
                  key={idx}
                  className="relative h-24 sm:h-28 lg:h-32 flex items-center justify-center"
                >
                  {/* Expanding dark navy orb backdrop that scales into the next section's space */}
                  <div
                    ref={orbBackdropRef}
                    className="pointer-events-none absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#0A2E5C] will-change-transform z-10"
                  />

                  {/* Center Sinergika Mark Orb */}
                  <div
                    ref={centerOrbRef}
                    className="relative z-20 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-[#00A884] bg-white shadow-[0_12px_34px_rgba(10,46,92,0.22)] will-change-transform"
                  >
                    <SinergikaMark className="w-11 h-[31px] sm:w-12 sm:h-[33px]" />
                  </div>
                </div>
              );
            }

            const parallaxX = col % 2 === 0 ? shiftXPos : shiftXNeg;
            const parallaxY = row % 2 === 0 ? shiftYPos : shiftYNeg;

            return (
              <motion.div
                key={idx}
                data-col={col}
                data-row={row}
                animate={{
                  y: [0, row % 2 === 0 ? -5 : 5, 0],
                  x: [0, col % 2 === 0 ? 4 : -4, 0],
                }}
                transition={{
                  duration: 4.5 + (idx % 5) * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (idx % 7) * 0.18,
                }}
                whileHover={{ scale: 1.04, zIndex: 15 }}
                style={{ backgroundColor: tile.bg }}
                className="hero-mosaic-tile relative h-24 sm:h-28 lg:h-32 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_2px_10px_rgba(10,46,92,0.04)] will-change-transform"
              >
                <motion.div
                  style={{ x: parallaxX, y: parallaxY }}
                  className="relative h-full w-full flex items-center justify-center"
                >
                  <MosaicTileGraphic tile={tile} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
