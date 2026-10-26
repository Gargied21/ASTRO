import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { Language } from '../../types/index.ts';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, loc } = useLanguage();
  const { showToast } = useDevotee();
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [panchangReminders, setPanchangReminders] = useState(true);

  const handleSaveSettings = () => {
    showToast(
      loc(
        'Preferences saved successfully',
        'सेटिंग्ज यशस्वीरित्या जतन केल्या',
        'प्राथमिकताएं सफलतापूर्वक सहेजी गईं',
        'પસંદગીઓ સફળતાપૂર્વક સાચવવામાં આવી'
      ),
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="space-y-1 pb-2">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
          {loc(
            'Settings & Devotee Preferences',
            'सेटिंग्ज व प्राधान्ये',
            'सेटिंग्स एवं प्राथमिकताएं',
            'સેટિંગ્સ અને પસંદગીઓ'
          )}
        </h1>
        <p className="text-xs sm:text-sm text-[#584141]">
          {loc(
            'Language, communication channels, security, and sanctum privacy controls.',
            'भाषा, सूचना प्राधान्ये, सुरक्षा व गोपनीयता नियंत्रणे.',
            'भाषा, सूचना प्राथमिकताएं, सुरक्षा एवं गोपनीयता नियंत्रण।',
            'ભાષા, સૂચના પસંદગીઓ, સુરક્ષા અને ગોપનીયતા નિયંત્રણો.'
          )}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xs border border-[#E0BFBF]/40 space-y-6 max-w-2xl">
        {/* Language setting */}
        <div className="space-y-3 pb-4 border-b border-[#E0BFBF]/30">
          <h3 className="font-serif text-base font-bold text-[#570013] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#765B00]">language</span>
            <span>{loc('Interface Language', 'इंटरफेस भाषा', 'इंटरफ़ेस भाषा', 'ઇન્ટરફેસ ભાષા')}</span>
          </h3>
          <p className="text-xs text-[#584141]">
            {loc(
              'Choose your preferred language for the public website and devotee sanctum.',
              'वेबसाइट आणि भक्त कक्ष कोणत्या भाषेत दिसावा ते निवडा.',
              'वेबसाइट एवं भक्त कक्ष हेतु अपनी पसंदीदा भाषा चुनें।',
              'વેબસાઇટ અને ભક્ત કક્ષ માટે આપની પસંદગીની ભાષા પસંદ કરો.'
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'mr', label: 'मराठी' },
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी' },
              { id: 'gu', label: 'ગુજરાતી' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id as Language)}
                className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                  language === item.id
                    ? 'bg-[#570013] text-white border-transparent shadow-xs'
                    : 'bg-[#FFF0ED] text-[#221918] border-[#E0BFBF]/40 hover:bg-[#FCEAE6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-4 pb-4 border-b border-[#E0BFBF]/30">
          <h3 className="font-serif text-base font-bold text-[#570013] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#765B00]">notifications</span>
            <span>{loc('Alert & Notification Channels', 'सूचना व संदेश प्राधान्ये', 'सूचना एवं संदेश प्राथमिकताएं', 'સૂચના અને સંદેશ પસંદગીઓ')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0ED] cursor-pointer">
              <div>
                <span className="font-bold text-[#221918] block">
                  {loc('Direct WhatsApp Alerts', 'WhatsApp थेट सूचना', 'व्हाट्सएप प्रत्यक्ष सूचनाएं', 'વોટ્સએપ સીધી સૂચનાઓ')}
                </span>
                <span className="text-[#584141]">
                  {loc(
                    'Live broadcast start alerts and postal prasad delivery tracking updates.',
                    'यज्ञ थेट प्रक्षेपण सुरू होताच आणि स्पीड पोस्ट प्रसादाची स्थिती.',
                    'यज्ञ सीधा प्रसारण प्रारंभ एवं डाक प्रसाद वितरण स्थिति।',
                    'યજ્ઞ લાઇવ પ્રસારણ શરૂ થતાં અને ટપાલ પ્રસાદ વિતરણ સ્થિતિ.'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#570013] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0ED] cursor-pointer">
              <div>
                <span className="font-bold text-[#221918] block">
                  {loc('Email Receipts & Monthly Digest', 'ईमेल पावती व मासिक अहवाल', 'ईमेल रसीद एवं मासिक विवरण', 'ઇમેઇલ પાવતી અને માસિક અહેવાલ')}
                </span>
                <span className="text-[#584141]">
                  {loc(
                    'Instant 80G tax exemption receipts and annual Form 10BE filing statements.',
                    '८०-जी धर्मदाय पावत्या आणि वार्षिक Form 10BE अधिसूचना.',
                    '80G आयकर छूट रसीदें एवं वार्षिक Form 10BE अधिसूचना।',
                    '૮૦G આવકવેરા મુક્તિ પાવતીઓ અને વાર્ષિક Form 10BE અધિસૂચના.'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="w-4 h-4 accent-[#570013] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FFF0ED] cursor-pointer">
              <div>
                <span className="font-bold text-[#221918] block">
                  {loc('Panchang & Sacred Vrata Reminders', 'पंचांग व एकादशी आठवण', 'पंचांग एवं एकादशी स्मरण', 'પંચાંગ અને એકાદશી સ્મરણ')}
                </span>
                <span className="text-[#584141]">
                  {loc(
                    'Advance reminders for major Ekadashis, Sankashti Chaturthi, and auspicious Muhurtas.',
                    'महत्त्वाच्या तिथी व संकष्टी चतुर्थीच्या आधी पूर्वसूचना.',
                    'प्रमुख एकादशी, संकष्टी चतुर्थी एवं शुभ मुहूर्तों की पूर्व सूचना।',
                    'મુખ્ય એકાદશી, સંકષ્ટી ચતુર્થી અને શુભ મુહૂર્તોની પૂર્વ સૂચના.'
                  )}
                </span>
              </div>
              <input
                type="checkbox"
                checked={panchangReminders}
                onChange={(e) => setPanchangReminders(e.target.checked)}
                className="w-4 h-4 accent-[#570013] rounded"
              />
            </label>
          </div>
        </div>

        {/* Security & Encryption Notice */}
        <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 space-y-1 text-xs">
          <span className="font-bold text-[#570013] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#765B00]">security</span>
            <span>{loc('256-Bit Encrypted Vedic Privacy Guarantee', '२५६-बिट सुरक्षित वैदिक गोपनीयता हमी', '256-बिट सुरक्षित वैदिक गोपनीयता आश्वासन', '૨૫૬-બિટ સુરક્ષિત વૈદિક ગોપનીયતા ગેરંટી')}</span>
          </span>
          <p className="text-[#584141] leading-relaxed">
            {loc(
              'Your personal gotra lineage, horoscopic charts, and financial transactions are encrypted under Indian Public Trust compliance and never shared with third parties.',
              'आपली संपर्क माहिती, जन्मपत्रिका व वित्तीय तपशील केंद्रीय सार्वजनिक विश्वस्त नियमांनुसार सुरक्षित असून ते त्रयस्थ व्यक्तीशी सामायिक केले जात नाहीत.',
              'आपकी संपर्क जानकारी, जन्मपत्रिका एवं वित्तीय विवरण केंद्रीय धर्मार्थ न्यास नियमों के अंतर्गत पूर्णतः सुरक्षित हैं और कभी किसी तीसरे पक्ष से साझा नहीं किए जाते।',
              'આપની સંપર્ક માહિતી, જન્મકુંડળી અને નાણાકીય વિગતો કેન્દ્રીય ધર્માદા ટ્રસ્ટ નિયમો અનુસાર સંપૂર્ણ સુરક્ષિત છે અને ક્યારેય ત્રીજા પક્ષ સાથે શેર કરવામાં આવતી નથી.'
            )}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs cursor-pointer"
          >
            {loc('Save Preferences', 'बदल जतन करा', 'प्राथमिकताएं सहेजें', 'પસંદગીઓ સાચવો')}
          </button>
        </div>
      </div>
    </div>
  );
};
