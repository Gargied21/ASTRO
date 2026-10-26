import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { toDevanagariNumerals, formatLocalizedNumber } from '../../utils/formatters.ts';
import { Modal } from '../common/Modal.tsx';

export const AstrologyView: React.FC = () => {
  const { consultation, addQuestion, showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [activeChartTab, setActiveChartTab] = useState<'d1' | 'd9' | 'moon' | 'degrees'>('d1');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestionCat, setNewQuestionCat] = useState('करिअर व उद्योग विस्तार');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionBhav, setNewQuestionBhav] = useState('दशम (कर्म) भाव');

  // Live countdown timer in Devanagari
  const [countdown, setCountdown] = useState({
    hours: 16,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    addQuestion({
      category: newQuestionCat,
      question: newQuestionText.trim(),
      refBhav: newQuestionBhav,
    });
    setNewQuestionText('');
    setIsQuestionModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Action Ribbon */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#584141]">
            <span>{t('devoteeSanctum')}</span>
            <span className="text-[#E0BFBF]">/</span>
            <span className="text-[#570013] font-semibold">{t('nav.astrology')}</span>
            <span className="text-[#E0BFBF]">/</span>
            <span className="px-2 py-0.5 rounded-full bg-[#FFD979]/50 text-[#795D00] text-[10px] font-bold uppercase">
              {loc('Confidential Sanctum', 'गोपनीय कक्ष', 'गोपनीय कक्ष', 'ગોપનીય કક્ષ')}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Vedic Astrology & Janmapatrika Console',
              'ज्योतिष व जन्मपत्रिका परामर्श',
              'वैदिक ज्योतिष एवं जन्मकुंडली परामर्श',
              'વૈદિક જ્યોતિષ અને જન્મકુંડળી પરામર્શ'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141]">
            {loc(
              'Maharishi Parashara & Jaimini Shastra principles • Auspicious Muhurtas, planetary remedies, and confidential counsel.',
              'महर्षि पराशर व जैमिनी सिद्धांत • वैदिक मुहूर्त, ग्रहदोष निवारण आणि गोपनीय भविष्य दर्शन.',
              'महर्षि पराशर एवं जैमिनी सिद्धांत • वैदिक मुहूर्त, ग्रहदोष निवारण एवं गोपनीय परामर्श।',
              'મહર્ષિ પરાશર અને જૈમિની સિદ્ધાંત • વૈદિક મુહૂર્ત, ગ્રહદોષ નિવારણ અને ગોપનીય પરામર્શ.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() =>
              showToast(
                loc(
                  'Downloading Kundali PDF...',
                  'जन्मपत्रिका PDF डाउनलोड सुरू झाले...',
                  'जन्मपत्रिका पीडीएफ डाउनलोड हो रहा है...',
                  'જન્મકુંડળી પીડીએફ ડાઉનલોડ થઈ રહી છે...'
                ),
                'info'
              )
            }
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E0BFBF]/40 text-[#221918] hover:bg-[#FFF0ED] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#765B00]">download_for_offline</span>
            <span>
              {loc(
                'Download Janmapatrika PDF',
                'जन्मपत्रिका PDF डाउनलोड',
                'जन्मपत्रिका पीडीएफ डाउनलोड',
                'જન્મકુંડળી પીડીએફ ડાઉનલોડ'
              )}
            </span>
          </button>
          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>
              {loc(
                '+ Add Consultation Question',
                '+ नवीन प्रश्न जोडा',
                '+ नया प्रश्न जोड़ें',
                '+ નવો પ્રશ્ન ઉમેરો'
              )}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Active Upcoming Consultation Card */}
      <div className="relative bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#570013] via-[#765B00] to-[#800020]"></div>

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6">
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqBoNe284pPDGZptxHjiY2YqjFnHWCk4n78DlFNs1FRoDvIKHHVjjmhOx-oXo1OwKc46AtIoWl6A55f5zgiDKS-5Lj3pZqEg09XUIFdp_Kpvu1H2E-prbWfydWNumkqemfsUDBp06kPL0o1clUKepUj4ylJMKzXt-7Id3RKEN6rO3EPzoMW8jQ1UCO1Dy0-OpYJdqgdRnUozHBo8ZZQDpGE5GFrQ__QtFU_QkXHMBUAGzilwuqjNy_dA"
                  alt="Pt. Vishnupant Shastri"
                  className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-[#C9A64B]"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#765B00] text-white flex items-center justify-center text-xs"
                  title="Vedic Certified Acharya"
                >
                  <span className="material-symbols-outlined text-sm leading-none">verified</span>
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFD979]/40 text-[#795D00] text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">event_available</span>
                    <span>{loc("Tomorrow's Confirmed Consultation", 'उद्याचा निश्चित परामर्श', 'कल का सुनिश्चित परामर्श', 'આવતીકાલનો કન્ફર્મ પરામર્શ')}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#584141] text-xs font-mono">
                    {loc('Consultation #:', 'परामर्श क्र:', 'परामर्श सं.:', 'પરામર્શ નં.:')} {consultation.id}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#570013]">
                  {loc(
                    'Daivajna Pt. Pu. Vishnupant Shastri',
                    'दैवज्ञ पं. पु. विष्णुपंत शास्त्री',
                    'दैवज्ञ पं. पू. विष्णुपंत शास्त्री',
                    'દૈવજ્ઞ પં. પૂ. વિષ્ણુપંત શાસ્ત્રી'
                  )}
                </h2>
                <p className="text-xs text-[#584141] leading-relaxed">
                  {loc(
                    '32 years study & experience • Kashi Vidyapeeth Gold Medalist • Vedic Astrology, Muhurta & Prashna Shastra Expert',
                    '३२ वर्षे अध्ययन व अनुभव • काशी विद्यापीठ सुवर्णपदक • वैदिक फलज्योतिष, मुहूर्त व प्रश्नशास्त्र तज्ञ',
                    '३२ वर्ष अध्ययन व अनुभव • काशी विद्यापीठ स्वर्ण पदक • वैदिक फलज्योतिष, मुहूर्त एवं प्रश्नशास्त्र विशेषज्ञ',
                    '૩૨ વર્ષ અધ્યયન અને અનુભવ • કાશી વિદ્યાપીઠ સુવર્ણચંદ્રક • વૈદિક જ્યોતિષ, મુહૂર્ત અને પ્રશ્નશાસ્ત્ર નિષ્ણાત'
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#FFF0ED] rounded-xl border border-[#E0BFBF]/30 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-white text-[#570013] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">calendar_today</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584141] block">{loc('Date & Time', 'दिनांक व वेळ', 'दिनांक व समय', 'તારીખ અને સમય')}</span>
                  <span className="font-bold text-[#221918]">
                    {loc(
                      'Tomorrow, 21 May 2024 • 11:30 AM',
                      'उद्या, २१ मे २०२४ • ११:३० AM',
                      'कल, 21 मई 2024 • 11:30 AM',
                      'આવતીકાલે, ૨૧ મે ૨૦૨૪ • ૧૧:૩૦ AM'
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-white text-[#765B00] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">hourglass_top</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584141] block">{loc('Duration', 'सत्र कालावधी', 'सत्र अवधि', 'સત્ર અવધિ')}</span>
                  <span className="font-bold text-[#221918]">
                    {loc(
                      '45 Minutes (In-depth Consultation)',
                      '४५ मिनिटे (सखोल परामर्श)',
                      '45 मिनट (गहन परामर्श)',
                      '૪૫ મિનિટ (ઊંડાણપૂર્વક પરામર્શ)'
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-white text-[#570013] flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584141] block">{loc('Mode & Location', 'माध्यम व स्थान', 'माध्यम व स्थान', 'માધ્યમ અને સ્થાન')}</span>
                  <span className="font-bold text-[#221918]">
                    {loc(
                      'Vedmandir Complex, Paud Road, Pune',
                      'वेदमंदिर संकुल, पौड रोड, पुणे',
                      'वेदमंदिर परिसर, पौड रोड, पुणे',
                      'વેદમંદિર સંકુલ, પૌડ રોડ, પુણે'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Countdown */}
          <div className="lg:w-72 shrink-0 flex flex-col justify-between bg-[#FCEAE6] rounded-xl p-5 border border-[#E0BFBF]/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#584141] font-bold">
                  {loc('Consultation Starts In', 'परामर्श प्रारंभ वेळ', 'परामर्श प्रारंभ समय', 'પરામર્શ પ્રારંભ સમય')}
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#765B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#765B00]"></span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-2">
                <div className="bg-white py-2 rounded-lg shadow-2xs border border-[#E0BFBF]/30">
                  <span className="font-serif text-2xl font-bold text-[#570013] block">
                    {formatLocalizedNumber(countdown.hours, language)}
                  </span>
                  <span className="text-[10px] text-[#584141]">{loc('Hours', 'तास', 'घंटे', 'કલાક')}</span>
                </div>
                <div className="bg-white py-2 rounded-lg shadow-2xs border border-[#E0BFBF]/30">
                  <span className="font-serif text-2xl font-bold text-[#570013] block">
                    {formatLocalizedNumber(countdown.minutes, language)}
                  </span>
                  <span className="text-[10px] text-[#584141]">{loc('Minutes', 'मिनिटे', 'मिनट', 'મિનિટ')}</span>
                </div>
                <div className="bg-white py-2 rounded-lg shadow-2xs border border-[#E0BFBF]/30">
                  <span className="font-serif text-2xl font-bold text-[#765B00] block">
                    {formatLocalizedNumber(countdown.seconds, language)}
                  </span>
                  <span className="text-[10px] text-[#584141]">{loc('Seconds', 'सेकंद', 'सेकंड', 'સેકન્ડ')}</span>
                </div>
              </div>
              <p className="text-[11px] text-center text-[#584141] mt-1">
                {loc('Please join or arrive at the Ashram reception 15 minutes prior.', 'सत्र सुरू होण्याच्या १५ मिनिटे आधी स्वागतकक्षात पोहोचावे.', 'सत्र प्रारंभ होने से 15 मिनट पूर्व स्वागत कक्ष में पहुंचें।', 'સત્ર શરૂ થવાના ૧૫ મિનિટ પહેલાં સ્વાગત કક્ષમાં પહોંચવું.')}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-[#570013] text-white text-xs font-bold text-center hover:bg-[#800020] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">videocam</span>
                <span>{loc('Alternative Google Meet Link', 'पर्यायी Google Meet लिंक', 'वैकल्पिक Google Meet लिंक', 'વૈકલ્પિક Google Meet લિંક')}</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    loc(
                      'Reschedule request registered. Ashram coordinator will contact you.',
                      'पुनर्नियोजन विनंती नोंदवली. आश्रम समन्वयकांचा संपर्क येईल.',
                      'पुनर्निर्धारण अनुरोध दर्ज किया गया। आश्रम समन्वयक आपसे संपर्क करेंगे।',
                      'પુનર્નિર્ધારણ વિનંતી નોંધાઈ. આશ્રમ સંયોજક સંપર્ક કરશે.'
                    ),
                    'info'
                  )
                }
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-[#FFF0ED] text-[#221918] text-xs font-bold text-center border border-[#E0BFBF]/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#765B00]">schedule</span>
                <span>{loc('Request Reschedule', 'पुनर्नियोजन विनंती', 'पुनर्निर्धारण अनुरोध', 'પુનર્નિર્ધારણ વિનંતી')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Kundali Chart Viewer & Birth Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 cols): Kundali Chart Diagram */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3 border-b border-[#E0BFBF]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765B00] text-xl">stars</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#570013]">
                  {loc('Janmapatrika Chart Visualization', 'जन्मपत्रिका प्रारूप', 'जन्मपत्रिका प्रारूप', 'જન્મકુંડળી પ્રારૂપ')}
                </h3>
                <span className="text-xs text-[#584141]">
                  {loc('Vedic North-Indian Diamond Format', 'वैदिक उत्तर भारतीय चौकोनी स्वरूप', 'वैदिक उत्तर भारतीय चौकोनी स्वरूप', 'વૈદિક ઉત્તર ભારતીય ચોરસ સ્વરૂપ')}
                </span>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center p-1 bg-[#FFF0ED] rounded-xl gap-1 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'd1', label: loc('Lagna Kundali (D1)', 'लग्न कुंडली (D1)', 'लग्न कुंडली (D1)', 'લગ્ન કુંડળી (D1)') },
                { id: 'd9', label: loc('Navamsha (D9)', 'नवमांश (D9)', 'नवमांश (D9)', 'નવમાંશ (D9)') },
                { id: 'moon', label: loc('Moon Chart', 'चंद्र कुंडली', 'चन्द्र कुंडली', 'ચંદ્ર કુંડળી') },
                { id: 'degrees', label: loc('Planetary Degrees', 'ग्रह अंश तक्ता', 'ग्रह अंश तालिका', 'ગ્રહ અંશ કોષ્ટક') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChartTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeChartTab === tab.id
                      ? 'bg-white text-[#570013] shadow-xs'
                      : 'text-[#584141] hover:text-[#221918]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-[#FFF8F6] rounded-xl p-4 flex items-center justify-center border border-[#E0BFBF]/40 shadow-inner">
            <svg className="w-full h-full text-[#570013]" fill="none" viewBox="0 0 500 500">
              <rect x="10" y="10" width="480" height="480" rx="4" className="fill-white stroke-[#570013]" strokeWidth="2.5"></rect>
              <line x1="10" y1="10" x2="490" y2="490" className="stroke-[#570013]" strokeWidth="2"></line>
              <line x1="490" y1="10" x2="10" y2="490" className="stroke-[#570013]" strokeWidth="2"></line>
              <polygon points="250,10 490,250 250,490 10,250" className="stroke-[#570013]" strokeWidth="2" fill="none"></polygon>

              <line x1="10" y1="10" x2="250" y2="10" className="stroke-[#765B00]" opacity="0.4" strokeDasharray="3 3" strokeWidth="1.2"></line>
              <line x1="490" y1="10" x2="250" y2="10" className="stroke-[#765B00]" opacity="0.4" strokeDasharray="3 3" strokeWidth="1.2"></line>

              {/* Center Bindu */}
              <circle cx="250" cy="250" r="14" className="fill-[#FFF0ED] stroke-[#765B00]" strokeWidth="1.5"></circle>
              <text x="250" y="254" textAnchor="middle" className="fill-[#570013] font-serif font-bold text-[13px]">ॐ</text>

              {/* House 1: Lagna */}
              <text x="250" y="70" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[15px]">२ (वृषभ)</text>
              <text x="250" y="105" textAnchor="middle" className="fill-[#570013] font-sans font-bold text-[13px]">लग्न • सूर्य (२१°)</text>
              <text x="250" y="125" textAnchor="middle" className="fill-[#584141] font-sans text-[11px]">बुध (०८°)</text>

              {/* House 2 */}
              <text x="135" y="55" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[14px]">३</text>
              <text x="135" y="85" textAnchor="middle" className="fill-[#570013] font-sans text-[12px]">शुक्र (१४°)</text>

              {/* House 12 */}
              <text x="365" y="55" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[14px]">१</text>
              <text x="365" y="85" textAnchor="middle" className="fill-[#570013] font-sans text-[12px]">राहू (१६°)</text>

              {/* House 4 */}
              <text x="135" y="245" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[15px]">५ (सिंह)</text>
              <text x="135" y="275" textAnchor="middle" className="fill-[#570013] font-sans font-bold text-[12px]">चंद्र (२९°)</text>

              {/* House 5 */}
              <text x="65" y="365" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[14px]">६</text>
              <text x="65" y="395" textAnchor="middle" className="fill-[#570013] font-sans text-[12px]">मंगळ (०३°)</text>

              {/* House 6 */}
              <text x="135" y="445" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[14px]">७</text>
              <text x="135" y="465" textAnchor="middle" className="fill-[#570013] font-sans text-[12px]">शनी [व] (१८°)</text>

              {/* House 7 */}
              <text x="250" y="420" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[15px]">८ (वृश्चिक)</text>
              <text x="250" y="380" textAnchor="middle" className="fill-[#570013] font-sans font-bold text-[13px]">गुरु (११°)</text>
              <text x="250" y="360" textAnchor="middle" className="fill-[#584141] font-sans text-[11px]">सप्तम भाव (कलत्र)</text>

              {/* House 10 */}
              <text x="365" y="245" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[15px]">११ (कुंभ)</text>
              <text x="365" y="275" textAnchor="middle" className="fill-[#584141] font-sans text-[11px]">दशम भाव (कर्म)</text>

              {/* House 11 */}
              <text x="435" y="135" textAnchor="middle" className="fill-[#765B00] font-serif font-bold text-[14px]">१२</text>
              <text x="435" y="165" textAnchor="middle" className="fill-[#570013] font-sans text-[12px]">केतू (१६°)</text>
            </svg>

            <span className="absolute bottom-3 left-4 text-[#584141] text-[11px] bg-white/90 px-2 py-0.5 rounded border border-[#E0BFBF]/40">
              {loc('[R] = Retrograde', '[व] = वक्री', '[व] = वक्री', '[વ] = વક્રી')}
            </span>
            <span className="absolute bottom-3 right-4 text-[#765B00] text-[11px] bg-white/90 px-2 py-0.5 rounded border border-[#E0BFBF]/40 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              <span>{loc('Shri Chaitanya Parashara Lineage', 'श्री चैतन्य पराशर संप्रदाय', 'श्री चैतन्य पराशर संप्रदाय', 'શ્રી ચૈતન્ય પરાશર સંપ્રદાય')}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#584141]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-[#765B00]">info</span>
              <span>{loc('Mathematical Ayanamsha: Lahiri Chitra Paksha (23°38\')', 'कुंडलीचे गणितीय अयन: लाहिडी चित्रापक्ष (२३°३८\')', 'कुंडली का गणितीय अयन: लाहिड़ी चित्रापक्ष (23°38\')', 'કુંડળીનું ગણિતીય અયન: લાહિડી ચિત્રાપક્ષ (૨૩°૩૮\')')}</span>
            </span>
            <button
              onClick={() => showToast(loc('Kundali SVG downloaded successfully', 'कुंडली SVG यशस्वीरीत्या डाऊनलोड झाली', 'कुंडली SVG सफलतापूर्वक सहेजी गई', 'કુંડળી SVG સફળતાપૂર્વક સાચવવામાં આવી'), 'success')}
              className="px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#570013] hover:bg-[#FCEAE6] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#765B00]">download</span>
              <span>{loc('Save SVG', 'SVG जतन करा', 'SVG सहेजें', 'SVG સાચવો')}</span>
            </button>
          </div>
        </div>

        {/* Right (4 cols): Birth Particulars */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
            <h3 className="font-serif text-base font-bold text-[#570013]">
              {loc('Birth Particulars', 'जन्म तपशील', 'जन्म विवरण', 'જન્મ વિગતો')}
            </h3>
            <span className="material-symbols-outlined text-[#765B00] text-xl">account_circle</span>
          </div>
          <p className="text-xs text-[#584141]">
            {loc(
              'Shri Rajesh Shantaram Kulkarni (Yajamana • Gotra: Bharadwaja)',
              'श्री राजेश शांताराम कुलकर्णी (यजमान • गोत्र: भारद्वाज)',
              'श्री राजेश शांताराम कुलकर्णी (यजमान • गोत्र: भारद्वाज)',
              'શ્રી રાજેશ શાંતારામ કુલકર્ણી (યજમાન • ગોત્ર: ભારદ્વાજ)'
            )}
          </p>

          <div className="space-y-2 text-xs">
            {[
              {
                label: loc('Date of Birth (DOB)', 'जन्म तारीख', 'जन्म तिथि', 'જન્મ તારીખ'),
                val: loc('15 August 1984', '१५ ऑगस्ट १९८४', '15 अगस्त 1984', '૧૫ ઓગસ્ટ ૧૯૮૪'),
              },
              {
                label: loc('Time of Birth (TOB)', 'जन्म वेळ', 'जन्म समय', 'જન્મ સમય'),
                val: loc('06:22 AM (Ghatika 02:55)', '०६:२२ AM (घटिका ०२:५५)', '06:22 AM (घटिका 02:55)', '૦૬:૨૨ AM (ઘટિકા ૦૨:૫૫)'),
              },
              {
                label: loc('Place of Birth (POB)', 'जन्म स्थान', 'जन्म स्थान', 'જન્મ સ્થળ'),
                val: loc('Pune, Maharashtra', 'पुणे, महाराष्ट्र', 'पुणे, महाराष्ट्र', 'પુણે, મહારાષ્ટ્ર'),
              },
              {
                label: loc('Ayana & Ritu', 'अयन व ऋतू', 'अयन व ऋतु', 'અયન અને ઋતુ'),
                val: loc('Dakshinayana • Varsha Ritu', 'दक्षिणायन • वर्षा ऋतू', 'दक्षिणायन • वर्षा ऋतु', 'દક્ષિણાયન • વર્ષા ઋતુ'),
              },
              {
                label: loc('Birth Nakshatra & Charan', 'जन्म नक्षत्र व चरण', 'जन्म नक्षत्र व चरण', 'જન્મ નક્ષત્ર અને ચરણ'),
                val: loc('Rohini (Charan 2)', 'रोहिणी (चरण २)', 'रोहिणी (चरण 2)', 'રોહિણી (ચરણ ૨)'),
                highlight: true,
              },
              {
                label: loc('Janma Rashi / Moon Sign', 'जन्म रास / चंद्र रास', 'जन्म राशि / चन्द्र राशि', 'જન્મ રાશિ / ચંદ્ર રાશિ'),
                val: loc('Taurus / Vrishabha (Lord: Venus)', 'वृषभ (स्वामी: शुक्र)', 'वृषभ (स्वामी: शुक्र)', 'વૃષભ (સ્વામી: શુક્ર)'),
              },
              {
                label: loc('Gana / Nadi / Yoni', 'गण / नाडी / योनी', 'गण / नाड़ी / योनि', 'ગણ / નાડી / યોનિ'),
                val: loc('Manushya / Antya / Sarpa', 'मनुष्य / अंत्य / सर्प', 'मनुष्य / अंत्य / सर्प', 'મનુષ્ય / અંત્ય / સર્પ'),
              },
              {
                label: loc('Varna / Vashya', 'वर्ण / वश्य', 'वर्ण / वश्य', 'વર્ણ / વશ્ય'),
                val: loc('Vaishya / Chatushpada', 'वैश्य / चतुष्पाद', 'वैश्य / चतुष्पाद', 'વૈશ્ય / ચતુષ્પાદ'),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/20"
              >
                <span className="text-[#584141]">{item.label}</span>
                <span className={`font-semibold ${item.highlight ? 'text-[#570013] font-bold' : 'text-[#221918]'}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#765B00] text-xl shrink-0 mt-0.5">verified</span>
            <div className="text-[11px] text-[#584141]">
              <strong className="text-[#570013] block">
                {loc('Panchang Astronomical Certification', 'पंचांग शुद्धता प्रमाणीकरण', 'पंचांग शुद्धता प्रमाणीकरण', 'પંચાંગ શુદ્ધતા પ્રમાણીકરણ')}
              </strong>
              {loc(
                '100% authenticated through subtle observation methodology in accordance with Dharmasindhu and Nirnayasindhu.',
                'धर्मसिंधू आणि निर्णयसिंधू संमत सूक्ष्म वेध पद्धतीनुसार १००% प्रमाणित.',
                'धर्मसिंधु और निर्णयसिंधु संमत सूक्ष्म वेध पद्धति अनुसार 100% प्रमाणित।',
                'ધર્મસિંધુ અને નિર્ણયસિંધુ માન્ય સૂક્ષ્મ વેધ પદ્ધતિ અનુસાર ૧૦૦% પ્રમાણિત.'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Vimshottari Mahadasha Timeline */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-[#E0BFBF]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765B00] text-xl">timelapse</span>
              <h3 className="font-serif text-lg font-bold text-[#570013]">
                {loc('Vimshottari Dasha & Antardasha Analysis', 'विंशोत्तरी महादशा व अंतर्दशा कालचक्र', 'विंशोत्तरी महादशा एवं अंतर्दशा कालचक्र', 'વિંશોત્તરી મહાદશા અને અંતર્દશા કાલચક્ર')}
              </h3>
            </div>
            <p className="text-xs text-[#584141] mt-0.5">
              {loc('Active planetary periods, influences, and upcoming milestones', 'सध्या चालू असलेले ग्रहचक्र, प्रभाव आणि आगामी जीवन टप्पे', 'वर्तमान में सक्रिय ग्रह चक्र, प्रभाव एवं आगामी जीवन चरण', 'હાલમાં ચાલુ ગ્રહચક્ર, પ્રભાવ અને આગામી જીવન તબક્કા')}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FFD979]/50 text-[#795D00] text-xs font-bold w-fit">
            {loc('Current: Jupiter Mahadasha', 'वर्तमान: गुरु महादशा', 'वर्तमान: गुरु महादशा', 'વર્તમાન: ગુરુ મહાદશા')}
          </span>
        </div>

        {/* Graphical Journey Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#584141]">
            <span>{loc('Rahu Mahadasha (Ended 2018)', 'राहु महादशा (समाप्त २०१८)', 'राहु महादशा (समाप्त 2018)', 'રાહુ મહાદશા (સમાપ્ત ૨૦૧૮)')}</span>
            <span className="text-[#570013] font-bold">{loc('Active: Jupiter Mahadasha (2018 - 2034)', 'चालू: गुरु महादशा (२०१८ - २०३४)', 'सक्रिय: गुरु महादशा (2018 - 2034)', 'ચાલુ: ગુરુ મહાદશા (૨૦૧૮ - ૨૦૩૪)')}</span>
            <span>{loc('Upcoming: Saturn Mahadasha (2034+)', 'आगामी: शनी महादशा (२०३४+)', 'आगामी: शनि महादशा (2034+)', 'આગામી: શનિ મહાદશા (૨૦૩૪+)')}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#FFF0ED] overflow-hidden flex border border-[#E0BFBF]/40">
            <div className="h-full bg-[#E0BFBF] w-[20%]" title="राहु महादशा"></div>
            <div className="h-full bg-gradient-to-r from-[#765B00] to-[#570013] w-[45%]" title="गुरु महादशा चालू"></div>
            <div className="h-full bg-[#FFF8F6] w-[35%]" title="शनि महादशा"></div>
          </div>
        </div>

        {/* Dasha Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#584141] uppercase tracking-wider font-semibold">
                  {loc('Mahadasha Lord', 'महादशा स्वामी', 'महादशा स्वामी', 'મહાદશા સ્વામી')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFDF94] text-[#251A00] text-[10px] font-bold">
                  {loc('16 Years', '१६ वर्षे', '16 वर्ष', '૧૬ વર્ષ')}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#570013]">{loc('Jupiter (Guru)', 'बृहस्पती (गुरु)', 'बृहस्पति (गुरु)', 'બૃહસ્પતિ (ગુરુ)')}</h4>
              <p className="text-xs font-bold text-[#221918] mt-0.5">{loc('Period: 2018 to 2034', 'कालावधी: २०१८ ते २०३४', 'अवधि: 2018 से 2034', 'સમયગાળો: ૨૦૧૮ થી ૨૦૩૪')}</p>
              <p className="text-xs text-[#584141] mt-2 leading-relaxed">
                {loc('Jupiter in the 7th house fosters spiritual elevation, high reverence, and awakened intellect.', 'सप्तमस्थ गुरु आध्यात्मिक प्रगती, उच्च सन्मान आणि विवेक बुद्धी जागृत करतो.', 'सप्तम भाव में गुरु आध्यात्मिक प्रगति, उच्च सम्मान और विवेक बुद्धि जागृत करते हैं।', 'સપ્તમ ભાવમાં ગુરુ આધ્યાત્મિક પ્રગતિ, ઉચ્ચ સન્માન અને વિવેક બુદ્ધિ જાગૃત કરે છે.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E0BFBF]/30 text-[11px]">
              <span className="text-[#584141]">{loc('Placement: ', 'स्थिती: ', 'स्थिति: ', 'સ્થિતિ: ')}</span>
              <span className="text-[#570013] font-bold">{loc('7th House (Friendly Sign)', 'सप्तम भाव (मित्रक्षेत्री)', 'सप्तम भाव (मित्रक्षेत्री)', 'સપ્તમ ભાવ (મિત્રક્ષેત્રી)')}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#584141] uppercase tracking-wider font-semibold">
                  {loc('Active Antardasha', 'चालू अंतर्दशा', 'सक्रिय अंतर्दशा', 'ચાલુ અંતર્દશા')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#570013] text-white text-[10px] font-bold">
                  {loc('Active', 'सक्रिय', 'सक्रिय', 'સક્રિય')}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#570013]">{loc('Saturn (Shani)', 'शनी ग्रह', 'शनि ग्रह', 'શનિ ગ્રહ')}</h4>
              <p className="text-xs font-bold text-[#221918] mt-0.5">{loc('Oct 2023 to Apr 2026', 'ऑक्टोबर २०२३ ते एप्रिल २०२६', 'अक्टूबर 2023 से अप्रैल 2026', 'ઓક્ટોબર ૨૦૨૩ થી એપ્રિલ ૨૦૨૬')}</p>
              <p className="text-xs text-[#584141] mt-2 leading-relaxed">
                {loc('Retrograde Saturn in 6th house drives rigorous discipline; challenges and rivals will be overcome.', 'षष्ठस्थ वक्री शनी कार्यक्षेत्रात कठोर परिश्रम करवून घेतो; स्पर्धा व आव्हानांवर मात होईल.', 'षष्ठ भाव में वक्री शनि कार्यक्षेत्र में कठोर परिश्रम कराते हैं; प्रतिस्पर्धा व चुनौतियों पर विजय प्राप्त होगी।', 'ષષ્ઠ ભાવમાં વક્રી શનિ કાર્યક્ષેત્રમાં કઠોર પરિશ્રમ કરાવે છે; સ્પર્ધા અને પડકારો પર વિજય પ્રાપ્ત થશે.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E0BFBF]/30 text-[11px]">
              <span className="text-[#584141]">{loc('Placement: ', 'स्थिती: ', 'स्थिति: ', 'સ્થિતિ: ')}</span>
              <span className="text-[#765B00] font-bold">{loc('6th House (Exalted Retrograde)', 'षष्ठ भाव (उच्च राशी वक्री)', 'षष्ठ भाव (उच्च राशि वक्री)', 'ષષ્ઠ ભાવ (ઉચ્ચ રાશિ વક્રી)')}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#584141] uppercase tracking-wider font-semibold">
                  {loc('Pratyantar Dasha', 'प्रत्यंतर दशा', 'प्रत्यंतर दशा', 'પ્રત્યંતર દશા')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FCEAE6] text-[#570013] text-[10px] font-bold">
                  {loc('Sub-period', 'सूक्ष्म काल', 'सूक्ष्म काल', 'સૂક્ષ્મ કાલ')}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#570013]">{loc('Mercury (Budha)', 'बुध ग्रह', 'बुध ग्रह', 'બુધ ગ્રહ')}</h4>
              <p className="text-xs font-bold text-[#221918] mt-0.5">{loc('Mar 2024 to Aug 2024', 'मार्च २०२४ ते ऑगस्ट २०२४', 'मार्च 2024 से अगस्त 2024', 'માર્ચ ૨૦૨૪ થી ઓગસ્ટ ૨૦૨૪')}</p>
              <p className="text-xs text-[#584141] mt-2 leading-relaxed">
                {loc('Crucial period for commercial decisions, documentation, and careful new investments.', 'व्यापार निर्णय, दस्तऐवजीकरण आणि नवीन गुंतवणुकीसाठी अत्यंत सतर्क राहण्याचा काळ.', 'व्यापार निर्णय, दस्तावेज़ीकरण और नए निवेश के लिए अत्यंत सतर्क रहने का समय।', 'વેપાર નિર્ણયો, દસ્તાવેજીકરણ અને નવા રોકાણો માટે અત્યંત સતર્ક રહેવાનો સમય.')}
              </p>
            </div>
            <div className="pt-2 border-t border-[#E0BFBF]/30 text-[11px]">
              <span className="text-[#584141]">{loc('Placement: ', 'स्थिती: ', 'स्थिति: ', 'સ્થિતિ: ')}</span>
              <span className="text-[#221918] font-bold">{loc('1st House (Budhaditya Yoga)', 'लग्नस्थ (बुधादित्य योग)', 'लग्नस्थ (बुधादित्य योग)', 'લગ્નસ્થ (બુધાદિત્ય યોગ)')}</span>
            </div>
          </div>
        </div>

        {/* Shastric Advice Callout */}
        <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#765B00] text-2xl shrink-0 mt-0.5">auto_stories</span>
            <div>
              <h5 className="font-serif text-sm font-bold text-[#570013]">
                {loc('Astrologer Observation & Remedial Guidance:', 'दैवज्ञ सूक्ष्म निरीक्षण व प्राथमिक उपाय सल्ला:', 'ज्योतिषी सूक्ष्म निरीक्षण एवं प्रारंभिक उपाय सलाह:', 'જ્યોતિષી સૂક્ષ્મ નિરીક્ષણ અને પ્રારંભિક ઉપાય સલાહ:')}
              </h5>
              <p className="text-[#584141] mt-0.5 leading-relaxed">
                {loc('Under the ongoing Jupiter-Saturn period, attend to health and knee wellness. Daily recitation of "Om Brim Brihaspataye Namah" is recommended.', 'सध्या गुरु-शनी दशा असल्याने आरोग्य व गुडघ्यांचे विकार यांकडे लक्ष द्यावे. गुरु ग्रहाचा \'ॐ बृं बृहस्पतये नमः\' जप नियमित चालू ठेवावा.', 'वर्तमान गुरु-शनि दशा में स्वास्थ्य एवं घुटनों की देखभाल करें। गुरु ग्रह के मंत्र \'ॐ बृं बृहस्पतये नमः\' का नित्य जप जारी रखें।', 'હાલમાં ગુરુ-શનિ દશા હોવાથી સ્વાસ્થ્ય અને ઘૂંટણની સંભાળ રાખો. ગુરુ ગ્રહના \'ॐ बृं बृहस्पतये नमः\' મંત્રનો નિત્ય જપ ચાલુ રાખો.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Pre-Consultation Questions */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-[#E0BFBF]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765B00] text-xl">quiz</span>
              <h3 className="font-serif text-lg font-bold text-[#570013]">
                {loc('Pre-Consultation Questions (Confidential Inquiries)', 'परामर्श पूर्व-प्रश्नावली (गोपनीय)', 'परामर्श पूर्व प्रश्नावली (गोपनीय)', 'પરામર્શ પૂર્વ પ્રશ્નાવલી (ગોપનીય)')}
              </h3>
            </div>
            <p className="text-xs text-[#584141] mt-0.5">
              {loc('Questions submitted for tomorrow\'s consultation — accepted for study by Pt. Vishnupant Shastri.', 'उद्याच्या सत्रासाठी आपण नोंदवलेले प्रश्न — दैवज्ञ पं. विष्णुपंत शास्त्री यांनी अभ्यासासाठी स्वीकारले आहेत.', 'कल के सत्र के लिए आपके द्वारा दर्ज प्रश्न — पं. विष्णुपंत शास्त्री द्वारा अध्ययन हेतु स्वीकार किए गए हैं।', 'આવતીકાલના સત્ર માટે આપના દ્વારા નોંધાયેલ પ્રશ્નો — પં. વિષ્ણુપંત શાસ્ત્રી દ્વારા અભ્યાસ માટે સ્વીકારવામાં આવ્યા છે.')}
            </p>
          </div>
          <button
            onClick={() => setIsQuestionModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>{loc('+ Add Question', '+ नवीन प्रश्न जोडा', '+ नया प्रश्न जोड़ें', '+ નવો પ્રશ્ન ઉમેરો')}</span>
          </button>
        </div>

        <div className="space-y-3">
          {consultation.questions.map((q, idx) => {
            const isQ1 = q.id === 'q1';
            const isQ2 = q.id === 'q2';
            const catLabel = isQ1
              ? loc('Career & Business Expansion', 'करिअर व उद्योग विस्तार', 'करियर एवं व्यापार विस्तार', 'કારકિર્દી અને વ્યવસાય વિસ્તરણ')
              : isQ2
              ? loc('Family Health & Children Education', 'कौटुंबिक आरोग्य व मुलांचे शिक्षण', 'पारिवारिक स्वास्थ्य एवं बच्चों की शिक्षा', 'પારિવારિક સ્વાસ્થ્ય અને બાળકોનું શિક્ષણ')
              : q.category;
            const qContent = isQ1
              ? loc(
                  'What are the auspicious Muhurtas and Nakshatras in 2024 to start a new software consultancy partnership? Will the partnership be favorable in the ongoing Saturn Antardasha?',
                  'नवीन सॉफ्टवेअर कन्सल्टन्सी भागीदारी सुरू करण्यासाठी २०२४ मधील अनुकूल मुहूर्त व नक्षत्र कोणते? चालू शनी अंतर्दशेत नवीन भागीदारी लाभदायक ठरेल का?',
                  'नई सॉफ्टवेयर कंसल्टेंसी साझेदारी शुरू करने के लिए 2024 में अनुकूल मुहूर्त और नक्षत्र कौन से हैं? वर्तमान शनि अंतर्दशा में साझेदारी लाभदायक होगी?',
                  'નવી સોફ્ટવેર કન્સલ્ટન્સી ભાગીદારી શરૂ કરવા માટે ૨૦૨૪ માં અનુકૂળ મુહૂર્ત અને નક્ષત્ર કયા છે? ચાલુ શનિ અંતર્દશામાં ભાગીદારી લાભદાયી રહેશે?'
                )
              : isQ2
              ? loc(
                  'When is the foreign travel yoga (9th and 12th houses) likely for elder son’s higher education (age 17)? Is any special anushthan needed for peace at home?',
                  'मोठ्या मुलाच्या (वय १७) उच्च शिक्षणासाठी परदेश गमन योग (९वा व १२वा भाव) केव्हा संभवतो? घरामध्ये शांती राहण्यासाठी काही विशेष अनुष्ठान आवश्यक आहे का?',
                  'बड़े बेटे (उम्र 17) की उच्च शिक्षा के लिए विदेश गमन योग (9वां व 12वां भाव) कब संभव है? घर में शांति हेतु क्या विशेष अनुष्ठान आवश्यक है?',
                  'મોટા પુત્રના (ઉંમર ૧૭) ઉચ્ચ શિક્ષણ માટે વિદેશ ગમન યોગ ક્યારે સંભવિત છે? ઘરમાં શાંતિ માટે કોઈ વિશેષ અનુષ્ઠાન જરૂરી છે?'
                )
              : q.question;
            const statusLabel = isQ1
              ? loc('Reviewed by Shastriji', 'शास्त्रीजींकडून तपासले गेले', 'शास्त्री जी द्वारा समीक्षित', 'શાસ્ત્રીજી દ્વારા સમીક્ષિત')
              : isQ2
              ? loc('Queued for Discussion', 'चर्चेसाठी समाविष्ट', 'चर्चा हेतु कतार में', 'ચર્ચા માટે કતારમાં')
              : q.status;
            const bhavLabel = isQ1
              ? loc('10th (Karma) & 11th (Labha) Houses', 'दशम (कर्म) व एकादश (लाभ) भाव', 'दशम (कर्म) एवं एकादश (लाभ) भाव', 'દશમ (કર્મ) અને એકાદશ (લાભ) ભાવ')
              : isQ2
              ? loc('5th (Santati) & 9th (Bhagya) Houses', 'पंचम (संतती) व नवम (भाग्य) भाव', 'पंचम (संतति) एवं नवम (भाग्य) भाव', 'પંચમ (સંતતિ) અને નવમ (ભાગ્ય) ભાવ')
              : q.refBhav;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex flex-col md:flex-row items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#570013] text-white font-bold flex items-center justify-center shrink-0">
                    {formatLocalizedNumber(idx + 1, language)}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#221918]">{catLabel}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FFD979]/50 text-[#795D00] text-[10px] font-bold">
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-[#584141] leading-relaxed">{qContent}</p>
                    <span className="text-[10px] text-[#765B00] font-semibold block">
                      {loc('Focus House:', 'संदर्भ भाव:', 'संदर्भ भाव:', 'સંદર્ભ ભાવ:')} {bhavLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={loc('Add Consultation Question', 'नवीन सल्ला प्रश्न जोडा', 'नया परामर्श प्रश्न जोड़ें', 'નવો પરામર્શ પ્રશ્ન ઉમેરો')}
        subtitle={loc('Submit questions for comprehensive Kundali analysis by the Acharya', 'दैवज्ञ आचार्यांकडे सखोल पत्रिका तपासणीसाठी प्रश्न सादर करा', 'आचार्यों के पास गहन कुंडली विश्लेषण के लिए प्रश्न प्रस्तुत करें', 'આચાર્ય સમક્ષ ગહન કુંડળી વિશ્લેષણ માટે પ્રશ્ન રજૂ કરો')}
        maxWidth="md"
      >
        <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#221918] mb-1">
              {loc('Subject Category', 'विषय श्रेणी', 'विषय श्रेणी', 'વિષય શ્રેણી')}
            </label>
            <select
              value={newQuestionCat}
              onChange={(e) => setNewQuestionCat(e.target.value)}
              className="w-full bg-[#FFF8F6] px-3 py-2 text-xs rounded-lg border border-[#E0BFBF]/50 focus:outline-none"
            >
              <option>{loc('Career & Business Expansion', 'करिअर व उद्योग विस्तार', 'करियर एवं व्यापार विस्तार', 'કારકિર્દી અને વ્યવસાય વિસ્તરણ')}</option>
              <option>{loc('Family Health & Education', 'कौटुंबिक आरोग्य व शिक्षण', 'पारिवारिक स्वास्थ्य एवं शिक्षा', 'પારિવારિક સ્વાસ્થ્ય અને શિક્ષણ')}</option>
              <option>{loc('Vivah & Matchmaking', 'विवाह योग व जोडीदार', 'विवाह योग एवं मिलान', 'વિવાહ યોગ અને મેળવણી')}</option>
              <option>{loc('Property & Vastu Shanti', 'वास्तु व भूमी खरेदी', 'वास्तु एवं भूमि खरीद', 'વાસ્તુ અને ભૂમિ ખરીદી')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#221918] mb-1">
              {loc('Referenced House', 'संदर्भित भाव', 'संदर्भित भाव', 'સંદર્ભિત ભાવ')}
            </label>
            <input
              type="text"
              value={newQuestionBhav}
              onChange={(e) => setNewQuestionBhav(e.target.value)}
              placeholder={loc('e.g. 10th (Karma) or 7th House', 'उदा. दशम (कर्म) किंवा सप्तम भाव', 'उदा. दशम (कर्म) या सप्तम भाव', 'દા.ત. દશમ (કર્મ) અથવા સપ્તમ ભાવ')}
              className="w-full bg-[#FFF8F6] px-3 py-2 text-xs rounded-lg border border-[#E0BFBF]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#221918] mb-1">
              {loc('Write your detailed question *', 'आपला प्रश्न सविस्तर लिहा *', 'अपना प्रश्न विस्तार से लिखें *', 'આપનો પ્રશ્ન વિગતવાર લખો *')}
            </label>
            <textarea
              rows={3}
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder={loc('Partnership, timing, or specific planetary combination details...', 'नवीन व्यवसायातील भागीदारी, वेळ, अथवा विशेष ग्रहस्थिती संदर्भात...', 'नए व्यवसाय में साझेदारी, समय, अथवा विशिष्ट ग्रह स्थिति के संबंध में...', 'નવા વ્યવસાયમાં ભાગીદારી, સમય, અથવા વિશેષ ગ્રહસ્થિતિ સંદર્ભે...')}
              className="w-full bg-[#FFF8F6] p-2.5 text-xs rounded-lg border border-[#E0BFBF]/50 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold cursor-pointer"
            >
              {loc('Cancel', 'रद्द करा', 'रद्द करें', 'રદ કરો')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] shadow-xs cursor-pointer"
            >
              {loc('Submit Question', 'प्रश्न सादर करा', 'प्रश्न प्रस्तुत करें', 'પ્રશ્ન સબમિટ કરો')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
