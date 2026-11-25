import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Plus, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TrialDummyPageProps {
  onBackToSinergika: () => void;
}

const HERO_TILES = [
  { bg: '#c5f03f', shape: 'quarter-br', fg: '#ff8a5c', anim: 'animate-geo-swing' },
  { bg: '#bfe3f7', shape: 'half-bottom', fg: '#9fc3d6', anim: 'animate-geo-drift-y' },
  { bg: '#a9bfa8', shape: 'circle', fg: '#bfe3f7', anim: 'animate-geo-drift-x' },
  { bg: '#f7f7f5', shape: 'triangle-tr', fg: '#ff8a5c', anim: 'animate-geo-swing' },
  { bg: '#bfe3f7', shape: 'half-left', fg: '#c5f03f', anim: 'animate-geo-drift-x' },
  { bg: '#9fc3d6', shape: 'quarter-tl', fg: '#f7f7f5', anim: 'animate-geo-spin' },
  { bg: '#ff8a5c', shape: 'circle', fg: '#c5f03f', anim: 'animate-geo-drift-y' },
  { bg: '#c5f03f', shape: 'arch', fg: '#a9bfa8', anim: 'animate-geo-swing' },
  { bg: '#a9bfa8', shape: 'quarter-bl', fg: '#ff8a5c', anim: 'animate-geo-spin-rev' },
  { bg: '#bfe3f7', shape: 'circle', fg: '#c5f03f', anim: 'animate-geo-drift-x' },
  { bg: '#f7f7f5', shape: 'center-blank', fg: '#ff8a5c', anim: '' },
  { bg: '#ff8a5c', shape: 'half-top', fg: '#9fc3d6', anim: 'animate-geo-drift-y' },
  { bg: '#c5f03f', shape: 'quarter-tr', fg: '#bfe3f7', anim: 'animate-geo-spin' },
  { bg: '#9fc3d6', shape: 'circle', fg: '#f7f7f5', anim: 'animate-geo-drift-x' },
  { bg: '#a9bfa8', shape: 'half-right', fg: '#c5f03f', anim: 'animate-geo-drift-x' },
  { bg: '#ff8a5c', shape: 'quarter-br', fg: '#bfe3f7', anim: 'animate-geo-swing' },
  { bg: '#c5f03f', shape: 'circle', fg: '#ff8a5c', anim: 'animate-geo-drift-y' },
  { bg: '#bfe3f7', shape: 'arch', fg: '#9fc3d6', anim: 'animate-geo-spin-rev' },
  { bg: '#f7f7f5', shape: 'half-bottom', fg: '#a9bfa8', anim: 'animate-geo-drift-y' },
  { bg: '#9fc3d6', shape: 'triangle-tr', fg: '#c5f03f', anim: 'animate-geo-swing' },
  { bg: '#a9bfa8', shape: 'circle', fg: '#ff8a5c', anim: 'animate-geo-drift-x' },
];

const WORRY_CHIPS = [
  { text: 'Forgot to start the timer', x: -160, y: -90, r: -4 },
  { text: "Where's that file?", x: 150, y: -85, r: 5 },
  { text: 'How long was that call?', x: -190, y: -25, r: 3 },
  { text: 'Did I send that invoice?', x: 180, y: -20, r: -4 },
  { text: 'What changed last round?', x: -165, y: 35, r: -3 },
  { text: 'Following up. Again.', x: 165, y: 40, r: 4 },
  { text: 'Is this profitable?', x: -120, y: 95, r: 5 },
  { text: '"Just one more change"', x: 130, y: 92, r: -5 },
  { text: "When's that client task?", x: -45, y: -115, r: -2 },
  { text: 'Chasing feedback', x: 55, y: 118, r: 3 },
  { text: 'Did I log those hours?', x: 0, y: 130, r: -2 },
];

const TOOL_CARDS = [
  { name: 'Notion', desc: 'Docs & task lists', price: '$120/yr', x: -140, y: -90 },
  { name: 'Loom', desc: 'Screen recordings', price: '$180/yr', x: 90, y: -110 },
  { name: 'Bonsai', desc: 'Invoices & contracts', price: '$228/yr', x: -170, y: 10 },
  { name: 'Toggl Track', desc: 'Time tracking', price: '$108/yr', x: 140, y: 15 },
  { name: 'Wispr Flow', desc: 'Voice dictation', price: '$144/yr', x: -110, y: 115 },
  { name: 'Granola', desc: 'AI meeting notes', price: '$168/yr', x: 115, y: 110 },
];

const ORBIT_NODES = [
  { label: 'Call', angle: -90 },
  { label: 'Notes', angle: -30 },
  { label: 'Tasks', angle: 30 },
  { label: 'Hours', angle: 90 },
  { label: 'Invoice', angle: 150 },
  { label: 'Recording', angle: 210 },
];

const STACK_CARDS = [
  {
    num: '1/6',
    title: 'Know where your money stands',
    desc: "See what's paid, invoiced, and still unbilled, and how close you are to your income goal.",
    bullets: ['Paid & outstanding income', 'Income goals', 'Project profitability', 'Unbilled work'],
    tint: '#bfe3f7',
    mockup: 'income',
  },
  {
    num: '2/6',
    title: 'Keep clients in the loop',
    desc: 'Give clients one place to follow progress, review deliverables, and share feedback.',
    bullets: ['Project progress', 'Deliverables & files', 'Feedback & approvals', 'Shared project updates'],
    tint: '#c5f03f',
    mockup: 'kanban',
  },
  {
    num: '5/6',
    title: 'Put your AI to work',
    desc: 'Connect Claude, Codex, or any AI agent to your workspace. Your meetings, tasks, and hours — readable by the tools you already think with.',
    bullets: ['Meetings & transcripts', 'Tasks, time & clients'],
    tint: '#ff8a5c',
    mockup: 'ai',
  },
  {
    num: '6/6',
    title: 'Talk instead of typing',
    desc: 'Hold fn and dictate emails, briefs, and prompts in any app on your Mac, minus the ums and uhs.',
    bullets: [
      'Works wherever you can type',
      'Your clients names, spelled right',
      'Emails laid out like emails',
      'Double-press fn to go hands-free',
    ],
    tint: '#9fc3d6',
    mockup: 'dictation',
  },
];

const FEATURE_GROUPS = [
  {
    stage: 'NEGOTIATION',
    heading: 'Turn a conversation into a project',
    tiles: [
      { title: 'Clients & projects', bg: '#bfe3f7', shape: 'ovals', upNext: false },
      { title: 'Proposal builder', bg: '#9fc3d6', shape: 'asterisk', upNext: false },
      { title: 'Agreements', bg: '#ff8a5c', shape: 'arch', upNext: false },
      { title: 'Client portal', bg: '#c5f03f', shape: 'crescents', upNext: true },
    ],
  },
  {
    stage: 'WORKING',
    heading: 'Keep every project moving',
    tiles: [
      { title: 'Screen recordings', bg: '#c5f03f', shape: 'ovals', upNext: false },
      { title: 'Ask Loopsii', bg: '#bfe3f7', shape: 'asterisk', upNext: false },
      { title: 'AI Meeting Assistant', bg: '#a9bfa8', shape: 'shutter', upNext: false },
      { title: 'Time tracking', bg: '#bfe3f7', shape: 'ring', upNext: false },
      { title: 'Gantt timeline & milestones', bg: '#ff8a5c', shape: 'bars', upNext: false },
      { title: 'Dictation', bg: '#c5f03f', shape: 'wave', upNext: false },
      { title: 'Change requests', bg: '#f6b196', shape: 'leaf', upNext: true },
    ],
  },
  {
    stage: 'CLOSURE',
    heading: 'Wrap up, deliver, and get paid',
    tiles: [
      { title: 'Time reports', bg: '#ff8a5c', shape: 'ovals', upNext: false },
      { title: 'Invoices', bg: '#9fc3d6', shape: 'spiral', upNext: false },
      { title: 'Deliverables page', bg: '#a9bfa8', shape: 'infinity', upNext: true },
    ],
  },
  {
    stage: 'PLANNING',
    heading: "Know what's coming next",
    tiles: [
      { title: 'Pre-meeting briefs', bg: '#bfe3f7', shape: 'asterisk', upNext: true },
      { title: 'Pipeline', bg: '#c5f03f', shape: 'arrows', upNext: true },
      { title: 'Income goals', bg: '#ff8a5c', shape: 'arch', upNext: true },
      { title: 'Capacity check', bg: '#bfe3f7', shape: 'bars', upNext: true },
    ],
  },
];

const ROADMAP_ITEMS = [
  {
    num: '01',
    badge: 'Live',
    color: '#9fc3d6',
    bullets: [
      'Clients, projects and task boards.',
      'Time tracking, timesheets and reports.',
      'Call and screen recording on Mac. No bot.',
      'AI notes, tasks and search across calls.',
    ],
  },
  {
    num: '02',
    badge: 'Up Next',
    color: '#f5b873',
    bullets: ['Income goals and deal pipeline.', 'Client portal for approvals and files.'],
  },
  {
    num: '03',
    badge: 'Up Next',
    color: '#a9bfa8',
    bullets: ['Capacity view across all projects.', 'Change requests and scope tracking.'],
  },
  {
    num: '04',
    badge: 'Up Next',
    color: '#ff8a5c',
    bullets: [
      'Desktop app for Windows.',
      'Full web platform in both desktop apps.',
      'Mobile app for iOS.',
    ],
  },
];

const TRIAL_FAQS = [
  {
    q: 'Do I need Mac to use Loopsii?',
    a: 'Loopsii launches first on macOS for system-level call recording and global dictation, with Windows and iOS following in Loop 04.',
  },
  {
    q: 'How much does Loopsii cost?',
    a: 'One flat plan at $12/month (or $10/month billed yearly) including all clients, recordings, dictation, and AI notes.',
  },
  {
    q: 'What happens to my call recordings and transcripts?',
    a: 'All recordings are processed privately on your workspace with full export and deletion control at any time.',
  },
  {
    q: 'Can I use Loopsii with Claude or ChatGPT?',
    a: 'Yes — connect via built-in MCP integration so your AI assistants can search meetings, tasks, and hours.',
  },
  {
    q: 'Can I dictate instead of typing?',
    a: 'Hold fn anywhere on your Mac to dictate formatted briefs, emails, and task updates directly.',
  },
];

// Generate ~110 deterministic colorful confetti pieces inside the analog clock face
const CLOCK_CONFETTI = Array.from({ length: 110 }, (_, i) => {
  const colors = ['#c5f03f', '#ff8a5c', '#bfe3f7', '#a9bfa8', '#f5b873', '#111111'];
  const angle = ((i * 137.5) % 360) * (Math.PI / 180);
  const r = 18 + ((i * 19) % 72);
  return {
    id: i,
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r + (i % 3 === 0 ? 18 : 6),
    rot: (i * 41) % 180,
    color: colors[i % colors.length],
    kind: i % 3,
  };
});

const CLOSING_WORDS = [
  { text: 'Shipped', x: -90, y: -45, r: -8 },
  { text: 'weekly,', x: 35, y: 40, r: 7 },
  { text: 'shaped', x: -55, y: 48, r: -6 },
  { text: 'by', x: 60, y: -35, r: 9 },
  { text: 'you', x: 85, y: 36, r: -7 },
];

function TileGraphic({ shape, fg, anim }: { shape: string; fg: string; anim: string }) {
  if (shape === 'center-blank') return null;
  if (shape === 'circle') {
    return (
      <div
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'quarter-br') {
    return (
      <div
        className={`absolute -bottom-1 -right-1 h-4/5 w-4/5 rounded-tl-full origin-bottom-right will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'quarter-tl') {
    return (
      <div
        className={`absolute -top-1 -left-1 h-4/5 w-4/5 rounded-br-full origin-top-left will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'quarter-tr') {
    return (
      <div
        className={`absolute -top-1 -right-1 h-4/5 w-4/5 rounded-bl-full origin-top-right will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'quarter-bl') {
    return (
      <div
        className={`absolute -bottom-1 -left-1 h-4/5 w-4/5 rounded-tr-full origin-bottom-left will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'half-bottom') {
    return (
      <div
        className={`absolute bottom-0 inset-x-2 h-1/2 rounded-t-full will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'half-top') {
    return (
      <div
        className={`absolute top-0 inset-x-2 h-1/2 rounded-b-full will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'half-left') {
    return (
      <div
        className={`absolute left-0 inset-y-2 w-1/2 rounded-r-full will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'half-right') {
    return (
      <div
        className={`absolute right-0 inset-y-2 w-1/2 rounded-l-full will-change-transform ${anim}`}
        style={{ backgroundColor: fg }}
      />
    );
  }
  if (shape === 'triangle-tr') {
    return (
      <div
        className={`h-[90%] w-[90%] will-change-transform ${anim}`}
        style={{ backgroundColor: fg, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
      />
    );
  }
  return (
    <div
      className={`h-12 w-16 rounded-t-full border-[10px] border-b-0 will-change-transform ${anim}`}
      style={{ borderColor: fg }}
    />
  );
}

function AbstractBlackShape({ shape }: { shape: string }) {
  if (shape === 'ovals') {
    return (
      <div className="flex items-center gap-1">
        <span className="h-8 w-4 rounded-full bg-[#111111]" />
        <span className="h-8 w-5 rounded-full bg-[#111111]" />
        <span className="h-8 w-6 rounded-full bg-[#111111]" />
        <span className="h-8 w-4 rounded-full bg-[#111111]" />
      </div>
    );
  }
  if (shape === 'asterisk') {
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12 text-[#111111]" fill="currentColor">
        <rect x="20" y="4" width="8" height="40" rx="2" />
        <rect x="20" y="4" width="8" height="40" rx="2" transform="rotate(60 24 24)" />
        <rect x="20" y="4" width="8" height="40" rx="2" transform="rotate(120 24 24)" />
      </svg>
    );
  }
  if (shape === 'arch') {
    return <div className="h-10 w-16 rounded-t-full border-[12px] border-b-0 border-[#111111]" />;
  }
  if (shape === 'bars') {
    return (
      <div className="flex items-end gap-1.5 h-10">
        {[60, 100, 45, 85, 100, 55, 90].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} className="w-1.5 bg-[#111111] rounded-xs" />
        ))}
      </div>
    );
  }
  if (shape === 'wave') {
    return (
      <div className="flex items-center gap-1.5 h-10">
        {[40, 85, 65, 100, 50, 75, 40].map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} className="w-2 rounded-full bg-[#111111]" />
        ))}
      </div>
    );
  }
  if (shape === 'ring') {
    return <div className="h-12 w-12 rounded-full border-[10px] border-[#111111]" />;
  }
  return (
    <div className="flex items-center gap-1">
      <div className="h-10 w-10 rounded-full bg-[#111111]" />
      <div className="h-10 w-10 rounded-full border-4 border-[#111111]" />
    </div>
  );
}

export function TrialDummyPage({ onBackToSinergika }: TrialDummyPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);
  const heroOrbRef = useRef<HTMLDivElement>(null);
  const heroNextTextRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const limeSlideRef = useRef<HTMLDivElement>(null);
  const stackTaxRef = useRef<HTMLDivElement>(null);
  const stackCardsRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const clockSectionRef = useRef<HTMLDivElement>(null);
  const closingWordsRef = useRef<HTMLDivElement>(null);
  const footerFiguresRef = useRef<HTMLDivElement>(null);

  const [yearlyPlan, setYearlyPlan] = useState(false);
  const [activeRoadmapIdx, setActiveRoadmapIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        // 1) HERO TILE GRID COLLAPSE -> CENTER ORANGE CIRCLE EXPANDS MASSIVELY AS NEXT BG + BLUR-TO-SHARP REVEAL
        if (heroGridRef.current && heroOrbRef.current && heroNextTextRef.current) {
          const tiles = gsap.utils.toArray<HTMLElement>('.loopsii-tile', heroGridRef.current);
          const orbIcon = heroGridRef.current.querySelector<HTMLElement>('.loopsii-orb-glyph');
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroGridRef.current,
              start: 'top 18%',
              end: '+=105%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });

          tiles.forEach((tile, idx) => {
            const col = idx % 7;
            const row = Math.floor(idx / 7);
            const dx = (3 - col) * 140;
            const dy = (1 - row) * 105;
            heroTl.to(
              tile,
              {
                x: dx,
                y: dy,
                scale: 0.14,
                opacity: 0,
                rotation: (3 - col) * 12,
                ease: 'power2.inOut',
              },
              0
            );
          });

          if (orbIcon) {
            heroTl.to(
              orbIcon,
              { scale: 1.5, opacity: 0, ease: 'power2.in', duration: 0.35 },
              0.25
            );
          }

          heroTl.to(
            heroOrbRef.current,
            { scale: 36, ease: 'power2.inOut', duration: 0.72 },
            0.28
          );

          gsap.fromTo(
            heroNextTextRef.current,
            { filter: 'blur(14px)', opacity: 0.15, y: 26 },
            {
              filter: 'blur(0px)',
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: heroNextTextRef.current,
                start: 'top 80%',
                end: 'top 42%',
                scrub: 0.75,
              },
            }
          );
        }

        // 2) CHAOS STAGE -> LIME SLIDE-UP PANEL
        if (chaosRef.current && limeSlideRef.current) {
          const chips = gsap.utils.toArray<HTMLElement>('.loopsii-chip', chaosRef.current);
          const chaosTl = gsap.timeline({
            scrollTrigger: {
              trigger: chaosRef.current,
              start: 'top top',
              end: '+=110%',
              pin: true,
              scrub: 0.85,
            },
          });

          chips.forEach((chip) => {
            chaosTl.to(
              chip,
              {
                x: Number(chip.dataset.sx || 0),
                y: Number(chip.dataset.sy || 0),
                rotation: Number(chip.dataset.sr || 0) * 3,
                opacity: 0.18,
                ease: 'power2.inOut',
              },
              0
            );
          });

          chaosTl.fromTo(
            limeSlideRef.current,
            { yPercent: 100 },
            { yPercent: 0, ease: 'power3.inOut' },
            0.4
          );
        }

        // 3) COPY-PASTE TAX -> CONVERGE INTO LIME ICON -> DASHED RING + 6 NODES
        if (stackTaxRef.current) {
          const cards = gsap.utils.toArray<HTMLElement>('.tax-tool-card', stackTaxRef.current);
          const ring = stackTaxRef.current.querySelector<HTMLElement>('.loopsii-ring');
          const nodes = gsap.utils.toArray<HTMLElement>('.loopsii-ring-node', stackTaxRef.current);
          const finalCard = stackTaxRef.current.querySelector<HTMLElement>('.loopsii-final-card');

          const taxTl = gsap.timeline({
            scrollTrigger: {
              trigger: stackTaxRef.current,
              start: 'top top',
              end: '+=130%',
              pin: true,
              scrub: 0.85,
            },
          });

          cards.forEach((card) => {
            taxTl.to(
              card,
              {
                x: -Number(card.dataset.tx || 0) * 0.65,
                y: -Number(card.dataset.ty || 0) * 0.65,
                scale: 0.25,
                opacity: 0,
                ease: 'power2.in',
              },
              0.1
            );
          });

          if (ring) {
            taxTl.fromTo(
              ring,
              { scale: 0.4, opacity: 0 },
              { scale: 1, opacity: 1, ease: 'power2.out' },
              0.35
            );
          }

          taxTl.fromTo(
            nodes,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.06, ease: 'back.out(1.7)' },
            0.45
          );

          if (finalCard) {
            taxTl.fromTo(
              finalCard,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, ease: 'power2.out' },
              0.72
            );
          }
        }

        // 4) STACKED FEATURE CARDS (Deck-of-Paper scale down + tilt)
        if (stackCardsRef.current) {
          const deckCards = gsap.utils.toArray<HTMLElement>('.deck-paper-card', stackCardsRef.current);
          deckCards.forEach((card, idx) => {
            if (idx < deckCards.length - 1) {
              gsap.to(card, {
                scale: 0.94 - (deckCards.length - idx) * 0.01,
                rotation: idx % 2 === 0 ? -1.4 : 1.4,
                opacity: 0.88,
                scrollTrigger: {
                  trigger: deckCards[idx + 1],
                  start: 'top 75%',
                  end: 'top 20%',
                  scrub: true,
                },
              });
            }
          });
        }

        // 5) ROADMAP ARC 01-04 Scrubbing
        if (roadmapRef.current) {
          ScrollTrigger.create({
            trigger: roadmapRef.current,
            start: 'top 60%',
            end: 'bottom 45%',
            scrub: true,
            onUpdate: (self) => {
              const idx = Math.min(3, Math.max(0, Math.floor(self.progress * 3.99)));
              setActiveRoadmapIdx(idx);
            },
          });
        }

        // 6) CONFETTI ANALOG CLOCK
        if (clockSectionRef.current) {
          const hHand = clockSectionRef.current.querySelector<HTMLElement>('.trial-clock-hour');
          const mHand = clockSectionRef.current.querySelector<HTMLElement>('.trial-clock-min');
          const dots = gsap.utils.toArray<HTMLElement>('.trial-confetti-piece', clockSectionRef.current);

          const clkTl = gsap.timeline({
            scrollTrigger: {
              trigger: clockSectionRef.current,
              start: 'top 80%',
              end: 'bottom 30%',
              scrub: 0.7,
            },
          });

          if (hHand) clkTl.to(hHand, { rotation: 210, ease: 'none' }, 0);
          if (mHand) clkTl.to(mHand, { rotation: 540, ease: 'none' }, 0);
          dots.forEach((dot) => {
            clkTl.to(
              dot,
              {
                x: Number(dot.dataset.cx || 0) * 0.65,
                y: Number(dot.dataset.cy || 0) * 0.65,
                rotation: Number(dot.dataset.cr || 0) + 90,
                ease: 'power2.out',
              },
              0
            );
          });
        }

        // 7) SCATTERED WORDS ASSEMBLING ("Shipped weekly, shaped by you")
        if (closingWordsRef.current) {
          const words = gsap.utils.toArray<HTMLElement>('.trial-scatter-word', closingWordsRef.current);
          gsap.fromTo(
            words,
            {
              x: (i) => CLOSING_WORDS[i]?.x ?? 0,
              y: (i) => CLOSING_WORDS[i]?.y ?? 0,
              rotation: (i) => CLOSING_WORDS[i]?.r ?? 0,
              opacity: 0.3,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              opacity: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: closingWordsRef.current,
                start: 'top 85%',
                end: 'top 42%',
                scrub: 0.8,
              },
            }
          );
        }

        // 8) FOOTER HALFTONE SEATED FIGURES SLIGHT ROTATE
        if (footerFiguresRef.current) {
          const leftFig = footerFiguresRef.current.querySelector<HTMLElement>('.seated-left');
          const rightFig = footerFiguresRef.current.querySelector<HTMLElement>('.seated-right');
          if (leftFig) {
            gsap.to(leftFig, {
              rotation: -7,
              y: -12,
              scrollTrigger: {
                trigger: footerFiguresRef.current,
                start: 'top 85%',
                end: 'bottom bottom',
                scrub: 0.8,
              },
            });
          }
          if (rightFig) {
            gsap.to(rightFig, {
              rotation: 7,
              y: -12,
              scrollTrigger: {
                trigger: footerFiguresRef.current,
                start: 'top 85%',
                end: 'bottom bottom',
                scrub: 0.8,
              },
            });
          }
        }
      });

      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => {
        window.clearTimeout(refreshTimer);
        mm.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const triggerDemoToast = (msg: string) => {
    setSignupMessage(msg);
    window.setTimeout(() => setSignupMessage(null), 3200);
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#f0f0f0] text-[#111111]"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)',
        backgroundSize: '42px 42px',
      }}
    >
      {/* Floating Trial Top Nav Bar (mirrors video 00:00) */}
      <header className="fixed inset-x-0 top-4 z-40 px-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4 rounded-full border border-black/10 bg-white/85 px-4 py-2 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.07)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSinergika}
              data-cursor-label="Kembali"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-[#c5f03f] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sinergika</span>
            </button>
            <span className="text-base font-extrabold tracking-tight">LØPSII</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-700">
            <a href="#trial-why" className="hover:text-black">
              Why Loopsii
            </a>
            <a href="#trial-features" className="hover:text-black">
              Features
            </a>
            <a href="#trial-pricing" className="hover:text-black">
              Pricing
            </a>
          </nav>

          <button
            type="button"
            onClick={() => triggerDemoToast('Trial Demo Mode: Akun demo siap dicoba.')}
            data-cursor-label="Sign up"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c5f03f] text-[#111111] text-[10px] font-bold">
              ↗
            </span>
            <span>Sign up for free</span>
          </button>
        </div>
      </header>

      {signupMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-[#111111] px-5 py-3 text-xs font-semibold text-[#c5f03f] shadow-xl"
        >
          {signupMessage}
        </div>
      )}

      {/* 00:00 - 00:03 HERO + FULL-WIDTH CONTINUOUS MOTION GEOMETRIC TILE COLLAPSE */}
      <section className="pt-28 pb-0 overflow-x-clip">
        <div className="px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <h1 className="lg:col-span-7 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[0.98]">
              One app for
              <br />
              your follow-ups
            </h1>
            <p className="lg:col-span-5 text-sm sm:text-base text-neutral-700 max-w-sm lg:ml-auto leading-relaxed">
              The all-in-one app for freelancers. Like a personal manager, it keeps your clients,
              calls, tasks and hours connected.
            </p>
          </div>
        </div>

        {/* Full-Width 3x7 Tile Grid (no outer card border, no EDITS/TIME MANAGEMENT labels) */}
        <div ref={heroGridRef} className="relative mt-12 w-full overflow-hidden py-8 sm:py-12 px-2 sm:px-5">
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 sm:gap-3 relative w-full">
            {HERO_TILES.map((tile, idx) => {
              const col = idx % 7;
              const row = Math.floor(idx / 7);
              const isCenter = idx === 10;
              if (isCenter) {
                return (
                  <div key={idx} className="relative h-24 sm:h-28 lg:h-32 flex items-center justify-center">
                    <div
                      ref={heroOrbRef}
                      className="relative z-20 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#ff8a5c] shadow-lg will-change-transform"
                    >
                      <span className="loopsii-orb-glyph text-2xl font-black tracking-tighter text-[#111111]">
                        ⟲
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <motion.div
                  key={idx}
                  animate={{
                    y: [0, row % 2 === 0 ? -5 : 5, 0],
                    x: [0, col % 2 === 0 ? 4 : -4, 0],
                  }}
                  transition={{
                    duration: 4.2 + (idx % 5) * 0.65,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (idx % 7) * 0.16,
                  }}
                  style={{ backgroundColor: tile.bg }}
                  className="loopsii-tile relative h-24 sm:h-28 lg:h-32 overflow-hidden flex items-center justify-center rounded-lg will-change-transform"
                >
                  <TileGraphic shape={tile.shape} fg={tile.fg} anim={tile.anim} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 00:03 Expanded Orange Circle Space ("What is Loopsii" seamlessly over #ff8a5c) */}
      <section
        id="trial-why"
        ref={heroNextTextRef}
        className="w-full bg-[#ff8a5c] text-[#111111] py-20 sm:py-28 px-4 sm:px-8"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div
            className="lg:col-span-4 text-2xl text-[#111111]/85"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            What is Loopsii
          </div>
          <div className="lg:col-span-8">
            <p className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug">
              Loopsii helps freelance designers and developers manage their entire workflow in one
              app. There&apos;s less to organize and more time to do the work.
            </p>
          </div>
        </div>
      </section>

      {/* 00:05 - 00:10 DARK CHAOS CLUSTER + LIME CURTAIN + DASHBOARD MOCKUP */}
      <section ref={chaosRef} className="relative overflow-hidden bg-[#1e1e1d] text-white min-h-[85vh] flex items-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,138,92,0.18),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-6xl w-full px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <h2 className="lg:col-span-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Too many things pulling you away
          </h2>

          <div className="lg:col-span-6 flex items-center justify-center">
            <span className="text-7xl sm:text-9xl font-extralight text-white/30 mr-2">(</span>
            <div className="flex flex-wrap justify-center gap-2 max-w-md py-6">
              {WORRY_CHIPS.map((chip) => (
                <div
                  key={chip.text}
                  data-sx={chip.x}
                  data-sy={chip.y}
                  data-sr={chip.r}
                  className="loopsii-chip rounded-full bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#111111] shadow-md"
                >
                  {chip.text}
                </div>
              ))}
            </div>
            <span className="text-7xl sm:text-9xl font-extralight text-white/30 ml-2">)</span>
          </div>

          <h2 className="lg:col-span-3 text-3xl sm:text-4xl font-bold tracking-tight lg:text-right">
            from the work that actually matters
          </h2>
        </div>

        {/* Full-screen Lime Panel Sliding Up (00:09 - 00:10) */}
        <div
          ref={limeSlideRef}
          className="hidden lg:flex absolute inset-0 z-20 flex-col items-center justify-center bg-[#c5f03f] px-6 text-center text-[#111111]"
        >
          <h2 className="text-5xl xl:text-6xl font-extrabold tracking-tight">
            That&apos;s why Loopsii exists
          </h2>
          <div className="mt-10 w-full max-w-2xl rounded-2xl border border-black/15 bg-white p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between text-xs text-neutral-500 pb-3 border-b border-neutral-100">
              <span className="font-semibold text-[#111111]">Still at it, Maya</span>
              <span className="rounded-full bg-[#c5f03f] px-3 py-1 font-bold text-[#111111]">
                Start timer
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-neutral-400">Activities</div>
                <div className="text-2xl font-extrabold mt-0.5">59</div>
              </div>
              <div className="col-span-2">
                <div className="text-neutral-400">Upcoming meetings</div>
                <div className="mt-1 font-semibold">19 Nov · Component workshop with Northwind</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 00:11 - 00:19 COPY-PASTE TAX -> DASHED RING -> $120/yr */}
      <section ref={stackTaxRef} className="relative py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="relative min-h-[540px] flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
            <div className="lg:col-span-3 text-2xl sm:text-3xl font-bold tracking-tight">
              Your whole stack, in one app
            </div>

            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px]">
              {/* Converging Tool Cards */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md z-10">
                {TOOL_CARDS.map((tool) => (
                  <div
                    key={tool.name}
                    data-tx={tool.x}
                    data-ty={tool.y}
                    className="tax-tool-card rounded-xl border border-black/10 bg-white p-4 shadow-sm"
                  >
                    <div className="text-sm font-bold">{tool.name}</div>
                    <div className="text-[11px] text-neutral-500">{tool.desc}</div>
                    <div className="mt-3 text-lg font-extrabold">{tool.price}</div>
                  </div>
                ))}
              </div>

              {/* Dashed Circular Ring with 6 Nodes */}
              <div className="loopsii-ring pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="relative h-72 w-72 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center">
                  {ORBIT_NODES.map((node) => {
                    const rad = (node.angle * Math.PI) / 180;
                    const leftPct = 50 + Math.cos(rad) * 49;
                    const topPct = 50 + Math.sin(rad) * 49;
                    return (
                      <div
                        key={node.label}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        className="loopsii-ring-node absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-black/15 px-3 py-1 text-xs font-bold shadow-sm"
                      >
                        {node.label}
                      </div>
                    );
                  })}
                  <div className="rounded-full bg-[#111111] px-5 py-2.5 text-xs font-bold text-white shadow-lg">
                    Client project
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 text-2xl sm:text-3xl font-bold tracking-tight lg:text-right">
              Everything on it, connected.
            </div>
          </div>

          <div className="loopsii-final-card mt-8 rounded-2xl border border-black/10 bg-white px-8 py-5 text-center shadow-md">
            <div className="text-xs font-bold text-neutral-500">Loopsii · All of the above</div>
            <div className="mt-1 text-3xl font-extrabold">$120/yr</div>
          </div>
        </div>

        {/* Lime Migration Banner (00:18) */}
        <div className="mt-12 rounded-3xl bg-[#c5f03f] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <h3 className="lg:col-span-6 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Move in without leaving anything behind
          </h3>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-sm sm:text-base text-neutral-800">
              Bring your recordings, meeting notes, docs and hours with you — dates, projects and
              links intact. Import twice, get no duplicates.
            </p>
            <button
              type="button"
              onClick={() => triggerDemoToast('14-day free trial demo started!')}
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
            >
              <span>Try it free for 14 days</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 00:20 - 00:29 STACKED FEATURE CARDS */}
      <section id="trial-features" ref={stackCardsRef} className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-12">
          Everything around your work, handled
        </h2>

        <div className="space-y-8">
          {STACK_CARDS.map((card) => (
            <div
              key={card.num}
              style={{ borderTopWidth: '10px', borderTopColor: card.tint }}
              className="deck-paper-card sticky top-24 rounded-3xl border border-black/10 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="text-xs font-mono font-bold text-neutral-400">{card.num}</div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{card.desc}</p>
                  <ul className="space-y-1.5 pt-2 text-xs font-medium text-neutral-700">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{ backgroundColor: `${card.tint}45` }}
                  className="lg:col-span-6 rounded-2xl p-6 min-h-[210px] flex items-center justify-center"
                >
                  {card.mockup === 'income' && (
                    <div className="w-full rounded-xl bg-white p-5 text-center shadow-sm">
                      <div className="text-xs text-neutral-500">Month income</div>
                      <div className="mt-2 text-3xl font-extrabold">$7,100</div>
                      <div className="mt-3 h-3 w-full rounded-full bg-[#f0f0f0] overflow-hidden flex">
                        <span className="w-2/5 bg-[#c5f03f]" />
                        <span className="w-1/4 bg-[#bfe3f7]" />
                        <span className="w-1/5 bg-[#ff8a5c]" />
                      </div>
                    </div>
                  )}
                  {card.mockup === 'kanban' && (
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {['Not Started', 'In Progress', 'Done'].map((col) => (
                        <div key={col} className="rounded-lg bg-white p-2.5 shadow-xs">
                          <div className="text-[10px] font-bold text-neutral-500">{col}</div>
                          <div className="mt-2 h-8 rounded bg-[#f0f0f0]" />
                          <div className="mt-1.5 h-6 rounded bg-[#c5f03f]/40" />
                        </div>
                      ))}
                    </div>
                  )}
                  {card.mockup === 'ai' && (
                    <div className="w-full rounded-xl bg-white p-4 shadow-sm space-y-2 text-xs">
                      <div className="font-bold">Claude · Connected to Loopsii</div>
                      <div className="rounded-lg bg-[#f0f0f0] p-2.5 text-neutral-700">
                        &ldquo;What did we agree with Anna about the pricing page?&rdquo;
                      </div>
                      <div className="rounded-lg bg-[#c5f03f]/30 p-2.5 font-medium">
                        Anna signed off on a three-tier pricing page.
                      </div>
                    </div>
                  )}
                  {card.mockup === 'dictation' && (
                    <div className="w-full rounded-xl bg-white p-5 shadow-sm text-center space-y-3">
                      <div className="text-xs font-bold text-neutral-500">Dictation active</div>
                      <div className="flex justify-center gap-1.5 h-8 items-center">
                        {[14, 28, 20, 32, 16, 26, 12].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}px` }}
                            className="w-1.5 rounded-full bg-[#111111]"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Stacked "Project" Folder Tabs Card (00:25 - 00:29) */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-3xl font-extrabold tracking-tight">
                  Go back to doing the work
                </h3>
                <p className="text-sm text-neutral-600">
                  Loopsii handles the rest. Set it up once, stop rebuilding your process for every
                  new client.
                </p>
              </div>
              <div className="lg:col-span-7 space-y-1.5">
                {['#ff8a5c', '#9fc3d6', '#c5f03f', '#bfe3f7', '#a9bfa8'].map((bg, i) => (
                  <div
                    key={bg}
                    style={{ backgroundColor: bg, marginLeft: `${i * 10}px` }}
                    className="rounded-t-2xl px-5 py-3 text-xs font-bold text-[#111111] shadow-xs transition-transform hover:-translate-y-1"
                  >
                    Project
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 00:30 - 00:40 FEATURE GRID ("What's included") */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div
          className="text-xl text-neutral-600 mb-2"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          What&apos;s included
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-12">
          Everything you need, at every project stage.
        </h2>

        <div className="space-y-14">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.stage} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <span className="inline-block rounded-full border border-black/20 px-3 py-1 text-[10px] font-bold tracking-widest">
                  {group.stage}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">{group.heading}</h3>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {group.tiles.map((tile, idx) => (
                  <div
                    key={tile.title}
                    style={{
                      backgroundColor: tile.bg,
                      transform: tile.upNext
                        ? `rotate(${idx % 2 === 0 ? -2.5 : 2.5}deg)`
                        : `rotate(${idx % 2 === 0 ? -0.6 : 0.6}deg)`,
                      opacity: tile.upNext ? 0.85 : 1,
                    }}
                    className="rounded-2xl p-5 min-h-[180px] flex flex-col justify-between transition-transform duration-200 hover:rotate-0 hover:scale-[1.03]"
                  >
                    <div>
                      <div className="text-base font-bold leading-snug">{tile.title}</div>
                      {tile.upNext && (
                        <div
                          className="text-sm text-neutral-700 mt-0.5"
                          style={{ fontFamily: 'var(--font-script)' }}
                        >
                          Up next
                        </div>
                      )}
                    </div>
                    <div className="pt-6">
                      <AbstractBlackShape shape={tile.shape} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 00:42 PRICING TOGGLE */}
      <section id="trial-pricing" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight">One plan.</h2>
          <div className="mt-4 inline-flex items-center gap-3 text-sm font-semibold">
            <span className={!yearlyPlan ? 'text-black' : 'text-neutral-400'}>Monthly</span>
            <button
              type="button"
              role="switch"
              aria-checked={yearlyPlan}
              onClick={() => setYearlyPlan((v) => !v)}
              className="relative inline-flex h-7 w-12 items-center rounded-full bg-[#111111] p-1 cursor-pointer"
            >
              <span
                className={`h-5 w-5 rounded-full bg-[#c5f03f] transition-transform ${
                  yearlyPlan ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={yearlyPlan ? 'text-black' : 'text-neutral-400'}>
              Yearly <span className="text-xs text-neutral-500">Save 17%</span>
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-black/15 bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-lg">
          <div className="md:col-span-5 bg-[#c5f03f] p-8 flex flex-col justify-between">
            <div className="text-sm font-bold">
              {yearlyPlan ? 'Yearly plan' : 'Monthly plan'}
            </div>
            <div className="mt-10">
              <span className="text-5xl font-extrabold">{yearlyPlan ? '$10' : '$12'}</span>
              <span className="text-sm font-semibold ml-1">/ month</span>
            </div>
          </div>
          <div className="md:col-span-7 p-8 space-y-3 text-sm">
            <div className="font-bold text-base">What&apos;s included</div>
            <ul className="space-y-2 text-neutral-700">
              <li>• Unlimited projects, clients &amp; time tracking</li>
              <li>• Meeting and screen recording with AI summaries</li>
              <li>• Dictation in any app on your Mac</li>
              <li>• Tasks, invoices &amp; client management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 00:43 - 00:53 ROADMAP ARC */}
      <section ref={roadmapRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto overflow-hidden">
        <div className="text-center mb-14">
          <div className="text-lg text-neutral-500" style={{ fontFamily: 'var(--font-script)' }}>
            The roadmap
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
            No fake launch dates. Just the actual plan.
          </h2>
        </div>

        <div className="relative pt-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 1120 120"
            className="hidden lg:block pointer-events-none w-full h-24 -mb-14"
            fill="none"
          >
            <path
              d="M 20 100 Q 560 -20 1100 100"
              stroke={ROADMAP_ITEMS[activeRoadmapIdx].color}
              strokeWidth="8"
              strokeDasharray="3 10"
              className="transition-colors duration-300"
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROADMAP_ITEMS.map((item, idx) => {
              const delta = idx - activeRoadmapIdx;
              const isCenter = idx === activeRoadmapIdx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => setActiveRoadmapIdx(idx)}
                  style={{
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 1024
                        ? `translateY(${Math.abs(delta) * 18}px) rotate(${delta * 4}deg) scale(${
                            isCenter ? 1.04 : 0.96
                          })`
                        : undefined,
                  }}
                  className="text-left rounded-3xl border border-black/12 bg-white p-5 shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: item.color }}
                    className="rounded-2xl p-4 text-white flex items-baseline justify-between"
                  >
                    <span className="text-4xl font-black tracking-tighter">
                      <span className="text-xs font-bold block">LOOP</span>
                      {item.num}
                    </span>
                    <span
                      className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-[#111111]"
                      style={{ fontFamily: 'var(--font-script)' }}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-neutral-700">
                    {item.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 00:54 - 00:57 123 FREELANCERS + CONFETTI ANALOG CLOCK */}
      <section ref={clockSectionRef} className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 rounded-3xl border border-black/10 bg-white p-8 flex flex-col justify-between">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready for an easier way to work?
            </h2>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => triggerDemoToast('Trial Demo: Ready to sign up!')}
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-xs font-bold text-white cursor-pointer"
              >
                <span>Sign up for free</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[#9fc3d6] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 overflow-hidden">
            <div>
              <div className="text-6xl sm:text-7xl font-black tracking-tighter">123</div>
              <div
                className="text-xl text-[#111111]"
                style={{ fontFamily: 'var(--font-script)' }}
              >
                freelancers already using Loopsii
              </div>
            </div>

            {/* Analog clock filled with ~110 confetti pieces */}
            <div className="relative flex h-56 w-56 shrink-0 items-center justify-center rounded-full border-4 border-[#111111] bg-white shadow-inner overflow-hidden">
              {CLOCK_CONFETTI.map((c) => (
                <span
                  key={c.id}
                  data-cx={c.x}
                  data-cy={c.y}
                  data-cr={c.rot}
                  style={{
                    backgroundColor: c.color,
                    transform: `translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`,
                  }}
                  className={`trial-confetti-piece absolute ${
                    c.kind === 0
                      ? 'h-2.5 w-2.5 rounded-full'
                      : c.kind === 1
                        ? 'h-2.5 w-2.5 rounded-xs'
                        : 'h-2 w-3.5 rounded-sm'
                  }`}
                />
              ))}
              <span className="z-10 h-3 w-3 rounded-full bg-[#111111]" />
              <span
                style={{ transformOrigin: 'bottom center' }}
                className="trial-clock-hour z-10 absolute bottom-1/2 left-1/2 -ml-[2px] h-14 w-[4px] rounded-full bg-[#111111]"
              />
              <span
                style={{ transformOrigin: 'bottom center' }}
                className="trial-clock-min z-10 absolute bottom-1/2 left-1/2 -ml-[1.5px] h-20 w-[3px] rounded-full bg-[#111111]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 00:58 FAQ */}
      <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="text-lg text-neutral-500" style={{ fontFamily: 'var(--font-script)' }}>
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Good questions, straight answers.
            </h2>
          </div>
          <div className="lg:col-span-8 divide-y divide-black/15 border-t border-b border-black/15">
            {TRIAL_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left font-bold text-base sm:text-lg cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-sm text-neutral-700 leading-relaxed">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 00:59 SCATTERED WORDS ASSEMBLING OVER HALFTONE */}
      <section
        ref={closingWordsRef}
        className="py-24 px-4 text-center overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(rgba(159, 195, 214, 0.55) 2px, transparent 2px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className="mx-auto max-w-5xl text-4xl sm:text-6xl font-extrabold tracking-tight">
          {CLOSING_WORDS.map((w) => (
            <span key={w.text} className="trial-scatter-word inline-block mr-[0.28em]">
              {w.text}
            </span>
          ))}
        </div>
      </section>

      {/* 01:00 - 01:04 BLUE HALFTONE FOOTER WITH ROTATING SEATED FIGURES & CROP-MARK CARD */}
      <footer
        ref={footerFiguresRef}
        className="relative overflow-hidden bg-[#9fc3d6] py-20 px-4 sm:px-8"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.45) 2px, transparent 2px)',
          backgroundSize: '10px 10px',
        }}
      >
        <div className="mx-auto max-w-6xl relative flex items-center justify-center">
          {/* Left seated figure silhouette */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 180"
            className="seated-left hidden lg:block w-36 h-52 text-[#6d947b] opacity-85 mr-6 shrink-0"
            fill="currentColor"
          >
            <circle cx="58" cy="30" r="16" />
            <path d="M38 56 C38 48 76 48 78 68 L84 114 L52 114 L46 80 Z" />
            <rect x="30" y="114" width="54" height="10" rx="5" fill="#4f6d5c" />
            <rect x="53" y="124" width="8" height="36" fill="#4f6d5c" />
            <rect x="34" y="158" width="46" height="8" rx="4" fill="#4f6d5c" />
          </svg>

          {/* Center White Card with Crop-Mark Corner Handles */}
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-10 sm:p-14 text-center shadow-2xl">
            <span className="absolute left-3 top-3 h-2.5 w-2.5 border-l-2 border-t-2 border-black" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 border-r-2 border-t-2 border-black" />
            <span className="absolute left-3 bottom-3 h-2.5 w-2.5 border-l-2 border-b-2 border-black" />
            <span className="absolute right-3 bottom-3 h-2.5 w-2.5 border-r-2 border-b-2 border-black" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start your loop here
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              One account, all your clients, one simple workflow
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => triggerDemoToast('Trial Demo: Loopsii account flow triggered!')}
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-xs font-bold text-white cursor-pointer"
              >
                <span>Sign up for free</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-10 pt-5 border-t border-black/10 flex flex-wrap items-center justify-between gap-4 text-[11px] text-neutral-500">
              <span>© Loopsii Reference Trial</span>
              <button
                type="button"
                onClick={onBackToSinergika}
                className="font-semibold text-[#111111] hover:underline cursor-pointer"
              >
                Kembali ke Landing Page Sinergika →
              </button>
            </div>
          </div>

          {/* Right seated figure silhouette */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 180"
            className="seated-right hidden lg:block w-36 h-52 text-[#ff8a5c] opacity-85 ml-6 shrink-0"
            fill="currentColor"
          >
            <circle cx="62" cy="30" r="16" />
            <path d="M42 68 C44 48 82 48 82 56 L74 114 L36 114 Z" />
            <rect x="36" y="114" width="54" height="10" rx="5" fill="#6d947b" />
            <rect x="59" y="124" width="8" height="36" fill="#6d947b" />
            <rect x="40" y="158" width="46" height="8" rx="4" fill="#6d947b" />
          </svg>
        </div>
      </footer>
    </div>
  );
}
