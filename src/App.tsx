import { useState, useEffect } from 'react';
import { useMemories } from './hooks/useMemories';
import type { Memory } from './types/memory';
import { FloatingHearts } from './components/layout/FloatingHearts';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/layout/Hero';
import { Timeline } from './components/timeline/Timeline';
import { Footer } from './components/layout/Footer';
import { LightboxModal } from './components/timeline/LightboxModal';
import { SecretLetterModal } from './components/modals/SecretLetterModal';
import { NfcWelcomeToast } from './components/modals/NfcWelcomeToast';
import { AdminPinModal } from './components/admin/AdminPinModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  const {
    memories,
    settings,
    addMemory,
    updateMemory,
    deleteMemory,
    updateSettings,
    resetToDefaults,
    exportData,
    importData,
  } = useMemories();

  // Modals & Navigation state
  const [selectedPhotoMemory, setSelectedPhotoMemory] = useState<Memory | null>(null);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'timeline' | 'admin'>('timeline');

  // Handle URL hash changes (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (!isAdminAuthenticated) {
          setIsPinModalOpen(true);
        } else {
          setCurrentView('admin');
        }
      } else {
        setCurrentView('timeline');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated]);

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
      window.location.hash = 'admin';
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsPinModalOpen(false);
    setCurrentView('admin');
    window.location.hash = 'admin';
  };

  const handleCloseAdmin = () => {
    setCurrentView('timeline');
    if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  // Lightbox navigation
  const handleNavigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedPhotoMemory || memories.length === 0) return;
    const currentIndex = memories.findIndex((m) => m.id === selectedPhotoMemory.id);
    if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
      setSelectedPhotoMemory(memories[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % memories.length;
      setSelectedPhotoMemory(memories[nextIndex]);
    }
  };

  const handleScrollToTimeline = () => {
    const element = document.getElementById('timeline-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#272021] selection:bg-[#E28290]/25 selection:text-[#8C2D3E]">
      {/* Gentle Floating Hearts & Sparkles Particles */}
      <FloatingHearts />

      {/* NFC Detection Toast */}
      <NfcWelcomeToast partner2={settings.partner2} />

      {/* Main View Switch */}
      {currentView === 'admin' ? (
        <AdminDashboard
          memories={memories}
          settings={settings}
          onAddMemory={addMemory}
          onUpdateMemory={updateMemory}
          onDeleteMemory={deleteMemory}
          onUpdateSettings={updateSettings}
          onResetToDefaults={resetToDefaults}
          onExportData={exportData}
          onImportData={importData}
          onClose={handleCloseAdmin}
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Navigation Bar */}
          <Navbar
            settings={settings}
            onOpenLetter={() => setIsLetterOpen(true)}
            onOpenAdmin={handleOpenAdminTrigger}
          />

          {/* Public Gift Experience */}
          <main className="flex-1">
            {/* Hero & Relationship Live Counter */}
            <Hero
              settings={settings}
              onOpenLetter={() => setIsLetterOpen(true)}
              onScrollToTimeline={handleScrollToTimeline}
            />

            {/* Vertical Alternating Memory Timeline */}
            <Timeline
              memories={memories}
              onSelectPhoto={(mem) => setSelectedPhotoMemory(mem)}
            />
          </main>

          {/* Footer with NFC Badge & Discreet Admin Trigger */}
          <Footer
            settings={settings}
            onOpenAdmin={handleOpenAdminTrigger}
          />
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        memory={selectedPhotoMemory}
        memories={memories}
        onClose={() => setSelectedPhotoMemory(null)}
        onNavigate={handleNavigateLightbox}
      />

      {/* Wax Sealed Love Letter Modal */}
      <SecretLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        settings={settings}
      />

      {/* Admin Security Gate PIN Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        correctPin={settings.adminPin}
      />
    </div>
  );
}

export default App;
