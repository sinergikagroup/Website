import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Code2, Cpu, Bot, Smartphone } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { SERVICES, type ProjectCategory, type ServiceItem } from '../data/sinergikaData';
import { MagneticWrap, updateSpotlightVars } from './InteractivePrimitives';

gsap.registerPlugin(ScrollTrigger);

interface ServicesBentoProps {
  onSelectCategoryAndConsult: (category: ProjectCategory) => void;
}

const ICON_MAP: Record<ProjectCategory, typeof Code2> = {
  Software: Code2,
  Apps: Smartphone,
  IoT: Cpu,
  Robotics: Bot,
};

interface BentoCardProps {
  service: ServiceItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}

function BentoCard({ service, index, isActive, onActivate }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 260, damping: 24 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 260, damping: 24 });

  const Icon = ICON_MAP[service.id];
  const accentBg = service.accent === 'lime' ? 'bg-[#A3E635]' : 'bg-[#00A884]';
  const accentText = service.accent === 'lime' ? 'text-[#0D1B2A]' : 'text-white';

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateSpotlightVars(e);
    if (e.pointerType !== 'mouse') return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(normX * 4.5);
    rotateX.set(-normY * 4.5);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      data-bento-index={index}
      onMouseEnter={onActivate}
      onClick={onActivate}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      role="button"
      tabIndex={0}
      data-cursor-label="Detail"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      aria-pressed={isActive}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 900,
      }}
      className={`bento-stagger-card ${service.span} spotlight-surface group relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 text-left transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] will-change-transform ${
        isActive
          ? 'border-[#0A2E5C] bg-[#0A2E5C] text-white shadow-[0_20px_44px_rgba(10,46,92,0.18)]'
          : 'border-neutral-200 bg-white text-[#0D1B2A] hover:border-[#00A884]/60'
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="service-active-ring"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#00A884]/55"
        />
      )}

      <div>
        {/* Top row: Index + functional icon */}
        <div className="flex items-center justify-between gap-4">
          <span
            className={`font-mono text-xs font-semibold tabular-nums ${
              isActive ? 'text-white/70' : 'text-neutral-500'
            }`}
          >
            {service.index} · {service.id}
          </span>
          <motion.span
            animate={isActive ? { scale: 1.06, rotate: -4 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150 ${
              isActive ? `${accentBg} ${accentText}` : 'bg-[#F4F4F2] text-[#0A2E5C]'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        </div>

        {/* Title & Summary */}
        <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight">
          {service.title}
        </h3>
        <p
          className={`mt-1 text-sm font-medium ${
            isActive ? 'text-white/75' : 'text-neutral-500'
          }`}
        >
          {service.subtitle}
        </p>
        <p
          className={`mt-4 text-sm sm:text-base leading-relaxed ${
            isActive ? 'text-white/90' : 'text-neutral-600'
          }`}
        >
          {service.summary}
        </p>
      </div>

      {/* Unboxed tech list & interactive prompt */}
      <div
        className={`mt-8 pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
          isActive ? 'border-white/15' : 'border-neutral-200'
        }`}
      >
        <div
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs ${
            isActive ? 'text-white/75' : 'text-neutral-500'
          }`}
        >
          {service.technologies.slice(0, 4).map((tech, idx) => (
            <span key={tech} className="inline-flex items-center gap-2">
              <span>{tech}</span>
              {idx < 3 && <span aria-hidden="true">·</span>}
            </span>
          ))}
        </div>

        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${
            isActive
              ? service.accent === 'lime'
                ? 'text-[#A3E635]'
                : 'text-[#5EEAD4]'
              : 'text-[#0A2E5C]'
          }`}
        >
          <span>{isActive ? 'Detail Aktif' : 'Lihat Detail'}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  );
}

export function ServicesBento({ onSelectCategoryAndConsult }: ServicesBentoProps) {
  const [activeId, setActiveId] = useState<ProjectCategory>('Software');
  const gridRef = useRef<HTMLDivElement>(null);

  const activeService: ServiceItem =
    SERVICES.find((service) => service.id === activeId) ?? SERVICES[0];

  // Scroll-scrubbed staggered deck tilt & settle into Bento Grid
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.bento-stagger-card', gridEl);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridEl,
          start: 'top 86%',
          end: 'top 28%',
          scrub: 0.75,
        },
      });

      cards.forEach((card, i) => {
        const tiltStart = i % 2 === 0 ? -2.2 : 2.2;
        tl.fromTo(
          card,
          { y: 36 + i * 10, rotation: tiltStart, scale: 0.96 },
          { y: 0, rotation: 0, scale: 1, ease: 'power2.out' },
          i * 0.08
        );
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="layanan" className="relative z-10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Kapabilitas Inti
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B2A] [text-wrap:balance]">
              Empat pilar rekayasa terpadu.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-neutral-600">
            Arahkan kursor atau klik salah satu kartu layanan untuk meninjau teknologi inti dan
            contoh penerapannya.
          </p>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {SERVICES.map((service, index) => (
            <BentoCard
              key={service.id}
              service={service}
              index={index}
              isActive={activeId === service.id}
              onActivate={() => setActiveId(service.id)}
            />
          ))}
        </div>

        {/* Dynamic Spotlight Detail Drawer below Bento Grid */}
        <div
          aria-live="polite"
          className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
                  <span>Spesifikasi Layanan Terpilih</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#0A2E5C]">{activeService.title}</span>
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-[#0D1B2A]">
                  Teknologi &amp; Arsitektur {activeService.id}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                  Tumpukan teknologi yang kami sesuaikan dengan beban kerja dan standar keamanan
                  infrastruktur Anda:
                </p>

                {/* Clean unboxed typographic stack list with staggered fade */}
                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs sm:text-sm font-medium text-[#0A2E5C]">
                  {activeService.technologies.map((tech, idx) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="inline-flex items-center gap-2.5"
                    >
                      <span>{tech}</span>
                      {idx < activeService.technologies.length - 1 && (
                        <span className="text-[#00A884]" aria-hidden="true">
                          /
                        </span>
                      )}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-6">
                  <MagneticWrap>
                    <button
                      type="button"
                      onClick={() => onSelectCategoryAndConsult(activeService.id)}
                      data-cursor-label="Konsultasi"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-[#0A2E5C] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-150 hover:bg-[#072247] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
                    >
                      <span>Konsultasi Proyek {activeService.id}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          activeService.accent === 'lime'
                            ? 'bg-[#A3E635] text-[#0D1B2A]'
                            : 'bg-[#00A884] text-white'
                        }`}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  </MagneticWrap>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:border-l lg:border-neutral-200 lg:pl-8">
                {activeService.useCases.map((useCase, idx) => (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.06 }}
                    className="space-y-2"
                  >
                    <div className="font-mono text-xs font-semibold text-[#00A884] tabular-nums">
                      Studi Kasus 0{idx + 1}
                    </div>
                    <h4 className="text-base font-bold tracking-tight text-[#0D1B2A]">
                      {useCase.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-600">{useCase.outcome}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
