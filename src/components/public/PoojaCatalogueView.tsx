import React, { useState, useMemo } from 'react';
import { poojaServices } from '../../data/poojaData.ts';
import { PoojaService } from '../../types/index.ts';
import { PoojaDetailModal } from './PoojaDetailModal.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedCurrency, formatLocalizedNumber } from '../../utils/formatters.ts';

interface PoojaCatalogueViewProps {
  onNavigate: (path: string, param?: string) => void;
  selectedPoojaId?: string;
}

export const PoojaCatalogueView: React.FC<PoojaCatalogueViewProps> = ({
  onNavigate,
  selectedPoojaId,
}) => {
  const { language, t, loc } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [activeModalPooja, setActiveModalPooja] = useState<PoojaService | null>(() => {
    if (selectedPoojaId) {
      return poojaServices.find((p) => p.id === selectedPoojaId) || null;
    }
    return null;
  });

  const categories = [
    {
      id: 'all',
      label:
        language === 'gu'
          ? 'બધી સેવાઓ'
          : language === 'hi'
          ? 'सभी सेवाएं'
          : language === 'mr'
          ? 'सर्व सेवा'
          : 'All Services',
    },
    {
      id: 'shanti',
      label:
        language === 'gu'
          ? 'શાંતિ અને ગ્રહદોષ'
          : language === 'hi'
          ? 'शांति एवं ग्रहदोष'
          : language === 'mr'
          ? 'शांती व ग्रहदोष'
          : 'Shanti & Graha Dosha',
    },
    {
      id: 'mahayajna',
      label:
        language === 'gu'
          ? 'મહાયજ્ઞ અને અનુષ્ઠાન'
          : language === 'hi'
          ? 'महायज्ञ एवं अनुष्ठान'
          : language === 'mr'
          ? 'महायज्ञ व अनुष्ठान'
          : 'Mahayajna & Anushthan',
    },
    {
      id: 'samskara',
      label:
        language === 'gu'
          ? 'સંસ્કાર અને વાસ્તુ'
          : language === 'hi'
          ? 'संस्कार एवं वास्तु'
          : language === 'mr'
          ? 'संस्कार व वास्तु'
          : 'Samskara & Griha Pravesh',
    },
    {
      id: 'abhishek',
      label:
        language === 'gu'
          ? 'નિત્ય અને અભિષેક'
          : language === 'hi'
          ? 'नित्य एवं अभिषेक'
          : language === 'mr'
          ? 'नित्य व अभिषेक'
          : 'Nitya & Abhishek',
    },
    {
      id: 'pitru',
      label:
        language === 'gu'
          ? 'શ્રાદ્ધ અને તર્પણ'
          : language === 'hi'
          ? 'श्राद्ध एवं तर्पण'
          : language === 'mr'
          ? 'श्राद्ध व तर्पण'
          : 'Pitru Tarpan',
    },
  ];

  const modes = [
    {
      id: 'all',
      label:
        language === 'gu'
          ? 'બધા માધ્યમ'
          : language === 'hi'
          ? 'सभी माध्यम'
          : language === 'mr'
          ? 'सर्व माध्यम'
          : 'All Modes',
    },
    {
      id: 'online',
      label:
        language === 'gu'
          ? 'ઑનલાઇન વિડિયો'
          : language === 'hi'
          ? 'ऑनलाइन वीडियो'
          : language === 'mr'
          ? 'ऑनलाईन'
          : 'Online Video',
    },
    {
      id: 'ashram',
      label:
        language === 'gu'
          ? 'આશ્રમ / ઘર'
          : language === 'hi'
          ? 'आश्रम / घर पर'
          : language === 'mr'
          ? 'आश्रम / निवासस्थानी'
          : 'Ashram / Home',
    },
  ];

  const filteredPoojaList = useMemo(() => {
    let list = poojaServices.filter((pooja) => {
      // Category filter
      if (selectedCategory !== 'all' && pooja.category !== selectedCategory) {
        return false;
      }
      // Mode filter
      if (selectedMode !== 'all' && !pooja.mode.includes(selectedMode as 'online' | 'ashram')) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName =
          pooja.nameEn.toLowerCase().includes(query) ||
          pooja.nameMr.toLowerCase().includes(query) ||
          (pooja.nameHi && pooja.nameHi.toLowerCase().includes(query)) ||
          (pooja.nameGu && pooja.nameGu.toLowerCase().includes(query)) ||
          pooja.descriptionEn.toLowerCase().includes(query) ||
          pooja.categoryLabelEn.toLowerCase().includes(query);
        if (!matchesName) return false;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'low-to-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      list = [...list].sort((a, b) => {
        const aHours = a.duration.includes('Days') ? 999 : parseFloat(a.duration) || 10;
        const bHours = b.duration.includes('Days') ? 999 : parseFloat(b.duration) || 10;
        return aHours - bHours;
      });
    }

    return list;
  }, [selectedCategory, selectedMode, searchQuery, sortBy]);

  const handleBook = (poojaId: string) => {
    onNavigate('book-appointment', poojaId);
  };

  const formatPoojaDuration = (dur: string) => {
    if (language === 'en') {
      return dur.replace('दैनिक ३ तास', '3 hours daily').replace('दररोज ५ तास', '5 hours daily');
    }
    if (language === 'mr') {
      return formatLocalizedNumber(dur.replace('3 – 7 Days', '३ ते ७ दिवस').replace('5 Days', '५ दिवस').replace('3.5 Hours', '३.५ तास').replace('4 Hours', '४ तास').replace('4.5 Hours', '४.५ तास').replace('3 Hours', '३ तास'), 'mr');
    }
    if (language === 'hi') {
      return formatLocalizedNumber(dur.replace('3 – 7 Days', '3 से 7 दिन').replace('5 Days', '5 दिन').replace('3.5 Hours', '3.5 घंटे').replace('4 Hours', '4 घंटे').replace('4.5 Hours', '4.5 घंटे').replace('3 Hours', '3 घंटे').replace('दैनिक ३ तास', 'दैनिक 3 घंटे').replace('दररोज ५ तास', 'प्रतिदिन 5 घंटे'), 'hi');
    }
    if (language === 'gu') {
      return formatLocalizedNumber(dur.replace('3 – 7 Days', '૩ થી ૭ દિવસ').replace('5 Days', '૫ દિવસ').replace('3.5 Hours', '૩.૫ કલાક').replace('4 Hours', '૪ કલાક').replace('4.5 Hours', '૪.૫ કલાક').replace('3 Hours', '૩ કલાક').replace('दैनिक ३ तास', 'રોજ ૩ કલાક').replace('दररोज ५ तास', 'દરરોજ ૫ કલાક'), 'gu');
    }
    return dur;
  };

  const formatPoojaPandits = (pnd: string) => {
    if (language === 'mr') {
      return pnd.replace('3 to 5 Ved-Murti Pandits', '३ ते ५ वेदमूर्ती पंडित').replace('2 Ghanapathis', '२ घनपाठी').replace('4 to 11 Ved-Murti Acharyas', '४ ते ११ वेदमूर्ती आचार्य').replace('2 to 3 Senior Acharyas', '२ ते ३ ज्येष्ठ आचार्य').replace('7 to 9 Ghanapathis', '७ ते ९ घनपाठी').replace('2 Shastris', '२ शास्त्री');
    }
    if (language === 'hi') {
      return pnd.replace('3 to 5 Ved-Murti Pandits', '3 से 5 वेदमूर्ति पंडित').replace('2 Ghanapathis', '2 घनपाठी').replace('4 to 11 Ved-Murti Acharyas', '4 से 11 वेदमूर्ति आचार्य').replace('2 to 3 Senior Acharyas', '2 से 3 वरिष्ठ आचार्य').replace('7 to 9 Ghanapathis', '7 से 9 घनपाठी').replace('2 Shastris', '2 शास्त्री');
    }
    if (language === 'gu') {
      return pnd.replace('3 to 5 Ved-Murti Pandits', '૩ થી ૫ વેદમૂર્તિ પંડિત').replace('2 Ghanapathis', '૨ ઘનપાઠી').replace('4 to 11 Ved-Murti Acharyas', '૪ થી ૧૧ વેદમૂર્તિ આચાર્ય').replace('2 to 3 Senior Acharyas', '૨ થી ૩ વરિષ્ઠ આચાર્ય').replace('7 to 9 Ghanapathis', '૭ થી ૯ ઘનપાઠી').replace('2 Shastris', '૨ શાસ્ત્રી');
    }
    return pnd;
  };

  const formatPoojaPriceLabel = (pooja: PoojaService) => {
    const amountStr = formatLocalizedCurrency(pooja.price, language);
    if (pooja.priceLabel.includes('onwards')) {
      if (language === 'mr') return `${amountStr} पासून पुढे`;
      if (language === 'hi') return `${amountStr} से प्रारंभ`;
      if (language === 'gu') return `${amountStr} થી શરૂ`;
      return `${amountStr} onwards`;
    }
    return amountStr;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Heritage Breadcrumbs & Sub-Bar */}
      <div className="w-full bg-[#FFF0ED] py-3 border-b border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-wrap items-center justify-between gap-3 text-xs text-[#584141]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#570013] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#765B00]">home</span>
              <span>{t('nav.home')}</span>
            </button>
            <span className="text-[#E0BFBF]">/</span>
            <span className="text-[#570013] font-semibold">
              {language === 'gu'
                ? 'પવિત્ર પૂજા અને યજ્ઞ સેવા સૂચિ'
                : language === 'hi'
                ? 'पवित्र पूजा एवं याज्ञिक सेवा सूची'
                : language === 'mr'
                ? 'पूजा व याज्ञिक सेवा सूची'
                : 'Sacred Poojas & Yadnik Services'}
            </span>
          </nav>
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#765B00] animate-pulse"></span>
            <span className="font-medium text-[#765B00]">
              {language === 'gu'
                ? 'પ્રમાણિત શાસ્ત્રોક્ત વિધાન • પ્રાચીન પરંપરા અનુસાર સંપન્ન'
                : language === 'hi'
                ? 'प्रमाणित शास्त्रोक्त विधान • परंपरागत वैदिक गुरुपरंपरा'
                : language === 'mr'
                ? 'प्रमाणित शास्त्रोक्त विधान • परंपरागत वैदिक गुरुपरंपरा'
                : 'Verified Shastric Vidhana • Authenticated by Traditional Lineage'}
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Page Header */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#FFF8F6] via-[#FFF0ED] to-[#FFF8F6] py-12 lg:py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="inline-flex items-center gap-2 text-[#765B00] text-xs font-semibold tracking-wider uppercase">
                <span className="material-symbols-outlined text-[18px]">flare</span>
                <span className="notranslate">॥ श्रौत स्मार्त कर्मकांड विधानम् ॥</span>
                <span>• {language === 'gu' ? 'પ્રામાણિક શાસ્ત્રીય વિધિ' : language === 'hi' ? 'प्रामाणिक शास्त्रीय विधि' : language === 'mr' ? 'अस्सल शास्त्रोक्त विधी' : 'Authentic Shastric Vidhi'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#570013] font-bold tracking-tight leading-tight">
                {language === 'gu'
                  ? 'પવિત્ર પૂજા, હવન અને યજ્ઞ સમારોહ'
                  : language === 'hi'
                  ? 'पवित्र पूजा, हवन एवं याज्ञिक अनुष्ठान'
                  : language === 'mr'
                  ? 'पवित्र पूजा, हवि व याज्ञिक विधी'
                  : 'Sacred Poojas, Havans & Yadnik Ceremonies'}
                <span className="block font-serif text-xl sm:text-2xl lg:text-3xl text-[#765B00] font-semibold mt-1">
                  {language === 'gu'
                    ? 'પ્રામાણિક વૈદિક પૂજા અને યજ્ઞ વિધાન'
                    : language === 'hi'
                    ? 'प्रामाणिक वैदिक पूजा एवं यज्ञ अनुष्ठान'
                    : language === 'mr'
                    ? 'पवित्र पूजा, हवि व याज्ञिक विधी'
                    : 'Authentic Vedic Poojas & Sacred Yadnik Havans'}
                </span>
              </h1>
              <p className="text-base text-[#584141] max-w-2xl leading-relaxed">
                {language === 'gu'
                  ? 'શાસ્ત્રોક્ત વૈદિક સ્વર ઉચ્ચારણ, અધિકૃત શુદ્ધ સામગ્રી અને સંપૂર્ણ શ્રદ્ધા સાથે સંપન્ન. અમારા પુણે આશ્રમમાં અથવા આપના નિવાસસ્થાને પ્રત્યક્ષ તથા ઑનલાઇન લાઇવ સ્ટ્રીમ ઉપલબ્ધ.'
                  : language === 'hi'
                  ? 'शुद्ध वैदिक स्वर उच्चारण, प्रामाणिक जैविक सामग्री एवं भयमुक्त वातावरण में संपन्न। हमारे पुणे आश्रम अथवा आपके निवास पर प्रत्यक्ष एवं ऑनलाइन लाइव उपलब्ध।'
                  : language === 'mr'
                  ? 'शास्त्रशुद्ध वेदोक्त स्वराघात, अस्सल सेंद्रिय सामग्री आणि निःशंक भावनेने संपन्न होणारे अनुष्ठान. आमच्या पुणे आश्रमात किंवा आपल्या निवासस्थानी प्रत्यक्ष व ऑनलाईन थेट प्रक्षेपण उपलब्ध.'
                  : 'Performed with strict Vedic swara pronunciation, authentic organic samagri, and zero fear-mongering. Available both live-streamed online and in-person at our Pune Ashram or your residence.'}
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[#221918]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[18px]">local_florist</span>
                  <span>
                    {language === 'gu'
                      ? '૧૦૦% ગીર ગાયનું ઘી અને બિલ્વ સામગ્રી'
                      : language === 'hi'
                      ? '100% शुद्ध देशी गाय का घी एवं बिल्व'
                      : language === 'mr'
                      ? '१००% देशी गायीचे तूप व बिल्व सामग्री'
                      : '100% Desi Cow Ghee & Bilva Samagri'}
                  </span>
                </div>
                <span className="text-[#E0BFBF] hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[18px]">groups</span>
                  <span>
                    {language === 'gu'
                      ? 'ઘનપાઠી વેદ વિદ્વાનો'
                      : language === 'hi'
                      ? 'घनपाठी वेद विद्वान'
                      : language === 'mr'
                      ? 'वेदविभूषण घनपाठी'
                      : 'Ghanapathi Reciters'}
                  </span>
                </div>
                <span className="text-[#E0BFBF] hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#765B00] text-[18px]">verified</span>
                  <span>
                    {language === 'gu'
                      ? 'પારદર્શક સંકલ્પ પત્ર'
                      : language === 'hi'
                      ? 'पारदर्शी संकल्प पत्र'
                      : language === 'mr'
                      ? 'पारदर्शक संकल्प पत्र'
                      : 'Transparent Sankalpa Patra'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-[320px] p-6 bg-[#FCEAE6] rounded-xl shadow-xs flex flex-col items-center text-center space-y-3 border border-[#E0BFBF]/40">
                <div className="w-14 h-14 rounded-full bg-[#570013] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">wb_sunny</span>
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-[#570013]">
                    {language === 'gu' ? 'શૌચ અને શ્રદ્ધા' : language === 'hi' ? 'शौच एवं श्रद्धा' : 'शौच व श्रद्धा'}
                  </span>
                  <p className="text-xs text-[#584141] mt-0.5">
                    {language === 'gu'
                      ? 'વિચારોની પવિત્રતા, સંસ્કૃત સ્વરોચ્ચાર અને સંપૂર્ણ શાસ્ત્રીય શુદ્ધતા.'
                      : language === 'hi'
                      ? 'विचारों की पवित्रता, शुद्ध संस्कृत उच्चारण एवं पूर्ण शास्त्रसम्मत निष्ठा।'
                      : language === 'mr'
                      ? 'चित्तशुद्धी, प्रामाणिक संस्कृत स्वराघात आणि संपूर्ण शास्त्रीय निष्ठा.'
                      : 'Purity of thought, authentic Sanskrit intonation, and total liturgical integrity since 1994.'}
                  </p>
                </div>
                <div className="w-full bg-white rounded-lg p-2.5 text-left flex items-center justify-between text-xs text-[#221918]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#765B00] font-semibold uppercase">
                      {language === 'gu' ? 'દૈનિક આશ્રમ હવન' : language === 'hi' ? 'दैनिक आश्रम हवन' : language === 'mr' ? 'दैनिक आश्रम हवि' : 'Daily Ashram Havan'}
                    </span>
                    <span className="font-semibold">
                      {language === 'gu'
                        ? 'બ્રહ્મ મુહૂર્ત (સવારે ૦૬:૧૫)'
                        : language === 'hi'
                        ? 'ब्रह्म मुहूर्त (प्रातः 06:15)'
                        : language === 'mr'
                        ? 'ब्राह्म मुहूर्त (सकाळी ०६:१५)'
                        : 'Brahma Muhurta (06:15 AM)'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#570013] text-[20px]">nest_clock_farsight_analog</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Console: Search, Mode, Sort & Category Filter Pills */}
      <section className="w-full sticky top-20 z-30 bg-[#FFF8F6]/95 backdrop-blur-md shadow-xs py-4 border-y border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-6 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7071] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'gu'
                    ? 'દેવતા, હેતુ દ્વારા પૂજા શોધો (દા.ત., નવગ્રહ, રુદ્રાભિષેક, વાસ્તુ)...'
                    : language === 'hi'
                    ? 'देवता, उद्देश्य द्वारा पूजा खोजें (उदा. नवग्रह, रुद्राभिषेक, वास्तु)...'
                    : language === 'mr'
                    ? 'देवता, हेतू किंवा नाव शोधा (उदा. नवग्रह, रुद्राभिषेक, वास्तु)...'
                    : 'Search pooja by deity, purpose (e.g., Navagraha, Rudrabhishek, Vastu)...'
                }
                className="w-full pl-11 pr-4 py-2.5 bg-white text-[#221918] text-sm rounded-lg border border-[#E0BFBF]/40 focus:outline-none focus:ring-2 focus:ring-[#765B00] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7071] hover:text-[#570013]"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Mode Filter Toggle */}
            <div className="lg:col-span-4 flex items-center bg-white p-1 rounded-lg border border-[#E0BFBF]/40 shadow-xs">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMode(m.id)}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedMode === m.id
                      ? 'text-white bg-[#570013] shadow-xs'
                      : 'text-[#584141] hover:text-[#570013]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="lg:col-span-2 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white text-[#221918] text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg border border-[#E0BFBF]/40 shadow-xs focus:outline-none cursor-pointer"
              >
                <option value="recommended">
                  {language === 'gu'
                    ? 'ક્રમ: ભલામણ કરેલ'
                    : language === 'hi'
                    ? 'क्रम: अनुशंसित'
                    : language === 'mr'
                    ? 'क्रम: शिफारस केलेले'
                    : 'Sort: Recommended'}
                </option>
                <option value="low-to-high">
                  {language === 'gu'
                    ? 'દક્ષિણા: ઓછી થી વધુ'
                    : language === 'hi'
                    ? 'दक्षिणा: कम से अधिक'
                    : language === 'mr'
                    ? 'किंमत: कमी ते जास्त'
                    : 'Dakshina: Low to High'}
                </option>
                <option value="duration">
                  {language === 'gu'
                    ? 'સમયગાળો (ઝડપી પ્રથમ)'
                    : language === 'hi'
                    ? 'अवधि (कम समय पहले)'
                    : language === 'mr'
                    ? 'कालावधी (कमी वेळ आधी)'
                    : 'Duration (Quickest first)'}
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7071] pointer-events-none text-[18px]">
                unfold_more
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#570013] text-white shadow-xs'
                    : 'bg-[#F6E4E1] text-[#221918] hover:bg-[#FCEAE6] hover:text-[#570013]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pooja Catalogue Grid Section */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#570013] font-serif">
                {language === 'gu'
                  ? 'ઉપલબ્ધ યાજ્ઞિક વિધિઓ'
                  : language === 'hi'
                  ? 'उपलब्ध याज्ञिक विधियाँ'
                  : language === 'mr'
                  ? 'उपलब्ध याज्ञिक विधी'
                  : 'Available Yadnik Vidhis'}
              </span>
              <span className="text-xs bg-[#FFD979] text-[#795D00] px-2 py-0.5 rounded font-bold">
                {filteredPoojaList.length}{' '}
                {language === 'gu'
                  ? 'સેવાઓ ઉપલબ્ધ'
                  : language === 'hi'
                  ? 'सेवाएं उपलब्ध'
                  : language === 'mr'
                  ? 'सेवा उपलब्ध'
                  : 'Services Displayed'}
              </span>
            </div>
            <p className="text-xs text-[#584141] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#765B00]">info</span>
              <span>
                {language === 'gu'
                  ? 'તમામ વિધિઓમાં ગોત્ર, નક્ષત્ર અને કુળદેવતા અનુસાર વ્યક્તિગત સંકલ્પ શામેલ છે.'
                  : language === 'hi'
                  ? 'सभी अनुष्ठानों में गोत्र, नक्षत्र एवं कुलदेवता अनुसार व्यक्तिगत संकल्प शामिल है।'
                  : language === 'mr'
                  ? 'सर्व विधींमध्ये गोत्र, नक्षत्र व कुलदैवतानुसार वैयक्तिक संकल्प केला जातो.'
                  : 'All rituals include personal Sankalpa by Gotra, Nakshatra & Kula Devata.'}
              </span>
            </p>
          </div>

          {filteredPoojaList.length === 0 ? (
            <div className="p-12 text-center bg-[#FFF0ED] rounded-xl space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#765B00]">search_off</span>
              <h3 className="font-serif text-lg font-bold text-[#570013]">
                {language === 'gu'
                  ? 'કોઈ મેળ ખાતી પૂજા મળી નથી'
                  : language === 'hi'
                  ? 'कोई पूजा उपलब्ध नहीं मिली'
                  : language === 'mr'
                  ? 'कोणतीही पूजा सापडली नाही'
                  : 'No matching poojas found'}
              </h3>
              <p className="text-xs text-[#584141]">
                {language === 'gu'
                  ? 'કૃપા કરીને આપના શોધ શબ્દો અથવા ફિલ્ટર્સ બદલીને ફરી પ્રયાસ કરો.'
                  : language === 'hi'
                  ? 'कृपया अपने खोज शब्द या फिल्टर बदलकर पुनः प्रयास करें।'
                  : language === 'mr'
                  ? 'कृपया आपले शोध शब्द किंवा फिल्टर बदलून पुन्हा प्रयत्न करा.'
                  : 'Please adjust your search terms or filters.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedMode('all');
                }}
                className="px-4 py-2 bg-[#570013] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {language === 'gu'
                  ? 'ફિલ્ટર્સ સાફ કરો'
                  : language === 'hi'
                  ? 'फिल्टर साफ करें'
                  : language === 'mr'
                  ? 'फिल्टर्स साफ करा'
                  : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoojaList.map((pooja) => {
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

                return (
                  <article
                    key={pooja.id}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#E0BFBF]/30 group"
                  >
                    {/* Card Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#FCEAE6]">
                      <img
                        src={pooja.image}
                        alt={poojaName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#570013]/80 via-transparent to-black/20"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-white/90 backdrop-blur-sm text-[#570013] text-xs px-2.5 py-1 rounded font-semibold shadow-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#765B00]">
                            {pooja.mode.includes('online') ? 'videocam' : 'temple_hindu'}
                          </span>
                          <span>
                            {pooja.mode.includes('online')
                              ? language === 'gu'
                                ? 'આશ્રમ / ઑનલાઇન વિડિયો'
                                : language === 'hi'
                                ? 'आश्रम / ऑनलाइन वीडियो'
                                : language === 'mr'
                                ? 'आश्रम / ऑनलाईन'
                                : 'Ashram / Online Video'
                              : language === 'gu'
                              ? 'આશ્રમ ગર્ભગૃહ'
                              : language === 'hi'
                              ? 'आश्रम गर्भगृह'
                              : language === 'mr'
                              ? 'आश्रम गर्भगृह'
                              : 'Ashram Sanctum'}
                          </span>
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#FFDF94]">
                          {pooja.lineage}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h2 className="font-serif text-lg font-bold text-[#570013] group-hover:text-[#800020] transition-colors leading-snug">
                          {poojaName}
                          <span className="block text-xs font-normal text-[#584141] mt-0.5">
                            {loc(pooja.categoryLabelEn, pooja.categoryLabelMr, pooja.categoryLabelHi, pooja.categoryLabelGu)}
                          </span>
                        </h2>
                        <p className="text-xs text-[#584141] leading-relaxed line-clamp-2">
                          {poojaDesc}
                        </p>
                      </div>

                      {/* Ritual Specs Grid */}
                      <div className="bg-[#FFF0ED] rounded-lg p-3 grid grid-cols-2 gap-2 text-xs text-[#584141]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#765B00] text-[16px]">schedule</span>
                          <span>{formatPoojaDuration(pooja.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#765B00] text-[16px]">group</span>
                          <span className="truncate">{formatPoojaPandits(pooja.pandits)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#765B00] text-[16px]">water_drop</span>
                          <span className="truncate">{pooja.samagri.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#765B00] text-[16px]">verified</span>
                          <span>
                            {language === 'gu'
                              ? 'વ્યક્તિગત સંકલ્પ'
                              : language === 'hi'
                              ? 'व्यक्तिगत संकल्प'
                              : language === 'mr'
                              ? 'वैयक्तिक संकल्प'
                              : 'Personal Sankalpa'}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & Action Buttons */}
                      <div className="pt-2 space-y-3">
                        <div className="flex items-baseline justify-between border-t border-[#E0BFBF]/30 pt-3">
                          <span className="text-xs text-[#584141] font-medium">
                            {language === 'gu' ? 'દક્ષિણા સેવા:' : language === 'hi' ? 'दक्षिणा सेवा:' : language === 'mr' ? 'दक्षिणा सेवा:' : 'Dakshina Seva:'}
                          </span>
                          <span className="font-serif text-base font-bold text-[#570013]">
                            {formatPoojaPriceLabel(pooja)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveModalPooja(pooja)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#FCEAE6] text-[#570013] text-xs font-bold hover:bg-[#F6E4E1] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>{t('action.viewDetails')}</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBook(pooja.id)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-all text-center flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">event_available</span>
                            <span>{t('action.bookSankalpa')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Shastra Conformance Section (3 Pillars) */}
      <section className="w-full bg-[#FFF0ED] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs text-[#765B00] font-semibold uppercase tracking-widest notranslate">
              ॥ धर्मो रक्षति रक्षितः ॥
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
              {language === 'gu'
                ? 'અમારો શાસ્ત્રીય પવિત્રતા સંકલ્પ'
                : language === 'hi'
                ? 'हमारा शास्त्रीय निष्ठा संकल्प'
                : language === 'mr'
                ? 'आमचा शास्त्रीय पावित्र्य संकल्प'
                : 'Our Shastric Integrity Charter'}
            </h2>
            <p className="text-sm text-[#584141]">
              {language === 'gu'
                ? 'ચૈતન્ય વેદ પ્રતિષ્ઠાનમાં પ્રત્યેક અનુષ્ઠાન અવિરત સ્માર્ત પરંપરા અનુસાર, અંધશ્રદ્ધા વિના સંપન્ન થાય છે.'
                : language === 'hi'
                ? 'चैतन्य वेद प्रतिष्ठान में प्रत्येक अनुष्ठान अखंड स्मार्त परंपरा अनुसार, अंधविश्वास से मुक्त होकर संपन्न होता है।'
                : language === 'mr'
                ? 'चैतन्य वेद प्रतिष्ठानमध्ये प्रत्येक अनुष्ठान अखंड स्मार्त परंपरेनुसार, अंधश्रद्धा व भीतीमुक्त वातावरणात संपन्न केले जाते.'
                : 'Every ritual at Chaitanya Ved Pratishthan adheres to unbroken Smarta canons, devoid of superstition, market pricing markups, or abbreviated shortcuts.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-xs flex flex-col space-y-3 border border-[#E0BFBF]/30">
              <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#765B00]">
                <span className="material-symbols-outlined text-[28px]">eco</span>
              </div>
              <h3 className="font-serif text-lg text-[#570013] font-bold">
                {language === 'gu' ? '૧૦૦% શુદ્ધ સજીવ સામગ્રી' : language === 'hi' ? '100% शुद्ध जैविक सामग्री' : language === 'mr' ? '१००% शुद्ध सेंद्रिय सामग्री' : '100% Organic Samagri'}
                <span className="block text-xs font-normal text-[#765B00] mt-0.5">
                  ({language === 'gu' ? 'શુદ્ધ સામગ્રી' : language === 'hi' ? 'शुद्ध सामग्री' : language === 'mr' ? 'शुद्ध सेंद्रिय सामग्री' : 'Pure Ingredients'})
                </span>
              </h3>
              <p className="text-sm text-[#584141] leading-relaxed">
                {language === 'gu'
                  ? 'પ્રમાણિત ગૌશાળાઓમાંથી સીધું મેળવેલ ગીર ગાયનું બિલોના ઘી, શુદ્ધ ભીમસેની કપૂર, તલ અને જંગલી બિલ્વપત્ર.'
                  : language === 'hi'
                  ? 'प्रमाणित गोशालाओं से सीधे प्राप्त शुद्ध देशी गाय का घी, शुद्ध कपूर, काले तिल एवं ताजे बिल्वपत्र।'
                  : language === 'mr'
                  ? 'प्रमाणित गोशाळांमधून थेट मिळणारे शुद्ध देशी गायीचे बिलोना तूप, भीमसेनी कापूर, सेंद्रिय तीळ आणि रानटी बिल्वपत्रे.'
                  : 'Sourced directly from certified gaushalas and Ayurvedic herb collectors: pure Gir cow bilona ghee, unadulterated camphor, organic sesame, and wild bilva patra.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#584141]">
                <span className="material-symbols-outlined text-[16px] text-[#765B00]">check_circle</span>
                <span>
                  {language === 'gu' ? 'કોઈપણ રાસાયણિક ભેળસેળ વિના' : language === 'hi' ? 'रसायन मुक्त एवं शुद्ध' : language === 'mr' ? 'रासायनिक भेसळ विरहित' : 'Zero chemical adulterants or colored dyes'}
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xs flex flex-col space-y-3 border border-[#E0BFBF]/30">
              <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#765B00]">
                <span className="material-symbols-outlined text-[28px]">school</span>
              </div>
              <h3 className="font-serif text-lg text-[#570013] font-bold">
                {language === 'gu' ? 'પ્રમાણિત ઘનપાઠી વેદપાઠી' : language === 'hi' ? 'प्रमाणित घनपाठी वेदपाठी' : language === 'mr' ? 'प्रमाणित घनपाठी वेदपाठी' : 'Verified Ghanapathi Reciters'}
                <span className="block text-xs font-normal text-[#765B00] mt-0.5">
                  ({language === 'gu' ? 'વેદ વિદ્વાન' : language === 'hi' ? 'वेद विद्वान' : language === 'mr' ? 'प्रमाणित वेदपाठी' : 'Vedic Scholars'})
                </span>
              </h3>
              <p className="text-sm text-[#584141] leading-relaxed">
                {language === 'gu'
                  ? 'પ્રત્યેક આચાર્યએ ઓછામાં ઓછા ૮ થી ૧૨ વર્ષનું આવાસીય ગુરુકુળ અધ્યયન અને સ્વરાઘાત સિદ્ધિ મેળવી છે.'
                  : language === 'hi'
                  ? 'प्रत्येक आचार्य ने 8 से 12 वर्षों का आवासीय गुरुकुल अध्ययन एवं शुद्ध स्वराघात सिद्ध किया है।'
                  : language === 'mr'
                  ? 'प्रत्येक आचार्यांनी किमान ८ ते १२ वर्षांचे निवासी गुरुकुल अध्ययन व स्वराघात प्रावीण्य प्राप्त केले आहे.'
                  : 'Every Acharya has undergone at least 8 to 12 years of residential Gurukul discipline with verified mastery over swara accents.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#584141]">
                <span className="material-symbols-outlined text-[16px] text-[#765B00]">check_circle</span>
                <span>
                  {language === 'gu' ? 'ઋગ્વેદ અને શુક્લ યજુર્વેદ પરંપરા' : language === 'hi' ? 'ऋग्वेद एवं शुक्ल यजुर्वेद शाखा' : language === 'mr' ? 'ऋग्वेद व शुक्ल यजुर्वेद शाखा' : 'Rigveda & Shukla Yajurveda lineages'}
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xs flex flex-col space-y-3 border border-[#E0BFBF]/30">
              <div className="w-12 h-12 rounded-lg bg-[#FCEAE6] flex items-center justify-center text-[#765B00]">
                <span className="material-symbols-outlined text-[28px]">receipt_long</span>
              </div>
              <h3 className="font-serif text-lg text-[#570013] font-bold">
                {language === 'gu' ? 'પારદર્શક દક્ષિણા નિયમાવલી' : language === 'hi' ? 'पारदर्शी दक्षिणा नियमावली' : language === 'mr' ? 'पारदर्शक मानधन नियमावली' : 'Transparent Dakshina Charter'}
                <span className="block text-xs font-normal text-[#765B00] mt-0.5">
                  ({language === 'gu' ? 'માનધન' : language === 'hi' ? 'पारदर्शी मानधन' : language === 'mr' ? 'पारदर्शक मानधन' : 'Fixed Honorarium'})
                </span>
              </h3>
              <p className="text-sm text-[#584141] leading-relaxed">
                {language === 'gu'
                  ? 'તમામ દક્ષિણા રાશિ અમારા જાહેર ચેરિટેબલ ટ્રસ્ટ મંડળ દ્વારા પૂર્વનિર્ધારિત છે. ૧૦૦% રકમ વિદ્વાનો અને ગુરુકુળ માટે ઉપયોગમાં લેવાય છે.'
                  : language === 'hi'
                  ? 'सभी दक्षिणा राशि हमारे सार्वजनिक न्यास मंडल द्वारा पूर्व-निर्धारित है। पूर्ण राशि विद्वानों एवं गुरुकुल विद्यार्थियों हेतु प्रयुक्त होती है।'
                  : language === 'mr'
                  ? 'सर्व मानधन रक्कम सार्वजनिक विश्वस्त न्यास मंडळाने पूर्वनिर्धारित केली आहे. १००% निधी ऋत्विज व गुरुकुल विद्यार्थ्यांसाठी वापरला जातो.'
                  : 'All dakshina amounts are predetermined by our public charitable trust board. 100% of proceeds go towards vedic scholars and Gurukul stipends.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#584141]">
                <span className="material-symbols-outlined text-[16px] text-[#765B00]">check_circle</span>
                <span>
                  {language === 'gu' ? 'અધિકૃત ૮૦-જી કરમુક્તિ પાવતી ઉપલબ્ધ' : language === 'hi' ? 'आधिकारिक 80G कर छूट रसीद उपलब्ध' : language === 'mr' ? 'अधिकृत ८०-जी करसवलत पावती उपलब्ध' : 'Official 80G tax receipt provided upon request'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Consultation Helpline CTA Section */}
      <section className="w-full bg-[#FFF8F6] py-14">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="relative overflow-hidden bg-[#570013] rounded-xl p-8 lg:p-12 text-white shadow-xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#800020] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">contact_support</span>
                  <span>
                    {language === 'gu'
                      ? 'આપની કુંડળી માટે કઈ પૂજા યોગ્ય છે તે જાણવા માગો છો?'
                      : language === 'hi'
                      ? 'अपनी कुंडली हेतु उचित पूजा या अनुष्ठान जानना चाहते हैं?'
                      : language === 'mr'
                      ? 'आपल्या पत्रिकेसाठी कोणता विधी किंवा होम योग्य आहे?'
                      : 'Unsure Which Pooja or Homa is Appropriate for Your Horoscope?'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {language === 'gu'
                    ? 'વરિષ્ઠ વૈદિક જ્યોતિષી સાથે પરામર્શ કરો'
                    : language === 'hi'
                    ? 'वरिष्ठ वैदिक ज्योतिषी से परामर्श करें'
                    : language === 'mr'
                    ? 'वरिष्ठ वैदिक दैवज्ञ व ज्योतिषांशी सल्लामसलत करा'
                    : 'Speak with a Senior Vedic Counselor & Jyotishi'}
                </h2>
                <p className="text-sm text-white/90 max-w-2xl leading-relaxed">
                  {language === 'gu'
                    ? 'કોઈપણ મોટું અનુષ્ઠાન કરતાં પહેલાં આપની જન્મકુંડળી અમારા વરિષ્ઠ શાસ્ત્રીઓ પાસે ચકાસાવો અને શાસ્ત્રોક્ત જરૂરિયાત સમજો.'
                    : language === 'hi'
                    ? 'किसी भी बड़े अनुष्ठान से पूर्व अपनी जन्मकुंडली हमारे वरिष्ठ आचार्यों से परखवाएं एवं शास्त्रसम्मत मार्गदर्शन प्राप्त करें।'
                    : language === 'mr'
                    ? 'कोणताही मोठा विधी करण्यापूर्वी आपल्या जन्मपत्रिकेचे ज्येष्ठ दैवज्ञांकडून सखोल परीक्षण करून ग्रहदशा तपासून घ्या.'
                    : 'Before undertaking any major remedy or expensive anushthan, have your Janma Kundali reviewed by our senior Shastris to evaluate planetary dashas and genuine scriptural needs.'}
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FFDF94] text-[20px]">call</span>
                    <span>{t('helpline')}: +91 98220 54321</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FFDF94] text-[20px]">schedule</span>
                    <span>
                      {language === 'gu'
                        ? 'સવારે ૧૦:૦૦ થી સાંજે ૦૬:૦૦ (દૈનિક)'
                        : language === 'hi'
                        ? 'प्रातः 10:00 से सायं 06:00 (दैनिक)'
                        : language === 'mr'
                        ? 'सकाळी १०:०० ते सायं ०६:०० (दैनिक)'
                        : '10:00 AM – 06:00 PM (Daily)'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => onNavigate('book-appointment')}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#FFD979] text-[#795D00] text-xs font-bold text-center hover:bg-[#FFDF94] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                  <span>{t('bookAppointment')}</span>
                </button>
                <a
                  href="tel:+919822054321"
                  className="w-full py-3.5 px-6 rounded-lg bg-white/15 backdrop-blur-md text-white text-xs font-bold text-center hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>
                    {language === 'gu' ? 'સીધો કૉલ કરો' : language === 'hi' ? 'सीधे कॉल करें' : language === 'mr' ? 'थेट कॉल करा' : 'Call Helpline Directly'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pooja Detail Modal */}
      <PoojaDetailModal
        pooja={activeModalPooja}
        isOpen={Boolean(activeModalPooja)}
        onClose={() => setActiveModalPooja(null)}
        onBook={handleBook}
      />
    </div>
  );
};
