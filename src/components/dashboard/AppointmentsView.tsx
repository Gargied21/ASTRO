import React from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AppointmentsViewProps {
  onNavigatePublic: (path: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ onNavigatePublic }) => {
  const { consultation, showToast } = useDevotee();
  const { t, loc } = useLanguage();

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
            {loc(
              'My Scheduled Consultations & Appointments',
              'माझ्या नियोजित अपॉइंटमेंट्स',
              'मेरी निर्धारित अपॉइंटमेंट्स',
              'મારી નિર્ધારિત એપોઇન્ટમેન્ટ્સ'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141]">
            {loc(
              'Details of your astrology consultations, muhurta deliberations, and ritual coordination.',
              'ज्योतिषीय मार्गदर्शन, मुहूर्त निश्चिती व पूजा नियोजन सत्रांचे तपशील.',
              'ज्योतिषीय परामर्श, मुहूर्त निर्धारण एवं पूजा नियोजन सत्रों का विवरण।',
              'જ્યોતિષીય પરામર્શ, મુહૂર્ત નિર્ધારણ અને પૂજા આયોજન સત્રોની વિગતો.'
            )}
          </p>
        </div>

        <button
          onClick={() => onNavigatePublic('book-appointment')}
          className="px-4 py-2.5 rounded-xl bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>+ {t('bookAppointment')}</span>
        </button>
      </div>

      {/* Confirmed Active Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#765B00] animate-pulse"></span>
            <span className="text-xs font-bold text-[#765B00]">
              {loc(
                'Upcoming Confirmed Session',
                'पुढील निश्चित सत्र',
                'आगामी निश्चित सत्र',
                'આગામી નિશ્ચિત સત્ર'
              )}
            </span>
          </div>
          <span className="font-mono text-xs text-[#584141]">{consultation.id}</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqBoNe284pPDGZptxHjiY2YqjFnHWCk4n78DlFNs1FRoDvIKHHVjjmhOx-oXo1OwKc46AtIoWl6A55f5zgiDKS-5Lj3pZqEg09XUIFdp_Kpvu1H2E-prbWfydWNumkqemfsUDBp06kPL0o1clUKepUj4ylJMKzXt-7Id3RKEN6rO3EPzoMW8jQ1UCO1Dy0-OpYJdqgdRnUozHBo8ZZQDpGE5GFrQ__QtFU_QkXHMBUAGzilwuqjNy_dA"
              alt={loc('Pt. Vishnupant Shastri', 'पं. पु. विष्णुपंत शास्त्री', 'पं. पु. विष्णुपंत शास्त्री', 'પં. પૂ. વિષ્ણુપંત શાસ્ત્રી')}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#765B00] shrink-0"
            />
            <div>
              <span className="font-serif text-base font-bold text-[#570013] block">
                {loc(
                  'Pt. Pu. Vishnupant Shastri (Jyotishratna)',
                  'दैवज्ञ पं. पु. विष्णुपंत शास्त्री (ज्योतिषरत्न)',
                  'दैवज्ञ पं. पू. विष्णुपंत शास्त्री (ज्योतिषरत्न)',
                  'દૈવજ્ઞ પં. પૂ. વિષ્ણુપંત શાસ્ત્રી (જ્યોતિષરત્ન)'
                )}
              </span>
              <span className="text-xs text-[#584141] block">
                {loc(
                  'Chief Acharya, Rigveda Vibhag',
                  'मुख्य आचार्य, ऋग्वेद विभाग',
                  'मुख्य आचार्य, ऋग्वेद विभाग',
                  'મુખ્ય આચાર્ય, ઋગ્વેદ વિભાગ'
                )}
              </span>
              <span className="text-xs text-[#765B00] font-semibold mt-0.5 block">
                {loc('Subject:', 'विषय:', 'विषय:', 'વિષય:')}{' '}
                {loc(
                  'Career, Business Expansion & Vimshottari Dasha Analysis',
                  'करिअर, उद्योग विस्तार व विंशोत्तरी दशा फलादेश',
                  'करियर, व्यापार विस्तार एवं विंशोत्तरी दशा फलादेश',
                  'કારકિર્દી, વેપાર વિસ્તરણ અને વિંશોત્તરી દશા ફળાદેશ'
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#221918]">
              <span className="material-symbols-outlined text-[#570013] text-base">event</span>
              <span>
                {loc(
                  'Tomorrow, 21 May 2024 • 11:30 AM',
                  'उद्या, २१ मे २०२४ • ११:३० AM',
                  'कल, 21 मई 2024 • 11:30 AM',
                  'આવતીકાલે, ૨૧ મે ૨૦૨૪ • ૧૧:૩૦ AM'
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#584141]">
              <span className="material-symbols-outlined text-[#765B00] text-base">location_on</span>
              <span>
                {loc(
                  'Ved Mandir Complex, Paud Road, Pune Ashram',
                  'वेद भवन, पौड रोड, पुणे आश्रम (कक्ष ३)',
                  'वेद भवन, पौड रोड, पुणे आश्रम (कक्ष 3)',
                  'વેદ ભવન, પૌડ રોડ, પુણે આશ્રમ (કક્ષ ૩)'
                )}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD979]/40 text-[#795D00] text-[11px] font-bold mt-1">
              {loc('Confirmed & Verified', 'आरक्षित व निश्चित', 'आरक्षित एवं सत्यापित', 'આરક્ષિત અને ચકાસાયેલ')}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E0BFBF]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#584141]">
            {loc(
              'Need to reschedule? Ashram Liaison:',
              'काही बदल करायचे असल्यास आश्रम समन्वयक:',
              'पुनर्निर्धारण के लिए आश्रम समन्वयक:',
              'ફેરફાર માટે આશ્રમ સંયોજક:'
            )}{' '}
            <a href="tel:+919822054321" className="text-[#570013] font-bold font-mono">
              +91 98220 54321
            </a>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                showToast(
                  loc(
                    'Directions sent to your phone via SMS & WhatsApp',
                    'पत्ता व नकाशा आपल्या फोनवर पाठवला आहे.',
                    'पता एवं मार्ग आपके फोन पर भेज दिया गया है।',
                    'સરનામું અને નકશો આપના ફોન પર મોકલવામાં આવ્યો છે.'
                  ),
                  'info'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#221918] font-semibold hover:bg-[#FCEAE6] transition-colors cursor-pointer"
            >
              {loc('Ashram Directions', 'आश्रम नकाशा व मार्ग', 'आश्रम मार्ग एवं नक्शा', 'આશ્રમ માર્ગ અને નકશો')}
            </button>
            <button
              onClick={() =>
                showToast(
                  loc(
                    'Opening questions list...',
                    'प्रश्न सूची उघडली जात आहे...',
                    'प्रश्नावली खोली जा रही है...',
                    'પ્રશ્નાવલી ખોલવામાં આવી રહી છે...'
                  ),
                  'info'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-[#570013] text-white font-bold hover:bg-[#800020] transition-colors cursor-pointer"
            >
              {loc('My Questions', 'माझे प्रश्न', 'मेरे प्रश्न', 'મારા પ્રશ્નો')}
            </button>
          </div>
        </div>
      </div>

      {/* Past Completed Consultations */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
        <h2 className="font-serif text-base font-bold text-[#570013]">
          {loc(
            'Past Consultations & Remedies History',
            'मागील पूर्ण झालेली सत्रे व उपाय इतिहास',
            'विगत परामर्श एवं उपाय इतिहास',
            'પાછલા પરામર્શ અને ઉપાય ઇતિહાસ'
          )}
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-[#FFF0ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E0BFBF]/30">
            <div>
              <span className="font-bold text-[#221918] block text-sm">
                {loc(
                  'Griha Vastu Shanti Consult & Janmapatrika Examination',
                  'गृह वास्तुशांती मुहूर्त व जन्मपत्रिका वेध',
                  'गृह वास्तुशांति मुहूर्त एवं जन्मपत्रिका परीक्षण',
                  'ગૃહ વાસ્તુશાંતિ મુહૂર્ત અને જન્મપત્રિકા પરીક્ષણ'
                )}
              </span>
              <span className="text-[#584141]">
                {loc(
                  '10 Jan 2024 • Pt. Vishnupant Shastri • Mode: Ashram Consultation',
                  '१० जानेवारी २०२४ • पं. पु. विष्णुपंत शास्त्री • थेट आश्रम परामर्श',
                  '10 जनवरी 2024 • पं. पु. विष्णुपंत शास्त्री • प्रत्यक्ष आश्रम परामर्श',
                  '૧૦ જાન્યુઆરી ૨૦૨૪ • પં. પૂ. વિષ્ણુપંત શાસ્ત્રી • પ્રત્યક્ષ આશ્રમ પરામર્શ'
                )}
              </span>
            </div>
            <button
              onClick={() =>
                showToast(
                  loc(
                    'Downloading remedy notes PDF...',
                    'सल्ला नोंद पीडीएफ डाउनलोड केली जात आहे.',
                    'उपाय निर्देश पीडीएफ डाउनलोड हो रहा है...',
                    'ઉપાય નોંધ પીડીએફ ડાઉનલોડ થઈ રહી છે...'
                  ),
                  'info'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E0BFBF]/40 text-[#570013] font-bold hover:bg-[#FFDADA] transition-colors self-start sm:self-auto cursor-pointer"
            >
              {loc('Remedy Notes PDF', 'सल्ला नोंद (PDF)', 'उपाय विवरण (PDF)', 'ઉપાય નોંધ (PDF)')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
