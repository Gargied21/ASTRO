import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AboutViewProps {
  onNavigate: (path: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const { language, t, loc } = useLanguage();

  return (
    <div className="flex flex-col w-full bg-[#FFF8F6] min-h-screen">
      {/* Breadcrumb */}
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
          <span className="text-[#570013] font-semibold">{t('nav.about')}</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-12 space-y-12">
        {/* Header Block */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FFD979]/40 text-[#795D00] text-xs font-bold uppercase tracking-wider">
            <span className="notranslate">॥ धर्मो रक्षति रक्षितः ॥</span> • {loc('35+ Years of Service', '३५+ वर्षे अविरत सेवा', '35+ वर्ष निरंतर सेवा', '૩૫+ વર્ષ નિરંતર સેવા')}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Chaitanya Ved Pratishthan — Heritage & Mission',
              'चैतन्य वेद प्रतिष्ठान — संस्था इतिहास व उद्दिष्टे',
              'चैतन्य वेद प्रतिष्ठान — संस्था इतिहास एवं उद्देश्य',
              'ચૈતન્ય વેદ પ્રતિષ્ઠાન — સંસ્થા ઇતિહાસ અને ઉદ્દેશ્યો'
            )}
          </h1>
          <p className="text-base text-[#584141] leading-relaxed">
            {loc(
              'Founded in Pune under the Bombay Public Trusts Act, 1950 (Regn. No. F/49210/Pune), Chaitanya Ved Pratishthan is dedicated to preserving the pristine oral transmission of the Four Vedas, advancing authentic Jyotish Shastra research, and maintaining a non-commercial, austere Gurukul environment.',
              'मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अंतर्गत (नोंदणी क्र. F/49210/पुणे) स्थापित, चैतन्य वेद प्रतिष्ठान चारही वेदांची मूळ श्रुतीपरंपरा संवर्धन, शास्त्रशुद्ध फलज्योतिष संशोधन आणि निःस्वार्थ गुरुकुल संकुल चालवण्यासाठी समर्पित आहे.',
              'मुंबई सार्वजनिक न्यास अधिनियम 1950 के अधीन (पंजीकरण सं. F/49210/पुणे) स्थापित, चैतन्य वेद प्रतिष्ठान चारों वेदों की मौलिक श्रुति परंपरा के संरक्षण, प्रामाणिक ज्योतिष शोध एवं निःस्वार्थ गुरुकुल संचालन हेतु समर्पित है।',
              'મુંબઈ જાહેર ટ્રસ્ટ અધિનિયમ ૧૯૫૦ હેઠળ (નોંધણી નં. F/49210/પુણે) સ્થાપિત, ચૈતન્ય વેદ પ્રતિષ્ઠાન ચારેય વેદોની મૌલિક શ્રુતિ પરંપરાના સંરક્ષણ, શાસ્ત્રોક્ત જ્યોતિષ સંશોધન અને નિઃસ્વાર્થ ગુરુકુળ સંચાલન માટે સમર્પિત છે.'
            )}
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFDADA] text-[#570013] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#570013]">
              {loc('Vedic Oral Lineage', 'वैदिक श्रुती परंपरा', 'वैदिक श्रुति परंपरा', 'વૈદિક શ્રુતિ પરંપરા')}
            </h3>
            <p className="text-xs text-[#584141] leading-relaxed">
              {loc(
                'Preserving the unbroken oral recitations of Shakala Rigveda and Madhyandina Shukla Yajurveda. Over 48 full-time students study tuition-free at our Ved Bhavan campus.',
                'शाकल ऋग्वेद व माध्यंदिन शुक्ल यजुर्वेदाचे सस्वर पाठांतर. ४८ हून अधिक पूर्णवेळ बटू आमच्या वेदभवन संकुलात निःशुल्क शिक्षण घेतात.',
                'शाकल ऋग्वेद एवं माध्यंदिन शुक्ल यजुर्वेद का सस्वर पाठ संरक्षण। 48 से अधिक पूर्णकालिक विद्यार्थी वेद भवन में निःशुल्क अध्ययनरत हैं।',
                'શાકલ ઋગ્વેદ અને માધ્યંદિન શુક્લ યજુર્વેદનું સસ્વર પાઠ સંરક્ષણ. ૪૮ થી વધુ પૂર્ણકાલીન વિદ્યાર્થીઓ વેદ ભવનમાં વિનામૂલ્યે અભ્યાસ કરે છે.'
              )}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFDF94] text-[#795D00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#570013]">
              {loc('Shastric Astronomy & Jyotish', 'शास्त्रशुद्ध फलज्योतिष व खगोल', 'शास्त्रशुद्ध फलज्योतिष एवं खगोल', 'શાસ્ત્રશુદ્ધ ફળજ્યોતિષ અને ખગોળ')}
            </h3>
            <p className="text-xs text-[#584141] leading-relaxed">
              {loc(
                'Anchored in Brihat Parashara Hora Shastra, Jaimini, and Surya Siddhanta mathematics. Consultations provide objective life discernment free from exploitative gemstone sales.',
                'बृहत् पराशर होरा शास्त्र, जैमिनी सूत्र व सूर्यसिद्धांत गणितावर आधारित. कोणत्याही अनावश्यक खड्यांच्या विक्रीविना केवळ स्पष्ट ग्रहमार्गदर्शन.',
                'बृहत् पाराशर होरा शास्त्र, जैमिनी सूत्र एवं सूर्यसिद्धान्त गणित पर आधारित। किसी भी भ्रामक रत्न-बिक्री के बिना केवल प्रामाणिक मार्गदर्शन।',
                'બૃહત્ પારાશર હોરા શાસ્ત્ર, જૈમિની સૂત્ર અને સૂર્યસિદ્ધાંત ગણિત પર આધારિત. કોઈ પણ અનાવશ્યક રત્ન વેચાણ વગર માત્ર સ્પષ્ટ માર્ગદર્શન.'
              )}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0ED] text-[#570013] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined">volunteer_activism</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#570013]">
              {loc('100% Tax Deductible 80G Seva', '१००% करसवलत ८०-जी सेवा', '100% कर-मुक्त 80G सेवा', '૧૦૦% કરમુક્ત 80G સેવા')}
            </h3>
            <p className="text-xs text-[#584141] leading-relaxed">
              {loc(
                'Recognized under Section 80G(5)(vi) of the Income Tax Act, 1961 (CBDT Approval #AAATC49210F20214). All contributions provide direct educational support to young Brahmacharis.',
                'आयकर कायदा १९६१ च्या कलम ८०-जी अंतर्गत मान्यताप्राप्त (CBDT Approval #AAATC49210F20214). सर्व समर्पण थेट वेद बटूंच्या शिक्षण व पोषणासाठी उपयोगात आणले जाते.',
                'आयकर अधिनियम 1961 की धारा 80G(5)(vi) के तहत मान्यता प्राप्त। सभी दान सीधे वेद विद्यार्थियों की शिक्षा एवं पोषण हेतु प्रयुक्त होते हैं।',
                'આવકવેરા કાયદા ૧૯૬૧ ની કલમ 80G હેઠળ માન્યતા પ્રાપ્ત. તમામ દાન સીધું વેદ વિદ્યાર્થીઓના શિક્ષણ અને પોષણ માટે વપરાય છે.'
              )}
            </p>
          </div>
        </div>

        {/* Acharya Council */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
              {loc('Scholarly Advisory Council', 'विद्वत्परिषद • सल्लागार मंडळ', 'विद्वत्परिषद • परामर्शदाता मंडल', 'વિદ્વત્પરિષદ • સલાહકાર મંડળ')}
            </span>
            <h2 className="font-serif text-2xl text-[#570013] font-bold">
              {loc('Our Senior Acharyas & Trustees', 'आमचे ज्येष्ठ आचार्य व विश्वस्त', 'हमारे वरिष्ठ आचार्य एवं न्यासी', 'અમારા વરિષ્ઠ આચાર્યો અને ટ્રસ્ટીઓ')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border border-[#E0BFBF]/40 shadow-xs flex items-start gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr8sUQmJU_ddYYDQH_FMwyANmppwuhlKmDsC5agsgu5KLGBNnUEFsVOF6m15896lNDYI-WoYxiQUZMAZoOsET-3jNqm5ya9xYYvno9QMEb0YtSqayVEXsdRFxneOxrarysM1PGql_ztJhegdgmB91BGP6qVO85cdueBUI2WlMdx2bT445bfplMTx06IH5xwtN-JQqBknbNd6eoI5dLvQ7AtBOIItTrgpB8d-5-qsTL_jfw6eenEEBLIQ"
                alt="Acharya Shripad Bhat"
                className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#E0BFBF]"
              />
              <div className="flex flex-col min-w-0">
                <h4 className="font-serif text-sm font-bold text-[#570013]">
                  {loc('V. M. Dr. Shripad Bhat', 'वे. मू. डॉ. श्रीपाद भट', 'वे. मू. डॉ. श्रीपाद भट', 'વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ')}
                </h4>
                <span className="text-xs text-[#765B00] font-semibold">
                  {loc('Rigveda Ghanapathi & Vice Chancellor', 'ऋग्वेद घनापाठी व मुख्य कुलगुरू', 'ऋग्वेद घनापाठी एवं कुलपति', 'ઋગ્વેદ ઘનાપાઠી અને મુખ્ય કુલપતિ')}
                </span>
                <p className="text-[11px] text-[#584141] mt-1">
                  {loc(
                    '35 years of unremitting pedagogy, Pune University Gold Medalist, expert in Vedic Pratishakhya.',
                    '३५ वर्षे अविरत अध्यापन, पुणे विद्यापीठ सुवर्णपदक, वैदिक प्रातिशाख्य तज्ञ.',
                    '35 वर्षों का निरंतर अध्यापन, पुणे विश्वविद्यालय स्वर्ण पदक विजेता, वैदिक प्रातिशाख्य विशेषज्ञ।',
                    '૩૫ વર્ષનું અવિરત અધ્યાપન, પુણે યુનિવર્સિટી સુવર્ણચંદ્રક વિજેતા, વૈદિક પ્રાતિશાખ્ય નિષ્ણાત.'
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#E0BFBF]/40 shadow-xs flex items-start gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqBoNe284pPDGZptxHjiY2YqjFnHWCk4n78DlFNs1FRoDvIKHHVjjmhOx-oXo1OwKc46AtIoWl6A55f5zgiDKS-5Lj3pZqEg09XUIFdp_Kpvu1H2E-prbWfydWNumkqemfsUDBp06kPL0o1clUKepUj4ylJMKzXt-7Id3RKEN6rO3EPzoMW8jQ1UCO1Dy0-OpYJdqgdRnUozHBo8ZZQDpGE5GFrQ__QtFU_QkXHMBUAGzilwuqjNy_dA"
                alt="Pt. Vishnupant Shastri"
                className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#E0BFBF]"
              />
              <div className="flex flex-col min-w-0">
                <h4 className="font-serif text-sm font-bold text-[#570013]">
                  {loc('Daivajna Pt. Vishnupant Shastri', 'दैवज्ञ पं. पु. विष्णुपंत शास्त्री', 'दैवज्ञ पं. पु. विष्णुपंत शास्त्री', 'દૈવજ્ઞ પં. પુ. વિષ્ણુપંત શાસ્ત્રી')}
                </h4>
                <span className="text-xs text-[#765B00] font-semibold">
                  {loc('Astrologer & Muhurta Specialist', 'फलज्योतिष व मुहूर्त विशारद', 'फलज्योतिष एवं मुहूर्त विशारद', 'ફળજ્યોતિષ અને મુહૂર્ત વિશારદ')}
                </span>
                <p className="text-[11px] text-[#584141] mt-1">
                  {loc(
                    '32 years of astrological counsel and Prashna Shastra discernment, honored by Kashi Vidyapeeth.',
                    '३२ वर्षे फलज्योतिष व प्रश्नशास्त्र अनुभव, काशी विद्यापीठ सन्मानित.',
                    '32 वर्षों का फलज्योतिष एवं प्रश्नशास्त्र अनुभव, काशी विद्यापीठ से सम्मानित।',
                    '૩૨ વર્ષનો ફળજ્યોતિષ અને પ્રશ્નશાસ્ત્ર અનુભવ, કાશી વિદ્યાપીઠ દ્વારા સન્માનિત.'
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#E0BFBF]/40 shadow-xs flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold font-serif text-lg shrink-0">
                {loc('P', 'पं', 'पं', 'પં')}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-serif text-sm font-bold text-[#570013]">
                  {loc('Pt. Vinayak Dixit', 'पं. विनायक दीक्षित', 'पं. विनायक दीक्षित', 'પં. વિનાયક દીક્ષિત')}
                </h4>
                <span className="text-xs text-[#765B00] font-semibold">
                  {loc('Ashram & Yajna Coordinator', 'आश्रम व यज्ञाश्रम समन्वयक', 'आश्रम एवं यज्ञाश्रम समन्वयक', 'આશ્રમ અને યજ્ઞાશ્રમ સંયોજક')}
                </span>
                <p className="text-[11px] text-[#584141] mt-1">
                  {loc(
                    'Head of ceremonial arrangements, gotra samkalpas, and international devotee coordination.',
                    'यज्ञ साहित्य, गोत्र संकल्प व देश-विदेशातील यजमान समन्वय प्रमुख.',
                    'यज्ञ सामग्री, गोत्र संकल्प एवं देश-विदेश के यजमानों के समन्वय प्रमुख।',
                    'યજ્ઞ સામગ્રી, ગોત્ર સંકલ્પ અને દેશ-વિદેશના યજમાનોના સંકલન પ્રમુખ.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Trust Registration Badge */}
        <div className="p-8 rounded-2xl bg-[#FFF0ED] border border-[#E0BFBF]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-[#570013]">
              {loc(
                'Visit Ved Bhavan Campus (Pune Ashram Visit)',
                'पुणे आश्रम भेट (वेदभवन संकुल)',
                'पुणे आश्रम दर्शन (वेदभवन परिसर)',
                'પુણે આશ્રમ દર્શન (વેદભવન પરિસર)'
              )}
            </h3>
            <p className="text-sm text-[#584141]">
              {loc(
                'Maharshi Vidya Nagar, Paud Road, Pune 411038. Open daily for darshan, consultations, and library access.',
                'महर्षी विद्या नगर, पौड रोड, पुणे ४११०३८. दर्शन, ज्योतिष सल्ला व ग्रंथालयासाठी दररोज खुले.',
                'महर्षि विद्या नगर, पौड रोड, पुणे 411038। दर्शन, ज्योतिष परामर्श एवं ग्रंथालय हेतु नित्य खुला।',
                'મહર્ષિ વિદ્યા નગર, પૌડ રોડ, પુણે ૪૧૧૦૩૮. દર્શન, જ્યોતિષ પરામર્શ અને ગ્રંથાલય માટે નિત્ય ખુલ્લું.'
              )}
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shrink-0 shadow-md cursor-pointer"
          >
            {loc('Get Location & Directions', 'स्थान व मार्गदर्शक नकाशा', 'स्थान एवं मार्गदर्शिका', 'સ્થાન અને માર્ગદર્શિકા')}
          </button>
        </div>
      </div>
    </div>
  );
};
