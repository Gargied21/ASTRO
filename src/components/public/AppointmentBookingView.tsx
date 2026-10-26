import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { ServiceDomain, ConsultationMode } from '../../types/index.ts';

interface AppointmentBookingViewProps {
  onNavigate: (path: string) => void;
  initialServiceId?: string;
}

export const AppointmentBookingView: React.FC<AppointmentBookingViewProps> = ({
  onNavigate,
  initialServiceId,
}) => {
  const { showToast } = useDevotee();
  const { language, t, loc } = useLanguage();

  const [serviceDomain, setServiceDomain] = useState<ServiceDomain>(
    initialServiceId ? 'pooja' : 'jyotish'
  );
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('online');
  const [selectedDate, setSelectedDate] = useState<string>('Tue, 20 May 2025');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:45 AM - 11:30 AM');

  // Devotee info form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [notes, setNotes] = useState('');

  // Confirmation slip state
  const [confirmedSlip, setConfirmedSlip] = useState<{
    id: string;
    name: string;
    service: string;
    slot: string;
    mode: string;
  } | null>(null);

  const availableDays = [
    { day: loc('Mon', 'सोम', 'सोम', 'સોમ'), date: '19', slots: loc('4 slots', '४ जागा', '4 सीटें', '૪ સ્લોટ'), isAvailable: true, fullDate: 'Mon, 19 May 2025' },
    { day: loc('Tue', 'मंगळ', 'मंगल', 'મંગળ'), date: '20', slots: loc('6 slots', '६ जागा', '6 सीटें', '૬ સ્લોટ'), isAvailable: true, fullDate: 'Tue, 20 May 2025' },
    { day: loc('Wed', 'बुध', 'बुध', 'બુધ'), date: '21', slots: loc('2 slots', '२ जागा', '2 सीटें', '૨ સ્લોટ'), isAvailable: true, fullDate: 'Wed, 21 May 2025' },
    { day: loc('Thu', 'गुरु', 'गुरु', 'ગુરુ'), date: '22', slots: loc('5 slots', '५ जागा', '5 सीटें', '૫ સ્લોટ'), isAvailable: true, fullDate: 'Thu, 22 May 2025' },
    { day: loc('Fri', 'शुक्र', 'शुक्र', 'શુક્ર'), date: '23', slots: loc('1 slot', '१ जागा', '1 सीट', '૧ સ્લોટ'), isAvailable: true, fullDate: 'Fri, 23 May 2025' },
    { day: loc('Sat', 'शनि', 'शनि', 'શનિ'), date: '24', slots: loc('3 slots', '३ जागा', '3 सीटें', '૩ સ્લોટ'), isAvailable: true, fullDate: 'Sat, 24 May 2025' },
    { day: loc('Sun', 'रवि', 'रवि', 'રવિ'), date: '25', slots: loc('Full', 'पूर्ण', 'पूर्ण', 'પૂર્ણ'), isAvailable: false, fullDate: 'Sun, 25 May 2025' },
  ];

  const morningSlots = [
    { time: '10:00 AM - 10:45 AM', label: '10:00 AM', status: 'available' },
    { time: '10:45 AM - 11:30 AM', label: '10:45 AM', status: 'available' },
    { time: '11:45 AM - 12:30 PM', label: '11:45 AM', status: 'available' },
    { time: '12:30 PM - 01:15 PM', label: '12:30 PM', status: 'booked' },
  ];

  const afternoonSlots = [
    { time: '03:15 PM - 04:00 PM', label: '03:15 PM', status: 'available' },
    { time: '04:00 PM - 04:45 PM', label: '04:00 PM', status: 'available' },
    { time: '05:00 PM - 05:45 PM', label: '05:00 PM', status: 'available' },
    { time: '06:00 PM - 06:45 PM', label: '06:00 PM', status: 'available' },
  ];

  const serviceSpecs = {
    jyotish: {
      name: loc('Vedic Jyotish Consultation', 'वैदिक ज्योतिष सल्ला', 'वैदिक ज्योतिष परामर्श', 'વૈદિક જ્યોતિષ પરામર્શ'),
      nameSub: loc('Kundali, Horoscopy & Dasha', 'कुंडली, फलज्योतिष व दशा', 'कुंडली एवं दशा विचार', 'કુંડળી અને દશા વિચાર'),
      price: '₹ 1,100',
      duration: loc('45 Mins', '४५ मिनिटे', '45 मिनट', '૪૫ મિનિટ'),
      desc: loc(
        'Kundali review, dosha analysis & authentic gemstone guidance.',
        'कुंडली वेध, दोष विश्लेषण व शास्त्रोक्त रत्न सल्ला.',
        'कुंडली विचार, दोष विश्लेषण एवं रत्न परामर्श।',
        'કુંડળી વિશ્લેષણ, દોષ નિવારણ અને રત્ન માર્ગદર્શન.'
      ),
    },
    pooja: {
      name: loc('Yadnik & Pooja Planning', 'पूजा व याज्ञिक नियोजन', 'पूजा एवं याज्ञिक नियोजन', 'પૂજા અને યાજ્ઞિક આયોજન'),
      nameSub: loc('Sankalpa, Muhurta & Vidhi', 'संकल्प, मुहूर्त व विधी', 'संकल्प, मुहूर्त एवं विधि', 'સંકલ્પ, મુહૂર્ત અને વિધિ'),
      price: loc('Margadarshan Seva', 'मार्गदर्शन सेवा', 'मार्गदर्शन सेवा', 'માર્ગદર્શન સેવા'),
      duration: loc('30 Mins', '३० मिनिटे', '30 मिनट', '૩૦ મિનિટ'),
      desc: loc(
        'Sankalpa, Muhurta selection & purohit assignment consultation.',
        'संकल्प, मुहूर्त निश्चिती व ऋत्विज नियोजन.',
        'संकल्प, मुहूर्त चयन एवं पुरोहित व्यवस्था।',
        'સંકલ્પ, મુહૂર્ત પસંદગી અને આચાર્ય આયોજન.'
      ),
    },
    vastu: {
      name: loc('Vastu Shastra Consultation', 'वास्तु सल्ला व परीक्षण', 'वास्तु परामर्श एवं परीक्षण', 'વાસ્તુ પરામર્શ અને પરીક્ષણ'),
      nameSub: loc('Residential & Commercial', 'गृह व व्यावसायिक वास्तू', 'गृह एवं व्यावसायिक वास्तु', 'ઘર અને વ્યવસાયિક વાસ્તુ'),
      price: '₹ 1,500',
      duration: loc('45 Mins', '४५ मिनिटे', '45 मिनट', '૪૫ મિનિટ'),
      desc: loc(
        'Residential & commercial directional harmony consultation.',
        'घर व व्यवसाय वास्तु परीक्षण व दिशादोष उपाय.',
        'गृह एवं व्यावसायिक वास्तु परीक्षण व दिशा दोष निवारण।',
        'ઘર અને વ્યવસાય વાસ્તુ પરીક્ષણ તેમજ દિશાદોષ નિવારણ.'
      ),
    },
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(loc('Please enter your full name', 'कृपया आपले पूर्ण नाव भरा', 'कृपया अपना पूरा नाम भरें', 'કૃપા કરીને આપનું પૂરું નામ ભરો'), 'error');
      return;
    }
    if (!phone.trim()) {
      showToast(loc('Please enter your contact phone number', 'कृपया आपला संपर्क क्रमांक भरा', 'कृपया अपना संपर्क नंबर भरें', 'કૃપા કરીને આપનો સંપર્ક નંબર ભરો'), 'error');
      return;
    }

    const slip = {
      id: `CVP-${new Date().getFullYear()}-0${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      service: serviceSpecs[serviceDomain].name,
      slot: `${selectedDate} • ${selectedSlot}`,
      mode: consultationMode === 'online' ? loc('Online Video Consultation (Google Meet)', 'थेट व्हिडिओ / Google Meet', 'ऑनलाइन गूगल मीट / वीडियो', 'ઑનલાઇન ગૂગલ મીટ / વિડિયો') : loc('In-Person at Pune Ashram', 'पुणे आश्रम प्रत्यक्ष भेट', 'पुणे आश्रम प्रत्यक्ष परामर्श', 'પુણે આશ્રમ પ્રત્યક્ષ મુલાકાત'),
    };

    setConfirmedSlip(slip);
    showToast(loc('Appointment provisional slip generated successfully!', 'अपॉइंटमेंट तात्पुरती नोंदवली गेली आहे!', 'अपॉइंटमेंट अनंतिम रूप से दर्ज हो गई है!', 'એપોઇન્ટમેન્ટ કામચલાઉ રીતે નોંધાઈ ગઈ છે!'), 'success');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner / Editorial Vedic Header */}
      <section className="w-full bg-[#FFF0ED] py-10 lg:py-14 border-b border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#584141] mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#570013] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>{t('nav.home')}</span>
            </button>
            <span className="text-[#E0BFBF]">/</span>
            <span className="text-[#570013] font-semibold">
              {loc('Book Appointment', 'अपॉइंटमेंट बुकिंग', 'अपॉइंटमेंट बुकिंग', 'એપોઇન્ટમેન્ટ બુકિંગ')}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFD979]/40 text-[#795D00] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#765B00]">verified</span>
                <span>
                  {loc(
                    'Authentic Vedic Guidance & Consultation Sanctum',
                    'वैदिक मार्गदर्शन व शास्त्रोक्त सल्ला केंद्र',
                    'वैदिक मार्गदर्शन एवं शास्त्रसम्मत परामर्श केंद्र',
                    'વૈદિક માર્ગદર્શન અને શાસ્ત્રોક્ત પરામર્શ કેન્દ્ર'
                  )}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#570013] font-bold tracking-tight">
                {loc(
                  'Schedule a Consultation or Pooja Planning',
                  'सल्ला व मार्गदर्शन अपॉइंटमेंट',
                  'परामर्श एवं पूजा नियोजन अपॉइंटमेंट',
                  'પરામર્શ અને પૂજા આયોજન એપોઇન્ટમેન્ટ'
                )}
                <span className="block text-xl sm:text-2xl text-[#221918] font-semibold mt-1">
                  {loc(
                    'Authentic Guidance Grounded in Traditional Shastras',
                    'सल्ला व मार्गदर्शन अपॉइंटमेंट',
                    'शास्त्रसम्मत परामर्श एवं मार्गदर्शन',
                    'શાસ્ત્રોક્ત પરામર્શ અને માર્ગદર્શન'
                  )}
                </span>
              </h1>
              <p className="text-sm text-[#584141] max-w-2xl pt-1 leading-relaxed">
                {loc(
                  'Consult with our authentic Vedic astrologers and ritual coordinators. Transparent, personalized, and confidential guidance grounded in traditional texts without fear-mongering.',
                  'आमच्या वेदशास्त्रसंपन्न ज्योतिषी व याज्ञिक आचार्यांशी थेट संवाद साधा. संपूर्ण पारदर्शकता, गोपनीयता आणि शास्त्रोक्त मार्गदर्शन.',
                  'हमारे विद्वान वैदिक ज्योतिषी एवं आचार्यों से प्रत्यक्ष परामर्श प्राप्त करें। पूर्ण पारदर्शिता एवं शास्त्रसम्मत मार्गदर्शन।',
                  'અમારા વિદ્વાન વૈદિક જ્યોતિષીઓ અને આચાર્યો સાથે પ્રત્યક્ષ પરામર્શ કરો. સંપૂર્ણ પારદર્શિતા અને શાસ્ત્રોક્ત માર્ગદર્શન.'
                )}
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-xl shadow-xs border border-[#E0BFBF]/30">
                <div className="w-12 h-12 rounded-full bg-[#FFF0ED] flex items-center justify-center shrink-0 text-[#765B00]">
                  <span className="material-symbols-outlined text-2xl">event_available</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#584141] uppercase tracking-wider block font-semibold">
                    {loc('Real-time Desk', 'थेट सेवा कक्ष', 'प्रत्यक्ष सेवा कक्ष', 'રિયલ-ટાઇમ ડેસ્ક')}
                  </span>
                  <span className="text-sm font-bold text-[#570013]">
                    {loc('Pune Ashram Open', 'पुणे आश्रम खुला आहे', 'पुणे आश्रम खुला है', 'પુણે આશ્રમ ખુલ્લો છે')}
                  </span>
                  <span className="text-xs text-[#765B00] block">
                    {loc('Slots refreshed daily at 08:00 AM', 'दररोज सकाळी ८:०० वाजता नवीन जागा उपलब्ध', 'प्रतिदिन प्रातः 8:00 बजे नई सीटें उपलब्ध', 'રોજ સવારે ૮:૦૦ વાગ્યે નવી જગ્યાઓ ઉપલબ્ધ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Flow: Left 65% Form, Right 35% Summary */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (65% / col-span-8) */}
            <form onSubmit={handleBookingSubmit} className="lg:col-span-8 space-y-6">
              {/* Step 1: Service Type Selection */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <h2 className="text-base sm:text-lg text-[#221918] font-bold">
                      {loc('Select Service Domain', 'विषय निवडा', 'विषय चुनें', 'વિષય પસંદ કરો')}
                    </h2>
                  </div>
                  <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
                    {loc('Step 1 of 4', 'टप्पा १ / ४', 'चरण 1 / 4', 'પગલું ૧ / ૪')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['jyotish', 'pooja', 'vastu'] as ServiceDomain[]).map((domain) => {
                    const isSelected = serviceDomain === domain;
                    const spec = serviceSpecs[domain];
                    return (
                      <label
                        key={domain}
                        className={`cursor-pointer group relative p-4 rounded-xl border transition-all shadow-xs flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#FCEAE6] border-[#570013] ring-1 ring-[#570013]'
                            : 'bg-white border-[#E0BFBF]/50 hover:bg-[#FFF0ED]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service_type"
                          value={domain}
                          checked={isSelected}
                          onChange={() => setServiceDomain(domain)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <span
                            className={`material-symbols-outlined text-2xl ${
                              isSelected ? 'text-[#570013]' : 'text-[#765B00]'
                            }`}
                          >
                            {domain === 'jyotish'
                              ? 'brightness_high'
                              : domain === 'pooja'
                              ? 'local_fire_department'
                              : 'domain'}
                          </span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full ring-2 ${
                              isSelected
                                ? 'bg-[#570013] ring-[#FFDADA]'
                                : 'bg-[#E8D6D3] ring-transparent'
                            }`}
                          ></span>
                        </div>
                        <div>
                          <h3 className="font-serif text-sm font-bold text-[#221918]">
                            {spec.name}
                          </h3>
                          <p className="text-xs text-[#765B00] font-semibold mt-0.5">
                            {spec.nameSub}
                          </p>
                          <p className="text-xs text-[#584141] mt-1 line-clamp-2">
                            {spec.desc}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-semibold flex items-center justify-between border-t border-[#E0BFBF]/30">
                          <span className="text-[#584141]">{spec.duration}</span>
                          <span className="bg-[#570013]/10 px-2 py-0.5 rounded text-[#570013] font-bold">
                            {spec.price}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Mode of Consultation */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <h2 className="text-base sm:text-lg text-[#221918] font-bold">
                      {loc('Consultation Mode', 'मार्ग निवडा', 'परामर्श माध्यम चुनें', 'પરામર્શ માધ્યમ પસંદ કરો')}
                    </h2>
                  </div>
                  <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
                    {loc('Step 2 of 4', 'टप्पा २ / ४', 'चरण 2 / 4', 'પગલું ૨ / ૪')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationMode('online')}
                    className={`p-4 rounded-xl text-left transition-all flex items-start gap-3 shadow-xs border cursor-pointer ${
                      consultationMode === 'online'
                        ? 'bg-[#FCEAE6] border-[#570013] ring-1 ring-[#570013]'
                        : 'bg-white border-[#E0BFBF]/50 hover:bg-[#FFF0ED]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#570013]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#570013] text-xl">videocam</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#570013]">
                          {loc('Online Video / Phone', 'ऑनलाईन व्हिडिओ / फोन', 'ऑनलाइन वीडियो / फोन', 'ઑનલાઇન વિડિયો / ફોન')}
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#FFDF94] text-[#251A00] text-[10px] font-bold rounded">
                          {loc('Recommended', 'शिफारस केलेले', 'अनुशंसित', 'ભલામણ કરેલ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#765B00] font-semibold mt-0.5">
                        {loc('Video or Phone Call Consultation', 'व्हिडिओ किंवा फोन कॉल सल्ला', 'वीडियो या फोन कॉल परामर्श', 'વિડિયો અથવા ફોન કૉલ પરામર્શ')}
                      </p>
                      <p className="text-xs text-[#584141] mt-1 leading-snug">
                        {loc(
                          'Join via secure Google Meet link or direct audio call. Digitized Kundali chart shared prior to session.',
                          'सुरक्षित गुगल मीट किंवा थेट ऑडिओ कॉलद्वारे जुळा. जन्मकुंडली सत्रापूर्वी पाठवली जाईल.',
                          'गूगल मीट अथवा सीधे फोन कॉल द्वारा जुड़ें। जन्मकुंडली सत्र से पूर्व प्रेषित की जाएगी।',
                          'ગૂગલ મીટ અથવા ફોન કૉલ દ્વારા જોડાઓ. જન્મકુંડળી સત્ર પહેલાં મોકલવામાં આવશે.'
                        )}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationMode('ashram')}
                    className={`p-4 rounded-xl text-left transition-all flex items-start gap-3 shadow-xs border cursor-pointer ${
                      consultationMode === 'ashram'
                        ? 'bg-[#FCEAE6] border-[#570013] ring-1 ring-[#570013]'
                        : 'bg-white border-[#E0BFBF]/50 hover:bg-[#FFF0ED]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FFF0ED] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#584141] text-xl">temple_hindu</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#221918]">
                        {loc('In-Person at Ashram', 'आश्रम प्रत्यक्ष भेट', 'आश्रम प्रत्यक्ष भेंट', 'આશ્રમ પ્રત્યક્ષ મુલાકાત')}
                      </span>
                      <p className="text-xs text-[#765B00] font-semibold mt-0.5">
                        {loc('Pune Ashram In-Person Visit', 'आश्रम प्रत्यक्ष भेट (पुणे केंद्र)', 'आश्रम प्रत्यक्ष भेंट (पुणे केंद्र)', 'આશ્રમ પ્રત્યક્ષ મુલાકાત (પુણે કેન્દ્ર)')}
                      </p>
                      <p className="text-xs text-[#584141] mt-1 leading-snug">
                        {loc(
                          'Visit Ved Bhavan, Paud Road, Pune. Face-to-face consultation with reverent Acharya.',
                          'वेद भवन, पौड रोड, पुणे येथे आचार्यांशी प्रत्यक्ष समोरासमोर चर्चा व मार्गदर्शन.',
                          'वेद भवन, पौड रोड, पुणे आश्रम में आचार्यों से प्रत्यक्ष भेंट एवं मार्गदर्शन।',
                          'વેદ ભવન, પૌડ રોડ, પુણે આશ્રમમાં આચાર્યો સાથે પ્રત્યક્ષ મુલાકાત અને માર્ગદર્શન.'
                        )}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 3: Date & Real-Time Slot Picker */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <h2 className="text-base sm:text-lg text-[#221918] font-bold">
                      {loc('Select Date & Available Slot', 'दिनांक व वेळ निवडा', 'दिनांक एवं समय चुनें', 'તારીખ અને ઉપલબ્ધ સમય પસંદ કરો')}
                    </h2>
                  </div>
                  <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
                    {loc('Step 3 of 4', 'टप्पा ३ / ४', 'चरण 3 / 4', 'પગલું ૩ / ૪')}
                  </span>
                </div>

                {/* Day selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#221918] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#570013]">
                        calendar_month
                      </span>
                      <span>{loc('Next 7 Available Days', 'पुढील ७ उपलब्ध दिवस', 'आगामी 7 उपलब्ध दिन', 'આગામી ૭ ઉપલબ્ધ દિવસ')}</span>
                    </span>
                    <span className="text-[#765B00] font-semibold">IST (GMT +5:30)</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {availableDays.map((dayItem) => {
                      const isSelected = selectedDate === dayItem.fullDate;
                      if (!dayItem.isAvailable) {
                        return (
                          <div
                            key={dayItem.day}
                            className="p-2.5 rounded-lg text-center bg-[#F0DFDB]/50 opacity-40 cursor-not-allowed border border-transparent"
                          >
                            <span className="block text-xs text-[#584141]">{dayItem.day}</span>
                            <span className="block text-base font-bold text-[#221918]">{dayItem.date}</span>
                            <span className="block text-[10px] text-[#8C7071] font-semibold uppercase">
                              {dayItem.slots}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={dayItem.day}
                          type="button"
                          onClick={() => setSelectedDate(dayItem.fullDate)}
                          className={`p-2.5 rounded-lg text-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#570013] text-white shadow-sm ring-2 ring-[#FFDADA] border-transparent'
                              : 'bg-white hover:bg-[#FFF0ED] text-[#221918] border-[#E0BFBF]/40'
                          }`}
                        >
                          <span
                            className={`block text-xs ${
                              isSelected ? 'text-white/80' : 'text-[#584141]'
                            }`}
                          >
                            {dayItem.day}
                          </span>
                          <span className="block text-base font-bold">{dayItem.date}</span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              isSelected ? 'text-[#FFDF94]' : 'text-[#765B00]'
                            }`}
                          >
                            {dayItem.slots}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Morning Slots */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#221918] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#765B00]">
                        wb_twilight
                      </span>
                      <span>
                        {loc(
                          'Morning Sessions (10:00 AM – 01:00 PM)',
                          'सकाळची सत्रे (१०:०० AM – ०१:०० PM)',
                          'प्रातःकालीन सत्र (10:00 AM – 01:00 PM)',
                          'પ્રભાત સત્ર (૧૦:૦૦ AM – ૦૧:૦૦ PM)'
                        )}
                      </span>
                    </span>
                    <span className="text-[#584141]">
                      {loc('45 min each', 'प्रत्येकी ४५ मिनिटे', 'प्रत्येक 45 मिनट', 'દરેક ૪૫ મિનિટ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {morningSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      const isBooked = slot.status === 'booked';

                      if (isBooked) {
                        return (
                          <div
                            key={slot.label}
                            className="py-2 px-3 rounded text-center bg-[#F0DFDB] opacity-50 flex items-center justify-between text-xs text-[#584141] line-through cursor-not-allowed"
                          >
                            <span>{slot.label}</span>
                            <span className="text-[10px] text-[#BA1A1A] uppercase font-bold">
                              {loc('Booked', 'नोंदणीकृत', 'आरक्षित', 'બુક થયેલ')}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`py-2 px-3 rounded text-center transition-colors flex items-center justify-between text-xs font-semibold cursor-pointer border ${
                            isSelected
                              ? 'bg-[#570013] text-white ring-1 ring-[#FFDADA] border-transparent'
                              : 'bg-[#FFF0ED] hover:bg-[#FFD979]/40 text-[#221918] border-[#E0BFBF]/40'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {isSelected ? (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#765B00]"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#221918] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#765B00]">
                        wb_sunny
                      </span>
                      <span>
                        {loc(
                          'Afternoon & Evening Sessions (03:00 PM – 07:00 PM)',
                          'दुपारी व संध्याकाळी सत्रे (०३:०० PM – ०७:०० PM)',
                          'दोपहर एवं सायंकालीन सत्र (03:00 PM – 07:00 PM)',
                          'બપોર અને સાંજનું સત્ર (૦૩:૦૦ PM – ૦૭:૦૦ PM)'
                        )}
                      </span>
                    </span>
                    <span className="text-[#584141]">
                      {loc('Pradosh Kaal Slots', 'प्रदोष काळ सत्रे', 'प्रदोष काल सत्र', 'પ્રદોષ કાળ સ્લોટ્સ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`py-2 px-3 rounded text-center transition-colors flex items-center justify-between text-xs font-semibold cursor-pointer border ${
                            isSelected
                              ? 'bg-[#570013] text-white ring-1 ring-[#FFDADA] border-transparent'
                              : 'bg-[#FFF0ED] hover:bg-[#FFD979]/40 text-[#221918] border-[#E0BFBF]/40'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {isSelected ? (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#765B00]"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slot Legend */}
                <div className="flex items-center gap-4 pt-2 text-[11px] text-[#584141]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#765B00]"></span>{' '}
                    {loc('Available', 'उपलब्ध', 'उपलब्ध', 'ઉપલબ્ધ')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#570013]"></span>{' '}
                    {loc('Selected', 'निवडलेले', 'चयनित', 'પસંદ કરેલ')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#BA1A1A]"></span>{' '}
                    {loc('Booked', 'नोंदणीकृत', 'आरक्षित', 'બુક થયેલ')}
                  </span>
                </div>
              </div>

              {/* Step 4: Devotee Information */}
              <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#800020] text-white flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <h2 className="text-base sm:text-lg text-[#221918] font-bold">
                      {loc('Devotee Information', 'भक्ताची माहिती', 'भक्त विवरण', 'ભક્તની માહિતી')}
                    </h2>
                  </div>
                  <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
                    {loc('Step 4 of 4', 'टप्पा ४ / ४', 'चरण 4 / 4', 'પગલું ૪ / ૪')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wide text-[#221918] font-bold block">
                      {loc('Full Name', 'पूर्ण नाव', 'पूरा नाम', 'પૂરું નામ')} <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#584141] text-[18px]">
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={loc(
                          'e.g. Shri Rajesh Shantaram Kulkarni',
                          'उदा. श्री राजेश शांताराम कुळकर्णी',
                          'उदा. श्री राजेश शांताराम कुलकर्णी',
                          'દા.ત. શ્રી રાજેશ શાંતારામ કુલકર્ણી'
                        )}
                        className="w-full bg-[#FFF8F6] pl-10 pr-3 py-2 rounded-lg border border-[#E0BFBF]/50 text-sm text-[#221918] focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wide text-[#221918] font-bold block">
                      {loc('Phone Number', 'भ्रमणध्वनी', 'मोबाइल नंबर', 'મોબાઇલ નંબર')} <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <span className="bg-[#FFF0ED] px-3 py-2 rounded-lg text-xs font-bold text-[#584141] flex items-center border border-[#E0BFBF]/40">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98220 54321"
                        className="w-full bg-[#FFF8F6] px-3 py-2 rounded-lg border border-[#E0BFBF]/50 text-sm text-[#221918] focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs uppercase tracking-wide text-[#221918] font-bold block">
                      {loc('Email Address', 'ईमेल आयडी', 'ईमेल आईडी', 'ઈમેઈલ આઈડી')} <span className="text-[#BA1A1A]">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#584141] text-[18px]">
                        mail
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={loc(
                          'rajesh.kulkarni@gmail.com (For video call invitation & summary)',
                          'rajesh.kulkarni@gmail.com (व्हिडिओ कॉल लिंक व संक्षेपासाठी)',
                          'rajesh.kulkarni@gmail.com (वीडियो कॉल आमंत्रण एवं विवरण हेतु)',
                          'rajesh.kulkarni@gmail.com (વિડિયો કૉલ લિંક અને વિગતો માટે)'
                        )}
                        className="w-full bg-[#FFF8F6] pl-10 pr-3 py-2 rounded-lg border border-[#E0BFBF]/50 text-sm text-[#221918] focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp opt-in */}
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#FFF0ED] cursor-pointer select-none border border-[#E0BFBF]/30">
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="w-4 h-4 accent-[#570013] rounded"
                  />
                  <div className="flex items-center gap-2 text-xs text-[#221918]">
                    <span className="material-symbols-outlined text-[18px] text-[#25D366]">chat</span>
                    <span>
                      {loc(
                        'Send appointment confirmation, reminder, and Google Meet link via WhatsApp',
                        'अपॉइंटमेंट पुष्टीकरण, स्मरणपत्र आणि गुगल मीट लिंक व्हॉट्सॲपवर पाठवा',
                        'व्हाट्सएप पर अपॉइंटमेंट पुष्टि, रिमाइंडर और गूगल मीट लिंक भेजें',
                        'વોટ્સએપ પર એપોઇન્ટમેન્ટ પુષ્ટિ, રિમાઇન્ડર અને ગૂગલ મીટ લિંક મોકલો'
                      )}
                    </span>
                  </div>
                </label>

                {/* Collapsible Birth Particulars */}
                <div className="pt-2 border-t border-[#E0BFBF]/30">
                  <div
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    className="flex items-center justify-between cursor-pointer select-none bg-[#FFF8F6] p-3 rounded-lg border border-[#E0BFBF]/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#570013] text-[20px]">
                        auto_awesome
                      </span>
                      <div>
                        <span className="font-serif text-sm font-bold text-[#570013] block">
                          {loc(
                            'Birth Particulars for Janma Patrika (Optional)',
                            'जन्म तपशील (पत्रिका व मुहूर्त - ऐच्छिक)',
                            'जन्म विवरण (जन्मपत्रिका एवं मुहूर्त - वैकल्पिक)',
                            'જન્મ વિગતો (જન્મપત્રિકા અને મુહૂર્ત - વૈકલ્પિક)'
                          )}
                        </span>
                        <span className="text-[11px] text-[#584141]">
                          {loc(
                            'Recommended for Astrological Horoscopy & Muhurta precision',
                            'ज्योतिष मार्गदर्शन व अचूक मुहूर्तासाठी शिफारस केलेले',
                            'सटीक ज्योतिषीय परामर्श एवं मुहूर्त हेतु अनुशंसित',
                            'ચોક્કસ જ્યોતિષીય પરામર્શ અને મુહૂર્ત માટે ભલામણ કરેલ'
                          )}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#570013]">
                      {isAccordionOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>

                  {isAccordionOpen && (
                    <div className="space-y-3 pt-3 p-3 bg-[#FFF0ED] rounded-b-lg border-x border-b border-[#E0BFBF]/40">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#221918] block">
                            {loc('Date of Birth', 'जन्म तारीख', 'जन्म तिथि', 'જન્મ તારીખ')}
                          </label>
                          <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs text-[#221918] border border-[#E0BFBF]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#221918] block">
                            {loc('Exact Time', 'जन्म वेळ', 'जन्म समय', 'જન્મ સમય')}
                          </label>
                          <input
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs text-[#221918] border border-[#E0BFBF]/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-[#221918] block">
                            {loc('Birth Place', 'जन्म स्थान', 'जन्म स्थान', 'જન્મ સ્થળ')}
                          </label>
                          <input
                            type="text"
                            value={birthPlace}
                            onChange={(e) => setBirthPlace(e.target.value)}
                            placeholder={loc('e.g. Pune, MH', 'उदा. पुणे, महाराष्ट्र', 'उदा. पुणे, महाराष्ट्र', 'દા.ત. પુણે, મહારાષ્ટ્ર')}
                            className="w-full bg-white px-3 py-2 rounded-lg text-xs text-[#221918] border border-[#E0BFBF]/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-[#221918] block">
                          {loc(
                            'Key Questions or Special Concerns',
                            'प्रश्नांचा थोडक्यात तपशील',
                            'प्रमुख प्रश्न अथवा विशेष विवरण',
                            'મુખ્ય પ્રશ્નો અથવા વિશેષ વિગત'
                          )}
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={loc(
                            'Career, Health, Vivah Yoga, Griha Nirmana Muhurta, Navagraha Shanti requirements...',
                            'करिअर, आरोग्य, विवाह योग, गृहनिर्माण मुहूर्त, नवग्रह शांती इत्यादी...',
                            'करियर, स्वास्थ्य, विवाह योग, गृह निर्माण मुहूर्त, नवग्रह शांति आदि...',
                            'કારકિર્દી, આરોગ્ય, વિવાહ યોગ, ગૃહ નિર્માણ મુહૂર્ત, નવગ્રહ શાંતિ વગેરે...'
                          )}
                          className="w-full bg-white p-2.5 rounded-lg text-xs text-[#221918] border border-[#E0BFBF]/50 focus:outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-[#E0BFBF]/30">
                  <div className="flex items-center gap-2 text-xs text-[#584141]">
                    <span className="material-symbols-outlined text-[16px] text-[#765B00]">lock</span>
                    <span>
                      {loc(
                        '256-bit encrypted • Strict Shastric privacy guaranteed',
                        '२५६-बिट एनक्रिप्टेड • संपूर्ण शास्त्राधारित गोपनीयता',
                        '256-बिट एन्क्रिप्टेड • पूर्ण शास्त्रसम्मत गोपनीयता',
                        '૨૫૬-બિટ એન્ક્રિપ્ટેડ • સંપૂર્ણ શાસ્ત્રોક્ત ગોપનીયતા'
                      )}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#570013] text-white font-serif font-bold text-sm shadow-md hover:bg-[#800020] transition-all cursor-pointer"
                  >
                    <span>
                      {loc(
                        'Confirm & Proceed to Slot Confirmation',
                        'नोंदणी पुष्टी करा व पुढे जा',
                        'पुष्टि करें एवं आगे बढ़ें',
                        'પુષ્ટિ કરો અને આગળ વધો'
                      )}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Summary & Instructions Sidebar (35% / col-span-4) */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-[#FFF0ED] p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-4 sticky top-28">
                <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
                  <h3 className="font-serif text-lg text-[#570013] font-bold">
                    {loc('Booking Overview', 'नोंदणी गोषवारा', 'बुकिंग सारांश', 'બુકિંગ સારાંશ')}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#765B00]/15 text-[#765B00] text-[11px] font-bold">
                    {loc('Live Summary', 'थेट तपशील', 'प्रत्यक्ष सारांश', 'લાઇવ સારાંશ')}
                  </span>
                </div>

                {/* Shloka Callout */}
                <div className="p-3 bg-white rounded-lg shadow-xs border border-[#E0BFBF]/30">
                  <p className="font-serif text-xs text-[#570013] italic font-semibold leading-relaxed notranslate">
                    ॥ यस्य नास्ति स्वयं प्रज्ञा शास्त्रं तस्य करोति किम् ॥
                  </p>
                  <p className="text-[10px] text-[#765B00] mt-1">
                    {loc(
                      'Vedic guidance illuminates inner discernment.',
                      'शास्त्रोक्त मार्गदर्शन विवेक जागृत करते.',
                      'वैदिक मार्गदर्शन विवेक जागृत करता है।',
                      'વૈદિક માર્ગદર્શન વિવેક જાગૃત કરે છે.'
                    )}
                  </p>
                </div>

                {/* Summary Attributes */}
                <div className="space-y-2.5 text-xs text-[#221918]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#584141] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#765B00]">category</span>
                      <span>{loc('Service:', 'सेवा:', 'सेवा:', 'સેવા:')}</span>
                    </span>
                    <span className="font-bold text-[#570013]">{serviceSpecs[serviceDomain].name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#584141] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#765B00]">devices</span>
                      <span>{loc('Mode:', 'मार्ग:', 'माध्यम:', 'માધ્યમ:')}</span>
                    </span>
                    <span className="font-semibold">
                      {consultationMode === 'online'
                        ? loc('Online Video / Phone', 'ऑनलाईन व्हिडिओ / फोन', 'ऑनलाइन वीडियो / फोन', 'ઑનલાઇન વિડિયો / ફોન')
                        : loc('In-Person at Ashram', 'आश्रम प्रत्यक्ष भेट', 'आश्रम प्रत्यक्ष भेंट', 'આશ્રમ પ્રત્યક્ષ મુલાકાત')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#584141] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#765B00]">calendar_today</span>
                      <span>{loc('Date:', 'दिनांक:', 'दिनांक:', 'તારીખ:')}</span>
                    </span>
                    <span className="font-semibold">{selectedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#584141] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#765B00]">schedule</span>
                      <span>{loc('Time Slot:', 'वेळ:', 'समय:', 'સમય:')}</span>
                    </span>
                    <span className="font-bold text-[#570013]">{selectedSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#584141] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#765B00]">timer</span>
                      <span>{loc('Duration:', 'कालावधी:', 'अवधि:', 'સમયગાળો:')}</span>
                    </span>
                    <span className="font-semibold">{serviceSpecs[serviceDomain].duration}</span>
                  </div>

                  <div className="pt-2 border-t border-[#E0BFBF]/30 flex items-center justify-between">
                    <span className="font-bold text-sm text-[#221918]">
                      {loc('Consultation Dakshina:', 'सल्ला दक्षिणा:', 'परामर्श दक्षिणा:', 'પરામર્શ દક્ષિણા:')}
                    </span>
                    <span className="font-serif font-bold text-base text-[#570013]">
                      {serviceSpecs[serviceDomain].price}
                    </span>
                  </div>
                </div>

                {/* What to expect list */}
                <div className="bg-white p-3.5 rounded-lg shadow-xs border border-[#E0BFBF]/30 space-y-2">
                  <h4 className="text-xs text-[#570013] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#765B00]">fact_check</span>
                    <span>{loc('What to Expect', 'सत्राचे स्वरूप', 'सत्र का स्वरूप', 'સત્રનું સ્વરૂપ')}</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-[#584141]">
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#765B00] mt-0.5">check_circle</span>
                      <span>
                        {loc(
                          'One-on-one confidential dialogue with a certified Shastric Scholar.',
                          'वेदशास्त्रसंपन्न आचार्यांशी थेट आणि गोपनीय संवाद.',
                          'प्रमाणित वैदिक आचार्यों से प्रत्यक्ष एवं गोपनीय संवाद।',
                          'પ્રમાણિત શાસ્ત્રીય વિદ્વાન સાથે પ્રત્યક્ષ અને ખાનગી સંવાદ.'
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#765B00] mt-0.5">check_circle</span>
                      <span>
                        {loc(
                          'Vedic Kundali analysis, planetary periods (Dasha-Bhukti) assessment.',
                          'वैदिक कुंडली विश्लेषण व ग्रह दशा-भुक्तींचे अचूक अवलोकन.',
                          'वैदिक कुंडली विश्लेषण एवं ग्रह दशा-भुक्ति का सटीक आकलन।',
                          'વૈદિક કુંડળી વિશ્લેષણ અને દશા-ભુક્તિનું સચોટ આકલન.'
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#765B00] mt-0.5">check_circle</span>
                      <span>
                        {loc(
                          'Simple, ethical scriptural remedies without fear.',
                          'भीतीविरहित, साधे आणि शास्त्राधारित उपाय.',
                          'भयमुक्त, सरल एवं शास्त्रसम्मत उपाय।',
                          'ભયમુક્ત, સરળ અને શાસ્ત્રોક્ત ઉપાયો.'
                        )}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Helpline Panel */}
                <div className="p-3 bg-[#F6E4E1] rounded-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#765B00] text-lg">headset_mic</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#584141] font-medium">
                      {loc('Need immediate assistance?', 'त्वरित साहाय्य हवे आहे का?', 'तत्काल सहायता चाहिए?', 'તાત્કાલિક સહાયની જરૂર છે?')}
                    </span>
                    <a href="tel:+919822054321" className="text-xs font-bold text-[#570013] hover:underline">
                      +91 98220 54321
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Confirmation Slip Modal */}
      {confirmedSlip && (
        <div
          className="fixed inset-0 z-50 bg-[#241B19]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
        >
          <div className="bg-white max-w-lg w-full rounded-xl p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E0BFBF]/40 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#FFDF94]/60 flex items-center justify-center text-[#765B00]">
                  <span className="material-symbols-outlined text-2xl">task_alt</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#570013] font-bold">
                    {loc('Appointment Provisional Slip', 'सत्र नोंदणी पावती', 'अपॉइंटमेंट अनंतिम पर्ची', 'એપોઇન્ટમેન્ટ કામચલાઉ સ્લિપ')}
                  </h3>
                  <span className="text-xs text-[#765B00]">
                    {loc('Booking Confirmation Receipt', 'प्रवेश व सत्र नोंदणी पावती', 'प्रवेश एवं सत्र पंजीकरण पर्ची', 'પ્રવેશ અને સત્ર નોંધણી પાવતી')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setConfirmedSlip(null)}
                className="text-[#584141] hover:text-[#570013]"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="bg-[#FFF0ED] p-4 rounded-lg space-y-2 text-xs text-[#221918]">
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Appointment ID:', 'नोंदणी क्रमांक:', 'अपॉइंटमेंट आईडी:', 'એપોઇન્ટમેન્ટ આઈડી:')}</span>
                <span className="font-mono font-bold text-[#570013]">{confirmedSlip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Devotee Name:', 'भक्ताचे नाव:', 'भक्त का नाम:', 'ભક્તનું નામ:')}</span>
                <span className="font-semibold">{confirmedSlip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Service:', 'सेवा:', 'सेवा:', 'સેવા:')}</span>
                <span className="font-semibold">{confirmedSlip.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Slot:', 'वेळ:', 'समय:', 'સ્લોટ:')}</span>
                <span className="font-semibold text-[#765B00]">{confirmedSlip.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Mode:', 'मार्ग:', 'माध्यम:', 'માધ્યમ:')}</span>
                <span className="font-semibold">{confirmedSlip.mode}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFDF94]/30 rounded text-center text-xs text-[#251A00]">
              {loc(
                'A confirmation SMS & WhatsApp ping has been dispatched. Our coordinator will verify Kundali details 2 hours prior to the session.',
                'पुष्टीकरण एसएमएस व व्हॉट्सॲप सूचना पाठवली आहे. सत्राच्या २ तास आधी समन्वयक तपशीलांची खात्री करतील.',
                'पुष्टि एसएमएस एवं व्हाट्सएप संदेश प्रेषित किया गया है। सत्र से 2 घंटे पूर्व समन्वयक विवरण सत्यापित करेंगे।',
                'પુષ્ટિ SMS અને વોટ્સએપ સંદેશ મોકલવામાં આવ્યો છે. સત્રના ૨ કલાક પહેલાં સંયોજક વિગતો ચકાસશે.'
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmedSlip(null);
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors cursor-pointer"
              >
                {loc('View in Devotee Dashboard', 'भक्त कक्षामध्ये पहा', 'भक्त कक्ष में देखें', 'ભક્ત કક્ષમાં જુઓ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
