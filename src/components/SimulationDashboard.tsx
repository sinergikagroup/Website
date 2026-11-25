import { useEffect, useRef, useState } from 'react';
import { Lightbulb, Minus, Plus, RotateCcw, ShieldAlert, Thermometer, Waves } from 'lucide-react';
import { motion } from 'motion/react';
import { updateSpotlightVars } from './InteractivePrimitives';

type ArmMode = 'Siaga' | 'Kalibrasi' | 'Pick & Place' | 'Berhenti Darurat';

interface RoboticArmViewportProps {
  armMode: ArmMode;
  armSpeed: number;
  onCycleComplete: () => void;
}

/**
 * Isolated 6-DOF Robotic Arm animation component with autonomous rAF kinematics
 * AND cursor-following manual offset when hovered in Siaga mode.
 */
function RoboticArmViewport({ armMode, armSpeed, onCycleComplete }: RoboticArmViewportProps) {
  const [phase, setPhase] = useState(0);
  const [cursorTarget, setCursorTarget] = useState({ shoulder: 0, elbow: 0, active: false });
  const phaseRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const onCycleRef = useRef(onCycleComplete);
  onCycleRef.current = onCycleComplete;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (armMode === 'Siaga' || armMode === 'Berhenti Darurat') {
      lastTimeRef.current = null;
      return;
    }

    if (prefersReduced) {
      const timer = window.setInterval(() => {
        phaseRef.current = (phaseRef.current + 0.6) % (Math.PI * 2);
        setPhase(phaseRef.current);
      }, 600);
      return () => window.clearInterval(timer);
    }

    let rafId = 0;
    const speedRadPerSec = armMode === 'Kalibrasi' ? 1.1 : (armSpeed / 100) * 3.4;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      let next = phaseRef.current + speedRadPerSec * dt;
      if (next >= Math.PI * 2) {
        next -= Math.PI * 2;
        if (armMode === 'Pick & Place') {
          onCycleRef.current();
        }
      }
      phaseRef.current = next;
      setPhase(next);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      lastTimeRef.current = null;
    };
  }, [armMode, armSpeed]);

  const handleViewportPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || armMode !== 'Siaga') return;
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setCursorTarget({
      shoulder: normX * 26,
      elbow: normY * 28,
      active: true,
    });
  };

  const handleViewportPointerLeave = () => {
    setCursorTarget({ shoulder: 0, elbow: 0, active: false });
  };

  const shoulderAngle =
    armMode === 'Berhenti Darurat'
      ? -18
      : armMode === 'Siaga'
        ? -25 + (cursorTarget.active ? cursorTarget.shoulder : 0)
        : armMode === 'Kalibrasi'
          ? Math.sin(phase) * 20 - 15
          : Math.sin(phase) * 28 - 18;

  const elbowAngle =
    armMode === 'Berhenti Darurat'
      ? 54
      : armMode === 'Siaga'
        ? 68 + (cursorTarget.active ? cursorTarget.elbow : 0)
        : armMode === 'Kalibrasi'
          ? 45 + Math.cos(phase) * 24
          : 55 + Math.cos(phase * 2) * 26;

  const gripperClosed =
    armMode === 'Pick & Place' ? Math.sin(phase) > 0 : armMode === 'Kalibrasi';

  return (
    <div
      ref={viewportRef}
      onPointerMove={handleViewportPointerMove}
      onPointerLeave={handleViewportPointerLeave}
      data-cursor-label={armMode === 'Siaga' ? 'Arahkan' : 'Kinematika'}
      className="mt-4 rounded-2xl bg-[#0A2E5C] p-4 sm:p-5 text-white relative overflow-hidden"
    >
      {/* Autonomous multi-line signal conduit behind robotic arm */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 56"
        className="absolute inset-x-0 bottom-0 h-14 w-full opacity-30 pointer-events-none"
      >
        <path
          d="M0 36 H105 L125 20 H245 L265 36 H360"
          fill="none"
          stroke="#00A884"
          strokeWidth="1.5"
          className={armMode !== 'Berhenti Darurat' ? 'animate-signal-flow' : ''}
        />
        <path
          d="M0 46 H135 L150 34 H225 L240 46 H360"
          fill="none"
          stroke="#A3E635"
          strokeWidth="1"
          className={armMode !== 'Berhenti Darurat' ? 'animate-signal-flow' : ''}
        />
      </svg>

      <div className="relative flex items-center justify-between text-xs font-mono text-white/75">
        <span className="tabular-nums">
          Bahu: {shoulderAngle.toFixed(0)}° · Siku: {elbowAngle.toFixed(0)}°
        </span>
        <span>Penjepit: {gripperClosed ? 'Tertutup' : 'Terbuka'}</span>
      </div>

      <div className="relative mt-3 flex justify-center">
        <svg
          viewBox="0 0 360 210"
          className="h-44 sm:h-48 w-full max-w-sm"
          role="img"
          aria-label={`Visualisasi lengan robotik dalam mode ${armMode}`}
        >
          {/* Floor baseline & target dock */}
          <line x1="20" y1="184" x2="340" y2="184" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <rect x="262" y="160" width="44" height="24" rx="4" fill="#072247" />
          <rect
            x="275"
            y="148"
            width="18"
            height="12"
            rx="2"
            fill={gripperClosed ? '#A3E635' : '#00A884'}
          />

          {/* Subtle laser alignment arc from gripper toward dock when active */}
          {armMode !== 'Berhenti Darurat' && (
            <path
              d="M 110 144 Q 205 60 284 148"
              fill="none"
              stroke="rgba(163, 230, 53, 0.2)"
              strokeWidth="1.25"
              strokeDasharray="4 6"
            />
          )}

          {/* Robot Base Pedestal */}
          <rect x="78" y="160" width="64" height="24" rx="5" fill="#072247" />
          <rect x="94" y="142" width="32" height="20" rx="4" fill="#F4F4F2" />
          <circle cx="110" cy="144" r="14" fill="none" stroke="rgba(0, 168, 132, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="110" cy="144" r="9" fill="#0A2E5C" stroke="#00A884" strokeWidth="3" />

          {/* Shoulder Link */}
          <g transform={`translate(110, 144) rotate(${shoulderAngle})`}>
            <rect x="-8" y="-76" width="16" height="78" rx="8" fill="#F4F4F2" />
            <circle cx="0" cy="-72" r="8" fill="#0A2E5C" stroke="#A3E635" strokeWidth="3" />

            {/* Elbow Link */}
            <g transform={`translate(0, -72) rotate(${elbowAngle})`}>
              <rect x="-6" y="-66" width="12" height="68" rx="6" fill="#D4D4D0" />
              <circle cx="0" cy="-64" r="6" fill="#00A884" />

              {/* Gripper Head */}
              <g transform="translate(0, -64)">
                <rect x="-12" y="-8" width="24" height="8" rx="3" fill="#F4F4F2" />
                <path
                  d={
                    gripperClosed
                      ? 'M -8 -8 L -4 -22 M 8 -8 L 4 -22'
                      : 'M -10 -8 L -14 -22 M 10 -8 L 14 -22'
                  }
                  stroke="#A3E635"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function SimulationDashboard() {
  // IoT Device states
  const [zoneALight, setZoneALight] = useState(true);
  const [zoneBLight, setZoneBLight] = useState(false);
  const [hvacActive, setHvacActive] = useState(true);
  const [targetTemp, setTargetTemp] = useState(21);
  const [motionSensorArmed, setMotionSensorArmed] = useState(true);

  // Robotic Arm control states
  const [armMode, setArmMode] = useState<ArmMode>('Pick & Place');
  const [armSpeed, setArmSpeed] = useState(65);
  const [completedCycles, setCompletedCycles] = useState(142);

  // Autonomous subtle ambient temperature drift every 2.2s
  const [tempDrift, setTempDrift] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTempDrift((prev) => (prev === 0 ? 0.1 : prev === 0.1 ? -0.1 : 0));
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  // Derived IoT telemetry values
  const ambientTemp = hvacActive
    ? (targetTemp + tempDrift).toFixed(1)
    : (28.4 + tempDrift).toFixed(1);
  const humidity = hvacActive ? 48 : 64;
  const powerWatt =
    (zoneALight ? 180 : 0) +
    (zoneBLight ? 180 : 0) +
    (hvacActive ? 920 + Math.abs(25 - targetTemp) * 35 : 40) +
    (armMode === 'Pick & Place' ? 410 : armMode === 'Kalibrasi' ? 190 : 25);

  const handleReset = () => {
    setZoneALight(true);
    setZoneBLight(false);
    setHvacActive(true);
    setTargetTemp(21);
    setMotionSensorArmed(true);
    setArmMode('Pick & Place');
    setArmSpeed(65);
    setCompletedCycles(142);
  };

  return (
    <section id="simulasi" className="relative z-10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              Simulasi Interaktif
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B2A] [text-wrap:balance]">
              Pratinjau kendali IoT &amp; robotika.
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            data-cursor-label="Reset"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-[#0A2E5C] transition-colors hover:border-[#0A2E5C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Simulasi</span>
          </button>
        </motion.div>

        {/* Main Dashboard Preview Container */}
        <div
          onPointerMove={updateSpotlightVars}
          className="spotlight-surface mt-10 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 lg:p-10"
        >
          {/* Top summary telemetry bar (tabular figures, zero pill clutter) */}
          <div className="grid grid-cols-2 gap-6 pb-8 border-b border-neutral-200 sm:grid-cols-4">
            <div>
              <div className="text-xs font-medium text-neutral-500">Konsumsi Daya Total</div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2E5C] tabular-nums">
                {powerWatt} <span className="text-sm font-medium text-neutral-500">W</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-500">Suhu Ruangan</div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2E5C] tabular-nums">
                {ambientTemp} <span className="text-sm font-medium text-neutral-500">°C</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-500">Kelembapan Relatif</div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2E5C] tabular-nums">
                {humidity} <span className="text-sm font-medium text-neutral-500">%</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-neutral-500">Siklus Lengan Robotik</div>
              <div className="mt-1 font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#00A884] tabular-nums">
                {completedCycles} <span className="text-sm font-medium text-neutral-500">unit</span>
              </div>
            </div>
          </div>

          {/* 2-Column Interactive Split: IoT Switches + Robotic Arm Preview */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: IoT Device Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#0D1B2A]">
                  Sakelar Perangkat IoT Fasilitas
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Ubah status lampu, target pendingin, dan sensor keamanan untuk melihat dampak
                  telemetri secara langsung.
                </p>
              </div>

              <div className="divide-y divide-neutral-200">
                {/* Control 1: Pencahayaan Zona A */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        zoneALight ? 'bg-[#A3E635] text-[#0D1B2A]' : 'bg-[#F4F4F2] text-neutral-500'
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#0D1B2A]">
                        Lampu Lini Perakitan A
                      </div>
                      <div className="text-xs text-neutral-500">
                        {zoneALight ? 'Menyala · 180 W aktif' : 'Mati · 0 W'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={zoneALight}
                    aria-label="Sakelar Lampu Lini Perakitan A"
                    onClick={() => setZoneALight((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer ${
                      zoneALight ? 'bg-[#0A2E5C]' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150 ${
                        zoneALight ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Control 2: Pencahayaan Zona B */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        zoneBLight ? 'bg-[#A3E635] text-[#0D1B2A]' : 'bg-[#F4F4F2] text-neutral-500'
                      }`}
                    >
                      <Lightbulb className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#0D1B2A]">
                        Lampu Area Gudang B
                      </div>
                      <div className="text-xs text-neutral-500">
                        {zoneBLight ? 'Menyala · 180 W aktif' : 'Mati · Hemat energi'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={zoneBLight}
                    aria-label="Sakelar Lampu Area Gudang B"
                    onClick={() => setZoneBLight((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer ${
                      zoneBLight ? 'bg-[#0A2E5C]' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150 ${
                        zoneBLight ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Control 3: Kontrol Suhu HVAC */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          hvacActive ? 'bg-[#00A884] text-white' : 'bg-[#F4F4F2] text-neutral-500'
                        }`}
                      >
                        <Thermometer className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#0D1B2A]">
                          Pendingin Ruangan (HVAC)
                        </div>
                        <div className="text-xs text-neutral-500">
                          {hvacActive
                            ? `Aktif · Target suhu ${targetTemp} °C`
                            : 'Nonaktif · Mengikuti suhu luar'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hvacActive}
                      aria-label="Sakelar Pendingin Ruangan HVAC"
                      onClick={() => setHvacActive((v) => !v)}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer ${
                        hvacActive ? 'bg-[#0A2E5C]' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150 ${
                          hvacActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {hvacActive && (
                    <div className="pl-12 flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-neutral-600">
                        Atur Target Suhu
                      </span>
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTargetTemp((t) => Math.max(16, t - 1))}
                          aria-label="Turunkan suhu target"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-[#0A2E5C] hover:border-[#0A2E5C] cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-12 text-center font-mono text-sm font-bold tabular-nums text-[#0A2E5C]">
                          {targetTemp}°C
                        </span>
                        <button
                          type="button"
                          onClick={() => setTargetTemp((t) => Math.min(27, t + 1))}
                          aria-label="Naikkan suhu target"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-[#0A2E5C] hover:border-[#0A2E5C] cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control 4: Sensor Gerak & Keamanan */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        motionSensorArmed
                          ? 'bg-[#0A2E5C] text-[#A3E635]'
                          : 'bg-[#F4F4F2] text-neutral-500'
                      }`}
                    >
                      <Waves className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#0D1B2A]">
                        Sensor Perimeter &amp; Gerak LiDAR
                      </div>
                      <div className="text-xs text-neutral-500">
                        {motionSensorArmed
                          ? 'Siaga Penuh · Area aman dari intrusi'
                          : 'Mode Pemeliharaan · Sensor dijeda'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={motionSensorArmed}
                    aria-label="Sakelar Sensor Perimeter LiDAR"
                    onClick={() => setMotionSensorArmed((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] cursor-pointer ${
                      motionSensorArmed ? 'bg-[#0A2E5C]' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150 ${
                        motionSensorArmed ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Robotic Arm Simulation */}
            <div className="lg:col-span-6 lg:border-l lg:border-neutral-200 lg:pl-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#0D1B2A]">
                      Lengan Robotik 6-DOF
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      Status operasi:{' '}
                      <strong className="font-semibold text-[#0A2E5C]">{armMode}</strong>
                    </p>
                  </div>

                  {armMode === 'Berhenti Darurat' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C]">
                      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                      <span>Aktuator Terkunci</span>
                    </span>
                  )}
                </div>

                <RoboticArmViewport
                  armMode={armMode}
                  armSpeed={armSpeed}
                  onCycleComplete={() => setCompletedCycles((c) => c + 1)}
                />
              </div>

              {/* Mode Switcher + Speed Slider */}
              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 text-xs font-semibold text-neutral-600">
                    Pilih Mode Operasi
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Pick & Place', 'Kalibrasi', 'Siaga', 'Berhenti Darurat'] as ArmMode[]).map(
                      (mode) => {
                        const active = armMode === mode;
                        const isEmergency = mode === 'Berhenti Darurat';
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setArmMode(mode)}
                            className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A2E5C] ${
                              active
                                ? isEmergency
                                  ? 'bg-[#FB923C] text-[#111111]'
                                  : 'bg-[#0A2E5C] text-white'
                                : 'bg-[#F4F4F2] text-neutral-700 hover:bg-neutral-200'
                            }`}
                          >
                            {mode}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
                    <label htmlFor="arm-speed-range">Kecepatan Aktuator</label>
                    <span className="font-mono font-bold text-[#0A2E5C] tabular-nums">
                      {armSpeed}%
                    </span>
                  </div>
                  <input
                    id="arm-speed-range"
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={armSpeed}
                    onChange={(e) => setArmSpeed(Number(e.target.value))}
                    disabled={armMode === 'Siaga' || armMode === 'Berhenti Darurat'}
                    className="mt-2 w-full accent-[#0A2E5C] cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
