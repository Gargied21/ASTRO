import React from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedCurrency, formatLocalizedNumber } from '../../utils/formatters.ts';

interface DashboardOverviewProps {
  onNavigateModule: (module: string) => void;
  onNavigatePublic: (path: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateModule,
  onNavigatePublic,
}) => {
  const { profile, receipts, rituals, consultation, showToast } = useDevotee();
  const { language, t, loc } = useLanguage();

  // Localized greetings based on active language
  const greetings: Record<string, string> = {
    mr: 'सस्नेह नमस्कार',
    hi: 'सादर प्रणाम',
    gu: 'સસ્નેહ નમસ્કાર',
    en: 'Warm Vedic Greetings',
  };

  const muhurtas: Record<string, string> = {
    mr: 'ज्येष्ठ शुक्ल दशमी • सोमवासर • सोमप्रदोष',
    hi: 'ज्येष्ठ शुक्ल दशमी • सोमवार • सोमप्रदोष',
    gu: 'જ્યેષ્ઠ શુક્લ દશમી • સોમવાર • સોમપ્રદોષ',
    en: 'Jyeshtha Shukla Dashami • Somavara • Soma Pradosha',
  };

  const streakTexts: Record<string, string> = {
    mr: '१४ दिवस अखंड साधना',
    hi: '14 दिन निरंतर स्वाध्याय',
    gu: '૧૪ દિવસ અવિરત સાધના',
    en: '14-Day Continuous Vedic Sadhana',
  };

  const devoteeName = profile.name?.trim() || loc('Registered Yajamana', 'नोंदणीकृत यजमान', 'पंजीकृत यजमान', 'નોંધાયેલ યજમાન');
  const activeRitualsCount = rituals.filter((r) => r.status !== 'completed').length;
  const primaryRitual = rituals[0];

  const devoteeGotra = profile.gotra ? `${profile.gotra} Gotra` : loc(
    'Bharadwaja (Kashyapa Pravara)',
    'भारद्वाज (काश्यप प्रवर)',
    'भारद्वाज (कश्यप प्रवर)',
    'ભારદ્વાજ (કાશ્યપ પ્રવર)'
  );

  const devoteeNakshatra = profile.nakshatra ? `${profile.nakshatra}` : loc(
    'Rohini (Pada 2)',
    'रोहिणी (द्वितीय चरण)',
    'रोहिणी (द्वितीय चरण)',
    'રોહિણી (દ્વિતીય ચરણ)'
  );

  const totalDonationsAmount = receipts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* SECTION A: PERSONALIZED GREETING & AUSPICIOUS REVERENCE */}
      <div className="w-full bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xs border border-[#E0BFBF]/40 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FFDF94]/20 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD979]/40 text-[#795D00] text-xs font-bold">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>{t('dash.verifiedDevotee')} • {profile.code}</span>
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#FFF0ED] text-[#584141] text-xs font-medium">
                {devoteeGotra} • {devoteeNakshatra}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#570013] font-bold tracking-tight">
              {greetings[language] || greetings.mr}, {devoteeName}
            </h1>

            <p className="text-xs sm:text-sm text-[#584141]">
              {t('dash.consoleTitle')} • {t('dash.todaysMuhurta')}:{' '}
              <span className="font-semibold text-[#570013]">
                {muhurtas[language] || muhurtas.mr}
              </span>
            </p>

            <div className="inline-flex items-center gap-2 mt-1">
              <span className="font-serif italic text-xs sm:text-sm text-[#765B00] font-bold">
                ॥ योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ॥
              </span>
            </div>
          </div>

          {/* Ashram Coordinator Strip */}
          <div className="bg-[#FFF0ED] p-4 rounded-xl flex items-center justify-between gap-4 lg:min-w-[320px] shrink-0 border border-[#E0BFBF]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#570013] text-white flex items-center justify-center font-serif text-base font-bold shrink-0 shadow-xs">
                {loc('VD', 'पं', 'पं', 'પં')}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#570013] truncate leading-tight">
                  {loc('Pt. Vinayak Dixit', 'पं. विनायक दीक्षित', 'पं. विनायक दीक्षित', 'પં. વિનાયક દીક્ષિત')}
                </span>
                <span className="text-[11px] text-[#584141]">{t('dash.liaisonTitle')}</span>
                <span className="text-xs text-[#765B00] font-bold mt-0.5 font-mono">+91 98220 54321</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="https://wa.me/919822054321"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white text-[#25D366] flex items-center justify-center hover:bg-[#FCEAE6] transition-colors shadow-2xs cursor-pointer"
                title="WhatsApp Liaison"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
              </a>
              <a
                href="tel:+919822054321"
                className="w-9 h-9 rounded-lg bg-[#570013] text-white flex items-center justify-center hover:bg-[#800020] transition-colors shadow-2xs cursor-pointer"
                title="Call Liaison"
              >
                <span className="material-symbols-outlined text-lg">call</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: PRIORITY METRIC STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div
          onClick={() => onNavigateModule('rituals')}
          className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/30 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#584141] uppercase tracking-wider font-bold">
              {t('dash.activeRituals')}
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFDADA] text-[#570013] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A] animate-pulse"></span>
              {loc('LIVE NOW', 'थेट चालू', 'प्रत्यक्ष चालू', 'જીવંત ચાલુ')}
            </span>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl font-bold text-[#570013]">
              {loc(`${activeRitualsCount} Active`, `${activeRitualsCount} चालू`, `${activeRitualsCount} सक्रिय`, `${activeRitualsCount} સક્રિય`)}
            </span>
            <p className="text-xs text-[#584141] mt-1 truncate">
              {(primaryRitual ? primaryRitual.title : loc('No Active Rituals Yet', 'सध्या कोणतेही अनुष्ठान नाही', 'कोई सक्रिय अनुष्ठान नहीं', 'કોઈ સક્રિય અનુષ્ઠાન નથી'))}
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div
          onClick={() => onNavigateModule('learning')}
          className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/30 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#584141] uppercase tracking-wider font-bold">
              {t('dash.learningCourses')}
            </span>
            <span className="p-1 rounded bg-[#FFD979]/40 text-[#795D00]">
              <span className="material-symbols-outlined text-base">menu_book</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl font-bold text-[#765B00]">
              {loc('2 Courses', '०२ वर्ग', '2 पाठ्यक्रम', '૨ અભ્યાસક્રમ')}
            </span>
            <p className="text-xs text-[#584141] mt-1 truncate">
              {loc(
                'Rigveda Mandala 1 & Sanskrit',
                'ऋग्वेद प्रथम मण्डल & संस्कृत',
                'ऋग्वेद प्रथम मण्डल एवं संस्कृत',
                'ઋગ્વેદ પ્રથમ મંડળ અને સંસ્કૃત'
              )}
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div
          onClick={() => onNavigateModule('astrology')}
          className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/30 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#584141] uppercase tracking-wider font-bold">
              {t('dash.upcomingAppointments')}
            </span>
            <span className="p-1 rounded bg-[#FFF0ED] text-[#570013]">
              <span className="material-symbols-outlined text-base">schedule</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl font-bold text-[#570013]">
              {(consultation ? `${consultation.date} • ${consultation.time}` : loc('Book Session', 'सत्र बुक करा', 'सत्र बुक करें', 'સત્ર બુક કરો'))}
            </span>
            <p className="text-xs text-[#584141] mt-1 truncate">
              {loc(
                'Pt. Vishnupant Shastri',
                'दैवज्ञ पं. विष्णुपंत शास्त्री',
                'ज्योतिषाचार्य पं. विष्णुपंत शास्त्री',
                'જ્યોતિષાચાર્ય પં. વિષ્ણુપંત શાસ્ત્રી'
              )}
            </p>
          </div>
        </div>

        {/* Stat 4 */}
        <div
          onClick={() => onNavigateModule('donations')}
          className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/30 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#584141] uppercase tracking-wider font-bold">
              {t('dash.totalDonations')}
            </span>
            <span className="p-1 rounded bg-[#FCEAE6] text-[#570013]">
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </span>
          </div>
          <div className="mt-3">
            <span className="font-serif text-2xl font-bold text-[#570013]">
              {formatLocalizedCurrency(totalDonationsAmount, language)}
            </span>
            <p className="text-xs text-[#584141] mt-1 truncate">
              {loc(
                'Form 10BE Ready to Download',
                'Form 10BE प्रमाणपत्र सज्ज',
                'फॉर्म 10BE प्रमाणपत्र तैयार',
                'ફોર્મ 10BE પ્રમાણપત્ર તૈયાર'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION C: QUICK ACTIONS TOOLBAR */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onNavigateModule('rituals')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">local_fire_department</span>
          <span>{t('dash.newBooking')}</span>
        </button>
        <button
          onClick={() => onNavigateModule('astrology')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-all shadow-xs border border-[#E0BFBF]/40 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-[#765B00]">auto_awesome</span>
          <span>
            {loc(
              'Book Astrology Session',
              'ज्योतिष भेट आरक्षित करा',
              'ज्योतिष सत्र आरक्षित करें',
              'જ્યોતિષ સત્ર બુક કરો'
            )}
          </span>
        </button>
        <button
          onClick={() => onNavigateModule('learning')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#221918] text-xs font-bold hover:bg-[#FCEAE6] transition-all shadow-xs border border-[#E0BFBF]/40 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-[#765B00]">play_circle</span>
          <span>{t('dash.studyVedas')}</span>
        </button>
        <button
          onClick={() => onNavigateModule('donations')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#584141] text-xs font-bold hover:bg-[#FCEAE6] transition-all shadow-xs border border-[#E0BFBF]/40 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">file_download</span>
          <span>{t('dash.downloadReceipt')}</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Active Ritual, Learning Progress, 80G Receipts */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Ritual Live Card */}
          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-5 sm:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A] animate-ping"></span>
                <span className="font-serif text-lg font-bold text-[#570013]">
                  {loc(
                    'Maha Mrityunjaya Anushthan & Rudra Swahakar',
                    'महामृत्युंजय महा अनुष्ठान व रुद्र स्वाहाकार',
                    'महामृत्युंजय महा अनुष्ठान एवं रुद्र स्वाहाकार',
                    'મહામૃત્યુંજય મહા અનુષ્ઠાન અને રુદ્ર સ્વાહાકાર'
                  )}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#570013] text-white text-xs font-bold self-start sm:self-auto shadow-xs">
                <span className="material-symbols-outlined text-sm">videocam</span>
                <span>{loc('LIVE STREAM ACTIVE', 'थेट प्रक्षेपण सक्रिय', 'प्रत्यक्ष प्रसारण सक्रिय', 'જીવંત પ્રસારણ સક્રિય')}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
              <div className="md:col-span-5 flex flex-col justify-between">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xs group bg-[#FCEAE6]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyMTt1HXsPDF9QTetxCiAAeo0KwEVeFCU_lERwAA4_fIu8pa0gXMyUpp5JyiATMjf9VZyTZ9pbOkLzNkqXSrENO6NlrNyL8zJZLpZddNBq6nyag9zNHcYxkZQXg8Lq0MdQBgt5Z7wimxWcyiCBOrJTmRghe6NNq4XwPZU9GM6L5LGf7fjzg1swFyKWF2-gLW-IanWnuJHBf5q7j244xWmYm7hkTZftxfvNbXajWVh3abK-x3L8-nsClg"
                    alt={loc('Yajna Live Stream', 'यज्ञ थेट प्रक्षेपण', 'यज्ञ प्रत्यक्ष प्रसारण', 'યજ્ઞ જીવંત પ્રસારણ')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded w-fit flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#BA1A1A]"></span>
                      HD 1080p • Live Ved Bhavan Pune
                    </span>
                    <button
                      onClick={() => onNavigateModule('rituals')}
                      className="w-full py-2 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">play_arrow</span>
                      <span>{loc('Join Live Yajna Broadcast', 'थेट प्रक्षेपणात सहभागी व्हा', 'प्रत्यक्ष प्रसारण में जुड़ें', 'જીવંત પ્રસારણમાં જોડાઓ')}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-[#FFF0ED] rounded-lg flex items-start gap-2.5 border border-[#E0BFBF]/30">
                  <span className="material-symbols-outlined text-[#765B00] text-lg mt-0.5">local_shipping</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#221918] truncate leading-tight">
                      {loc(
                        'Sacred Raksha Sutra & Bhasma Prasad Dispatched',
                        'रक्षा सूत्र व भस्म प्रसाद रवाना',
                        'रक्षा सूत्र एवं भस्म प्रसाद प्रेषित',
                        'રક્ષા સૂત્ર અને ભસ્મ પ્રસાદ રવાના'
                      )}
                    </span>
                    <span className="text-[11px] text-[#584141] font-mono">
                      Speed Post #IP784920412IN • In Transit
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-[#584141] uppercase tracking-wider block font-semibold">
                      {loc('Sankalpa Intent', 'यजमान संकल्प हेतू', 'संकल्प हेतु', 'સંકલ્પ હેતુ')}
                    </span>
                    <span className="text-xs font-bold text-[#221918]">
                      {loc(
                        'Family Health, Longevity & Ayushya Vriddhi',
                        'सकुटुंब आरोग्य, दीर्घायुष्य व क्लेश निवृत्ती (Health & Ayushya Vriddhi)',
                        'सकुटुंब स्वास्थ्य, दीर्घायु एवं क्लेश निवारण',
                        'સકુટુંબ સ્વાસ્થ્ય, દીર્ઘાયુષ્ય અને સુખ શાંતિ'
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="p-2.5 rounded-lg bg-[#FFF0ED]">
                      <span className="text-[10px] text-[#584141] block">
                        {loc('Chief Hotri Priest', 'मुख्य ऋत्विक', 'मुख्य ऋत्विक', 'મુખ્ય ઋત્વિક')}
                      </span>
                      <span className="text-xs font-bold text-[#570013] truncate block">
                        {loc('Dr. Shripad Bhat (Ghanapathi)', 'डॉ. श्रीपाद भट (घनापाठी)', 'डॉ. श्रीपाद भट (घनापाठी)', 'ડૉ. શ્રીપાદ ભટ (ઘનપાઠી)')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FFF0ED]">
                      <span className="text-[10px] text-[#584141] block">
                        {loc('Progress', 'कालावधी', 'प्रगति', 'પ્રગતિ')}
                      </span>
                      <span className="text-xs font-bold text-[#221918] block">
                        {loc('Day 3 of 7 (In Progress)', 'दिवस ३ / ७ (सुरू)', 'दिन 3 / 7 (प्रगति पर)', 'દિવસ ૩ / ૭ (ચાલુ)')}
                      </span>
                    </div>
                  </div>

                  {/* Japa Count Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#584141] font-medium">
                        {loc('Rudra Japa Count', 'जपसंख्या प्रगती (रुद्र जप)', 'रुद्र जप संख्या', 'રુદ્ર જપ સંખ્યા')}
                      </span>
                      <span className="font-bold text-[#570013] font-mono">19,000 / 125,000 (15.2%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FFF0ED] rounded-full overflow-hidden">
                      <div className="h-full bg-[#765B00] rounded-full" style={{ width: '15.2%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E0BFBF]/30">
                  <button
                    onClick={() => onNavigateModule('rituals')}
                    className="text-xs font-bold text-[#570013] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{loc('View Full Sankalpa Details', 'संकल्प तपशील व गोत्र माहिती', 'पूर्ण संकल्प विवरण देखें', 'સંપૂર્ણ સંકલ્પ વિગતો જુઓ')}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast(
                        loc(
                          'Connecting to Ashram Liaison...',
                          'पुरोहितांशी संपर्क जोडला जात आहे...',
                          'आश्रम पुरोहितों से संपर्क किया जा रहा है...',
                          'આશ્રમ પુરોહિતો સાથે સંપર્ક થઈ રહ્યો છે...'
                        ),
                        'info'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold hover:bg-[#FCEAE6] transition-colors cursor-pointer"
                  >
                    {loc('Contact Pandits', 'पुरोहितांशी संपर्क', 'पुरोहितों से संपर्क करें', 'પુરોહિતો સાથે સંપર્ક')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Gurukul Learning Progress */}
          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#765B00] text-xl">auto_stories</span>
                <span className="font-serif text-lg font-bold text-[#570013]">
                  {loc(
                    'My Gurukul Learning & Veda Sadhana',
                    'माझा गुरुकुल स्वाध्याय व वेद साधना',
                    'मेरा गुरुकुल स्वाध्याय व वेद साधना',
                    'મારો ગુરુકુલ સ્વાધ્યાય અને વેદ સાધના'
                  )}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFDF94] text-[#251A00] text-xs font-bold">
                <span className="material-symbols-outlined text-sm text-[#765B00]">local_fire_department</span>
                <span>{streakTexts[language] || streakTexts.mr}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFF0ED] flex flex-col justify-between space-y-3 border border-[#E0BFBF]/30">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#570013] text-white text-[10px] font-bold">
                      {loc('Samhita Chanting', 'संहिता पाठ', 'संहिता पाठ', 'સંહિતા પાઠ')}
                    </span>
                    <span className="text-xs font-bold text-[#765B00]">
                      {loc('Lesson 4 of 12 (33%)', 'पाठ ४ / १२ (३३%)', 'पाठ 4 / 12 (33%)', 'પાઠ ૪ / ૧૨ (૩૩%)')}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#570013]">
                    {loc(
                      'Rigveda Shakala Samhita - Mandala 1',
                      'ऋग्वेद शाकल संहिता अध्ययन - प्रथम मण्डल',
                      'ऋग्वेद शाकल संहिता अध्ययन - प्रथम मण्डल',
                      'ઋગ્વેદ શાકલ સંહિતા અધ્યયન - પ્રથમ મંડલ'
                    )}
                  </h3>
                  <p className="text-xs text-[#584141] line-clamp-2">
                    {loc(
                      'Agni Sukta (1.1) • Svarita & Anudatta accentuation rules with audio.',
                      'अग्नि सूक्त (१.१) • उदात्त-अनुदात्त-स्वरित सराव, मंत्र १ व २ स्वर शुद्ध उच्चारण.',
                      'अग्नि सूक्त (1.1) • उदात्त-अनुदात्त-स्वरित अभ्यास, मंत्र 1 व 2 स्वर शुद्ध उच्चारण.',
                      'અગ્નિ સૂક્ત (૧.૧) • ઉદાત્ત-અનુદાત્ત-સ્વરિત અભ્યાસ, મંત્ર ૧ અને ૨ શુદ્ધ ઉચ્ચારણ.'
                    )}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#221918]">
                    33% {loc('Completed', 'पूर्ण', 'पूर्ण', 'પૂર્ણ')}
                  </span>
                  <button
                    onClick={() => onNavigateModule('learning')}
                    className="px-3 py-1.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors cursor-pointer"
                  >
                    {loc('Resume Study', 'अभ्यास सुरू करा', 'अध्ययन जारी रखें', 'અભ્યાસ શરૂ કરો')}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF0ED] flex flex-col justify-between space-y-3 border border-[#E0BFBF]/30">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#765B00] text-white text-[10px] font-bold">
                      {loc('Sanskrit', 'संभाषण', 'संस्कृत संभाषण', 'સંસ્કૃત સંભાષણ')}
                    </span>
                    <span className="text-xs font-bold text-[#765B00]">
                      {loc('Session 7 of 20 (50%)', 'सत्र ७ / २० (५०%)', 'सत्र 7 / 20 (50%)', 'સત્ર ૭ / ૨૦ (૫૦%)')}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#570013]">
                    {loc(
                      'Conversational Sanskrit & Paninian Grammar',
                      'संस्कृत संभाषण व पाणिनीय व्याकरण',
                      'संस्कृत संभाषण व पाणिनीय व्याकरण',
                      'સંસ્કૃત સંભાષણ અને પાણિનીય વ્યાકરણ'
                    )}
                  </h3>
                  <p className="text-xs text-[#584141] line-clamp-2">
                    {loc(
                      'Next Live Interactive Session: Saturday 08:30 AM IST (Zoom).',
                      'नेक्स्ट लाईव्ह वर्ग: शनिवार • सकाळी ०८:३० (Zoom थेट संवाद).',
                      'अगला लाइव्ह वर्ग: शनिवार • सुबह 08:30 (Zoom सीधा संवाद).',
                      'આગામી લાઈવ ક્લાસ: શનિવાર • સવારે ૦૮:૩૦ (Zoom સીધો સંવાદ).'
                    )}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#221918]">
                    50% {loc('Completed', 'पूर्ण', 'पूर्ण', 'પૂર્ણ')}
                  </span>
                  <button
                    onClick={() => onNavigateModule('learning')}
                    className="px-3 py-1.5 rounded-lg bg-[#765B00] text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {loc('Join Zoom Class', 'Zoom जॉईन', 'Zoom से जुड़ें', 'Zoom જોડાઓ')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 80G Receipts Vault preview */}
          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E0BFBF]/30">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#570013]">
                  {loc(
                    '80G Tax Exemption Receipts Vault',
                    '८०-जी धर्मदाय पावती व वित्तीय संच',
                    '80G कर छूट रसीदें एवं वित्तीय संच',
                    '૮૦G કર મુક્તિ રસીદો અને નાણાકીય સંચય'
                  )}
                </h2>
                <p className="text-xs text-[#584141]">
                  {loc(
                    'CBDT Section 80G Compliant tax exemption certificates',
                    'आयकर कलम ८०-जी अन्वये १००% करसवलत पात्र पावत्या',
                    'आयकर धारा 80G के अंतर्गत 100% कर छूट प्राप्त रसीदें',
                    'આવકવેરા કલમ ૮૦G હેઠળ કર મુક્તિ પ્રમાણપત્રો'
                  )}
                </p>
              </div>
              <button
                onClick={() => onNavigateModule('donations')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">folder_zip</span>
                <span>
                  {loc(
                    'Download Form 10BE Certificate',
                    'Form 10BE वार्षिक प्रमाणपत्र',
                    'Form 10BE वार्षिक प्रमाण पत्र',
                    'Form 10BE વાર્ષિક પ્રમાણપત્ર'
                  )}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {receipts.slice(0, 2).map((r) => (
                <div
                  key={r.receiptNo}
                  className="p-3.5 rounded-xl bg-[#FFF0ED] flex flex-col md:flex-row md:items-center justify-between gap-3 border border-[#E0BFBF]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white text-[#570013] flex items-center justify-center shrink-0 shadow-2xs">
                      <span className="material-symbols-outlined text-xl">receipt</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#221918] truncate">
                        {language === 'en'
                          ? r.purpose
                          : language === 'hi'
                          ? (r.purposeHi || r.purpose)
                          : language === 'gu'
                          ? (r.purposeGu || r.purpose)
                          : (r.purposeMr || r.purpose)}
                      </span>
                      <span className="text-[11px] text-[#584141]">
                        {loc('Receipt:', 'पावती:', 'रसीद:', 'રસીદ:')}{' '}
                        <span className="font-mono font-semibold">{r.receiptNo}</span> • {r.date} • {r.mode}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <span className="font-serif text-base font-bold text-[#570013]">
                      ₹ {r.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onNavigateModule('donations')}
                      className="px-3 py-1.5 rounded bg-white text-[#570013] text-xs font-bold hover:bg-[#570013] hover:text-white transition-all shadow-xs cursor-pointer"
                    >
                      {loc('Receipt PDF', 'पावती PDF', 'रसीद PDF', 'રસીદ PDF')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Astrology preview, upcoming events, Seva sponsorship */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Confirmed Astrology Consultation */}
          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <span className="font-serif text-base font-bold text-[#570013]">
                {loc('Vedic Astrology Consultation', 'वैदिक जन्मपत्रिका परामर्श', 'वैदिक जन्मपत्रिका परामर्श', 'વૈદિક જન્મકુંડળી પરામર્શ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD979]/50 text-[#795D00] text-xs font-bold">
                {loc('Confirmed', 'आरक्षित', 'आरक्षित', 'કન્ફર્મ')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqBoNe284pPDGZptxHjiY2YqjFnHWCk4n78DlFNs1FRoDvIKHHVjjmhOx-oXo1OwKc46AtIoWl6A55f5zgiDKS-5Lj3pZqEg09XUIFdp_Kpvu1H2E-prbWfydWNumkqemfsUDBp06kPL0o1clUKepUj4ylJMKzXt-7Id3RKEN6rO3EPzoMW8jQ1UCO1Dy0-OpYJdqgdRnUozHBo8ZZQDpGE5GFrQ__QtFU_QkXHMBUAGzilwuqjNy_dA"
                alt="Pt. Vishnupant Shastri"
                className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E0BFBF]"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#570013] truncate leading-tight">
                  {loc('Pt. Pu. Vishnupant Shastri (Jyotishratna)', 'दैवज्ञ पं. पु. विष्णुपंत शास्त्री', 'दैवज्ञ पं. पु. विष्णुपंत शास्त्री', 'દૈવજ્ઞ પં. પૂ. વિષ્ણુપંત શાસ્ત્રી')}
                </span>
                <span className="text-[11px] text-[#584141]">
                  {loc('Jyotish & Muhurta Scholar', 'फलज्योतिष व मुहूर्त विशारद', 'फलज्योतिष व मुहूर्त विशारद', 'જ્યોતિષ અને મુહૂર્ત વિશારદ')}
                </span>
                <span className="text-[11px] text-[#765B00] font-semibold mt-0.5">
                  {loc('Focus: Mahadasha & Remedial Shanti', 'विषय: महादशा व ग्रहशांती', 'विषय: महादशा व ग्रहशांति', 'વિષય: મહાદશા અને ગ્રહશાંતિ')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FFF0ED] space-y-1 border border-[#E0BFBF]/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#221918]">
                <span className="material-symbols-outlined text-[#570013] text-base">event</span>
                <span>{loc('Tomorrow • 11:30 AM IST', 'उद्या • ११:३० AM IST', 'कल • 11:30 AM IST', 'આવતીકાલે • ૧૧:૩૦ AM IST')}</span>
              </div>
              <div className="flex items-center gap-2 text-[#584141]">
                <span className="material-symbols-outlined text-[#765B00] text-base">location_on</span>
                <span>{loc('Central Ashram, Pune (In-Person)', 'वेदमंदिर, पौड रोड, पुणे (प्रत्यक्ष भेट)', 'वेदमंदिर, पौड रोड, पुणे (प्रत्यक्ष परामर्श)', 'વેદમંદિર, પૌડ રોડ, પુણે (પ્રત્યક્ષ મુલાકાત)')}</span>
              </div>
            </div>

            {/* Kundali Thumbnail */}
            <div className="p-3 rounded-xl bg-[#FFF8F6] border border-[#E0BFBF]/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#584141] font-semibold">{loc('Kundali Chart (D1 Lagna)', 'कुंडली प्रारूप (D1 लग्न)', 'कुंडली प्रारूप (D1 लग्न)', 'કુંડળી પ્રારૂપ (D1 લગ્ન)')}</span>
                <span className="text-[#570013] font-bold">{loc('Dasha: Guru-Shani', 'दशा: गुरू-शनि-बुध', 'दशा: गुरु-शनि-बुध', 'દશા: ગુરુ-શનિ-બુધ')}</span>
              </div>
              <div className="w-full aspect-[4/3] bg-white rounded-lg flex items-center justify-center p-2 border border-[#E0BFBF]/30">
                <svg className="w-full h-full text-[#765B00]" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
                  <rect height="96" width="96" x="2" y="2"></rect>
                  <line x1="2" x2="98" y1="2" y2="98"></line>
                  <line x1="98" x2="2" y1="2" y2="98"></line>
                  <polygon points="50,2 98,50 50,98 2,50"></polygon>
                  <text fill="#570013" fontSize="5" fontWeight="bold" textAnchor="middle" x="50" y="32">लग्न (२)</text>
                  <text fill="#765B00" fontSize="4" textAnchor="middle" x="50" y="24">सूर्य • बुध</text>
                  <text fill="#221918" fontSize="4.5" textAnchor="middle" x="50" y="72">गुरु (८)</text>
                  <text fill="#221918" fontSize="4.5" textAnchor="middle" x="24" y="50">चंद्र (५)</text>
                  <text fill="#221918" fontSize="4.5" textAnchor="middle" x="76" y="50">केतू (१२)</text>
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigateModule('astrology')}
                className="w-full py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>{loc('Open Full Kundali & Dasha Suite', 'कुंडली व दशा कक्ष उघडा', 'कुंडली व दशा कक्ष खोलें', 'કુંડળી અને દશા કક્ષ ખોલો')}</span>
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <h2 className="font-serif text-base font-bold text-[#570013]">
                {loc('Upcoming Ashram Events', 'आगामी आश्रम उपक्रम', 'आगामी आश्रम कार्यक्रम', 'આગામી આશ્રમ કાર્યક્રમો')}
              </h2>
              <button
                onClick={() => onNavigatePublic('events')}
                className="text-xs font-bold text-[#765B00] hover:underline cursor-pointer"
              >
                {loc('View All', 'सर्व पहा', 'सभी देखें', 'બધા જુઓ')}
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#FFF0ED] flex items-start gap-3 border border-[#E0BFBF]/30">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-[#570013] text-white shrink-0 font-mono">
                  <span className="text-xs font-bold leading-none">04</span>
                  <span className="text-[9px] leading-none opacity-80 mt-1 uppercase">{loc('JUN', 'जून', 'जून', 'જૂન')}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#221918] truncate">
                    {loc(
                      'Nirjala Ekadashi Community Sahasranama',
                      'निर्जला एकादशी सामूहिक विष्णुसहस्रनाम',
                      'निर्जला एकादशी सामूहिक विष्णुसहस्रनाम',
                      'નિર્જલા એકાદશી સામૂહિક વિષ્ણુસહસ્રનામ'
                    )}
                  </span>
                  <span className="text-[11px] text-[#584141] mt-0.5">
                    {loc('5:30 PM • Ashram Yajna Shala', 'सायंकाळी ५:३० • यज्ञाश्रम', 'शाम 5:30 • यज्ञाश्रम', 'સાંજે ૫:૩૦ • યજ્ઞાશ્રમ')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FFF0ED] flex items-start gap-3 border border-[#E0BFBF]/30">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-[#765B00] text-white shrink-0 font-mono">
                  <span className="text-xs font-bold leading-none">21</span>
                  <span className="text-[9px] leading-none opacity-80 mt-1 uppercase">{loc('JUN', 'जून', 'जून', 'જૂન')}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#221918] truncate">
                    {loc(
                      'Surya Sankranti Maha Rudrabhishek Yajna',
                      'सूर्य संक्रांति महा रुद्राभिषेक होम',
                      'सूर्य संक्रांति महा रुद्राभिषेक होम',
                      'સૂર્ય સંક્રાંતિ મહા રુદ્રાભિષેક હોમ'
                    )}
                  </span>
                  <span className="text-[11px] text-[#584141] mt-0.5">
                    {loc('07:00 AM • Live Stream Available', 'सकाळी ०७:०० • थेट प्रक्षेपण', 'सुबह 07:00 • सीधा प्रसारण', 'સવારે ૦૭:૦૦ • લાઈવ પ્રસારણ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vidyarthi Dattak Yojana Sponsorship Callout */}
          <div className="w-full bg-[#FFF0ED] rounded-2xl p-5 sm:p-6 shadow-xs border border-[#E0BFBF]/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765B00]">handshake</span>
              <span className="text-xs uppercase tracking-wider text-[#765B00] font-bold">
                {loc('Sacred Seva Sponsorship', 'सत्कार्य आवाहन', 'सत्कार्य आह्वान', 'સત્કાર્ય આહ્વાન')}
              </span>
            </div>
            <h3 className="font-serif text-base font-bold text-[#570013]">
              {loc('Veda Student Sponsorship Scheme', 'वेद विद्यार्थी दत्तक योजना', 'वेद विद्यार्थी दत्तक योजना', 'વેદ વિદ્યાર્થી દત્તક યોજના')}
            </h3>
            <p className="text-xs text-[#584141] leading-relaxed">
              {loc(
                'Support a student scholar in full-time residential Vedic studies, boarding, and meals. 100% Tax Exempt under 80G.',
                'गुरुकुलातील एका बटूच्या वार्षिक अध्ययन, निवास व भोजनाची व्यवस्था करा. आपल्या सेवेला आयकर ८०-जी सवलत लागू.',
                'गुरुकुल के एक बटुक के वार्षिक अध्ययन, आवास और भोजन की व्यवस्था करें। आयकर धारा 80G के अंतर्गत 100% कर छूट मान्य।',
                'ગુરુકુલના એક બટુકના વાર્ષિક અધ્યયન, આવાસ અને ભોજનની વ્યવસ્થા કરો. આવકવેરા કલમ ૮૦G હેઠળ કર મુક્તિ ઉપલબ્ધ.'
              )}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-[#E0BFBF]/30">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#584141]">{loc('Monthly Seva', 'मासिक सेवा', 'मासिक सेवा', 'માસિક સેવા')}</span>
                <span className="font-serif text-base font-bold text-[#570013]">{formatLocalizedCurrency(2500, language)} / {loc('mo', 'महिना', 'माह', 'મહિનો')}</span>
              </div>
              <button
                onClick={() => onNavigateModule('donations')}
                className="px-3.5 py-1.5 rounded-lg bg-[#765B00] text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                {loc('Sponsor Now', 'मासिक सेवा वाढवा', 'सेवा सहयोग दें', 'સેવા સહયોગ આપો')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
