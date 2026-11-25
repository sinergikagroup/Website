import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMPACT_METRICS, PAIN_POINTS } from '../data/sinergikaData';
import { AnimatedMetricValue, SinergikaMark, updateSpotlightVars } from './InteractivePrimitives';

gsap.registerPlugin(ScrollTrigger);

interface PainPointsSectionProps {
  onOpenModal: () => void;
}

const CHAOS_CHIPS = [
  { text: 'Data masih input manual di Excel?', x: -120, y: -64, r: -6 },
  { text: 'Sensor gudang mati tanpa alert?', x: 110, y: -58, r: 5 },
  { text: 'Aplikasi kaku tidak ikuti alur kerja?', x: -140, y: 12, r: 4 },
  { text: 'Mesin pabrik terputus dari ERP?', x: 135, y: 18, r: -4 },
  { text: 'Laporan produksi telat 2 hari?', x: -95, y: 74, r: -5 },
  { text: 'Vendor software & hardware terpisah?', x: 96, y: 70, r: 6 },
];

const CONVERGENCE_NODES = [
  { label: 'Custom ERP', angle: -90 },
  { label: 'Mobile Apps', angle: -30 },
  { label: 'IoT Gateway', angle: 30 },
  { label: 'Cloud API', angle: 90 },
  { label: 'Robotics 6-DOF', angle: 150 },
  { label: 'Live Telemetry', angle: 210 },
];

export function PainPointsSection({ onOpenModal }: PainPointsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const chaosStageRef = useRef<HTMLDivElement>(null);
  const limeCurtainRef = useRef<HTMLDivElement>(null);
  const convergenceRef = useRef<HTMLDivElement>(null);

  // Scroll-driven progress for Pain Points vertical line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.55'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  useEffect(() => {
    const chaosEl = chaosStageRef.current;
    const curtainEl = limeCurtainRef.current;
    const convEl = convergenceRef.current;
    if (!chaosEl || !curtainEl || !convEl) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      // 1) Chaos Stage: floating worry chips scatter outward & lime curtain slides up on scroll
      const chips = gsap.utils.toArray<HTMLElement>('.chaos-chip', chaosEl);
      const chaosTl = gsap.timeline({
        scrollTrigger: {
          trigger: chaosEl,
          start: 'top top',
          end: '+=95%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      chips.forEach((chip) => {
        const dx = Number(chip.dataset.scatterX || 0);
        const dy = Number(chip.dataset.scatterY || 0);
        const rot = Number(chip.dataset.scatterR || 0);
        chaosTl.to(
          chip,
          {
            x: dx,
            y: dy,
            rotation: rot * 2.4,
            opacity: 0.2,
            scale: 0.9,
            ease: 'power2.inOut',
          },
          0
        );
      });

      chaosTl.fromTo(
        curtainEl,
        { yPercent: 100 },
        { yPercent: 0, ease: 'power3.inOut' },
        0.35
      );

      // 2) Convergence Stage: Legacy cards converge into central hub & orbit nodes appear sequentially
      const legacyCards = gsap.utils.toArray<HTMLElement>('.legacy-card', convEl);
      const orbitNodes = gsap.utils.toArray<HTMLElement>('.orbit-node', convEl);
      const orbitRing = convEl.querySelector<HTMLElement>('.orbit-ring');

      const convTl = gsap.timeline({
        scrollTrigger: {
          trigger: convEl,
          start: 'top 62%',
          end: 'bottom 42%',
          scrub: 0.8,
        },
      });

      legacyCards.forEach((card) => {
        const tx = Number(card.dataset.convX || 0);
        const ty = Number(card.dataset.convY || 0);
        convTl.to(
          card,
          {
            x: tx,
            y: ty,
            scale: 0.4,
            opacity: 0,
            ease: 'power2.in',
          },
          0
        );
      });

      if (orbitRing) {
        convTl.fromTo(
          orbitRing,
          { scale: 0.5, opacity: 0, rotate: -30 },
          { scale: 1, opacity: 1, rotate: 0, ease: 'power2.out' },
          0.25
        );
      }

      convTl.fromTo(
        orbitNodes,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.08, ease: 'back.out(1.6)' },
        0.35
      );

      return () => {
        chaosTl.kill();
        convTl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 py-0">
      {/* Stage 1: Full-width Dark Chaos Cluster seamlessly receiving Hero's expanded orb */}
      <div
        ref={chaosStageRef}
        className="relative w-full overflow-hidden bg-[#0A2E5C] min-h-[76vh] flex items-center px-6 py-20 sm:px-10 sm:py-28 text-white"
      >
        {/* Ambient radial glow inside dark stage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,168,132,0.24),transparent_65%)]"
        />

        <div className="relative z-10 mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 text-center lg:text-left">
            <p className="text-xs font-semibold tracking-wide text-[#A3E635]">
              Sebelum Terintegrasi
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Terlalu banyak hambatan
            </h2>
          </div>

          {/* Central floating cluster framed by large ( ) brackets */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[220px] sm:min-h-[260px]">
            <span
              aria-hidden="true"
              className="select-none text-[6rem] sm:text-[9rem] font-extralight leading-none text-[#00A884]/45 mr-1 sm:mr-3"
            >
              (
            </span>

            <div className="relative flex flex-wrap items-center justify-center gap-2.5 max-w-md py-4">
              {CHAOS_CHIPS.map((chip) => (
                <div
                  key={chip.text}
                  data-scatter-x={chip.x}
                  data-scatter-y={chip.y}
                  data-scatter-r={chip.r}
                  style={{ transform: `rotate(${chip.r * 0.45}deg)` }}
                  className="chaos-chip rounded-full bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0D1B2A] shadow-md will-change-transform"
                >
                  {chip.text}
                </div>
              ))}
            </div>

            <span
              aria-hidden="true"
              className="select-none text-[6rem] sm:text-[9rem] font-extralight leading-none text-[#00A884]/45 ml-1 sm:ml-3"
            >
              )
            </span>
          </div>

          <div className="lg:col-span-3 text-center lg:text-right">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              yang memecah fokus tim Anda.
            </h2>
          </div>
        </div>

        {/* Full-width Sliding Lime Curtain Panel */}
        <div
          ref={limeCurtainRef}
          aria-hidden="true"
          className="hidden lg:flex absolute inset-0 z-20 items-center justify-center bg-[#A3E635] px-8 text-center"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-wide text-[#0A2E5C]">
              Satu Arsitektur Terpadu
            </p>
            <div className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0D1B2A]">
              Itulah mengapa Sinergika hadir.
            </div>
          </div>
        </div>
      </div>

      {/* Stage 2: Full-width Pain Points & Impact Metrics Band (unboxed edge-to-edge) */}
      <div
        onPointerMove={updateSpotlightVars}
        className="spotlight-surface w-full border-b border-neutral-200/80 bg-white/90 py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column: Bold problem framing */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-neutral-500">
                  Tantangan Operasional
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0D1B2A] [text-wrap:balance]">
                  Teknologi seharusnya mempercepat kerja, bukan menambah kerumitan.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-600">
                  Banyak bisnis terjebak antara perangkat lunak yang terpisah-pisah dan mesin
                  lapangan yang berjalan tanpa data. Sinergika menyatukan keduanya dalam satu
                  arsitektur yang ramping.
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={onOpenModal}
                  data-cursor-label="Diskusi"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2E5C] underline decoration-[#00A884] decoration-2 underline-offset-4 transition-colors hover:text-[#00A884] cursor-pointer"
                >
                  <span>Diskusikan hambatan sistem Anda</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right column: Scroll-linked hairline-separated list */}
            <div className="lg:col-span-7 relative lg:pl-6">
              <div
                aria-hidden="true"
                className="hidden lg:block absolute left-0 top-1 bottom-1 w-[2px] bg-neutral-100 rounded-full overflow-hidden"
              >
                <motion.div
                  style={{ scaleY: lineScaleY }}
                  className="h-full w-full origin-top bg-gradient-to-b from-[#0A2E5C] via-[#00A884] to-[#A3E635]"
                />
              </div>

              <div className="divide-y divide-neutral-200">
                {PAIN_POINTS.map((item, idx) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0.35, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.55 }}
                    transition={{
                      duration: 0.42,
                      delay: idx * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="py-5 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start"
                  >
                    <span className="sm:col-span-2 font-mono text-sm font-semibold text-[#00A884] tabular-nums">
                      {item.number}
                    </span>
                    <div className="sm:col-span-10">
                      <h3 className="text-lg font-bold tracking-tight text-[#0D1B2A]">
                        {item.problem}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Adjacent Proof Metrics Row with animated tabular count-up */}
          <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {IMPACT_METRICS.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1.5"
              >
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A2E5C] tabular-nums">
                  <AnimatedMetricValue value={metric.value} />
                </div>
                <div className="text-sm font-semibold text-[#0D1B2A]">{metric.label}</div>
                <p className="text-xs leading-relaxed text-neutral-500">{metric.context}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage 3: Full-width Unboxed Unified Convergence Ring directly on Blueprint Grid */}
      <div
        ref={convergenceRef}
        className="relative w-full overflow-hidden py-14 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Konvergensi Ekosistem
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D1B2A]">
              Dari sistem terpisah menjadi satu pusat kendali.
            </h3>
          </div>

          <div className="relative mt-10 flex items-center justify-center min-h-[300px] sm:min-h-[340px]">
            {/* Converging disconnected legacy cards */}
            <div
              data-conv-x="150"
              data-conv-y="80"
              className="legacy-card hidden lg:block absolute left-4 top-6 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-600 shadow-xs"
            >
              Spreadsheet Manual
            </div>
            <div
              data-conv-x="-150"
              data-conv-y="80"
              className="legacy-card hidden lg:block absolute right-4 top-6 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-600 shadow-xs"
            >
              Aplikasi Generik Kaku
            </div>
            <div
              data-conv-x="150"
              data-conv-y="-80"
              className="legacy-card hidden lg:block absolute left-4 bottom-6 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-600 shadow-xs"
            >
              Sensor Lapangan Terisolasi
            </div>
            <div
              data-conv-x="-150"
              data-conv-y="-80"
              className="legacy-card hidden lg:block absolute right-4 bottom-6 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold text-neutral-600 shadow-xs"
            >
              Mesin Produksi Offline
            </div>

            {/* Dashed circular convergence ring */}
            <div className="orbit-ring relative flex h-64 w-64 sm:h-72 sm:w-72 items-center justify-center rounded-full border-2 border-dashed border-[#00A884]/55">
              {/* 6 Connected Orbit Nodes */}
              {CONVERGENCE_NODES.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const radiusPct = 49;
                const leftPct = 50 + Math.cos(rad) * radiusPct;
                const topPct = 50 + Math.sin(rad) * radiusPct;
                return (
                  <div
                    key={node.label}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="orbit-node absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0A2E5C]/15 bg-white px-3 py-1.5 text-[11px] font-bold text-[#0A2E5C] shadow-sm whitespace-nowrap"
                  >
                    {node.label}
                  </div>
                );
              })}

              {/* Center Hub Button */}
              <button
                type="button"
                onClick={onOpenModal}
                data-cursor-label="Mulai"
                className="relative z-10 flex h-28 w-28 sm:h-32 sm:w-32 flex-col items-center justify-center gap-1.5 rounded-full bg-[#0A2E5C] text-white shadow-[0_16px_38px_rgba(10,46,92,0.24)] transition-transform duration-150 hover:scale-105 cursor-pointer"
              >
                <span className="h-9 w-11 rounded-lg bg-white p-1 flex items-center justify-center">
                  <SinergikaMark className="w-9 h-[25px]" />
                </span>
                <span className="text-[11px] font-extrabold tracking-tight text-[#A3E635]">
                  SINERGIKA
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
