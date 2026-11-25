import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ProjectCategory } from '../data/sinergikaData';
import { MagneticWrap } from './InteractivePrimitives';

gsap.registerPlugin(ScrollTrigger);

interface FooterSectionProps {
  onOpenModal: () => void;
}

const CONFETTI_COLORS = ['#0A2E5C', '#00A884', '#A3E635', '#FB923C', '#9FC3D6'];

const CLOCK_CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const radius = 84 + (i % 3) * 14;
  return {
    id: i,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: i % 2 === 0 ? 7 : 5,
    isSquare: i % 3 === 0,
  };
});

const CLOSING_WORDS = [
  { text: 'Dirancang', x: -70, y: -26, r: -10 },
  { text: 'presisi,', x: 40, y: 24, r: 8 },
  { text: 'terhubung', x: -50, y: 32, r: -6 },
  { text: 'penuh', x: 65, y: -22, r: 9 },
  { text: 'untuk', x: -35, y: -30, r: -5 },
  { text: 'Anda.', x: 55, y: 26, r: 7 },
];

export function FooterSection({ onOpenModal }: FooterSectionProps) {
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = closingRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const hourHand = el.querySelector<HTMLElement>('.clock-hour-hand');
      const minHand = el.querySelector<HTMLElement>('.clock-min-hand');
      const confettiItems = gsap.utils.toArray<HTMLElement>('.clock-confetti-dot', el);
      const scatterWords = gsap.utils.toArray<HTMLElement>('.assemble-word', el);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          end: 'bottom 52%',
          scrub: 0.75,
        },
      });

      if (hourHand) tl.to(hourHand, { rotation: 165, ease: 'none' }, 0);
      if (minHand) tl.to(minHand, { rotation: 480, ease: 'none' }, 0);

      confettiItems.forEach((dot) => {
        tl.to(
          dot,
          {
            scale: 1.15,
            x: Number(dot.dataset.pullX || 0) * 0.68,
            y: Number(dot.dataset.pullY || 0) * 0.68,
            ease: 'power2.out',
          },
          0
        );
      });

      scatterWords.forEach((word) => {
        const sx = Number(word.dataset.scatterX || 0);
        const sy = Number(word.dataset.scatterY || 0);
        const sr = Number(word.dataset.scatterR || 0);
        tl.fromTo(
          word,
          { x: sx, y: sy, rotation: sr, opacity: 0.35 },
          { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'power3.out' },
          0
        );
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <footer className="pb-12 pt-4 sm:pt-8">
      {/* Full-width seamless Precision Clock & Assembling Closing Statement */}
      <div
        ref={closingRef}
        className="w-full py-12 sm:py-16 overflow-hidden border-t border-[#0A2E5C]/10 bg-white/45"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Precision Analog Clock with Geometric Confetti Nodes */}
          <div className="md:col-span-5 flex items-center justify-center gap-6">
            <div className="relative flex h-44 w-44 items-center justify-center">
              {CLOCK_CONFETTI.map((dot) => (
                <span
                  key={dot.id}
                  data-pull-x={dot.x}
                  data-pull-y={dot.y}
                  style={{
                    transform: `translate(${dot.x}px, ${dot.y}px)`,
                    backgroundColor: dot.color,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                  }}
                  className={`clock-confetti-dot absolute will-change-transform ${
                    dot.isSquare ? 'rounded-xs' : 'rounded-full'
                  }`}
                />
              ))}

              {/* Clock Face */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#0A2E5C] bg-[#F4F4F2] shadow-inner">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00A884] z-10" />
                <span
                  style={{ transformOrigin: 'bottom center' }}
                  className="clock-hour-hand absolute bottom-1/2 left-1/2 -ml-[2px] h-7 w-[4px] rounded-full bg-[#0A2E5C] will-change-transform"
                />
                <span
                  style={{ transformOrigin: 'bottom center' }}
                  className="clock-min-hand absolute bottom-1/2 left-1/2 -ml-[1.5px] h-10 w-[3px] rounded-full bg-[#00A884] will-change-transform"
                />
              </div>
            </div>

            <div>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A2E5C] tabular-nums">
                24/7
              </div>
              <div className="text-xs font-semibold text-neutral-600">
                Pemantauan &amp; Otomasi
              </div>
            </div>
          </div>

          {/* Assembling Scattered Headline Words */}
          <div className="md:col-span-7 text-center md:text-left">
            <p className="text-xs font-semibold tracking-wide text-[#00A884]">
              Standar Rekayasa Sinergika
            </p>
            <div className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0D1B2A] leading-tight">
              {CLOSING_WORDS.map((word) => (
                <span
                  key={word.text}
                  data-scatter-x={word.x}
                  data-scatter-y={word.y}
                  data-scatter-r={word.r}
                  className="assemble-word inline-block mr-[0.26em] will-change-transform"
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Bold closing invitation card (exact wording & CTA preserved) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-[#0A2E5C] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden"
        >
          {/* Subtle crop-mark corner handles inspired by technical drafting */}
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l-2 border-t-2 border-[#00A884]/50" />
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r-2 border-t-2 border-[#00A884]/50" />
          <span aria-hidden="true" className="pointer-events-none absolute left-4 bottom-4 h-3 w-3 border-l-2 border-b-2 border-[#00A884]/50" />
          <span aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 h-3 w-3 border-r-2 border-b-2 border-[#00A884]/50" />

          {/* Subtle autonomous flowing circuit line in footer card */}
          <svg
            aria-hidden="true"
            viewBox="0 0 600 120"
            className="pointer-events-none absolute -right-12 -top-8 h-40 w-[340px] opacity-20"
            fill="none"
          >
            <path
              d="M20 100 C 160 100, 180 20, 340 20 L 580 20"
              stroke="#00A884"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-signal-flow"
            />
            <path
              d="M60 112 C 200 112, 220 42, 380 42 L 580 42"
              stroke="#A3E635"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-signal-flow"
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold tracking-wide text-[#A3E635]">
                Mulai Kolaborasi
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight [text-wrap:balance]">
                Siap menghubungkan operasional Anda dengan sistem yang bekerja otomatis?
              </h2>
              <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/80">
                Jadwalkan sesi diskusi teknis 30 menit bersama insinyur perangkat lunak dan
                spesialis perangkat keras kami untuk memetakan solusi paling efisien.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <MagneticWrap>
                <button
                  type="button"
                  onClick={onOpenModal}
                  data-cursor-label="Mulai"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm sm:text-base font-bold text-[#0A2E5C] transition-all duration-150 hover:bg-[#A3E635] hover:text-[#0D1B2A] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                >
                  <span>Konsultasi Proyek</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A2E5C] text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              </MagneticWrap>
            </div>
          </div>
        </motion.div>

        {/* Quiet footer bar with full uploaded company logo */}
        <div className="mt-10 pt-8 border-t border-neutral-300/70 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <a
              href="#beranda"
              aria-label="Kembali ke atas — Sinergika"
              className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xs transition-transform duration-150 hover:scale-[1.03]"
            >
              <img
                src="/assets/aistudio/87.8754465854356_c2df29c3.png"
                alt="Logo Sinergika"
                referrerPolicy="no-referrer"
                className="h-10 w-10 object-contain"
              />
            </a>
            <span className="text-base font-extrabold tracking-tight text-[#0A2E5C]">
              SINERGIKA
            </span>
            <span aria-hidden="true">·</span>
            <span>Jakarta &amp; Bandung, Indonesia</span>
            <span aria-hidden="true">·</span>
            <a
              href="mailto:halo@sinergika.id"
              className="font-medium text-[#0A2E5C] hover:text-[#00A884] hover:underline transition-colors"
            >
              halo@sinergika.id
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium">
            <a href="#layanan" className="hover:text-[#0A2E5C] transition-colors">
              Layanan
            </a>
            <a href="#simulasi" className="hover:text-[#0A2E5C] transition-colors">
              Simulasi
            </a>
            <a href="#alur-kerja" className="hover:text-[#0A2E5C] transition-colors">
              Alur Kerja
            </a>
            <a href="#faq" className="hover:text-[#0A2E5C] transition-colors">
              FAQ
            </a>
            <span className="text-neutral-400">© {new Date().getFullYear()} Sinergika</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface ConsultationModalProps {
  isOpen: boolean;
  initialCategory: ProjectCategory;
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = ['Software', 'Apps', 'IoT', 'Robotics'];

export function ConsultationModal({
  isOpen,
  initialCategory,
  onClose,
}: ConsultationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<ProjectCategory>(initialCategory);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName) {
      setError('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Mohon masukkan alamat email kerja yang valid.');
      return;
    }
    if (trimmedMsg.length < 10) {
      setError('Mohon jelaskan kebutuhan proyek Anda minimal 10 karakter.');
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2E5C]/45 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleResetAndClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleResetAndClose}
              aria-label="Tutup jendela konsultasi"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F2] text-[#0A2E5C] transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {submitted ? (
              <div className="py-4 text-left space-y-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00A884] text-white">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    id="modal-title"
                    className="text-2xl font-extrabold tracking-tight text-[#0D1B2A]"
                  >
                    Permintaan Konsultasi Diterima
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Terima kasih, <strong className="text-[#0D1B2A]">{name}</strong>. Tim rekayasa{' '}
                    <strong className="text-[#0D1B2A]">{category}</strong> kami akan menghubungi{' '}
                    <span className="font-mono text-xs text-[#0A2E5C]">{email}</span> dalam 1×24
                    jam kerja untuk menjadwalkan sesi diskusi.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="inline-flex items-center justify-center rounded-full bg-[#0A2E5C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#072247] cursor-pointer"
                  >
                    Kembali ke Halaman
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold tracking-wide text-neutral-500">
                  Mulai Diskusi Teknis
                </p>
                <h3
                  id="modal-title"
                  className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#0D1B2A]"
                >
                  Konsultasi Proyek
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  Ceritakan target sistem Anda. Kami akan menyiapkan estimasi arsitektur dan
                  linimasa awal.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="consult-name"
                      className="block text-xs font-semibold text-[#0D1B2A]"
                    >
                      Nama Lengkap &amp; Perusahaan
                    </label>
                    <input
                      id="consult-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Nadia Pratama — PT Logistik Nusantara"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-[#F4F4F2]/50 px-3.5 py-2.5 text-sm text-[#0D1B2A] placeholder:text-neutral-400 focus:border-[#0A2E5C] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="consult-email"
                      className="block text-xs font-semibold text-[#0D1B2A]"
                    >
                      Email Kerja
                    </label>
                    <input
                      id="consult-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.co.id"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-[#F4F4F2]/50 px-3.5 py-2.5 text-sm text-[#0D1B2A] placeholder:text-neutral-400 focus:border-[#0A2E5C] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#0D1B2A]">
                      Jenis Proyek
                    </span>
                    <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORIES.map((item) => {
                        const active = category === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setCategory(item)}
                            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#0A2E5C] text-[#A3E635]'
                                : 'bg-[#F4F4F2] text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="consult-message"
                      className="block text-xs font-semibold text-[#0D1B2A]"
                    >
                      Ringkasan Kebutuhan
                    </label>
                    <textarea
                      id="consult-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Jelaskan alur kerja saat ini, perangkat yang ingin dihubungkan, atau target peluncuran..."
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-[#F4F4F2]/50 px-3.5 py-2.5 text-sm text-[#0D1B2A] placeholder:text-neutral-400 focus:border-[#0A2E5C] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-semibold text-[#C2410C]">
                      {error}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:text-[#0D1B2A] cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0A2E5C] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#072247] cursor-pointer"
                    >
                      <span>Kirim Permintaan</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00A884] text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
