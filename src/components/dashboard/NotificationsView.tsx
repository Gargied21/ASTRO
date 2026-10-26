import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface NotificationsViewProps {
  onNavigateModule: (module: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateModule }) => {
  const { showToast } = useDevotee();
  const { loc } = useLanguage();

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      titleEn: 'Live Yajna Broadcast Active Now',
      titleMr: 'थेट यज्ञानुष्ठान सत्र चालू आहे',
      titleHi: 'प्रत्यक्ष यज्ञ अनुष्ठान सत्र प्रारंभ है',
      titleGu: 'પ્રત્યક્ષ યજ્ઞ અનુષ્ઠાન સત્ર શરૂ છે',
      timeEn: '10 mins ago',
      timeMr: '१० मिनिटांपूर्वी',
      timeHi: '10 मिनट पूर्व',
      timeGu: '૧૦ મિનિટ પહેલાં',
      messageEn: 'Maha Mrityunjaya Anushthan: Chapter 8 Samputa Swahakar session streaming live. 18 Yajmans connected.',
      messageMr: 'महामृत्युंजय अनुष्ठान: अष्टम अध्याय संपुट स्वाहाकार सत्र थेट प्रक्षेपण सुरू आहे. १८ यजमान जोडले आहेत.',
      messageHi: 'महामृत्युंजय अनुष्ठान: आठवां अध्याय संपुट स्वाहाकार सत्र प्रत्यक्ष प्रसारित हो रहा है। 18 यजमान जुड़े हैं।',
      messageGu: 'મહામૃત્યુંજય અનુષ્ઠાન: આઠમો અધ્યાય સંપુટ સ્વાહાકાર સત્રનું જીવંત પ્રસારણ ચાલુ છે. ૧૮ યજમાનો જોડાયેલા છે.',
      unread: true,
      actionModule: 'rituals',
      actionTextEn: 'Join Live Yajna Stream',
      actionTextMr: 'थेट प्रवाहात सामील व्हा',
      actionTextHi: 'प्रत्यक्ष प्रसारण में जुड़ें',
      actionTextGu: 'જીવંત પ્રસારણમાં જોડાઓ',
      icon: 'local_fire_department',
    },
    {
      id: 'n2',
      titleEn: 'Astrology Session Confirmed for Tomorrow',
      titleMr: 'उद्याचा ज्योतिष परामर्श निश्चित',
      titleHi: 'कल का ज्योतिष परामर्श सुनिश्चित',
      titleGu: 'આવતીકાલનું જ્યોતિષ પરામર્શ સુનિશ્ચિત',
      timeEn: '2 hours ago',
      timeMr: '२ तासांपूर्वी',
      timeHi: '2 घंटे पूर्व',
      timeGu: '૨ કલાક પહેલાં',
      messageEn: 'Session scheduled tomorrow at 11:30 AM IST with Pt. Vishnupant Shastri. Pre-questionnaire reviewed.',
      messageMr: 'दैवज्ञ पं. विष्णुपंत शास्त्री यांच्यासोबत उद्या सकाळी ११:३० वाजता आपले सत्र नियोजित आहे. पूर्व-प्रश्नावली तपासली गेली आहे.',
      messageHi: 'ज्योतिषाचार्य पं. विष्णुपंत शास्त्री जी के साथ कल प्रातः 11:30 बजे आपका सत्र निर्धारित है। पूर्व-प्रश्नावली जांची गई है।',
      messageGu: 'જ્યોતિષાચાર્ય પં. વિષ્ણુપંત શાસ્ત્રી સાથે આવતીકાલે સવારે ૧૧:૩૦ વાગ્યે આપનું સત્ર નિર્ધારિત છે. પૂર્વ-પ્રશ્નાવલી ચકાસવામાં આવી છે.',
      unread: true,
      actionModule: 'astrology',
      actionTextEn: 'View Consultation Room',
      actionTextMr: 'परामर्श कक्ष पहा',
      actionTextHi: 'परामर्श कक्ष देखें',
      actionTextGu: 'પરામર્શ કક્ષ જુઓ',
      icon: 'auto_awesome',
    },
    {
      id: 'n3',
      titleEn: 'Sacred Raksha Sutra & Bhasma Consignment Dispatched',
      titleMr: 'अभिमंत्रित रक्षा सूत्र व भस्म प्रसाद रवाना',
      titleHi: 'अभिमंत्रित रक्षा सूत्र एवं भस्म प्रसाद प्रेषित',
      titleGu: 'અભિમંત્રિત રક્ષા સૂત્ર અને ભસ્મ પ્રસાદ રવાના',
      timeEn: 'Yesterday',
      timeMr: 'काल दुपारी',
      timeHi: 'कल दोपहर',
      timeGu: 'ગઈકાલે બપોરે',
      messageEn: 'Consignment IP784920412IN handed over to India Speed Post. Expected delivery today by 3 PM.',
      messageMr: 'स्पीड पोस्ट ट्रॅकिंग क्र. IP784920412IN द्वारे महाप्रसाद पाठवला आहे. आज दुपारी ३ वाजेपर्यंत वितरण अपेक्षित.',
      messageHi: 'स्पीड पोस्ट ट्रैकिंग क्र. IP784920412IN द्वारा महाप्रसाद प्रेषित किया गया है। आज दोपहर 3 बजे तक वितरण अपेक्षित।',
      messageGu: 'સ્પીડ પોસ્ટ ટ્રેકિંગ નં. IP784920412IN દ્વારા મહાપ્રસાદ મોકલવામાં આવ્યો છે. આજે બપોરે ૩ વાગ્યા સુધીમાં પહોંચવાની અપેક્ષા.',
      unread: false,
      actionModule: 'rituals',
      actionTextEn: 'Track Postal Consignment',
      actionTextMr: 'टपाल ट्रॅक करा',
      actionTextHi: 'डाक ट्रैक करें',
      actionTextGu: 'ટપાલ ટ્રેક કરો',
      icon: 'local_shipping',
    },
    {
      id: 'n4',
      titleEn: 'FY 2024-25 Form 10BE Annual Certificate Generated',
      titleMr: 'आर्थिक वर्ष २०२४-२५ Form 10BE प्रमाणपत्र तयार',
      titleHi: 'वित्तीय वर्ष 2024-25 फॉर्म 10BE वार्षिक प्रमाणपत्र तैयार',
      titleGu: 'નાણાકીય વર્ષ ૨૦૨૪-૨૫ ફોર્મ 10BE વાર્ષિક પ્રમાણપત્ર તૈયાર',
      timeEn: '2 days ago',
      timeMr: '२ दिवसांपूर्वी',
      timeHi: '2 दिन पूर्व',
      timeGu: '૨ દિવસ પહેલાં',
      messageEn: 'Your 80G tax deduction annual certificate is ready for download with IT Dept ARN: 2425-CVPT-9981-BE.',
      messageMr: 'आपले वार्षिक ८०-जी आयकर करसवलत Form 10BE प्रमाणपत्र संच तयार आहे (ARN: 2425-CVPT-9981-BE).',
      messageHi: 'आपका वार्षिक 80G आयकर छूट फॉर्म 10BE प्रमाणपत्र संच तैयार है (ARN: 2425-CVPT-9981-BE)।',
      messageGu: 'આપનું વાર્ષિક ૮૦-જી આવકવેરા કરમુક્તિ ફોર્મ 10BE પ્રમાણપત્ર તૈયાર છે (ARN: 2425-CVPT-9981-BE).',
      unread: false,
      actionModule: 'donations',
      actionTextEn: 'Download Form 10BE',
      actionTextMr: '८०-जी संच पहा',
      actionTextHi: 'फॉर्म 10BE डाउनलोड करें',
      actionTextGu: 'ફોર્મ 10BE ડાઉનલોડ કરો',
      icon: 'receipt_long',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast(
      loc(
        'All notifications marked as read',
        'सर्व सूचना वाचल्या म्हणून चिन्हांकित केल्या',
        'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं',
        'બધી સૂચનાઓ વંચાઈ ગઈ તરીકે ચિહ્નિત કરી'
      ),
      'info'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
            {loc(
              'Devotee Sanctum Notifications & Alerts',
              'सूचना व संदेश',
              'भक्त सूचनाएं एवं संदेश',
              'ભક્ત સૂચનાઓ અને સંદેશાઓ'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141]">
            {loc(
              'Live ritual broadcasts, upcoming consultations, and tax receipt alerts.',
              'यज्ञ सत्रे, परामर्श वेळा, आणि पावती संदर्भातील थेट संदेश.',
              'यज्ञ सत्र, परामर्श समय एवं रसीद संबंधी प्रत्यक्ष संदेश।',
              'યજ્ઞ સત્રો, પરામર્શ સમય અને પાવતી સંબંધિત જીવંત સંદેશાઓ.'
            )}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#570013] hover:underline cursor-pointer self-start sm:self-auto"
        >
          {loc('Mark all as read', 'सर्व वाचले म्हणून चिन्हांकित करा', 'सभी पढ़ी हुई चिह्नित करें', 'બધું વંચાઈ ગયું તરીકે ચિહ્નિત કરો')}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              n.unread
                ? 'bg-white border-[#765B00]/40 shadow-xs'
                : 'bg-[#FFF0ED]/60 border-[#E0BFBF]/30 opacity-90'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  n.unread ? 'bg-[#570013] text-white' : 'bg-[#FFF0ED] text-[#765B00]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{n.icon}</span>
              </div>
              <div className="flex flex-col min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#221918]">
                    {loc(n.titleEn, n.titleMr, n.titleHi, n.titleGu)}
                  </span>
                  {n.unread && (
                    <span className="px-1.5 py-0.5 rounded bg-[#BA1A1A] text-white text-[10px] font-bold">
                      {loc('NEW', 'नवीन', 'नया', 'નવું')}
                    </span>
                  )}
                  <span className="text-[11px] text-[#584141] opacity-75">
                    • {loc(n.timeEn, n.timeMr, n.timeHi, n.timeGu)}
                  </span>
                </div>
                <p className="text-xs text-[#584141] leading-relaxed">
                  {loc(n.messageEn, n.messageMr, n.messageHi, n.messageGu)}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateModule(n.actionModule)}
              className="px-3.5 py-2 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
            >
              {loc(n.actionTextEn, n.actionTextMr, n.actionTextHi, n.actionTextGu)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
