import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { Language } from '../../types/index.ts';

interface DashboardLayoutProps {
  currentModule: string;
  onNavigateModule: (module: string) => void;
  onNavigatePublic: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentModule,
  onNavigateModule,
  onNavigatePublic,
  children,
}) => {
  const { language, setLanguage, t, loc } = useLanguage();
  const { profile, rituals, logout, showToast } = useDevotee();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const devoteeDisplayName =
    profile.name?.trim() ||
    loc('Registered Yajamana', 'नोंदणीकृत यजमान', 'पंजीकृत यजमान', 'નોંધાયેલ યજમાન');

  const activeRitualsCount = rituals.filter((r) => r.status !== 'completed').length;

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'overview', key: 'nav.overview', icon: 'dashboard' },
    {
      id: 'rituals',
      key: 'nav.rituals',
      icon: 'local_fire_department',
      badge:
        activeRitualsCount > 0
          ? loc(
              `${activeRitualsCount} Active`,
              `${activeRitualsCount} चालू`,
              `${activeRitualsCount} सक्रिय`,
              `${activeRitualsCount} સક્રિય`
            )
          : undefined,
      badgeColor: 'bg-[#FFD979] text-[#795D00]',
    },
    { id: 'appointments', key: 'nav.appointments', icon: 'calendar_month' },
    {
      id: 'learning',
      key: 'nav.learning',
      icon: 'menu_book',
      badge: loc('Gurukul', 'गुरुकुल', 'गुरुकुल', 'ગુરુકુળ'),
      badgeColor: 'bg-[#FFDCC1] text-[#2E1600]',
    },
    { id: 'astrology', key: 'nav.astrology', icon: 'auto_awesome' },
    { id: 'donations', key: 'nav.donations', icon: 'receipt_long' },
    { id: 'events', key: 'nav.events', icon: 'groups' },
    { id: 'resources', key: 'nav.resources', icon: 'library_books' },
  ];

  const subNavItems = [
    { id: 'notifications', key: 'nav.notifications', icon: 'notifications', dot: true },
    { id: 'profile', key: 'nav.profile', icon: 'badge' },
    { id: 'settings', key: 'nav.settings', icon: 'settings' },
  ];

  const languagesList: { code: Language; label: string }[] = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'en', label: 'English' },
  ];

  const handleSignOut = () => {
    logout();
    onNavigatePublic('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('rudra') || q.includes('mrityunjaya') || q.includes('yajna') || q.includes('यज्ञ')) {
      onNavigateModule('rituals');
    } else if (q.includes('tax') || q.includes('80g') || q.includes('receipt') || q.includes('पावती')) {
      onNavigateModule('donations');
    } else if (q.includes('kundali') || q.includes('jyotish') || q.includes('कुंडली') || q.includes('दशा')) {
      onNavigateModule('astrology');
    } else if (q.includes('veda') || q.includes('course') || q.includes('agni') || q.includes('अग्नि')) {
      onNavigateModule('learning');
    } else {
      showToast(`'${searchQuery}' (${t('dash.searchPlaceholder')})`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221918]">
      {/* Mobile Backdrop for Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar (260px) */}
      <aside
        className={`fixed left-0 top-0 h-full w-[270px] bg-[#FFF0ED] shadow-[0_1px_12px_rgba(0,0,0,0.06)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 border-r border-[#E0BFBF]/30 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Sidebar Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between bg-white border-b border-[#E0BFBF]/30">
            <button
              onClick={() => onNavigatePublic('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              title="Return to Public Website"
            >
              <Logo size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-[14px] font-bold tracking-tight text-[#570013] leading-tight truncate">
                  {t('org.name')}
                </span>
                <span className="text-[11px] text-[#765B00] font-medium truncate">
                  {t('devoteeSanctum')} • Portal
                </span>
              </div>
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#584141] hover:text-[#570013] p-1.5 rounded-lg hover:bg-[#FFF0ED] cursor-pointer"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3">
            <nav className="flex flex-col gap-1 text-xs">
              {navItems.map((item) => {
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateModule(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#800020] text-white font-bold shadow-xs'
                        : 'text-[#584141] hover:bg-[#F6E4E1] hover:text-[#221918]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-lg leading-none shrink-0 opacity-80">
                        {item.icon}
                      </span>
                      <span className="truncate">{t(item.key)}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="my-2 mx-1 h-[1px] bg-[#E0BFBF]/40"></div>

              {subNavItems.map((item) => {
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateModule(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#800020] text-white font-bold shadow-xs'
                        : 'text-[#584141] hover:bg-[#F6E4E1] hover:text-[#221918]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-lg leading-none shrink-0 opacity-80">
                        {item.icon}
                      </span>
                      <span className="truncate">{t(item.key)}</span>
                    </div>
                    {item.dot && (
                      <span className="w-2 h-2 rounded-full bg-[#BA1A1A] shrink-0"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Devotee Identity Card at bottom */}
        <div className="p-3 bg-white/95 m-2.5 rounded-xl border border-[#E0BFBF]/40 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onNavigateModule('profile');
                setMobileSidebarOpen(false);
              }}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FFD979] text-[#795D00] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {devoteeDisplayName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#221918] truncate leading-tight">
                  {devoteeDisplayName}
                </span>
                <span className="text-[11px] text-[#765B00] font-mono truncate font-semibold">
                  {profile.code || '#CVP-DEVOTEE'}
                </span>
              </div>
            </button>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-[#584141] hover:bg-[#F6E4E1] hover:text-[#BA1A1A] transition-colors cursor-pointer"
              title={t('nav.logout')}
            >
              <span className="material-symbols-outlined text-base leading-none">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper (offset by 270px on desktop) */}
      <div className="lg:pl-[270px] flex flex-col min-h-screen justify-between">
        {/* Top Utility Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E0BFBF]/30 px-4 lg:px-8 flex items-center justify-between gap-3">
          {/* Left: Hamburger + Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#584141] hover:bg-[#FFF0ED] cursor-pointer"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-xl leading-none">menu</span>
            </button>

            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <span className="material-symbols-outlined text-base text-[#584141] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dash.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFF8F6] border border-[#E0BFBF]/50 text-xs text-[#221918] placeholder:text-[#584141]/60 focus:outline-none focus:border-[#800020]"
              />
            </form>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Auspicious Muhurta Banner */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6E4E1] text-[#221918] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm text-[#765B00] leading-none">
                brightness_7
              </span>
              <span>{t('dash.muhurtaValue')}</span>
            </div>

            {/* New Booking CTA */}
            <button
              onClick={() => onNavigateModule('rituals')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-[#570013] text-white text-xs font-bold rounded-lg hover:bg-[#800020] transition-all shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base leading-none">add_circle</span>
              <span>{t('dash.newBooking')}</span>
            </button>

            {/* Multilingual Switcher (all 4 languages: mr, hi, gu, en) */}
            <div className="flex items-center px-1.5 sm:px-2 py-1 rounded-lg bg-[#FFF0ED] text-[11px] text-[#584141] gap-1 border border-[#E0BFBF]/40">
              {languagesList.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span className="opacity-30 text-[10px]">|</span>}
                  <button
                    onClick={() => setLanguage(l.code)}
                    className={`cursor-pointer px-1 rounded transition-colors ${
                      language === l.code
                        ? 'text-[#570013] font-bold bg-[#FFDADA]'
                        : 'hover:text-[#221918]'
                    }`}
                    title={l.label}
                  >
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => onNavigateModule('notifications')}
              className="relative p-2 rounded-lg text-[#584141] hover:bg-[#F6E4E1] transition-colors cursor-pointer"
              title={t('nav.notifications')}
            >
              <span className="material-symbols-outlined text-xl leading-none">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white"></span>
            </button>

            {/* Devotee Avatar */}
            <button
              onClick={() => onNavigateModule('profile')}
              className="relative flex items-center pl-1 cursor-pointer"
              title={t('nav.profile')}
            >
              <div className="w-8 h-8 rounded-full bg-[#FFD979] text-[#795D00] ring-1 ring-[#765B00] flex items-center justify-center font-bold text-xs">
                {devoteeDisplayName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#E8C264] ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Dynamic Content Canvas */}
        <main className="w-full p-3 sm:p-5 lg:p-8 flex-1">{children}</main>

        {/* Dashboard Compact Institutional Footer */}
        <footer className="w-full bg-[#FFF0ED] py-3 px-4 lg:px-8 border-t border-[#E0BFBF]/30 text-xs text-[#584141]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>
              © 2025 {t('org.name')} • {t('devoteeSanctum')} • Regd. Public Charitable Trust F/49210
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs leading-none">lock</span>
                <span>
                  {loc(
                    '256-bit Encrypted Shastric Vault',
                    '२५६-बिट सुरक्षित शास्त्रीय संच',
                    '256-बिट सुरक्षित शास्त्रीय संच',
                    '૨૫૬-બિટ સુરક્ષિત શાસ્ત્રીય ભંડાર'
                  )}
                </span>
              </span>
              <span>•</span>
              <span>
                {t('dash.liaisonTitle')}:{' '}
                <a href="tel:+919822054321" className="text-[#570013] font-bold hover:underline font-mono">
                  +91 98220 54321
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
