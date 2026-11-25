import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { MagneticWrap, SinergikaMark } from './InteractivePrimitives';

interface NavbarProps {
  onOpenModal: () => void;
  onOpenTrial: () => void;
}

const NAV_LINKS = [
  { label: 'Layanan', href: '#layanan' },
  { label: 'Simulasi', href: '#simulasi' },
  { label: 'Alur Kerja', href: '#alur-kerja' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ onOpenModal, onOpenTrial }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 40;
    if (next !== scrolled) setScrolled(next);
  });

  useEffect(() => {
    const sectionIds = ['layanan', 'simulasi', 'alur-kerja', 'faq'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { threshold: [0.2, 0.45], rootMargin: '-18% 0px -45% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-5xl pointer-events-auto">
        <div
          className={`flex items-center justify-between gap-4 md:gap-8 rounded-full border backdrop-blur-md transition-all duration-300 ${
            scrolled
              ? 'border-[#0A2E5C]/18 bg-white/92 px-4 py-1.5 sm:px-5 shadow-[0_12px_36px_rgba(10,46,92,0.12)]'
              : 'border-[#0A2E5C]/12 bg-white/85 px-4 py-2 sm:px-6 shadow-[0_8px_30px_rgba(10,46,92,0.08)]'
          }`}
        >
          {/* Zone 1: Brand lockup with cropped monogram emblem + single-line wordmark */}
          <a
            href="#beranda"
            onClick={() => setActiveHref(null)}
            className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A2E5C] rounded-sm"
          >
            <span className="h-8 w-9 rounded-lg bg-white shrink-0 flex items-center justify-center">
              <SinergikaMark className="w-9 h-[25px]" />
            </span>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#0A2E5C]">
              SINERGIKA
            </span>
          </a>

          {/* Zone 2: Clean typographic navigation links with shared layout active indicator */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0A2E5C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A2E5C] rounded-sm ${
                    isActive ? 'text-[#0A2E5C] font-semibold' : ''
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[#00A884]"
                    />
                  )}
                </a>
              );
            })}
            <button
              type="button"
              onClick={onOpenTrial}
              data-cursor-label="Trial"
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 text-[#00A884] font-semibold hover:text-[#0A2E5C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0A2E5C] rounded-sm cursor-pointer"
            >
              Trial Demo
            </button>
          </nav>

          {/* Zone 3: Single primary CTA + Mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <MagneticWrap>
              <button
                type="button"
                onClick={onOpenModal}
                data-cursor-label="Mulai"
                className="group inline-flex items-center gap-2 rounded-full bg-[#0A2E5C] px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#072247] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
              >
                <span>Konsultasi Proyek</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00A884] text-white transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            </MagneticWrap>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#0A2E5C] transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <nav
            aria-label="Navigasi seluler"
            className="mt-2 rounded-2xl border border-[#0A2E5C]/12 bg-white/95 p-3 backdrop-blur-md shadow-[0_12px_32px_rgba(10,46,92,0.1)] md:hidden"
          >
            <div className="flex flex-col divide-y divide-neutral-100">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-3 text-sm font-medium text-[#0D1B2A] hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#00A884]" aria-hidden="true" />
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenTrial();
                }}
                className="flex items-center justify-between px-3 py-3 text-sm font-semibold text-[#00A884] hover:bg-neutral-50 rounded-lg transition-colors text-left cursor-pointer"
              >
                <span>Trial Demo</span>
                <ArrowUpRight className="h-4 w-4 text-[#00A884]" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
