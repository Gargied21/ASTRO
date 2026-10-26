import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { Language } from '../../types/index.ts';

interface PublicHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPath, onNavigate }) => {
  const { language, setLanguage, t, loc } = useLanguage();
  const { isLoggedIn, setIsLoginModalOpen, profile } = useDevotee();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', key: 'nav.home', icon: 'home' },
    { id: 'about', key: 'nav.about', icon: 'info' },
    { id: 'jyotish', key: 'nav.jyotish', icon: 'auto_awesome' },
    { id: 'yadnik-and-pooja', key: 'nav.pooja', icon: 'local_fire_department' },
    { id: 'gurukul', key: 'nav.gurukul', icon: 'menu_book' },
    { id: 'events', key: 'nav.events', icon: 'event' },
    { id: 'resources', key: 'nav.resources', icon: 'library_books' },
    { id: 'contact', key: 'nav.contact', icon: 'call' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const languagesList: { code: Language; label: string; short: string }[] = [
    { code: 'mr', label: 'मराठी', short: 'मरा' },
    { code: 'hi', label: 'हिंदी', short: 'हिं' },
    { code: 'gu', label: 'ગુજરાતી', short: 'ગુ' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-[#FFF8F6] shadow-[0_1px_8px_rgba(36,27,25,0.05)] border-b border-[#E0BFBF]/30 transition-all">
        {/* Top Utility Ribbon */}
        <div className="w-full bg-[#FFF0ED] border-b border-[#E0BFBF]/30">
          <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-10 h-9 sm:h-10 flex items-center justify-between text-[#584141] text-xs font-medium">
            {/* Left helpline & motto */}
            <div className="flex items-center gap-2 sm:gap-4 truncate">
              <a
                href="tel:+919822054321"
                className="flex items-center gap-1 sm:gap-1.5 hover:text-[#570013] transition-colors shrink-0"
                title="Call Ashram Helpline"
              >
                <span className="material-symbols-outlined text-[15px] text-[#765B00]">call</span>
                <span className="hidden sm:inline font-semibold text-xs">{t('helpline')}: </span>
                <span className="font-mono text-[#570013] text-[11px] sm:text-xs font-semibold">
                  +91 98220 54321
                </span>
              </a>
              <span className="hidden md:inline-block text-[#E0BFBF]">|</span>
              <span className="hidden md:inline text-[#765B00] font-semibold tracking-wide font-serif text-[11px] lg:text-xs">
                {t('org.motto')}
              </span>
            </div>

            {/* Right Language & Quick Auth Links */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-md px-1.5 py-0.5 border border-[#E0BFBF]/60 shadow-2xs">
                <span className="material-symbols-outlined text-[13px] text-[#765B00] hidden sm:inline mr-0.5">
                  translate
                </span>
                {languagesList.map((lang, index) => (
                  <React.Fragment key={lang.code}>
                    {index > 0 && <span className="text-[#E0BFBF] text-[10px]">/</span>}
                    <button
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-1 sm:px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'text-[#570013] font-bold bg-[#FFDADA] shadow-2xs'
                          : 'text-[#584141] hover:text-[#570013]'
                      }`}
                      title={`Switch language to ${lang.label}`}
                    >
                      <span className="sm:hidden">{lang.short}</span>
                      <span className="hidden sm:inline">{lang.label}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Quick Donate Link (sm+) */}
              <button
                onClick={() => handleNavClick('donate')}
                className="hidden sm:flex text-[#765B00] hover:text-[#570013] transition-colors font-semibold items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                <span className="text-[11px] sm:text-xs">{t('donateTitle')}</span>
              </button>

              {/* Devotee Account / Login */}
              {isLoggedIn ? (
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-1 text-[#570013] hover:text-[#800020] font-semibold transition-colors cursor-pointer"
                  title="Go to Devotee Sanctum Console"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#765B00]">account_circle</span>
                  <span className="hidden sm:inline text-xs font-bold">{t('devoteeSanctum')}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1 text-[#584141] hover:text-[#570013] transition-colors cursor-pointer text-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">login</span>
                  <span className="font-semibold hidden xs:inline">{t('devoteeLogin')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Brand Navigation Bar */}
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 shrink-0 text-left cursor-pointer group min-w-0"
            title={t('org.name')}
          >
            <div className="shrink-0">
              <Logo size="md" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-sm sm:text-lg lg:text-xl font-bold text-[#570013] group-hover:text-[#800020] transition-colors tracking-tight leading-tight truncate">
                {t('org.name')}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-semibold text-[#765B00] tracking-wide truncate">
                  {t('org.tagline')}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links (Visible on lg: 1024px+) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[13px] xl:text-sm font-medium text-[#584141]">
            {navLinks.map((link) => {
              const isActive = currentPath === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#570013] font-bold bg-[#FCEAE6] shadow-2xs'
                      : 'hover:text-[#221918] hover:bg-[#FFF0ED]'
                  }`}
                >
                  {t(link.key)}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('donate')}
              className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 sm:py-2 rounded-lg border border-[#765B00] text-[#570013] text-xs sm:text-sm font-semibold hover:bg-[#FCEAE6] transition-colors cursor-pointer"
            >
              {t('donateTitle')}
            </button>
            <button
              onClick={() => handleNavClick('book-appointment')}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#800020] text-white text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#570013] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm sm:text-base mr-1">calendar_month</span>
              <span className="hidden sm:inline">{t('bookAppointment')}</span>
              <span className="sm:hidden">{loc('Book', 'नोंदणी', 'पंजीकरण', 'બુક')}</span>
            </button>

            {/* Mobile Menu Trigger Button (Visible on < lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#570013] hover:bg-[#FCEAE6] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu via Portal directly to body */}
      {mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] w-screen h-screen flex justify-end">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/60 transition-opacity cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Sidebar */}
            <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FFF8F6] h-screen max-h-screen shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#E0BFBF]/40 z-10">
              <div>
                {/* Drawer Header */}
                <div className="p-4 bg-white border-b border-[#E0BFBF]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Logo size="sm" />
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-bold text-[#570013] leading-tight">
                        {t('org.name')}
                      </span>
                      <span className="text-[11px] text-[#765B00] font-medium">
                        {t('org.tagline')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-[#584141] hover:bg-[#FFF0ED] hover:text-[#570013] cursor-pointer"
                    aria-label="Close menu"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Language Switcher inside Drawer */}
                <div className="p-4 bg-[#FFF0ED]/90 border-b border-[#E0BFBF]/20">
                  <span className="text-[11px] font-bold text-[#765B00] uppercase tracking-wider block mb-2">
                    {t('ui.selectLanguage')}
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-lg border border-[#E0BFBF]/40">
                    {languagesList.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`py-1.5 text-xs font-semibold rounded text-center transition-all cursor-pointer ${
                          language === lang.code
                            ? 'bg-[#800020] text-white shadow-xs'
                            : 'text-[#584141] hover:bg-[#FCEAE6]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Devotee Account Status / Action */}
                <div className="p-4 border-b border-[#E0BFBF]/20 bg-white">
                  {isLoggedIn ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FFD979] text-[#795D00] flex items-center justify-center font-bold text-xs">
                          {profile.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#221918]">{profile.name}</span>
                          <span className="text-[10px] text-[#765B00] font-mono">{profile.code}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-[#570013] rounded-md shadow-2xs cursor-pointer"
                      >
                        {t('devoteeSanctum')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold flex items-center justify-center gap-2 border border-[#E0BFBF]/60 hover:bg-[#FFDADA] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">login</span>
                      <span>{t('devoteeLogin')}</span>
                    </button>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="p-3 flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isActive = currentPath === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#800020] text-white font-bold shadow-xs'
                            : 'text-[#221918] hover:bg-[#FFF0ED]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg leading-none shrink-0 opacity-80">
                          {link.icon}
                        </span>
                        <span>{t(link.key)}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions in Drawer */}
              <div className="p-4 bg-white border-t border-[#E0BFBF]/30 flex flex-col gap-2.5">
                <button
                  onClick={() => handleNavClick('book-appointment')}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#FFD979] text-[#795D00] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span>{t('bookAppointment')}</span>
                </button>
                <button
                  onClick={() => handleNavClick('donate')}
                  className="w-full py-2 px-3 rounded-lg border border-[#765B00] text-[#570013] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#FFF0ED] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">volunteer_activism</span>
                  <span>{t('donateTitle')}</span>
                </button>

                <div className="flex items-center justify-between text-xs text-[#584141] pt-2 border-t border-[#E0BFBF]/30">
                  <a
                    href="tel:+919822054321"
                    className="flex items-center gap-1 text-[#570013] font-semibold hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>{t('helplineNum')}</span>
                  </a>
                  <a
                    href="https://wa.me/919822054321"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#25D366] font-semibold hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
