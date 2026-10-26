import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { DevoteeProvider, useDevotee } from './context/DevoteeContext.tsx';
import { PublicHeader } from './components/common/PublicHeader.tsx';
import { PublicFooter } from './components/common/PublicFooter.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { LoginModal } from './components/public/LoginModal.tsx';

// Public Views
import { HomeView } from './components/public/HomeView.tsx';
import { PoojaCatalogueView } from './components/public/PoojaCatalogueView.tsx';
import { GurukulCatalogueView } from './components/public/GurukulCatalogueView.tsx';
import { AgniSuktaPlayerView } from './components/public/AgniSuktaPlayerView.tsx';
import { AppointmentBookingView } from './components/public/AppointmentBookingView.tsx';
import { AboutView } from './components/public/AboutView.tsx';
import { ContactView } from './components/public/ContactView.tsx';
import { EventsView } from './components/public/EventsView.tsx';
import { ResourcesView } from './components/public/ResourcesView.tsx';
import { DonateView } from './components/public/DonateView.tsx';

// Dashboard Views
import { DashboardLayout } from './components/dashboard/DashboardLayout.tsx';
import { DashboardOverview } from './components/dashboard/DashboardOverview.tsx';
import { RitualsView } from './components/dashboard/RitualsView.tsx';
import { AppointmentsView } from './components/dashboard/AppointmentsView.tsx';
import { GurukulLearningView } from './components/dashboard/GurukulLearningView.tsx';
import { AstrologyView } from './components/dashboard/AstrologyView.tsx';
import { DonationsVaultView } from './components/dashboard/DonationsVaultView.tsx';
import { NotificationsView } from './components/dashboard/NotificationsView.tsx';
import { ProfileView } from './components/dashboard/ProfileView.tsx';
import { SettingsView } from './components/dashboard/SettingsView.tsx';

const AppContent: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, isLoggedIn } = useDevotee();
  const { syncTranslate } = useLanguage();

  // Navigation route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  });

  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);

  // Sync Google Translate when route changes
  useEffect(() => {
    syncTranslate();
  }, [currentRoute, routeParam, syncTranslate]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        const [route, param] = hash.split('?id=');
        setCurrentRoute(route);
        setRouteParam(param);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string, param?: string) => {
    setCurrentRoute(path);
    setRouteParam(param);
    const hashUrl = param ? `#${path}?id=${param}` : `#${path}`;
    window.history.pushState(null, '', hashUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardRoute = currentRoute.startsWith('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F6]">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Devotee Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => navigate('dashboard')}
      />

      {isDashboardRoute ? (
        /* Authenticated Dashboard Shell */
        <DashboardLayout
          currentModule={currentRoute.replace('dashboard/', '').replace('dashboard', 'overview')}
          onNavigateModule={(mod) => navigate(mod === 'overview' ? 'dashboard' : `dashboard/${mod}`)}
          onNavigatePublic={(path) => navigate(path)}
        >
          {(() => {
            const mod = currentRoute.replace('dashboard/', '').replace('dashboard', 'overview');
            switch (mod) {
              case 'overview':
                return (
                  <DashboardOverview
                    onNavigateModule={(m) => navigate(`dashboard/${m}`)}
                    onNavigatePublic={(p) => navigate(p)}
                  />
                );
              case 'rituals':
                return <RitualsView onNavigatePublic={navigate} />;
              case 'appointments':
                return <AppointmentsView onNavigatePublic={navigate} />;
              case 'learning':
                return <GurukulLearningView />;
              case 'astrology':
                return <AstrologyView />;
              case 'donations':
                return <DonationsVaultView />;
              case 'events':
                return <EventsView onNavigate={navigate} />;
              case 'resources':
                return <ResourcesView onNavigate={navigate} />;
              case 'notifications':
                return <NotificationsView onNavigateModule={(m) => navigate(`dashboard/${m}`)} />;
              case 'profile':
                return <ProfileView />;
              case 'settings':
                return <SettingsView />;
              default:
                return (
                  <DashboardOverview
                    onNavigateModule={(m) => navigate(`dashboard/${m}`)}
                    onNavigatePublic={(p) => navigate(p)}
                  />
                );
            }
          })()}
        </DashboardLayout>
      ) : (
        /* Public Website Shell */
        <div className="flex flex-col min-h-screen justify-between">
          <PublicHeader currentPath={currentRoute} onNavigate={navigate} />

          <main className="flex-1 pt-[108px] sm:pt-[120px]">
            {(() => {
              switch (currentRoute) {
                case 'home':
                  return <HomeView onNavigate={navigate} />;
                case 'about':
                  return <AboutView onNavigate={navigate} />;
                case 'jyotish':
                  return <AppointmentBookingView onNavigate={navigate} initialServiceId="jyotish" />;
                case 'yadnik-and-pooja':
                  return <PoojaCatalogueView onNavigate={navigate} selectedPoojaId={routeParam} />;
                case 'gurukul':
                  return <GurukulCatalogueView onNavigate={navigate} />;
                case 'gurukul-agni-sukta':
                  return <AgniSuktaPlayerView onNavigate={navigate} />;
                case 'book-appointment':
                  return <AppointmentBookingView onNavigate={navigate} initialServiceId={routeParam} />;
                case 'events':
                  return <EventsView onNavigate={navigate} />;
                case 'resources':
                  return <ResourcesView onNavigate={navigate} />;
                case 'donate':
                  return <DonateView onNavigate={navigate} />;
                case 'contact':
                  return <ContactView onNavigate={navigate} />;
                default:
                  return <HomeView onNavigate={navigate} />;
              }
            })()}
          </main>

          <PublicFooter onNavigate={navigate} />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DevoteeProvider>
        <AppContent />
      </DevoteeProvider>
    </LanguageProvider>
  );
}
