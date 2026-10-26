import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedNumber } from '../../utils/formatters.ts';

interface ResourcesViewProps {
  onNavigate: (path: string) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onNavigate }) => {
  const { showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pothi' | 'panchang' | 'audio'>('panchang');

  const formatPanchangTime = (str: string) => {
    if (language === 'mr') {
      return formatLocalizedNumber(
        str.replace('AM', 'सकाळी').replace('PM', 'दुपारी').replace('–', 'ते'),
        'mr'
      );
    }
    if (language === 'hi') {
      return formatLocalizedNumber(
        str.replace('AM', 'प्रातः').replace('PM', 'दोपहर').replace('–', 'से'),
        'hi'
      );
    }
    if (language === 'gu') {
      return formatLocalizedNumber(
        str.replace('AM', 'સવારે').replace('PM', 'બપોરે').replace('–', 'થી'),
        'gu'
      );
    }
    return str;
  };

  const pothiDownloads = [
    {
      title: loc(
        'Rigveda Shakala Samhita (Mandala 1)',
        'ऋग्वेद शाकल संहिता (प्रथम मण्डल)',
        'ऋग्वेद शाकल संहिता (प्रथम मण्डल)',
        'ઋગ્વેદ શાકલ સંહિતા (પ્રથમ મંડલ)'
      ),
      format: 'PDF • 8.4 MB',
      shakha: loc('Shakala Shakha', 'शाकल शाखा', 'शाकल शाखा', 'શાકલ શાખા'),
      desc: loc(
        'Original Samhita with Vedic accent notation, Pada-patha, and Sayana commentary summary.',
        'मूळ सस्वर संहिता, पदपाठ आणि सायण भाष्य सारांश.',
        'मूल सस्वर संहिता, पदपाठ एवं सायण भाष्य सारांश।',
        'મૂળ સસ્વર સંહિતા, પદપાઠ અને સાયણ ભાષ્ય સારાંશ.'
      ),
    },
    {
      title: loc(
        'Sri Rudrashtadhyayi & Chamakam Recitation Text',
        'श्री रुद्राष्टाध्यायी व चमकम् सस्वर पाठ',
        'श्री रुद्राष्टाध्यायी एवं चमकम् सस्वर पाठ',
        'શ્રી રુદ્રાષ્ટાદ્યાયી અને ચમકમ્ સસ્વર પાઠ'
      ),
      format: 'PDF • 5.1 MB',
      shakha: loc('Shukla Yajurveda', 'शुक्ल यजुर्वेद', 'शुक्ल यजुर्वेद', 'શુક્લ યજુર્વેદ'),
      desc: loc(
        'Namaka-Chamaka mantras, Nyasa procedures, and Phala-shruti explanations.',
        'नमक-चमक मंत्र, न्यास विधी आणि फलश्रुतीसह.',
        'नमक-चमक मंत्र, न्यास विधि एवं फलश्रुति सहित।',
        'નમક-ચમક મંત્ર, ન્યાસ વિધિ અને ફલશ્રુતિ સાથે.'
      ),
    },
    {
      title: loc(
        'Sri Sukta & Purusha Sukta Worship Manual',
        'श्री सूक्त व पुरुष सूक्त उपासना विधी',
        'श्री सूक्त एवं पुरुष सूक्त उपासना विधि',
        'શ્રી સૂક્ત અને પુરુષ સૂક્ત ઉપાસના વિધિ'
      ),
      format: 'PDF • 3.2 MB',
      shakha: loc('Rigveda Khila', 'ऋग्वेद परिशिष्ट', 'ऋग्वेद परिशिष्ट', 'ઋગ્વેદ પરિશિષ્ટ'),
      desc: loc(
        'Authentic hymns and meditation guide for Lakshmi worship and spiritual advancement.',
        'लक्ष्मी प्राप्ती व आत्मिक उद्धारासाठी प्रामाणिक पाठ.',
        'लक्ष्मी प्राप्ति एवं आत्मिक उत्थान हेतु प्रामाणिक पाठ।',
        'લક્ષ્મી પ્રાપ્તિ અને આત્મિક ઉદ્ધાર માટે પ્રમાણિક પાઠ.'
      ),
    },
    {
      title: loc(
        'Nitya Sandhyavandanam & Brahmayajna Manual',
        'नित्य संध्योपासन व ब्रह्मयज्ञ विधी',
        'नित्य संध्योपासन एवं ब्रह्मयज्ञ विधि',
        'નિત્ય સંધ્યોપાસના અને બ્રહ્મયજ્ઞ વિધિ'
      ),
      format: 'PDF • 2.8 MB',
      shakha: loc('Trikala Sandhya', 'त्रिकाल संध्या', 'त्रिकाल संध्या', 'ત્રિકાળ સંધ્યા'),
      desc: loc(
        'Detailed steps for Achamana, Pranayama, Gayatri Japa, and Tarpana rituals.',
        'आचमन, प्राणायाम, गायत्री जप व तर्पण सविस्तर पद्धती.',
        'आचमन, प्राणायाम, गायत्री जप एवं तर्पण की विस्तृत विधि।',
        'આચમન, પ્રાણાયામ, ગાયત્રી જપ અને તર્પણની વિસ્તૃત પદ્ધતિ.'
      ),
    },
  ];

  const audioChants = [
    {
      title: loc('Agni Sukta — Rigveda 1.1', 'अग्नि सूक्त — ऋग्वेद १.१', 'अग्नि सूक्त — ऋग्वेद 1.1', 'અગ્નિ સૂક્ત — ઋગ્વેદ ૧.૧'),
      reciter: loc('V. M. Dr. Shripad Bhat', 'वे. मू. डॉ. श्रीपाद भट', 'वे. मू. डॉ. श्रीपाद भट', 'વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ'),
      duration: '08:35',
    },
    {
      title: loc('Sri Rudram — Chamakam Samputa', 'श्री रुद्रम् — चमकम् संपुट', 'श्री रुद्रम् — चमकम् संपुट', 'શ્રી રુદ્રમ્ — ચમકમ્ સંપુટ'),
      reciter: loc('Ashram Ghanapatha Mandali', 'आश्रम घनपाठ मंडळ', 'आश्रम घनपाठ मंडल', 'આશ્રમ ઘનપાઠ મંડળ'),
      duration: '22:15',
    },
    {
      title: loc('Mahamrityunjaya Mantra (108 Chants)', 'महामृत्युंजय मंत्र १०८ आवर्तने', 'महामृत्युंजय मंत्र 108 आवृत्तियाँ', 'મહામૃત્યુંજય મંત્ર ૧૦૮ આવર્તન'),
      reciter: loc('Pt. Ganeshbuwa Ranade', 'पं. गणेशबुवा रानडे', 'पं. गणेशबुवा रानडे', 'પં. ગણેશબુવા રાનડે'),
      duration: '28:40',
    },
    {
      title: loc('Vishnu Sahasranama Stotram with Accents', 'विष्णुसहस्रनाम स्तोत्र सस्वर', 'विष्णुसहस्रनाम स्तोत्र सस्वर', 'વિષ્ણુસહસ્રનામ સ્તોત્ર સસ્વર'),
      reciter: loc('Veda Mandir Chanting Troupe', 'वेदमंदिर वृंद', 'वेदमंदिर वृंद', 'વેદમંદિર વૃંદ'),
      duration: '25:10',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-[#FFF8F6] min-h-screen">
      <div className="w-full bg-[#FFF0ED] py-3 border-b border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex items-center gap-2 text-xs text-[#584141]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#570013] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#765B00]">home</span>
            <span>{t('nav.home')}</span>
          </button>
          <span className="text-[#E0BFBF]">/</span>
          <span className="text-[#570013] font-semibold">
            {loc(
              'Sacred Resources (Pothis, Audio & Panchang)',
              'साहित्य, पोथी व नित्य पंचांग',
              'साहित्य, पोथी एवं नित्य पंचांग',
              'સાહિત્ય, પોથી અને નિત્ય પંચાંગ'
            )}
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-12 space-y-10">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
            {loc(
              'Public Knowledge Repository',
              'सार्वजनिक ज्ञान भांडार',
              'सार्वजनिक ज्ञान भंडार',
              'સાર્વજનિક જ્ઞાન ભંડાર'
            )}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Vedic Pothis, Audio Masters & Daily Panchang',
              'अस्सल वैदिक पोथी, ध्वनीमुद्रण व पंचांग',
              'प्रामाणिक वैदिक पोथी, ध्वनिमुद्रण एवं पंचांग',
              'પ્રમાણિક વૈદિક પોથી, ધ્વનિમુદ્રણ અને પંચાંગ'
            )}
          </h1>
          <p className="text-sm text-[#584141]">
            {loc(
              'Freely accessible sacred resources preserved from authentic palm manuscripts and recorded by traditional master scholars.',
              'पारंपरिक हस्तलिखितांवर आधारित आणि अधिकारसंपन्न गुरुमुखातून ध्वनीमुद्रित केलेले विनामूल्य वेद साहित्य.',
              'पारंपरिक पांडुलिपियों पर आधारित तथा प्रामाणिक विद्वानों द्वारा ध्वन्यांकित निःशुल्क वेद साहित्य।',
              'પરંપરાગત હસ્તપ્રતો પર આધારિત અને અધિકૃત ગુરુમુખથી રેકોર્ડ થયેલું વિનામૂલ્યે વેદ સાહિત્ય.'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#E0BFBF]/40 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('panchang')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'panchang'
                ? 'bg-[#570013] text-white shadow-xs'
                : 'text-[#584141] hover:bg-[#FFF0ED]'
            }`}
          >
            {loc('Daily Panchang & Muhurtas', 'दैनिक पंचांग व शुभ मुहूर्त', 'दैनिक पंचांग एवं शुभ मुहूर्त', 'દૈનિક પંચાંગ અને શુભ મુહૂર્ત')}
          </button>
          <button
            onClick={() => setActiveTab('pothi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pothi'
                ? 'bg-[#570013] text-white shadow-xs'
                : 'text-[#584141] hover:bg-[#FFF0ED]'
            }`}
          >
            {loc('Pothi & Manuscript Downloads', 'सस्वर पोथी व हस्तलिखित', 'सस्वर पोथी एवं पांडुलिपि', 'સસ્વર પોથી અને હસ્તપ્રત')}
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#570013] text-white shadow-xs'
                : 'text-[#584141] hover:bg-[#FFF0ED]'
            }`}
          >
            {loc('Vedic Audio Chants', 'वैदिक ध्वनीमुद्रण', 'वैदिक ध्वनिमुद्रण', 'વૈદિક ધ્વનિમુદ્રણ')}
          </button>
        </div>

        {/* Tab 1: Daily Panchang */}
        {activeTab === 'panchang' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E0BFBF]/30">
              <div>
                <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
                  {loc(
                    'Lahiri Ayanamsha Approved • Chitra Paksha',
                    'लाहिडी अयनांश संमत • चित्रा पक्ष',
                    'लाहिड़ी अयनांश सम्मत • चित्रा पक्ष',
                    'લાહિડી અયનાંશ સંમત • ચિત્રા પક્ષ'
                  )}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#570013] mt-0.5">
                  {loc(
                    'Jyeshtha Shukla Dashami • Somavara (Soma Pradosha)',
                    'ज्येष्ठ शुक्ल दशमी • सोमवासर (सोमप्रदोष)',
                    'ज्येष्ठ शुक्ल दशमी • सोमवासर (सोमप्रदोष)',
                    'જ્યેષ્ઠ શુક્લ દશમી • સોમવાર (સોમપ્રદોષ)'
                  )}
                </h3>
              </div>
              <span className="px-3 py-1 bg-[#FFD979]/40 text-[#795D00] text-xs font-bold rounded-full w-fit">
                {loc(
                  'Sunrise: 05:56 AM • Sunset: 07:08 PM',
                  'सूर्योदय: ०५:५६ AM • सूर्यास्त: ०७:०८ PM',
                  'सूर्योदय: 05:56 AM • सूर्यास्त: 07:08 PM',
                  'સૂર્યોદય: ૦૫:૫૬ AM • સૂર્યાસ્ત: ૦૭:૦૮ PM'
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30 space-y-1">
                <span className="text-[11px] text-[#584141] uppercase">{loc('Tithi', 'तिथी', 'तिथि', 'તિથિ')}</span>
                <span className="font-serif text-base font-bold text-[#570013] block">
                  {loc('Shukla Dashami', 'शुक्ल दशमी', 'शुक्ल दशमी', 'શુક્લ દશમી')}
                </span>
                <span className="text-xs text-[#584141]">
                  {loc(
                    'Till 02:14 PM, followed by Ekadashi',
                    'दुपारी ०२:१४ पर्यंत, तदनंतर एकादशी',
                    'अपराह्न 02:14 तक, तदुपरांत एकादशी',
                    'બપોરે ૦૨:૧૪ સુધી, ત્યારબાદ એકાદશી'
                  )}
                </span>
              </div>

              <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30 space-y-1">
                <span className="text-[11px] text-[#584141] uppercase">{loc('Nakshatra', 'नक्षत्र', 'नक्षत्र', 'નક્ષત્ર')}</span>
                <span className="font-serif text-base font-bold text-[#570013] block">
                  {loc('Hasta Nakshatra', 'हस्त नक्षत्र', 'हस्त नक्षत्र', 'હસ્ત નક્ષત્ર')}
                </span>
                <span className="text-xs text-[#584141]">
                  {loc(
                    'Till 08:40 PM, followed by Chitra',
                    'रात्री ०८:४० पर्यंत, तदनंतर चित्रा',
                    'रात्रि 08:40 तक, तदुपरांत चित्रा',
                    'રાત્રે ૦૮:૪૦ સુધી, ત્યારબાદ ચિત્રા'
                  )}
                </span>
              </div>

              <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30 space-y-1">
                <span className="text-[11px] text-[#584141] uppercase">{loc('Yoga & Karana', 'योग व करण', 'योग एवं करण', 'યોગ અને કરણ')}</span>
                <span className="font-serif text-base font-bold text-[#570013] block">
                  {loc('Siddhi Yoga', 'सिद्धि योग', 'सिद्धि योग', 'સિદ્ધિ યોગ')}
                </span>
                <span className="text-xs text-[#584141]">
                  {loc('Karana: Gara • Anandadi: Chhatra', 'करण: गर • आनंदादि योग: छत्र', 'करण: गर • आनंदादि योग: छत्र', 'કરણ: ગર • આનંદાદિ યોગ: છત્ર')}
                </span>
              </div>

              <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30 space-y-1">
                <span className="text-[11px] text-[#584141] uppercase">{loc('Moon Sign', 'चंद्र राशी', 'चन्द्र राशि', 'ચંદ્ર રાશિ')}</span>
                <span className="font-serif text-base font-bold text-[#570013] block">
                  {loc('Virgo (Kanya)', 'कन्या रास', 'कन्या राशि', 'કન્યા રાશિ')}
                </span>
                <span className="text-xs text-[#584141]">
                  {loc('Rashi Lord: Mercury (Budha)', 'राशी स्वामी: बुध ग्रह', 'राशि स्वामी: बुध ग्रह', 'રાશિ સ્વામી: બુધ ગ્રહ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FCEAE6] border border-[#E0BFBF]/40 space-y-2">
                <span className="text-xs font-bold text-[#570013] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#765B00] text-[16px]">check_circle</span>
                  <span>{loc('Auspicious Muhurtas', 'शुभ मुहूर्त', 'शुभ मुहूर्त', 'શુભ મુહૂર્ત')}</span>
                </span>
                <div className="text-xs text-[#584141] space-y-1">
                  <div className="flex justify-between">
                    <span>{loc('Abhijit Muhurta:', 'अभिजीत मुहूर्त:', 'अभिजीत मुहूर्त:', 'અભિજીત મુહૂર્ત:')}</span>
                    <strong className="text-[#221918]">{formatPanchangTime('12:02 PM – 12:54 PM')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc('Amrit Kala:', 'अमृत काळ:', 'अमृत काल:', 'અમૃત કાળ:')}</span>
                    <strong className="text-[#221918]">{formatPanchangTime('02:30 PM – 04:15 PM')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc('Brahma Muhurta:', 'ब्रह्म मुहूर्त:', 'ब्रह्म मुहूर्त:', 'બ્રહ્મ મુહૂર્ત:')}</span>
                    <strong className="text-[#221918]">{formatPanchangTime('04:25 AM – 05:10 AM')}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/40 space-y-2">
                <span className="text-xs font-bold text-[#BA1A1A] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#BA1A1A] text-[16px]">block</span>
                  <span>{loc('Inauspicious Periods (Avoid Major Undertakings)', 'अशुभ काळ (महत्त्वाची कार्ये टाळा)', 'अशुभ काल (महत्वपूर्ण कार्य टालें)', 'અશુભ કાળ (મહત્વપૂર્ણ કાર્યો ટાળો)')}</span>
                </span>
                <div className="text-xs text-[#584141] space-y-1">
                  <div className="flex justify-between">
                    <span>{loc('Rahu Kala:', 'राहू काळ:', 'राहु काल:', 'રાહુ કાળ:')}</span>
                    <strong className="text-[#BA1A1A]">{formatPanchangTime('07:30 AM – 09:08 AM')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc('Yamaganda:', 'यमगंड:', 'यमगंड:', 'યમગંડ:')}</span>
                    <strong className="text-[#BA1A1A]">{formatPanchangTime('10:45 AM – 12:22 PM')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{loc('Gulika Kala:', 'गुलिक काळ:', 'गुलिक काल:', 'ગુલિક કાળ:')}</span>
                    <strong className="text-[#584141]">{formatPanchangTime('01:59 PM – 03:36 PM')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pothi Downloads */}
        {activeTab === 'pothi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pothiDownloads.map((pothi, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-[#FFDADA] text-[#570013] px-2 py-0.5 rounded font-bold uppercase">
                    {pothi.shakha}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#570013]">{pothi.title}</h3>
                  <p className="text-xs text-[#584141]">{pothi.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E0BFBF]/30">
                  <span className="text-xs text-[#765B00] font-semibold">{formatLocalizedNumber(pothi.format, language)}</span>
                  <button
                    onClick={() =>
                      showToast(
                        loc(
                          `Download started: ${pothi.title}`,
                          `डाउनलोड सुरू झाले: ${pothi.title}`,
                          `डाउनलोड प्रारंभ हुआ: ${pothi.title}`,
                          `ડાઉનલોડ શરૂ થયું: ${pothi.title}`
                        ),
                        'info'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>{loc('Download PDF', 'PDF डाउनलोड', 'PDF डाउनलोड', 'PDF ડાઉનલોડ')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Audio Chants */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioChants.map((audio, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow-xs border border-[#E0BFBF]/40 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0ED] text-[#570013] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">graphic_eq</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#570013]">{audio.title}</h3>
                    <p className="text-xs text-[#584141]">{audio.reciter}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#765B00] font-mono">{formatLocalizedNumber(audio.duration, language)}</span>
                  <button
                    onClick={() => onNavigate('gurukul-agni-sukta')}
                    className="p-2 rounded-full bg-[#570013] text-white hover:bg-[#800020] transition-colors cursor-pointer"
                    title={loc('Play in recitation console', 'स्वाध्याय कक्षात ऐका', 'स्वाध्याय कक्ष में सुनें', 'સ્વાધ્યાય કક્ષમાં સાંભળો')}
                  >
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
