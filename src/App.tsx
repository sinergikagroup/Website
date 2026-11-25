import { lazy, Suspense, useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaqSection } from './components/FaqSection';
import { ConsultationModal, FooterSection } from './components/FooterAndModal';
import { HeroSection } from './components/HeroSection';
import {
  AmbientSignalField,
  InteractiveCursor,
  IntroCurtain,
  ScrollProgressBar,
  useLenisScrollTrigger,
} from './components/InteractivePrimitives';
import { Navbar } from './components/Navbar';
import { PainPointsSection } from './components/PainPointsSection';
import { ServicesBento } from './components/ServicesBento';
import { SimulationDashboard } from './components/SimulationDashboard';
import { WorkflowSection } from './components/WorkflowSection';
import type { ProjectCategory } from './data/sinergikaData';

const TrialDummyPage = lazy(() =>
  import('./components/TrialDummyPage').then((m) => ({ default: m.TrialDummyPage }))
);

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('Software');
  const [activeView, setActiveView] = useState<'sinergika' | 'trial'>('sinergika');

  useLenisScrollTrigger(modalOpen);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [activeView]);

  const handleOpenModal = (category: ProjectCategory = 'Software') => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  if (activeView === 'trial') {
    return (
      <>
        <ScrollProgressBar />
        <InteractiveCursor />
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center text-sm font-semibold text-[#111111]">
              Memuat Trial Demo...
            </div>
          }
        >
          <TrialDummyPage
            onBackToSinergika={() => {
              setActiveView('sinergika');
              window.scrollTo({ top: 0 });
            }}
          />
        </Suspense>
      </>
    );
  }

  return (
    <div className="blueprint-grid-bg relative min-h-screen text-[#0D1B2A]">
      <IntroCurtain />
      <AmbientSignalField />
      <ScrollProgressBar />
      <InteractiveCursor />

      <Navbar
        onOpenModal={() => handleOpenModal('Software')}
        onOpenTrial={() => setActiveView('trial')}
      />

      <main className="relative z-10">
        <HeroSection onOpenModal={() => handleOpenModal('Software')} />
        <PainPointsSection onOpenModal={() => handleOpenModal('Software')} />
        <ServicesBento onSelectCategoryAndConsult={(cat) => handleOpenModal(cat)} />
        <SimulationDashboard />
        <WorkflowSection />
        <FaqSection />
      </main>

      <div className="relative z-10">
        <FooterSection onOpenModal={() => handleOpenModal('Software')} />
      </div>

      <ConsultationModal
        isOpen={modalOpen}
        initialCategory={selectedCategory}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
