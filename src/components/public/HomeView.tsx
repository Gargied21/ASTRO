import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { poojaServices } from '../../data/poojaData.ts';
import { formatLocalizedNumber } from '../../utils/formatters.ts';
import offlineLogo from '../../assets/logo.png';

interface HomeViewProps {
  onNavigate: (path: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { language, t, loc } = useLanguage();
  const featuredPoojas = poojaServices.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO */}
      <section className="relative w-full overflow-hidden bg-[#FFF8F6] py-14 lg:py-24">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#FFDF94]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#FFDADA]/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Text Content */}
            <div className="lg:col-span-7 flex flex-col space-y-5">
              {/* Overline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6E4E1] w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#765B00]"></span>
                <span className="text-xs font-semibold text-[#765B00] tracking-widest uppercase">
                  {t('home.heroBadge')}
                </span>
                <span className="text-[#8C7071] text-xs">|</span>
                <span className="text-xs text-[#584141] font-medium">
                  {loc('Authentic & Scholarly', 'प्रामाणिक व शास्त्रोक्त', 'प्रामाणिक एवं शास्त्रोक्त', 'પ્રમાણિક અને શાસ્ત્રોક્ત')}
                </span>
              </div>

              {/* Hero Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#570013] font-bold tracking-tight leading-tight lg:leading-[56px]">
                {t('home.heroTitle1')}
                <br />
                <span className="italic font-normal text-[#221918]">
                  {t('home.heroTitle2')}
                </span>
              </h1>

              {/* Body Description */}
              <p className="text-base sm:text-lg text-[#584141] max-w-2xl leading-relaxed">
                {t('home.heroDesc')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('book-appointment')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#570013] text-white text-sm font-semibold shadow-md hover:bg-[#800020] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                  <span>{t('home.ctaBook')}</span>
                </button>
                <button
                  onClick={() => onNavigate('yadnik-and-pooja')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#FCEAE6] text-[#570013] text-sm font-semibold shadow-xs hover:bg-[#F6E4E1] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#765B00]">explore</span>
                  <span>{t('home.ctaExplore')}</span>
                </button>
              </div>

              {/* Trust Markers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 max-w-xl">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FFF0ED] shadow-xs">
                  <span className="material-symbols-outlined text-[#765B00] text-[22px]">verified</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#221918] font-bold">{t('home.trust1')}</span>
                    <span className="text-[11px] text-[#584141]">{t('home.trust1Sub')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FFF0ED] shadow-xs">
                  <span className="material-symbols-outlined text-[#765B00] text-[22px]">auto_stories</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#221918] font-bold">{t('home.trust2')}</span>
                    <span className="text-[11px] text-[#584141]">{t('home.trust2Sub')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FFF0ED] shadow-xs col-span-2 sm:col-span-1">
                  <span className="material-symbols-outlined text-[#765B00] text-[22px]">visibility</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#221918] font-bold">{t('home.trust3')}</span>
                    <span className="text-[11px] text-[#584141]">{t('home.trust3Sub')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Sacred Emblem Visual */}
            <div className="lg:col-span-5 relative flex justify-center mt-8 lg:mt-0">
              <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
                {/* Concentric Golden Circles */}
                <div className="absolute inset-0 rounded-full bg-[#F6E4E1]/60 shadow-inner"></div>
                <div className="absolute inset-4 rounded-full bg-[#FFF0ED] shadow-md"></div>
                <div className="absolute inset-8 rounded-full bg-[#FCEAE6] shadow-sm flex items-center justify-center">
                  {/* Sacred Mandala Line Artwork */}
                  <svg
                    className="absolute w-full h-full text-[#765B00]/15 animate-[spin_120s_linear_infinite]"
                    fill="none"
                    viewBox="0 0 200 200"
                  >
                    <circle cx="100" cy="100" r="95" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1.5"></circle>
                    <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1"></circle>
                    <polygon points="100,10 120,80 190,100 120,120 100,190 80,120 10,100 80,80" stroke="currentColor" strokeWidth="0.8"></polygon>
                    <polygon points="100,25 115,85 175,100 115,115 100,175 85,115 25,100 85,85" stroke="currentColor" strokeWidth="0.8" transform="rotate(45 100 100)"></polygon>
                  </svg>
                </div>

                {/* Central Official Insignia Seal */}
                <div className="relative z-10 w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-2xl p-1 bg-gradient-to-tr from-[#570013] to-[#800020] flex items-center justify-center">
                  <img
                    src={offlineLogo || '/logo.png'}
                    alt="Chaitanya Ved Pratishthan Official Seal"
                    className="w-full h-full object-cover rounded-full shadow-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== window.location.origin + '/logo.png') {
                        target.src = '/logo.png';
                      }
                    }}
                    loading="eager"
                  />
                </div>

                {/* Floating Stamp */}
                <div className="absolute -bottom-2 -left-2 bg-white text-[#221918] px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20 border border-[#E0BFBF]/40">
                  <span className="material-symbols-outlined text-[#765B00] text-[20px]">workspace_premium</span>
                  <span className="text-xs font-semibold tracking-wide">
                    {t('home.experience')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE FOUR PILLARS */}
      <section className="w-full bg-[#FFF0ED] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-[#765B00] uppercase tracking-widest font-semibold">
                चार मुख्य स्तंभ • The Four Pillars
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                {t('pillars.title')}
              </h2>
            </div>
            <p className="text-sm text-[#584141] max-w-md">
              {t('pillars.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Jyotish */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#570013] shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">brightness_high</span>
                </div>
                <div>
                  <span className="text-xs text-[#765B00] font-medium tracking-wide">
                    वेदचक्षु • Astrology
                  </span>
                  <h3 className="font-serif text-lg text-[#221918] font-bold mt-1">
                    {t('pillars.jyotishTitle')}
                  </h3>
                </div>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {t('pillars.jyotishDesc')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('jyotish')}
                className="inline-flex items-center gap-1.5 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-2 transition-colors cursor-pointer"
              >
                <span>Consult Scholars</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Pillar 2: Yadnik */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#570013] shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">local_fire_department</span>
                </div>
                <div>
                  <span className="text-xs text-[#765B00] font-medium tracking-wide">
                    कर्मकांड • Sacred Rites
                  </span>
                  <h3 className="font-serif text-lg text-[#221918] font-bold mt-1">
                    {t('pillars.yadnikTitle')}
                  </h3>
                </div>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {t('pillars.yadnikDesc')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('yadnik-and-pooja')}
                className="inline-flex items-center gap-1.5 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-2 transition-colors cursor-pointer"
              >
                <span>{loc('Explore Poojas', 'पूजा विधी पहा', 'पूजा विधि देखें', 'પૂજા વિધિ જુઓ')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Pillar 3: Gurukul */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#570013] shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">school</span>
                </div>
                <div>
                  <span className="text-xs text-[#765B00] font-medium tracking-wide">
                    {loc('Gurukul • Living Tradition', 'गुरुकुल • जिवंत परंपरा', 'गुरुकुल • सजीव परंपरा', 'ગુરુકુળ • જીવંત પરંપરા')}
                  </span>
                  <h3 className="font-serif text-lg text-[#221918] font-bold mt-1">
                    {t('pillars.gurukulTitle')}
                  </h3>
                </div>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {t('pillars.gurukulDesc')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('gurukul')}
                className="inline-flex items-center gap-1.5 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-2 transition-colors cursor-pointer"
              >
                <span>{loc('Adhyayan Scheme', 'अध्ययन योजना', 'अध्ययन योजना', 'અધ્યયન યોજના')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Pillar 4: Resources */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#570013] shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">menu_book</span>
                </div>
                <div>
                  <span className="text-xs text-[#765B00] font-medium tracking-wide">
                    {loc('Free Knowledge • Public Repository', 'विनामूल्य ज्ञान • ग्रंथ संग्रह', 'निःशुल्क ज्ञान • ग्रंथ संग्रह', 'વિનામૂલ્યે જ્ઞાન • ગ્રંથ સંગ્રહ')}
                  </span>
                  <h3 className="font-serif text-lg text-[#221918] font-bold mt-1">
                    {t('pillars.resourcesTitle')}
                  </h3>
                </div>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {t('pillars.resourcesDesc')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="inline-flex items-center gap-1.5 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-2 transition-colors cursor-pointer"
              >
                <span>{loc('Free Downloads', 'विनामूल्य डाउनलोड', 'निःशुल्क डाउनलोड', 'વિનામૂલ્યે ડાઉનલોડ')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED POOJAS & SACRAMENTAL CEREMONIES */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-[#765B00] uppercase tracking-widest font-semibold">
                {loc('Authentic Rituals', 'नियत पूजा व अनुष्ठान', 'प्रामाणिक पूजा एवं अनुष्ठान', 'પ્રમાણિક પૂજા અને અનુષ્ઠાન')}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                {loc('Featured Sacramental Ceremonies', 'प्रमुख यज्ञाहुती व विधी', 'प्रमुख यज्ञाहुति एवं विधियाँ', 'પ્રમુખ યજ્ઞાહુતિ અને વિધિઓ')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('yadnik-and-pooja')}
              className="inline-flex items-center gap-1 text-sm text-[#765B00] hover:text-[#570013] font-semibold transition-colors cursor-pointer"
            >
              <span>{loc('View All 24+ Vidhis', 'सर्व २४+ विधी पहा', 'सभी 24+ विधियाँ देखें', 'બધી ૨૪+ વિધિઓ જુઓ')}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPoojas.map((pooja) => {
              const poojaName =
                language === 'gu'
                  ? pooja.nameGu || pooja.nameEn
                  : language === 'hi'
                  ? pooja.nameHi || pooja.nameMr
                  : language === 'mr'
                  ? pooja.nameMr
                  : pooja.nameEn;
              const poojaDesc =
                language === 'gu'
                  ? pooja.descriptionGu || pooja.descriptionEn
                  : language === 'hi'
                  ? pooja.descriptionHi || pooja.descriptionMr
                  : language === 'mr'
                  ? pooja.descriptionMr
                  : pooja.descriptionEn;
              const categoryLabel = loc(
                pooja.category,
                pooja.categoryLabelMr,
                pooja.categoryLabelMr,
                pooja.categoryLabelMr
              );

              return (
                <div
                  key={pooja.id}
                  className="bg-[#FFF0ED] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between border border-[#E0BFBF]/30 group"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-[#FCEAE6]">
                    <img
                      src={pooja.image}
                      alt={poojaName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#570013] text-white text-xs px-2.5 py-1 rounded-md shadow-xs font-semibold">
                      {categoryLabel}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#765B00] font-medium">
                        <span>{pooja.duration}</span>
                        <span className="bg-white px-2 py-0.5 rounded text-[11px] font-semibold text-[#584141] shadow-xs">
                          {loc('Ashram & Online', 'आश्रम व थेट प्रक्षेपण', 'आश्रम एवं ऑनलाइन', 'આશ્રમ અને ઑનલાઇન')}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#570013] leading-snug">
                        {poojaName}
                      </h4>
                      <p className="text-xs text-[#584141] line-clamp-2 leading-relaxed">
                        {poojaDesc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#E0BFBF]/30">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#584141] uppercase">
                          {loc('Dakshina', 'दक्षिणा', 'दक्षिणा', 'દક્ષિણા')}
                        </span>
                        <span className="text-sm font-bold text-[#221918]">{pooja.priceLabel}</span>
                      </div>
                      <button
                        onClick={() => onNavigate('yadnik-and-pooja', pooja.id)}
                        className="p-2 rounded-lg bg-white text-[#570013] hover:bg-[#570013] hover:text-white transition-colors shadow-xs cursor-pointer"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: INSTITUTIONAL CREDIBILITY & THREE CORE TENETS */}
      <section className="w-full bg-[#F6E4E1] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="text-xs text-[#765B00] uppercase tracking-widest font-semibold">
              {loc('Institutional Integrity', 'आमची विचारसरणी व मूल्ये', 'हमारी विचारसरणी एवं मूल्य', 'અમારી વિચારસરણી અને મૂલ્યો')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
              {loc('Why Seek Guidance with Chaitanya Ved Pratishthan?', 'चैतन्य वेद प्रतिष्ठानकडून मार्गदर्शन का घ्यावे?', 'चैतन्य वेद प्रतिष्ठान से मार्गदर्शन क्यों लें?', 'ચૈતન્ય વેદ પ્રતિષ્ઠાન પાસેથી માર્ગદર્શન કેમ લેવું?')}
            </h2>
            <p className="text-base text-[#584141] leading-relaxed">
              {loc(
                'In an era filled with sensational astrological claims, our trust maintains an austere sanctuary dedicated strictly to shastric discipline, scholarship, and genuine empathy.',
                'सनसनाटी ज्योतिषीय दाव्यांच्या काळात आमचा ट्रस्ट शास्त्रोक्त शिस्त, विद्वत्ता आणि निष्ठा राखत कार्य करतो.',
                'सनसनीखेज ज्योतिषीय दावों के दौर में हमारा ट्रस्ट शास्त्रीय अनुशासन, विद्वता और निष्ठा बनाए रखते हुए कार्य करता है।',
                'સનસનાટીપૂર્ણ જ્યોતિષીય દાવાઓના સમયમાં અમારો ટ્રસ્ટ શાસ્ત્રોક્ત શિસ્ત, વિદ્વાનતા અને નિષ્ઠા જાળવીને કાર્ય કરે છે.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-xs flex flex-col space-y-3 relative border border-[#E0BFBF]/30">
              <div className="w-10 h-10 rounded-full bg-[#FFDADA] flex items-center justify-center font-bold text-[#570013] font-serif text-lg">
                {formatLocalizedNumber(1, language)}
              </div>
              <h3 className="font-serif text-lg text-[#221918] font-bold">
                {loc('Rigorous Shastra Conformance', 'शास्त्रोक्त शुद्धता व निष्ठा', 'शास्त्रोक्त शुद्धता एवं निष्ठा', 'શાસ્ત્રોક્ત શુદ્ધતા અને નિષ્ઠા')}
              </h3>
              <span className="text-xs text-[#765B00] font-medium">
                {loc('Purity in Chanting', 'मंत्रोच्चार शुद्धता', 'मंत्रोच्चार शुद्धता', 'મંત્રોચ્ચાર શુદ્ધતા')}
              </span>
              <p className="text-sm text-[#584141] leading-relaxed">
                {loc(
                  'Every mantra is voiced with strict swara intonation. Our purohits undergo twelve years of rigorous Shruti study under authorized traditional teachers.',
                  'प्रत्येक मंत्र शुद्ध स्वराघातासह म्हटला जातो. आमचे पुरोहित १२ वर्षांचे पारंपरिक श्रुति अध्ययन पूर्ण केलेले असतात.',
                  'प्रत्येक मंत्र शुद्ध स्वराघात के साथ उच्चारित होता है। हमारे पुरोहित 12 वर्षों का पारंपरिक श्रुति अध्ययन पूर्ण किए होते हैं।',
                  'દરેક મંત્ર શુદ્ધ સ્વરાઘાત સાથે ઉચ્ચારવામાં આવે છે. અમારા પુરોહિતોએ ૧૨ વર્ષનું પરંપરાગત શ્રુતિ અધ્યયન પૂર્ણ કરેલું હોય છે.'
                )}
              </p>
              <ul className="pt-2 space-y-1.5 text-xs text-[#221918]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Precise phonetic accuracy', 'अचूक वर्णोच्चार व स्वराघात', 'सटीक वर्णोच्चारण एवं स्वराघात', 'ચોક્કસ વર્ણોચ્ચાર અને સ્વરાઘાત')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Authentic organic Havana samagri', 'शुद्ध सात्त्विक हवन साहित्य', 'शुद्ध सात्त्विक हवन सामग्री', 'શુદ્ધ સાત્ત્વિક હવન સામગ્રી')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xs flex flex-col space-y-3 relative border border-[#E0BFBF]/30">
              <div className="w-10 h-10 rounded-full bg-[#FFDF94] flex items-center justify-center font-bold text-[#795D00] font-serif text-lg">
                {formatLocalizedNumber(2, language)}
              </div>
              <h3 className="font-serif text-lg text-[#221918] font-bold">
                {loc('Ethical & Transparent Counsel', 'पारदर्शक व भयमुक्त मार्गदर्शन', 'पारदर्शी एवं भयमुक्त मार्गदर्शन', 'પારદર્શક અને ભયમુક્ત માર્ગદર્શન')}
              </h3>
              <span className="text-xs text-[#765B00] font-medium">
                {loc('No Superstition', 'अंधश्रद्धा निर्मूलन', 'अंधविश्वास से परे', 'અંધશ્રદ્ધા મુક્ત')}
              </span>
              <p className="text-sm text-[#584141] leading-relaxed">
                {loc(
                  'We hold zero tolerance for superstitious exploitation. Consultations present clear celestial indicators alongside practical life counsel without exorbitant stone prescriptions.',
                  'आम्ही कोणत्याही अंधश्रद्धेला थारा देत नाही. रत्ने वा भ्रामक उपायांच्या जाळ्यात न अडकवता केवळ स्पष्ट ग्रहमार्गदर्शन केले जाते.',
                  'हम किसी भी अंधविश्वास को बढ़ावा नहीं देते। रत्न या भ्रामक उपायों के चक्र में डाले बिना केवल स्पष्ट ग्रहमार्गदर्शन किया जाता है।',
                  'અમે કોઈ પણ અંધશ્રદ્ધાને પ્રોત્સાહન આપતા નથી. રત્ન કે ભ્રામક ઉપાયોની જાળમાં ફસાવ્યા વગર માત્ર સ્પષ્ટ ગ્રહમાર્ગદર્શન આપવામાં આવે છે.'
                )}
              </p>
              <ul className="pt-2 space-y-1.5 text-xs text-[#221918]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Published fixed Dakshina structure', 'पारदर्शक व निश्चित दक्षिणा', 'पारदर्शी एवं निश्चित दक्षिणा', 'પારદર્શક અને નિશ્ચિત દક્ષિણા')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Transparent samkalpa records', 'नोंदणीकृत संकल्प नोंद', 'पंजीकृत संकल्प विवरण', 'નોંધાયેલ સંકલ્પ વિગતો')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-xs flex flex-col space-y-3 relative border border-[#E0BFBF]/30">
              <div className="w-10 h-10 rounded-full bg-[#F0DFDB] flex items-center justify-center font-bold text-[#584141] font-serif text-lg">
                {formatLocalizedNumber(3, language)}
              </div>
              <h3 className="font-serif text-lg text-[#221918] font-bold">
                {loc('Accessible Heritage for All', 'सुलभ व सर्वसमावेशक परंपरा', 'सुलभ एवं सर्वसमावेशक परंपरा', 'સુલભ અને સર્વસમાવેશક પરંપરા')}
              </h3>
              <span className="text-xs text-[#765B00] font-medium">
                {loc('Global Outreach', 'वैश्विक समन्वय', 'वैश्विक समन्वय', 'વૈશ્વિક સમન્વય')}
              </span>
              <p className="text-sm text-[#584141] leading-relaxed">
                {loc(
                  'Spiritual knowledge belongs to everyone. Devotees abroad participate seamlessly via high-definition two-way video sankalpas, accompanied by full commentary.',
                  'अध्यात्म ज्ञान सर्वांसाठी खुले आहे. परदेशातील भाविक थेट एचडी व्हिडिओ संकल्पाद्वारे सहभागी होऊ शकतात.',
                  'अध्यात्म ज्ञान सभी के लिए खुला है। विदेश में रहने वाले भक्त सीधे एचडी वीडियो संकल्प द्वारा जुड़ सकते हैं।',
                  'અધ્યાત્મ જ્ઞાન બધા માટે ખુલ્લું છે. વિદેશમાં રહેતા ભક્તો સીધા એચડી વિડિયો સંકલ્પ દ્વારા જોડાઈ શકે છે.'
                )}
              </p>
              <ul className="pt-2 space-y-1.5 text-xs text-[#221918]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Global diaspora live sankalpas', 'थेट प्रक्षेपण व संकल्प विधी', 'लाइव प्रसारण एवं संकल्प विधि', 'લાઇવ પ્રસારણ અને સંકલ્પ વિધિ')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Free downloadable study material', 'विनामूल्य अध्ययन साहित्य', 'निःशुल्क अध्ययन सामग्री', 'વિનામૂલ્યે અધ્યયન સામગ્રી')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: GURUKUL & COMMUNITY ACTIVITIES SPOTLIGHT */}
      <section className="w-full bg-[#FFF8F6] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[#765B00] uppercase tracking-widest font-semibold">
                {loc('Community & Gurukul Activities', 'गुरुकुल उपक्रम व सेवा', 'गुरुकुल उपक्रम एवं सेवा', 'ગુરુકુળ પ્રવૃત્તિઓ અને સેવા')}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                {loc('Nurturing Tradition, Serving Society', 'संस्कृती संवर्धन व समाजसेवा', 'संस्कृति संवर्धन एवं समाजसेवा', 'સંસ્કૃતિ સંવર્ધન અને સમાજસેવા')}
              </h2>
            </div>
            <p className="text-sm text-[#584141] max-w-md">
              {loc(
                'Beyond individual rituals, the Pratishthan funds full-time student bursaries and leads eco-spiritual programs.',
                'केवळ पूजेपुरते मर्यादित न राहता गुरुकुलातील विद्यार्थ्यांचे संपूर्ण शिक्षण व समाजोपयोगी उपक्रम राबवले जातात.',
                'केवल पूजा तक सीमित न रहकर गुरुकुल के विद्यार्थियों की संपूर्ण शिक्षा एवं लोकोपयोगी उपक्रम चलाए जाते हैं।',
                'માત્ર પૂજા પૂરતું સીમિત ન રહેતાં ગુરુકુળના વિદ્યાર્થીઓનું સંપૂર્ણ શિક્ષણ અને સમાજોપયોગી પ્રવૃત્તિઓ ચલાવવામાં આવે છે.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#FFF0ED] rounded-xl overflow-hidden shadow-xs flex flex-col justify-between border border-[#E0BFBF]/30">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-[#765B00] text-xs font-semibold">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  <span>{loc('Gurukul Vedic Learning Mission', 'गुरुकुल वेदपाठ योजना', 'गुरुकुल वेदपाठ योजना', 'ગુરુકુળ વેદપાઠ યોજના')}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#570013] font-bold">
                  {loc('Preserving Oral Recitation for Future Generations', 'भावी पिढ्यांसाठी वेद श्रुती संवर्धन', 'भावी पीढ़ियों हेतु वेद श्रुति संवर्धन', 'ભાવી પેઢીઓ માટે વેદ શ્રુતિ સંવર્ધન')}
                </h3>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {loc(
                    'Our residential students master Samhita, Pada, and Krama recitations alongside modern mathematics and English. Donors sponsor entire academic cohorts through our 80G-certified trust scheme.',
                    'आमचे निवासी विद्यार्थी संहिता, पद व क्रम पाठासह आधुनिक गणित व इंग्रजी भाषा शिकतात. दानशूर भाविक आमच्या ८०-जी करसवलत योजनेद्वारे या विद्यार्थ्यांचे पालकत्व घेतात.',
                    'हमारे आवासीय विद्यार्थी संहिता, पद एवं क्रम पाठ के साथ आधुनिक गणित व अंग्रेजी भी सीखते हैं। दानदाता हमारी 80G कर-मुक्त योजना द्वारा विद्यार्थियों को प्रायोजित करते हैं।',
                    'અમારા નિવાસી વિદ્યાર્થીઓ સંહિતા, પદ અને ક્રમ પાઠ સાથે આધુનિક ગણિત અને અંગ્રેજી પણ શીખે છે. દાતાઓ અમારી 80G કરમુક્ત યોજના દ્વારા વિદ્યાર્થીઓનું પાલકત્વ સ્વીકારે છે.'
                  )}
                </p>
                <div className="pt-2 flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl text-[#570013] font-bold">
                      {formatLocalizedNumber(48, language)}+
                    </span>
                    <span className="text-xs text-[#584141]">{loc('Full-time Vidyarthis', 'पूर्णवेळ वेद विद्यार्थी', 'पूर्णकालिक वेद विद्यार्थी', 'પૂર્ણકાલીન વેદ વિદ્યાર્થીઓ')}</span>
                  </div>
                  <div className="w-px h-10 bg-[#E0BFBF]"></div>
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl text-[#570013] font-bold">
                      {formatLocalizedNumber(100, language)}%
                    </span>
                    <span className="text-xs text-[#584141]">{loc('Free Food & Lodging', 'विनामूल्य निवास व भोजन', 'निःशुल्क आवास एवं भोजन', 'વિનામૂલ્યે આવાસ અને ભોજન')}</span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full bg-[#FCEAE6] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFDxJIEOeesVt62cJRI8eWtLhmrUi2Fia4vQBbcpLrE6emxGdxXnRCX6rXwM_T_XMyuw13sga6qahjZuSaU7au87abF3WR-PRXP_2kD5wQuBlcY29LymwgDzGLROmdblTc8b0N6hZawmbUeCo8M1bWgTknTpPg_gtF3mxXPJ4Kfzx8Jq26FTOBmKe0LzSq2ul75gHfRwKfswMcnXpYEBIWDmEeOp9kSDk-l9IL5yJe8ePlYChH_tC-xA"
                  alt="Vedic Gurukul Vidyarthis studying in courtyard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#FCEAE6] rounded-xl p-6 shadow-xs flex flex-col justify-between flex-1 border border-[#E0BFBF]/30">
                <div className="space-y-2">
                  <span className="text-xs text-[#765B00] font-semibold uppercase">
                    {loc('Conversational Sanskrit Weekends', 'संस्कृत संभाषण शिबीर', 'संस्कृत संभाषण शिविर', 'સંસ્કૃત સંભાષણ શિબિર')}
                  </span>
                  <h4 className="font-serif text-lg text-[#221918] font-bold">
                    {loc('Conversational Sanskrit Weekends', 'संस्कृत संभाषण अभ्यासवर्ग', 'संस्कृत संभाषण कार्यशाला', 'સંસ્કૃત સંભાષણ કાર્યશાળા')}
                  </h4>
                  <p className="text-sm text-[#584141] leading-relaxed">
                    {loc(
                      'Open to enthusiasts of all age groups. Learn to converse, read Subhashitas, and grasp foundational grammar seamlessly.',
                      'सर्व वयोगटांतील जिज्ञासूंसाठी सुलभ संस्कृत संभाषण, सुभाषिते व मूलभूत व्याकरण शिकण्याची सहजसुलभ संधी.',
                      'सभी आयु वर्ग के जिज्ञासुओं के लिए सरल संस्कृत संभाषण, सुभाषित एवं मूलभूत व्याकरण सीखने का सुअवसर।',
                      'બધી વયના જિજ્ઞાસુઓ માટે સરળ સંસ્કૃત સંભાષણ, સુભાષિતો અને મૂળભૂત વ્યાકરણ શીખવાની સુવર્ણ તક.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('gurukul')}
                  className="inline-flex items-center gap-1 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-3 cursor-pointer"
                >
                  <span>{loc('View Batch Timetable', 'वेळापत्रक पहा', 'समय सारणी देखें', 'સમયપત્રક જુઓ')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="bg-[#F6E4E1] rounded-xl p-6 shadow-xs flex flex-col justify-between flex-1 border border-[#E0BFBF]/30">
                <div className="space-y-2">
                  <span className="text-xs text-[#765B00] font-semibold uppercase">
                    {loc('Eco-Spiritual Seva Initiatives', 'वृक्षारोपण व अन्नदान सेवा', 'वृक्षारोपण एवं अन्नदान सेवा', 'વૃક્ષારોપણ અને અન્નદાન સેવા')}
                  </span>
                  <h4 className="font-serif text-lg text-[#221918] font-bold">
                    {loc('Eco-Spiritual Seva Initiatives', 'पर्यावरण व अन्नदान सेवा प्रकल्प', 'पर्यावरण एवं अन्नदान सेवा प्रकल्प', 'પર્યાવરણ અને અન્નદાન સેવા પ્રકલ્પ')}
                  </h4>
                  <p className="text-sm text-[#584141] leading-relaxed">
                    {loc(
                      'Planting indigenous medicinal trees (Audumbar, Bilva, Peepal) around Western Ghats watersheds and daily satvik Prasad distribution.',
                      'औदुंबर, बिल्व, पिंपळ यांसारख्या देशी औषधी वृक्षांचे संवर्धन आणि नित्य सात्त्विक महाप्रसाद वाटप उपक्रम.',
                      'औदुंबर, बिल्व, पीपल जैसे औषधीय वृक्षों का रोपण एवं नित्य सात्त्विक महाप्रसाद वितरण उपक्रम।',
                      'ઔદુંબર, બીલી, પીપળો જેવા ઔષધીય વૃક્ષોનું રોપણ અને નિત્ય સાત્ત્વિક મહાપ્રસાદ વિતરણ ઉપક્રમ.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('events')}
                  className="inline-flex items-center gap-1 text-sm text-[#570013] hover:text-[#800020] font-semibold pt-3 cursor-pointer"
                >
                  <span>{loc('Participate in Seva', 'सेवेत सहभागी व्हा', 'सेवा में सहभागी बनें', 'સેવામાં સહભાગી બનો')}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="w-full bg-[#FFF0ED] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-10">
          <div className="text-center space-y-1">
            <span className="text-xs text-[#765B00] uppercase tracking-widest font-semibold">
              {loc('Voices of Trust', 'अनुभव व भाविकांचे अभिप्राय', 'अनुभव एवं भक्तों के विचार', 'અનુભવ અને ભક્તોના અભિપ્રાય')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
              {loc('Quiet Dignity, Reverent Accuracy', 'शास्त्रोक्त पावित्र्य आणि आत्मिक समाधान', 'शास्त्रोक्त पवित्रता एवं आत्मिक शांति', 'શાસ્ત્રોક્ત પવિત્રતા અને આત્મિક શાંતિ')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <p className="text-sm text-[#584141] italic leading-relaxed">
                {loc(
                  '"We arranged the Shatachandi Homa through Chaitanya Ved Pratishthan for my mother’s recovery. What impressed us most was their absolute adherence to time, dignified chanting without loud speakers, and complete transparency in Samagri billing. It felt truly sacred."',
                  '"माझ्या आईच्या आरोग्यासाठी आम्ही शतचंडी याग आयोजित केला होता. वेळेचे काटेकोर पालन, ध्वनिक्षेपकांविना अतिशय शांत व गंभीर मंत्रोच्चार आणि साहित्यातील १००% पारदर्शकता यामुळे मनाला अतीव समाधान लाभले."',
                  '"मेरी माताजी के स्वास्थ्य लाभ हेतु हमने शतचंडी महायज्ञ कराया। समय का पूर्ण पालन, शांत एवं गंभीर वातावरण में मंत्रोच्चार तथा सामग्री में शत-प्रतिशत पारदर्शिता अत्यंत प्रशंसनीय रही।"',
                  '"મારી માતાજીના સ્વાસ્થ્ય લાભ માટે અમે શતચંડી યાગનું આયોજન કર્યું હતું. સમયનું ચોક્કસ પાલન, શાંત અને ગંભીર મંત્રોચ્ચાર અને સામગ્રીમાં સંપૂર્ણ પારદર્શિતાથી ખૂબ જ આત્મિક સંતોષ મળ્યો."'
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFDADA] flex items-center justify-center font-bold text-[#570013] font-serif">
                  DR
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#221918] font-bold">{loc('Dr. Rajesh Deshmukh', 'डॉ. राजेश देशमुख', 'डॉ. राजेश देशमुख', 'ડૉ. રાજેશ દેશમુખ')}</span>
                  <span className="text-xs text-[#584141]">{loc('Professor & Researcher, Pune', 'प्राध्यापक व संशोधक, पुणे', 'प्राध्यापक एवं शोधकर्ता, पुणे', 'પ્રોફેસર અને સંશોધક, પુણે')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-[#E0BFBF]/30">
              <p className="text-sm text-[#584141] italic leading-relaxed">
                {loc(
                  '"Residing in London, we were worried about conducting our daughter’s Navagraha and Laghurudra pooja properly. The Live Stream was crystal clear; Guruji explained the meaning of each mantra so patiently. Highly recommended for families abroad."',
                  '"लंडनमध्ये वास्तव्यास असल्याने मुलीच्या नवग्रह व लघुरुद्र पूजेबद्दल आम्ही साशंक होतो. परंतु लाइव्ह प्रवाहाची गुणवत्ता उत्कृष्ट होती आणि गुरुजींनी प्रत्येक मंत्राचा सविस्तर अर्थ समजावून सांगितला."',
                  '"लंदन में रहने के कारण हम अपनी पुत्री की नवग्रह एवं लघुरुद्र पूजा को लेकर चिंतित थे। लाइव प्रसारण अत्यंत स्पष्ट था तथा गुरुजी ने प्रत्येक मंत्र का अर्थ अत्यंत धैर्य से समझाया। विदेश में रहने वाले परिवारों के लिए यह सर्वोत्तम है।',
                  '"લંડનમાં રહેતા હોવાથી દીકરીની નવગ્રહ અને લઘુરુદ્ર પૂજા વિષે અમે ચિંતિત હતા. પરંતુ લાઇવ પ્રસારણ અત્યંત સ્પષ્ટ હતું અને ગુરુજીએ દરેક મંત્રનો અર્થ ખૂબ જ ધીરજથી સમજાવ્યો."'
                )}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFDF94] flex items-center justify-center font-bold text-[#795D00] font-serif">
                  SK
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#221918] font-bold">{loc('Snehal & Kedar Joshi', 'स्नेहल व केदार जोशी', 'स्नेहल एवं केदार जोशी', 'સ્નેહલ અને કેદાર જોશી')}</span>
                  <span className="text-xs text-[#584141]">{loc('Software Architect, London UK', 'सॉफ्टवेअर आर्किटेक्ट, लंडन यूके', 'सॉफ्टवेयर आर्किटेक्ट, लंदन यूके', 'સૉફ્ટવેર આર્કિટેક્ટ, લંડન યુકે')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL REASSURING CONSULTATION CALLOUT */}
      <section className="w-full bg-[#FFF8F6] py-14">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="relative bg-gradient-to-r from-[#FCEAE6] via-[#F6E4E1] to-[#FCEAE6] p-8 lg:p-12 rounded-2xl shadow-xs border border-[#E0BFBF]/40 overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white shadow-xs">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">support_agent</span>
                  <span className="text-xs font-semibold text-[#765B00]">
                    {loc('Personal Guidance & Consultation', 'वैयक्तिक मार्गदर्शन व पूजा सल्ला', 'व्यक्तिगत मार्गदर्शन एवं पूजा परामर्श', 'વ્યક્તિગત માર્ગદર્શન અને પૂજા પરામર્શ')}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                  {loc('Plan Your Sacred Ritual or Astrological Consultation', 'आपला पवित्र संकल्प वा ज्योतिषीय सल्ला निश्चित करा', 'अपना पवित्र संकल्प अथवा ज्योतिषीय परामर्श निश्चित करें', 'તમારો પવિત્ર સંકલ્પ અથવા જ્યોતિષીય પરામર્શ નિશ્ચિત કરો')}
                </h2>
                <p className="text-sm text-[#584141]">
                  {loc(
                    'Our scholars are ready to assist you in selecting auspicious dates, explaining Vidhi preparations, and setting up in-person or live-streamed ceremonies.',
                    'आमचे अभ्यासक शुभ मुहूर्त निवडणे, विधी तयारी आणि संकल्प पूजेचे नियोजन करण्यात साहाय्य करतील.',
                    'हमारे विद्वान शुभ मुहूर्त चयन, विधि तैयारी एवं संकल्प पूजा के नियोजन में सहायता करेंगे।',
                    'અમારા વિદ્વાનો શુભ મુહૂર્ત પસંદગી, વિધિ તૈયારી અને સંકલ્પ પૂજાના આયોજનમાં સહાય કરશે.'
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a
                  href="tel:+919822054321"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-[#570013] text-sm font-semibold shadow-xs hover:bg-[#FFF0ED] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#765B00]">phone_in_talk</span>
                  <span>+91 98220 54321</span>
                </a>
                <button
                  onClick={() => onNavigate('book-appointment')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#570013] text-white text-sm font-bold shadow-md hover:bg-[#800020] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>{loc('Book Appointment Now', 'अपॉइंटमेंट बुक करा', 'परामर्श बुक करें', 'એપોઇન્ટમેન્ટ બુક કરો')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

