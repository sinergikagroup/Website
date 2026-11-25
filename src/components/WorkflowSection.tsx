import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { WORKFLOW_STEPS } from '../data/sinergikaData';
import { updateSpotlightVars } from './InteractivePrimitives';

gsap.registerPlugin(ScrollTrigger);

const ARC_STAGE_COLORS = ['#0A2E5C', '#00A884', '#0284C7', '#65A30D'];

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [userLocked, setUserLocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const arcPathRef = useRef<SVGPathElement>(null);
  const userLockedRef = useRef(false);
  userLockedRef.current = userLocked;

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const pathEl = arcPathRef.current;
    if (!sectionEl) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 68%',
        end: 'bottom 42%',
        scrub: true,
        onUpdate: (self) => {
          if (!userLockedRef.current) {
            const idx = Math.min(3, Math.max(0, Math.floor(self.progress * 3.99)));
            setActiveStep(idx);
          }
          if (pathEl) {
            gsap.to(pathEl, {
              strokeDashoffset: -self.progress * 180,
              duration: 0.1,
              overwrite: 'auto',
            });
          }
        },
      });

      return () => trigger.kill();
    });

    return () => mm.revert();
  }, []);

  const arcColor = ARC_STAGE_COLORS[activeStep] ?? ARC_STAGE_COLORS[0];

  return (
    <section
      id="alur-kerja"
      ref={sectionRef}
      onMouseLeave={() => setUserLocked(false)}
      className="relative z-10 py-16 sm:py-24 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Metodologi Eksekusi
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B2A] [text-wrap:balance]">
              Dari konsep hingga terpasang di lapangan.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-neutral-600">
            Empat tahapan terukur yang menjaga transparansi jadwal, anggaran, dan kualitas teknis
            setiap proyek.
          </p>
        </motion.div>

        {/* Desktop Curved Dashed Roadmap Arc SVG */}
        <div className="relative mt-10 lg:mt-14">
          <svg
            aria-hidden="true"
            viewBox="0 0 1120 110"
            className="hidden lg:block pointer-events-none absolute -top-10 inset-x-0 w-full h-28 overflow-visible"
            fill="none"
          >
            <path
              ref={arcPathRef}
              d="M 40 92 Q 560 -24 1080 92"
              stroke={arcColor}
              strokeWidth="2.5"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5 pt-2">
            {WORKFLOW_STEPS.map((step, index) => {
              const isSelected = activeStep === index;
              const delta = index - activeStep;
              // Tangent tilt & subtle arc offset on desktop while keeping all 4 cards crisp & readable
              const desktopRotate = delta * 2.2;
              const desktopArcY = Math.abs(delta) * 10 - (isSelected ? 8 : 0);

              return (
                <motion.div
                  key={step.number}
                  animate={{
                    y: typeof window !== 'undefined' && window.innerWidth >= 1024 ? desktopArcY : 0,
                    rotate:
                      typeof window !== 'undefined' && window.innerWidth >= 1024 ? desktopRotate : 0,
                    scale: isSelected ? 1.02 : 0.985,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  onMouseEnter={() => {
                    setUserLocked(true);
                    setActiveStep(index);
                  }}
                  onClick={() => {
                    setUserLocked(true);
                    setActiveStep(index);
                  }}
                  onPointerMove={updateSpotlightVars}
                  role="button"
                  tabIndex={0}
                  data-cursor-label={`Tahap ${step.number}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setUserLocked(true);
                      setActiveStep(index);
                    }
                  }}
                  aria-pressed={isSelected}
                  className={`spotlight-surface relative flex flex-col justify-between rounded-2xl border p-6 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] will-change-transform ${
                    isSelected
                      ? 'border-[#0A2E5C] bg-white shadow-[0_18px_42px_rgba(10,46,92,0.12)]'
                      : 'border-neutral-200 bg-white/80 hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="workflow-active-bar"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                      style={{ backgroundColor: arcColor }}
                      className="absolute inset-x-6 top-0 h-[3px] rounded-b-full"
                    />
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold tabular-nums transition-colors ${
                          isSelected
                            ? index % 2 === 0
                              ? 'bg-[#0A2E5C] text-[#A3E635]'
                              : 'bg-[#00A884] text-white'
                            : 'bg-[#F4F4F2] text-[#0A2E5C]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className="text-xs font-medium text-neutral-500">{step.duration}</span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold tracking-tight text-[#0D1B2A]">
                      {step.number}. {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-200">
                    <div className="text-xs font-semibold text-neutral-500">Keluaran Utama</div>
                    <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#0D1B2A]">
                      {step.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#00A884]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
