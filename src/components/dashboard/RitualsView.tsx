import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedNumber } from '../../utils/formatters.ts';

interface RitualsViewProps {
  onNavigatePublic: (path: string, param?: string) => void;
}

export const RitualsView: React.FC<RitualsViewProps> = ({ onNavigatePublic }) => {
  const { showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [isJoinStreamModalOpen, setIsJoinStreamModalOpen] = useState(false);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FFF0ED] text-[#570013] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
            </span>
            <span className="text-xs uppercase tracking-wider text-[#765B00] font-bold">
              {t('devoteeSanctum')} • {t('nav.rituals')}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold tracking-tight">
            {loc(
              'My Rituals & Vedic Anushthan',
              'माझे यज्ञ व अनुष्ठान',
              'मेरे यज्ञ एवं अनुष्ठान',
              'મારા યજ્ઞ અને અનુષ્ઠાન'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141] max-w-2xl leading-relaxed">
            {loc(
              'Real-time progress of consecrated Vedic Havans, live altar streaming, daily ahuti sessions, and sacred prasad consignment tracking.',
              'वैदिक परंपरेनुसार संकल्पित अनुष्ठानांची दैनिक प्रगती, थेट यज्ञमंडप प्रक्षेपण, आहुती सत्रे आणि सिद्ध प्रसादाचे टपाल ट्रॅकिंग.',
              'वैदिक परंपरानुसार संकल्पित अनुष्ठानों की दैनिक प्रगति, प्रत्यक्ष यज्ञमंडप प्रसारण, आहुति सत्र एवं पवित्र प्रसाद ट्रैकिंग।',
              'વૈદિક પરંપરા અનુસાર સંકલ્પિત અનુષ્ઠાનોની દૈનિક પ્રગતિ, પ્રત્યક્ષ યજ્ઞમંડપ પ્રસારણ, આહુતિ સત્રો અને પવિત્ર પ્રસાદ ટ્રેકિંગ.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() =>
              showToast(
                loc(
                  'Speed Post: #IP784920412IN • In Transit • Expected by 3 PM',
                  'स्पीड पोस्ट ट्रॅकिंग: #IP784920412IN • आज दुपारी ३ वाजेपर्यंत वितरण अपेक्षित',
                  'स्पीड पोस्ट ट्रैकिंग: #IP784920412IN • आज दोपहर 3 बजे तक वितरण अपेक्षित',
                  'સ્પીડ પોસ્ટ ટ્રેકિંગ: #IP784920412IN • આજે બપોરે ૩ વાગ્યા સુધીમાં પહોંચવાની અપેક્ષા'
                ),
                'info'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#570013] border border-[#E0BFBF]/40 shadow-xs hover:bg-[#FFF0ED] text-xs font-bold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#765B00]">local_shipping</span>
            <span>{t('dash.trackPrasad')}</span>
          </button>
          <button
            onClick={() => onNavigatePublic('yadnik-and-pooja')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#570013] text-white shadow-md hover:bg-[#800020] text-xs font-bold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>{t('dash.newBooking')}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-1.5 bg-[#FFF0ED] rounded-xl border border-[#E0BFBF]/30">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: loc('All Rituals', 'सर्व विधी', 'सभी अनुष्ठान', 'બધી વિધિઓ'), count: 3 },
            { id: 'active', label: loc('Active / Live', 'चालू अनुष्ठान', 'सक्रिय अनुष्ठान', 'ચાલુ અનુષ્ઠાન'), count: 1, ping: true },
            { id: 'upcoming', label: loc('Scheduled', 'आगामी विधी', 'आगामी अनुष्ठान', 'આગામી વિધિઓ'), count: 1 },
            { id: 'completed', label: loc('Archive', 'संपन्न अनुष्ठान', 'संपन्न अनुष्ठान', 'સંપન્ન અનુષ્ઠાન'), count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white text-[#570013] shadow-xs'
                  : 'text-[#584141] hover:text-[#570013]'
              }`}
            >
              {tab.ping && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#765B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#765B00]"></span>
                </span>
              )}
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#584141] text-[10px]">
                {formatLocalizedNumber(tab.count, language)}
              </span>
            </button>
          ))}
        </div>
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#584141] pr-2">
          <span className="material-symbols-outlined text-sm text-[#765B00]">verified</span>
          <span>
            {loc(
              'Yajnashala Stream: Evening Sandhya & Rudra Ahuti sessions active',
              'यज्ञशाळा संकलन: सायं संध्या व रुद्र आहुती नियमित चालू',
              'यज्ञशाला संकलन: सायं संध्या एवं रुद्र आहुति नियमित चालू',
              'યજ્ઞશાળા સંકલન: સાયં સંધ્યા અને રુદ્ર આહુતિ નિયમિત ચાલુ'
            )}
          </span>
        </div>
      </div>

      {/* ACTIVE LIVE RITUAL CARD */}
      {(activeFilter === 'all' || activeFilter === 'active') && (
        <div className="w-full bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#570013] via-[#765B00] to-[#800020]"></div>
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#570013] text-white text-xs font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span>{loc('LIVE NOW', 'थेट चालू', 'सीधा प्रसारण चालू', 'લાઈવ પ્રસારણ ચાલુ')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFD979]/40 text-[#795D00] text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{loc('Day 3 of 7 • Chapter 8 Samputa', 'दिवस ३ / ७ • अष्टम अध्याय संपुट', 'दिन 3 / 7 • अष्टम अध्याय संपुट', 'દિવસ ૩ / ૭ • અષ્ટમ અધ્યાય સંપુટ')}</span>
                  </span>
                  <span className="text-xs font-mono text-[#765B00] font-semibold">
                    {loc('Sankalpa No: #CVP-RUDRA-9842', 'संकल्प क्र: #CVP-RUDRA-9842', 'संकल्प सं.: #CVP-RUDRA-9842', 'સંકલ્પ નં.: #CVP-RUDRA-9842')}
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-[#570013] font-bold pt-1">
                  {loc('Maha Mrityunjaya Mahayanushthan & Rudra Swahakar', 'महामृत्युंजय महा अनुष्ठान व रुद्र स्वाहाकार', 'महामृत्युंजय महा अनुष्ठान एवं रुद्र स्वाहाकार', 'મહામૃત્યુંજય મહા અનુષ્ઠાન અને રુદ્ર સ્વાહાકાર')}
                </h2>
                <p className="text-xs sm:text-sm text-[#584141]">
                  {loc('Shatchandi & Maharudra Vidhi Vidhan • Consecrated Vedic Chants & Dashamsha Homa Tarpana', 'शतचंडी व महारुद्र विधी विधान • प्रत्यक्ष वेद मंत्रोच्चार व दशांश होम तर्पण', 'शतचंडी एवं महारुद्र विधि विधान • प्रत्यक्ष वेद मंत्रोच्चार एवं दशांश होम तर्पण', 'શતચંડી અને મહારુદ્ર વિધિ વિધાન • પ્રત્યક્ષ વેદ મંત્રોચ્ચાર અને દશાંશ હોમ તર્પણ')}
                </p>
              </div>

              <button
                onClick={() =>
                  showToast(
                    loc('Yajamana: Shri Rajesh Kulkarni, Kashyapa Gotra, Rohini Nakshatra', 'यजमान: श्री राजेश कुळकर्णी, काश्यप गोत्र, रोहिणी नक्षत्र', 'यजमान: श्री राजेश कुलकर्णी, कश्यप गोत्र, रोहिणी नक्षत्र', 'યજમાન: શ્રી રાજેશ કુલકર્ણી, કશ્યપ ગોત્ર, રોહિણી નક્ષત્ર'),
                    'info'
                  )
                }
                className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">description</span>
                <span>{loc('Sankalpa & Gotra Details', 'संकल्प गोत्र तपशील', 'संकल्प गोत्र विवरण', 'સંકલ્પ ગોત્ર વિગતો')}</span>
              </button>
            </div>

            {/* Video & Specs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Video Container (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-2">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xs bg-[#FCEAE6]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvmS_y21mXiTUbxeV58F0d56w6FQj4LC2ROYgnt3wqE0Hjn4axULQDYALLS0hIXGgCRD5QGIh1zB_qG5hp-6WMcyCsOaVQKQntd6sfT04m6toH9qrFjrzvovsoRLkBqyC7B76bdrVT1cc7hrGaQbQPjVknnOtKxwh5ufvhW-DLrJMVTIWpLII04wRfjbmrtattFvANvnAaNRL1tyddtUID8fWIUZXpK-3020XBXNoIQvvp05lbgRukaQ"
                    alt={loc('Active Yajna', 'थेट यज्ञानुष्ठान', 'प्रत्यक्ष यज्ञ अनुष्ठान', 'જીવંત યજ્ઞ અનુષ્ઠાન')}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#570013]/90 backdrop-blur-md text-xs font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">videocam</span>
                        {loc('1080p HD • Yajnashala Cam 1', '1080p HD • यज्ञशाळा कॅमेरा १', '1080p HD • यज्ञशाला कैमरा 1', '1080p HD • યજ્ઞશાળા કેમેરા ૧')}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#FFDF94]">group</span>
                        {loc('18 Yajamana Families Connected', '१८ यजमान कुटुंबे जोडलेली आहेत', '18 यजमान परिवार जुड़े हुए हैं', '૧૮ યજમાન પરિવારો જોડાયેલા છે')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span>{loc('Current Ahuti Session: Rudra Swahakar Samputa (Rudrachamakam)', 'वर्तमान आहुती सत्र: रुद्र स्वाहाकार संपुट (रुद्रचमकम्)', 'वर्तमान आहुति सत्र: रुद्र स्वाहाकार संपुट (रुद्रचमकम्)', 'વર્તમાન આહુતિ સત્ર: રુદ્ર સ્વાહાકાર સંપુટ (રુદ્રચમકમ્)')}</span>
                        <span className="text-[#FFDF94]">{loc('Live Audio On', 'थेट ध्वनी चालू', 'सीधा ऑडियो चालू', 'લાઈવ ઓડિયો ચાલુ')}</span>
                      </div>
                      <button
                        onClick={() => setIsJoinStreamModalOpen(true)}
                        className="w-full py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">video_call</span>
                        <span>{loc('Join 2-Way Live Stream', 'थेट प्रक्षेपणात सहभागी व्हा', 'सीधे प्रसारण में सम्मिलित हों', 'લાઈવ પ્રસારણમાં જોડાઓ')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1 text-xs text-[#584141]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#765B00]">info</span>
                    {loc('2-way audio/video enables live Yajamana name pronunciation and Sankalpa recitation', '२-वे ऑडिओ/व्हिडिओद्वारे यजमान नामोच्चार व संकल्प पठण शक्य', '2-वे ऑडियो/वीडियो द्वारा यजमान नामोच्चार एवं संकल्प पाठ संभव', '૨-વે ઓડિયો/વિડિયો દ્વારા યજમાન નામોચ્ચાર અને સંકલ્પ પઠન શક્ય')}
                  </span>
                  <span className="text-[11px] text-[#584141]">{loc('Latency: 0.8s (Ultra-low latency)', 'विलंब: ०.८ सेकंद (अल्ट्रा-लो लेटन्सी)', 'विलंब: 0.8 सेकंड (अल्ट्रा-लो लेटेंसी)', 'વિલંબ: ૦.૮ સેકન્ડ (અલ્ટ્રા-લો લેટન્સી)')}</span>
                </div>
              </div>

              {/* Right Specs & Japa Meter (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#570013] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#765B00]">counter_1</span>
                      <span>{loc('Japa Progress', 'मंत्र जप प्रगती', 'मंत्र जप प्रगति', 'મંત્ર જપ પ્રગતિ')}</span>
                    </span>
                    <span className="font-serif text-base font-bold text-[#765B00]">
                      {loc('19,000', '१९,०००', '19,000', '૧૯,૦૦૦')} <span className="text-xs text-[#584141] font-normal">/ {loc('125,000', '१,२५,०००', '1,25,000', '૧,૨૫,૦૦૦')}</span>
                    </span>
                  </div>
                  <div className="w-full bg-white h-3 rounded-full overflow-hidden p-0.5 border border-[#E0BFBF]/30">
                    <div className="bg-gradient-to-r from-[#765B00] to-[#570013] h-full rounded-full transition-all duration-1000" style={{ width: '15.2%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#584141]">
                    <span>{loc('15.2% Completed (Target: 125,000 Japa)', '१५.२% संपन्न (लक्ष्य: १,२५,००० जप)', '15.2% संपन्न (लक्ष्य: 1,25,000 जप)', '૧૫.૨% સંપન્ન (લક્ષ્ય: ૧,૨૫,૦૦૦ જપ)')}</span>
                    <span className="text-[#570013] font-bold">{loc('Remaining: 106,000 Japa', 'उर्वरित: १,०६,००० जप', 'शेष: 1,06,000 जप', 'બાકી: ૧,૦૬,૦૦૦ જપ')}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 space-y-1 text-xs">
                  <span className="text-[10px] text-[#584141] uppercase tracking-wider block font-semibold">
                    {loc('Sankalpa Intent', 'संकल्प हेतू', 'संकल्प उद्देश्य', 'સંકલ્પ હેતુ')}
                  </span>
                  <p className="font-bold text-[#221918]">
                    {loc('Family health, longevity, protection from untimely death, and spiritual relief', 'सकुटुंब आरोग्य, दीर्घायुष्य, अपमृत्यू निवारण व क्लेश निवृत्ती', 'सपरिवार स्वास्थ्य, दीर्घायु, अपमृत्यु निवारण एवं क्लेश निवृत्ति', 'સકુટુંબ આરોગ્ય, દીર્ઘાયુષ્ય, અપમૃત્યુ નિવારણ અને ક્લેશ નિવૃત્તિ')}
                  </p>
                  <p className="text-[#765B00] text-[11px]">
                    {loc('Gotra: Kashyapa • Yajamana: Shri Rajesh Kulkarni & Smt. Anuradha Kulkarni', 'गोत्र: कश्यप • यजमान: श्री राजेश कुलकर्णी व सौ. अनुराधा कुलकर्णी', 'गोत्र: कश्यप • यजमान: श्री राजेश कुलकर्णी एवं श्रीमती अनुराधा कुलकर्णी', 'ગોત્ર: કશ્યપ • યજમાન: શ્રી રાજેશ કુલકર્ણી અને શ્રીમતી અનુરાધા કુલકર્ણી')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#584141] block">{loc('Chief Hotri', 'मुख्य ऋत्विक', 'मुख्य ऋत्विक', 'મુખ્ય ઋત્વિક')}</span>
                    <span className="font-bold text-[#570013] block">{loc('Dr. Shripad Bhat (Ghanapathi)', 'वे. मू. डॉ. श्रीपाद भट', 'वे. मू. डॉ. श्रीपाद भट', 'વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ')}</span>
                    <span className="text-[10px] text-[#584141]">{loc('Ghanapathi (35 years experience)', 'घनापाठी (३५ वर्षे अनुभव)', 'घनापाठी (35 वर्ष अनुभव)', 'ઘનાપાઠી (૩૫ વર્ષ અનુભવ)')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#584141] block">{loc('Assistant Priests', 'सहाय्यक पुरोहित', 'सहायक पुरोहित', 'સહાયક પુરોહિત')}</span>
                    <span className="font-bold text-[#221918] block">{loc('4 Vedic Priests', '४ वेद ब्रह्मवृंद', '4 वेद ब्रह्मवृंद', '૪ વેદ બ્રહ્મવૃંદ')}</span>
                    <span className="text-[10px] text-[#765B00]">{loc('Rigveda & Yajurveda Shakha', 'ऋग्वेद व यजुर्वेद शाखा', 'ऋग्वेद एवं यजुर्वेद शाखा', 'ઋગ્વેદ અને યજુર્વેદ શાખા')}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFD979]/40 border border-[#C9A64B]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#765B00]">wb_sunny</span>
                    <div>
                      <span className="font-bold text-[#795D00] block">{loc("Today's Main Ahuti Session", 'आजचे मुख्य आहुती सत्र', 'आज का मुख्य आहुति सत्र', 'આજનો મુખ્ય આહુતિ સત્ર')}</span>
                      <span className="font-bold text-[#570013]">{loc('11:00 AM - 01:30 PM (Swahakar)', 'सकाळी ११:०० ते दु. ०१:३० (स्वाहाकार)', 'प्रातः 11:00 से दोपहर 01:30 (स्वाहाकार)', 'સવારે ૧૧:૦૦ થી બપોરે ૦૧:૩૦ (સ્વાહાકાર)')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white text-[#584141] text-[10px] font-bold">
                    {loc('Session 2 of 3', 'सत्र २/३', 'सत्र 2/3', 'સત્ર ૨/૩')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sanctified Prasad Tracking */}
            <div className="p-5 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E0BFBF]/30">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-[#FFD979] text-[#795D00]">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                  </span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#570013]">
                      {loc('Sanctified Prasad Postal Consignment Tracking', 'अभिमंत्रित महाप्रसाद टपाल ट्रॅकिंग', 'अभिमंत्रित महाप्रसाद डाक ट्रैकिंग', 'અભિમંત્રિત મહાપ્રસાદ ટપાલ ટ્રેકિંગ')}
                    </h3>
                    <span className="text-xs font-mono text-[#765B00] font-semibold">
                      Speed Post Consignment: #IP784920412IN
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFD979] text-[#795D00] text-xs font-bold">
                  <span className="material-symbols-outlined text-xs">near_me</span>
                  <span>{loc('Out for Delivery • Pune Central Hub', 'मार्गावर (पुणे मध्यवर्ती केंद्र)', 'वितरण हेतु प्रस्थान (पुणे केंद्रीय केंद्र)', 'ડિલિવરી માટે રવાના (પુણે સેન્ટ્રલ હબ)')}</span>
                </span>
              </div>

              {/* 4 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#570013] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-[#221918] block">{loc('Yajna Bhasma Collection', 'हवन भस्म संकलन', 'हवन भस्म संकलन', 'હવન ભસ્મ સંકલન')}</span>
                    <span className="text-[10px] text-[#584141]">{loc('21 June, Evening', '२१ जून, सायंकाळी', '21 जून, शाम', '૨૧ જૂન, સાંજે')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#570013] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-[#221918] block">{loc('Vedic Sanctification', 'वेदोक्त संपुटीकरण', 'वेदोक्त संपुटीकरण', 'વેદોક્ત સંપુટીકરણ')}</span>
                    <span className="text-[10px] text-[#584141]">{loc('22 June, 09:00 AM', '२२ जून, सकाळी ०९:००', '22 जून, सुबह 09:00', '૨૨ જૂન, સવારે ૦૯:૦૦')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#765B00] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {formatLocalizedNumber(3, language)}
                  </span>
                  <div>
                    <span className="font-bold text-[#765B00] block">{loc('Postal Dispatch in Transit', 'टपाल वितरण चालू', 'डाक वितरण चालू', 'ટપાલ વિતરણ ચાલુ')}</span>
                    <span className="text-[10px] text-[#584141]">{loc('Today by 3:00 PM', 'आज दुपारी ३ वाजेपर्यंत', 'आज दोपहर 3 बजे तक', 'આજે બપોરે ૩ વાગ્યા સુધીમાં')}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 opacity-50">
                  <span className="w-5 h-5 rounded-full bg-white text-[#584141] border border-[#E0BFBF] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {formatLocalizedNumber(4, language)}
                  </span>
                  <div>
                    <span className="font-bold text-[#221918] block">{loc('Delivery at Yajamana Home', 'यजमान गृही पावती', 'यजमान के घर प्राप्ति', 'યજમાનના ઘરે પ્રાપ્તિ')}</span>
                    <span className="text-[10px] text-[#584141]">{loc('Kothrud, Pune', 'कोथरूड, पुणे', 'कोथरुड, पुणे', 'કોથરૂડ, પુણે')}</span>
                  </div>
                </div>
              </div>

              {/* Box items */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#584141] font-semibold">{loc('Included in Prasad Box:', 'प्रसाद पेटी अंतर्भूत घटक:', 'प्रसाद बॉक्स में सम्मिलित:', 'પ્રસાદ પેટીમાં સમાવિષ્ટ:')}</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0BFBF]/40 text-[#221918] text-[11px] font-medium">
                  {loc('Sanctified Red Thread (Raksha Sutra)', 'रक्षा सूत्र', 'रक्षा सूत्र', 'રક્ષા સૂત્ર')}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0BFBF]/40 text-[#221918] text-[11px] font-medium">
                  {loc('Consecrated Yajna Bhasma', 'सिद्ध भस्म', 'सिद्ध भस्म', 'સિદ્ધ ભસ્મ')}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0BFBF]/40 text-[#221918] text-[11px] font-medium">
                  {loc('5-Mukhi Rudraksha', '५-मुखी रुद्राक्ष', '5-मुखी रुद्राक्ष', '૫-મુખી રુદ્રાક્ષ')}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0BFBF]/40 text-[#221918] text-[11px] font-medium">
                  {loc('Dry Fruit Mahaprasad', 'यज्ञातील काजू-बदाम महाप्रसाद', 'यज्ञ का सूखा मेवा महाप्रसाद', 'યજ્ઞનો ડ્રાય ફ્રુટ મહાપ્રસાદ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING & COMPLETED RITUALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Card */}
        {(activeFilter === 'all' || activeFilter === 'upcoming') && (
          <div className="bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFF0ED] text-[#570013] text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">calendar_month</span>
                    <span>{loc('Upcoming Ritual • Scheduled & Confirmed', 'आगामी विधी • Scheduled & Confirmed', 'आगामी अनुष्ठान • Scheduled & Confirmed', 'આગામી વિધિઓ • Scheduled & Confirmed')}</span>
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#570013] mt-1">
                    {loc('Laghu Rudra Abhishek & Panchamrit Mahapooja', 'लघुरुद्र अभिषेक व पंचामृत महापूजा', 'लघुरुद्र अभिषेक एवं पंचामृत महापूजा', 'લઘુરુદ્ર અભિષેક અને પંચામૃત મહાપૂજા')}
                  </h3>
                  <p className="text-xs text-[#584141]">
                    {loc('Ekadashani Rudradhyaya Recitation • Consecrated Panchamrit Bath & Bilvapatra Offering', 'एकादशणी रुद्राध्याय आवर्तन • सार्ध पंचामृत स्नान व बिल्वपत्र समर्पण', 'एकादशनी रुद्राध्याय आवर्तन • पंचामृत स्नान एवं बिल्वपत्र समर्पण', 'એકાદશની રુદ્રાધ્યાય આવર્તન • પંચામૃત સ્નાન અને બિલીપત્ર સમર્પણ')}
                  </p>
                </div>
                <span className="p-2 rounded-xl bg-[#FFF0ED] text-[#570013]">
                  <span className="material-symbols-outlined text-2xl">temple_hindu</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/30">
                  <span className="text-[10px] text-[#584141] block">{loc('Auspicious Muhurta & Tithi', 'मुहूर्त व तिथी', 'मुहूर्त एवं तिथि', 'મુહૂર્ત અને તિથિ')}</span>
                  <span className="font-bold text-[#221918] block">{loc('Ashadha Shukla Ekadashi', 'आषाढ शुद्ध एकादशी', 'आषाढ़ शुक्ल एकादशी', 'અષાઢ સુદ એકાદશી')}</span>
                  <span className="text-[11px] text-[#765B00]">{loc('Sunday, 6 July 2025 • 07:30 AM', 'रविवार, ६ जुलै २०२५ • ०७:३० AM', 'रविवार, 6 जुलाई 2025 • 07:30 AM', 'રવિવાર, ૬ જુલાઈ ૨૦૨૫ • ૦૭:૩૦ AM')}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/30">
                  <span className="text-[10px] text-[#584141] block">{loc('Attendance Mode', 'उपस्थिती पद्धत', 'उपस्थिति माध्यम', 'હાજરી પદ્ધતિ')}</span>
                  <span className="font-bold text-[#570013] block">{loc('In-person Ashram Attendance', 'प्रत्यक्ष आश्रम उपस्थिती', 'प्रत्यक्ष आश्रम उपस्थिति', 'પ્રત્યક્ષ આશ્રમ હાજરી')}</span>
                  <span className="text-[11px] text-[#584141]">{loc('Seating: Hall No. 4', 'आसन व्यवस्था: कक्ष क्र. ४', 'बैठने की व्यवस्था: कक्ष सं. 4', 'બેઠક વ્યવસ્થા: ખંડ નં. ૪')}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FFF8F6] border border-[#E0BFBF]/30 text-xs text-[#584141] space-y-1">
                <span className="font-bold text-[#570013] block">{loc('Preparation Checklist:', 'तयारी मार्गदर्शक सूचना:', 'तैयारी मार्गदर्शक निर्देश:', 'તૈયારી માર્ગદર્શિકા:')}</span>
                <p>{loc('• Please wear traditional consecrated garments (Dhoti-Kurta or traditional silk).', '• सोवळे वस्त्र (धोतर-उपरणे अथवा पारंपारिक रेशमी वस्त्र) परिधान करावे.', '• पारंपरिक पवित्र वस्त्र (धोती-कुर्ता या पारंपरिक रेशमी वस्त्र) धारण करें।', '• પરંપરાગત પવિત્ર વસ્ત્રો (ધોતી-કુર્તા અથવા પરંપરાગત રેશમી વસ્ત્રો) ધારણ કરવાં.')}</p>
                <p>{loc('• Light fasting recommended before ritual; only fruits or water permitted.', '• विधीपूर्वी अल्पोपहार टाळावा, केवळ फलाहार किंवा जल प्राशन चालते.', '• अनुष्ठान से पूर्व अल्पाहार से बचें, केवल फलाहार अथवा जल ग्रहण करें।', '• વિધિ પહેલાં હળવો ઉપવાસ રાખવો, માત્ર ફળાહાર અથવા જળ ગ્રહણ કરવું.')}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E0BFBF]/30 flex items-center justify-between">
              <button
                onClick={() => showToast(loc('Reschedule request registered. Ashram coordinator will contact you.', 'पुनर्नियोजन विनंती नोंदवली. समन्वयकांचा फोन येईल.', 'पुनर्निर्धारण अनुरोध दर्ज किया गया। आश्रम समन्वयक संपर्क करेंगे।', 'પુનર્નિર્ધારણ વિનંતી નોંધાઈ. સંયોજકનો ફોન આવશે.'), 'info')}
                className="text-xs font-semibold text-[#584141] hover:text-[#570013] cursor-pointer"
              >
                {loc('Reschedule', 'वेळ बदला / रीशेड्यूल', 'समय बदलें / पुनर्निर्धारण', 'સમય બદલો / પુનર્નિર્ધારણ')}
              </button>
              <button
                onClick={() => showToast(loc('Downloading E-Invitation Card (PDF)...', 'ई-आमंत्रण पत्रिका (PDF) डाउनलोड होत आहे...', 'ई-निमंत्रण पत्र (PDF) डाउनलोड हो रहा है...', 'ઈ-નિમંત્રણ પત્રિકા (PDF) ડાઉનલોડ થઈ રહી છે...'), 'success')}
                className="px-4 py-2 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>{loc('Invitation Card (PDF)', 'आमंत्रण पत्रिका (PDF)', 'निमंत्रण पत्र (PDF)', 'નિમંત્રણ પત્રિકા (PDF)')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Completed Card */}
        {(activeFilter === 'all' || activeFilter === 'completed') && (
          <div className="bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFF0ED] text-[#765B00] text-xs font-bold">
                    <span className="material-symbols-outlined text-xs">task_alt</span>
                    <span>{loc('Completed Ritual • Archive', 'संपन्न विधी • Completed Archive', 'संपन्न अनुष्ठान • Completed Archive', 'સંપન્ન વિધિ • Completed Archive')}</span>
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#570013] mt-1">
                    {loc('Ganesh Yagya & Navagraha Shanti Homa', 'गणेश याग व नवग्रह शांती होम', 'गणेश याग एवं नवग्रह शांति होम', 'ગણેશ યાગ અને નવગ્રહ શાંતિ હોમ')}
                  </h3>
                  <p className="text-xs text-[#584141]">
                    {loc('Atharvashirsha Sahasravartana, Modak Dedication & Navagraha Samidha Ahuti', 'अथर्वशीर्ष सहस्रावर्तन, मोदक समर्पण व नवग्रह समिधा आहुती विधी', 'अथर्वशीर्ष सहस्रावर्तन, मोदक समर्पण एवं नवग्रह समिधा आहुति विधि', 'અથર્વશીર્ષ સહસ્રાવર્તન, મોદક સમર્પણ અને નવગ્રહ સમિધા આહુતિ વિધિ')}
                  </p>
                </div>
                <span className="p-2 rounded-xl bg-[#FFF0ED] text-[#765B00]">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/30">
                  <span className="text-[10px] text-[#584141] block">{loc('Completion Tithi', 'संपन्न तिथी', 'संपन्न तिथि', 'સંપન્ન તિથિ')}</span>
                  <span className="font-bold text-[#221918] block">{loc('Vaishakha Shukla Chaturthi', 'वैशाख शुक्ल चतुर्थी', 'वैशाख शुक्ल चतुर्थी', 'વૈશાખ સુદ ચોથ')}</span>
                  <span className="text-[11px] text-[#584141]">{loc('15 May 2025 • Purnahuti Concluded', '१५ मे २०२५ • पूर्णाहूती प्राप्त', '15 मई 2025 • पूर्णाहूति प्राप्त', '૧૫ મે ૨૦૨૫ • પૂર્ણાહુતિ પ્રાપ્ત')}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FFF0ED] border border-[#E0BFBF]/30">
                  <span className="text-[10px] text-[#584141] block">{loc('Contribution & 80G Tax Receipt', 'योगदान व कर सवलत पावती', 'योगदान एवं 80G कर छूट रसीद', 'યોગદાન અને ૮૦G કર મુક્તિ પાવતી')}</span>
                  <span className="font-bold text-[#570013] block">{loc('₹ 11,000 (80G Exemption)', '₹११,००० (८०-जी सवलत)', '₹11,000 (80G छूट)', '₹૧૧,૦૦૦ (૮૦G મુક્તિ)')}</span>
                  <span className="text-[11px] text-[#765B00]">{loc('Receipt: ', 'पावती: ', 'रसीद: ', 'પાવતી: ')}<span className="font-mono font-semibold">#CVP-2025-0721</span></span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FFF8F6] border-l-4 border-[#570013] text-xs space-y-1">
                <span className="font-bold text-[#570013] block">{loc('Sankalpa Siddhi Blessing:', 'संकल्प सिद्धी आशीर्वाद:', 'संकल्प सिद्धि आशीर्वाद:', 'સંકલ્પ સિદ્ધિ આશીર્વાદ:')}</span>
                <p className="font-serif italic text-[#221918] leading-relaxed notranslate">
                  "गणानां त्वा गणपतिं हवामहे कविं कवीनामुपमश्रवस्तमम् । ज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत आ नः शृण्वन्नूतिभिः सीद सादनम् ॥"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E0BFBF]/30 flex items-center justify-between">
              <button
                onClick={() => showToast(loc('Opening Yajna Video Recording Player...', 'संपूर्ण यज्ञ रेकॉर्डिंग प्लेयर उघडत आहे...', 'यज्ञ रिकॉर्डिंग प्लेयर खुल रहा है...', 'યજ્ઞ રેકોર્ડિંગ પ્લેયર ખૂલી રહ્યો છે...'), 'info')}
                className="px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">video_library</span>
                <span>{loc('Watch 1080p Recording', 'यज्ञ रेकॉर्डिंग पहा', 'यज्ञ रिकॉर्डिंग देखें', 'યજ્ઞ રેકોર્ડિંગ જુઓ')}</span>
              </button>
              <button
                onClick={() => showToast(loc('Downloading Blessing Letter (PDF)...', 'आशीर्वाद पत्र (PDF) डाउनलोड सुरू झाले', 'आशीर्वाद पत्र (PDF) डाउनलोड हो रहा है...', 'આશીર્વાદ પત્ર (PDF) ડાઉનલોડ શરૂ થયું'), 'success')}
                className="px-4 py-2 rounded-lg bg-white border border-[#E0BFBF] text-[#570013] text-xs font-bold hover:bg-[#FFF0ED] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#765B00]">workspace_premium</span>
                <span>{loc('Blessing Letter (PDF)', 'आशीर्वाद पत्र (PDF)', 'आशीर्वाद पत्र (PDF)', 'આશીર્વાદ પત્ર (PDF)')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2-Way Stream Joining Modal */}
      {isJoinStreamModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#241B19]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
        >
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E0BFBF]/40">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#570013] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">videocam</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-[#570013]">
                  {loc('Live 2-Way Yajnashala Broadcast', 'थेट २-वे यज्ञशाळा प्रक्षेपण', 'प्रत्यक्ष 2-वे यज्ञशाला प्रसारण', 'જીવંત ૨-વે યજ્ઞશાળા પ્રસારણ')}
                </h3>
              </div>
              <button
                onClick={() => setIsJoinStreamModalOpen(false)}
                className="text-[#584141] hover:text-[#570013] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#584141]">
              <div className="bg-[#FFF0ED] p-4 rounded-xl space-y-2 border border-[#E0BFBF]/30">
                <p className="font-bold text-[#221918]">
                  {loc('Yajamana: Shri Rajesh Kulkarni & Family (Gotra: Kashyapa)', 'यजमान: श्री राजेश कुळकर्णी व कुटुंब (गोत्र: काश्यप)', 'यजमान: श्री राजेश कुलकर्णी एवं परिवार (गोत्र: काश्यप)', 'યજમાન: શ્રી રાજેશ કુલકર્ણી અને પરિવાર (ગોત્ર: કાશ્યપ)')}
                </p>
                <p>
                  {loc('Currently Active: Maha Mrityunjaya Mantra Japa & Swahakar Ahuti Session', 'सध्या चालू: महामृत्युंजय मंत्र जप व स्वाहाकार आहुती सत्र', 'वर्तमान में सक्रिय: महामृत्युंजय मंत्र जप एवं स्वाहाकार आहुति सत्र', 'હાલમાં ચાલુ: મહામૃત્યુંજય મંત્ર જપ અને સ્વાહાકાર આહુતિ સત્ર')}
                </p>
                <div className="flex items-center gap-2 text-[#765B00] font-semibold pt-1">
                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-pulse"></span>
                  <span>Audio & Video Feed Ready (Google Meet / WebRTC)</span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed">
                {loc('Please keep your microphone muted upon joining. The Chief Hotri will instruct you to unmute during your personalized Sankalpa recitation.', 'प्रक्षेपणात जोडल्यानंतर कृपया आपला माईक म्यूट ठेवावा. मुख्य ऋत्विक आपल्या नावाचा संकल्प उच्चारताना माईक सुरू करण्यास सांगतील.', 'प्रसारण में जुड़ने के उपरांत कृपया अपना माइक म्यूट रखें। मुख्य ऋत्विक आपके नाम का संकल्प उच्चारते समय माइक खोलने का निर्देश देंगे।', 'પ્રસારણમાં જોડાયા પછી કૃપા કરીને તમારો માઇક મ્યૂટ રાખો. મુખ્ય ઋત્વિક આપના નામનો સંકલ્પ ઉચ્ચારતી વખતે માઇક શરૂ કરવાનું કહેશે.')}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsJoinStreamModalOpen(false);
                  showToast(loc('Connected to live Yajnashala sanctum!', 'थेट यज्ञमंडपात जोडले गेले आहात!', 'प्रत्यक्ष यज्ञमंडप में जुड़ गए हैं!', 'જીવંત યજ્ઞમંડપમાં જોડાઈ ગયા છો!'), 'success');
                }}
                className="w-full py-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">video_call</span>
                <span>{loc('Enter Yajnashala (Join Live Sanctum)', 'यज्ञमंडपात प्रवेश करा', 'यज्ञमंडप में प्रवेश करें', 'યજ્ઞમંડપમાં પ્રવેશ કરો')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
