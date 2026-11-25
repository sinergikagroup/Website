import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
} from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Synchronizes Lenis smooth scrolling with GSAP ScrollTrigger across the entire page.
 */
export function useLenisScrollTrigger(paused: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Intercept internal anchor clicks for Lenis smooth scroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -72 });
    };
    document.addEventListener('click', handleAnchorClick);

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refreshTimeout);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (paused) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [paused]);
}

/**
 * Cleanly isolates the top S-monogram emblem from the uploaded brand asset without wordmark clipping.
 */
export function SinergikaMark({ className = 'w-11 h-[30px]' }: { className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden shrink-0 ${className}`}>
      <img
        src="/assets/aistudio/87.8754465854356_c2df29c3.png"
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="absolute left-1/2 -translate-x-1/2 max-w-none pointer-events-none select-none"
        style={{ width: '166%', height: 'auto', top: '-38%' }}
      />
    </span>
  );
}

/**
 * Brief, non-blocking cinematic intro curtain with Sinergika monogram & kinetic signal line.
 * Automatically bypassed when prefers-reduced-motion is enabled.
 */
export function IntroCurtain() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(() => setShow(false), 720);
    return () => window.clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          onClick={() => setShow(false)}
          initial={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0A2E5C] text-white cursor-pointer"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-16 w-16 rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center">
              <SinergikaMark className="w-12 h-[33px]" />
            </div>
            <div className="h-[2px] w-36 overflow-hidden rounded-full bg-white/15">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full bg-gradient-to-r from-[#00A884] to-[#A3E635]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Autonomous subtle interactive node-link canvas reacting gently to cursor proximity.
 */
export function AmbientSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let rafId = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const nodeCount = width < 768 ? 16 : 26;
    const nodes = Array.from({ length: nodeCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: idx % 4 === 0 ? 2.2 : 1.5,
      teal: idx % 3 === 0,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handleLeave = () => {
      pointer.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    const render = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160 && dist > 1) {
            n.x += (dx / dist) * 0.3;
            n.y += (dy / dist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(0, 168, 132, ${0.13 * (1 - dist / 160)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(10, 46, 92, ${0.055 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.teal ? 'rgba(0, 168, 132, 0.25)' : 'rgba(10, 46, 92, 0.2)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none opacity-70"
    />
  );
}

/**
 * Top viewport scroll progress line tracking overall reading progress.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-[#0A2E5C] via-[#00A884] to-[#A3E635] pointer-events-none"
      style={{ scaleX }}
    />
  );
}

/**
 * Desktop-only small arrow custom cursor that scales up & displays contextual labels
 * over interactive elements. Automatically disabled on touch devices and reduced motion.
 */
export function InteractiveCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isPointerInteractive, setIsPointerInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 580, damping: 38, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 580, damping: 38, mass: 0.3 });

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncCapability = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };
    syncCapability();

    finePointer.addEventListener('change', syncCapability);
    reducedMotion.addEventListener('change', syncCapability);
    return () => {
      finePointer.removeEventListener('change', syncCapability);
      reducedMotion.removeEventListener('change', syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labelEl = target.closest<HTMLElement>('[data-cursor-label]');
      if (labelEl) {
        setCursorLabel(labelEl.getAttribute('data-cursor-label'));
        setIsPointerInteractive(true);
        return;
      }

      const interactiveEl = target.closest(
        'a, button, input, textarea, [role="button"], [role="switch"]'
      );
      setCursorLabel(null);
      setIsPointerInteractive(Boolean(interactiveEl));
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);
    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 pointer-events-none select-none will-change-transform"
      style={{ x, y }}
    >
      <div
        className={`flex items-center gap-1.5 transition-transform duration-150 ${
          isPressed ? 'scale-85' : isPointerInteractive ? 'scale-125' : 'scale-100'
        }`}
      >
        {/* Crisp vector arrow pointer */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          className="-translate-x-0.5 -translate-y-0.5 drop-shadow-sm"
        >
          <path
            d="M3 2.5L16.5 9.5L10.2 11.4L7.8 17.5L3 2.5Z"
            fill={isPointerInteractive ? '#00A884' : '#0A2E5C'}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {cursorLabel && (
          <span className="rounded-full bg-[#0A2E5C] px-2.5 py-0.5 text-[10px] font-semibold tracking-tight text-[#A3E635] shadow-md border border-[#00A884]/40 whitespace-nowrap">
            {cursorLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

/**
 * Subtle magnetic pull container for primary CTA elements on fine-pointer devices.
 */
export function MagneticWrap({ children, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 22 });
  const y = useSpring(rawY, { stiffness: 320, damping: 22 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    rawX.set(offsetX);
    rawY.set(offsetY);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x, y }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated tabular metric count-up triggered on viewport entry while preserving exact display format.
 */
export function AnimatedMetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    if (value === '3,4×') {
      const controls = animate(0, 3.4, {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplay(`${latest.toFixed(1).replace('.', ',')}×`),
      });
      return () => controls.stop();
    }

    if (value === '< 45 ms') {
      const controls = animate(85, 45, {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplay(`< ${Math.round(latest)} ms`),
      });
      return () => controls.stop();
    }

    if (value === '99,94%') {
      const controls = animate(95, 99.94, {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplay(`${latest.toFixed(2).replace('.', ',')}%`),
      });
      return () => controls.stop();
    }

    setDisplay(value);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

/**
 * Updates CSS variables --spot-x and --spot-y directly on DOM node (zero React re-renders).
 */
export function updateSpotlightVars(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
  el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
}
