import React from 'react';
import { Logo } from './Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="w-full bg-[#FFF0ED] text-[#221918] border-t border-[#E0BFBF]/40 mt-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Institution Brand & Trust info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="flex flex-col">
                <span className="font-serif text-lg leading-tight text-[#570013] font-bold">
                  {t('org.name')}
                </span>
                <span className="text-xs text-[#765B00] tracking-wide font-medium">
                  {t('org.tagline')}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#584141] leading-relaxed">
              {t('footer.aboutDesc')}
            </p>
            <div className="bg-white rounded-lg p-3 shadow-2xs border border-[#E0BFBF]/40 flex flex-col gap-1">
              <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
                {t('footer.trustTitle')}
              </span>
              <span className="text-xs text-[#584141]">
                {t('footer.trustDetails')}
              </span>
            </div>
          </div>

          {/* Column 2: Services & Rituals */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-base text-[#570013] font-serif font-bold border-b border-[#E0BFBF]/40 pb-2">
              {t('footer.servicesTitle')}
            </h4>
            <ul className="space-y-2 text-sm text-[#584141]">
              <li>
                <button
                  onClick={() => onNavigate('jyotish')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">brightness_high</span>
                  <span>{language === 'mr' ? 'फलज्योतिष व कुंडली वेध' : language === 'hi' ? 'वैदिक ज्योतिष एवं जन्मकुंडली' : language === 'gu' ? 'જ્યોતિષ અને જન્મકુંડળી' : 'Vedic Astrology & Horoscopy'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('yadnik-and-pooja')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">local_fire_department</span>
                  <span>{language === 'mr' ? 'नवचंडी व शतचंडी महायज्ञ' : language === 'hi' ? 'नवचंडी एवं शतचंडी महायज्ञ' : language === 'gu' ? 'નવચંડી અને શતચંડી મહાયજ્ઞ' : 'Navchandi & Shatachandi Mahayagya'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('yadnik-and-pooja')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">water_drop</span>
                  <span>{language === 'mr' ? 'लघुरुद्र व महारुद्राभिषेक' : language === 'hi' ? 'लघुरुद्र एवं महारुद्राभिषेक' : language === 'gu' ? 'લઘુરુદ્ર અને મહારુદ્રાભિષેક' : 'Laghu Rudra & Maha Rudrabhishek'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('yadnik-and-pooja')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">home</span>
                  <span>{language === 'mr' ? 'वास्तुशांती व गृहप्रवेश विधी' : language === 'hi' ? 'वास्तु शांति एवं गृह प्रवेश' : language === 'gu' ? 'વાસ્તુ શાંતિ અને ગૃહ પ્રવેશ' : 'Vastu Shanti & Griha Pravesh'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('yadnik-and-pooja')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">spa</span>
                  <span>{language === 'mr' ? 'महामृत्युंजय अनुष्ठान' : language === 'hi' ? 'महामृत्युंजय अनुष्ठान' : language === 'gu' ? 'મહામૃત્યુંજય અનુષ્ઠાન' : 'Maha Mrityunjaya Anushthan'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Education & Resources */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-base text-[#570013] font-serif font-bold border-b border-[#E0BFBF]/40 pb-2">
              {language === 'mr' ? 'ज्ञानसाधना व गुरुकुल' : language === 'hi' ? 'शिक्षा एवं गुरुकुल' : language === 'gu' ? 'શિક્ષણ અને ગુરુકુળ' : 'Education & Resources'}
            </h4>
            <ul className="space-y-2 text-sm text-[#584141]">
              <li>
                <button
                  onClick={() => onNavigate('gurukul')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">menu_book</span>
                  <span>{t('pillars.gurukulTitle')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gurukul-agni-sukta')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">headphones</span>
                  <span>{language === 'mr' ? 'अग्निसूक्त सस्वर ध्वनीमुद्रण' : language === 'hi' ? 'अग्निसूक्त सस्वर पाठ' : language === 'gu' ? 'અગ્નિસૂક્ત સસ્વર પાઠ' : 'Agni Sukta Recitation Console'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">download</span>
                  <span>{language === 'mr' ? 'स्तोत्र रत्नावली व ग्रंथ' : language === 'hi' ? 'स्तोत्र संग्रह एवं ग्रंथ' : language === 'gu' ? 'સ્તોત્ર સંગ્રહ અને ગ્રંથો' : 'Stotra Ratnavali & Sacred PDFs'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resources')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">calendar_month</span>
                  <span>{language === 'mr' ? 'दैनिक पंचांग व मुहूर्त' : language === 'hi' ? 'दैनिक पंचांग एवं मुहूर्त' : language === 'gu' ? 'દૈનિક પંચાંગ અને મુહૂર્ત' : 'Daily Panchang & Muhurta'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-[#570013] transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#765B00]">event</span>
                  <span>{language === 'mr' ? 'सत्संग व आध्यात्मिक उत्सव' : language === 'hi' ? 'सत्संग एवं आध्यात्मिक उत्सव' : language === 'gu' ? 'સત્સંગ અને આધ્યાત્મિક ઉત્સવ' : 'Spiritual Discourse & Satsang'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Reach Us & Timings */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-base text-[#570013] font-serif font-bold border-b border-[#E0BFBF]/40 pb-2">
              {t('footer.contactTitle')}
            </h4>
            <div className="text-sm text-[#584141] space-y-2.5">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#765B00] shrink-0 mt-0.5">location_on</span>
                <span>{t('footer.address')}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#765B00] shrink-0">schedule</span>
                <span>{language === 'mr' ? 'नित्य संपर्क: सकाळी ९:०० ते सायं ६:००' : language === 'hi' ? 'दैनिक संपर्क: प्रातः 9:00 से सायं 6:00' : language === 'gu' ? 'દૈનિક સંપર્ક: સવારે ૯:૦૦ થી સાંજે ૬:૦૦' : 'Daily Consultations: 09:00 AM – 06:00 PM'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#765B00] shrink-0">call</span>
                <a href="tel:+919822054321" className="hover:text-[#570013] font-semibold text-[#570013] font-mono">
                  +91 98220 54321
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#765B00] shrink-0">mail</span>
                <a href="mailto:seva@chaitanyaved.org" className="hover:text-[#570013]">
                  seva@chaitanyaved.org
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-[#E0BFBF]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#584141] gap-4 text-center sm:text-left">
          <span>{t('footer.copyright')}</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => onNavigate('about')} className="hover:text-[#570013] cursor-pointer">
              {t('nav.about')}
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#570013] cursor-pointer">
              {t('nav.contact')}
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('donate')} className="hover:text-[#570013] cursor-pointer">
              {t('nav.donate')}
            </button>
            <span>•</span>
            <span className="text-[#765B00] font-semibold font-serif">॥ सत्यमेव जयते नानृतम् ॥</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
