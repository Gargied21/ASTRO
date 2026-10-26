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
  const { isLoginModalOpen, setIsLoginModalOpen, isLoggedIn, isLoading } = useDevotee();
  const { syncTranslate, loc } = useLanguage();

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

  // Prompt login modal if visiting a protected dashboard route while unauthenticated
  useEffect(() => {
    if (isDashboardRoute && !isLoggedIn && !isLoading) {
      setIsLoginModalOpen(true);
    }
  }, [isDashboardRoute, isLoggedIn, isLoading, setIsLoginModalOpen]);

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

      {isDashboardRoute && isLoggedIn ? (
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
      ) : isDashboardRoute && !isLoggedIn ? (
        /* Protected Route Gate when unauthenticated */
        <div className="flex flex-col min-h-screen justify-between">
          <PublicHeader currentPath="home" onNavigate={navigate} />
          <main className="flex-1 pt-[140px] pb-20 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E0BFBF]/60 shadow-md text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FFF0ED] text-[#800020] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#570013]">
                {loc(
                  'Devotee Sanctum Authentication Required',
                  'भक्त कक्ष प्रवेशासाठी लॉगिन आवश्यक',
                  'भक्त कक्ष प्रवेश हेतु प्रमाणीकरण आवश्यक',
                  'ભક્ત કક્ષ પ્રવેશ માટે પ્રમાણીકરણ આવશ્યક'
                )}
              </h2>
              <p className="text-sm text-[#584141] leading-relaxed">
                {loc(
                  'Please verify your mobile number via sacred OTP to access your personal rituals, 80G tax receipts, and Jyotish consultations.',
                  'आपले वैयक्तिक अनुष्ठान, ८०-जी कर पावत्या आणि ज्योतिष सल्ला पाहण्यासाठी कृपया ओटीपी द्वारे लॉगिन करा.',
                  'अपने व्यक्तिगत अनुष्ठान, 80G रसीदें और ज्योतिष परामर्श देखने के लिए कृपया ओटीपी से लॉगिन करें।',
                  'આપના વ્યક્તિગત અનુષ્ઠાન, 80G પાવતીઓ અને જ્યોતિષ પરામર્શ જોવા માટે કૃપા કરીને OTP થી લોગિન કરો.'
                )}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#800020] text-white text-xs font-bold hover:bg-[#570013] transition-colors cursor-pointer"
                >
                  {loc('Sign In with OTP', 'ओटीपीने लॉगिन करा', 'ओटीपी से लॉगिन करें', 'OTP થી લોગિન કરો')}
                </button>
                <button
                  onClick={() => navigate('home')}
                  className="px-4 py-2.5 rounded-xl border border-[#E0BFBF] text-[#584141] text-xs font-semibold hover:bg-[#FFF0ED] transition-colors cursor-pointer"
                >
                  {loc('Return Home', 'मुख्य पृष्ठ', 'मुख्य पृष्ठ', 'મુખ્ય પૃષ્ઠ')}
                </button>
              </div>
            </div>
          </main>
          <PublicFooter onNavigate={navigate} />
        </div>
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
