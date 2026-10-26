import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../api/client.ts';

interface AppointmentsViewProps {
  onNavigatePublic: (path: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ onNavigatePublic }) => {
  const { consultation, showToast } = useDevotee();
  const { t, loc } = useLanguage();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.appointments.getMy()
      .then((res) => {
        if (isMounted && res.success) {
          setAppointments(res.data || []);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch appointments:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const hasSessions = !!consultation || appointments.length > 0;

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

      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E0BFBF]/40">
          <div className="w-8 h-8 border-2 border-[#570013] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-[#584141]">{loc('Loading appointments...', 'अपॉइंटमेंट्स लोड होत आहेत...', 'अपॉइंटमेंट्स लोड हो रहे हैं...', 'એપોઇન્ટમેન્ટ્સ લોડ થઈ રહી છે...')}</p>
        </div>
      ) : !hasSessions ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#E0BFBF]/40 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF0ED] text-[#570013] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">event_busy</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-[#570013]">
            {loc('No Appointments Scheduled Yet', 'सध्या कोणतीही अपॉइंटमेंट निश्चित केलेली नाही', 'अभी कोई अपॉइंटमेंट निर्धारित नहीं है', 'હજુ સુધી કોઈ એપોઇન્ટમેન્ટ નિર્ધારિત નથી')}
          </h3>
          <p className="text-xs text-[#584141] max-w-md mx-auto leading-relaxed">
            {loc(
              'Schedule a Vedic Jyotish consultation, Pooja planning session, or Vastu deliberation with our learned Purohits.',
              'आमच्या दैवज्ञ आचार्यांसोबत ज्योतिष मार्गदर्शन, पूजा नियोजन किंवा वास्तु संवादासाठी अपॉइंटमेंट बुक करा.',
              'हमारे दैवज्ञ आचार्यों के साथ ज्योतिष परामर्श, पूजा योजना अथवा वास्तु संवाद हेतु अपॉइंटमेंट बुक करें।',
              'અમારા દૈવજ્ઞ આચાર્યો સાથે જ્યોતિષ પરામર્શ, પૂજા આયોજન અથવા વાસ્તુ સંવાદ માટે એપોઇન્ટમેન્ટ બુક કરો.'
            )}
          </p>
          <button
            onClick={() => onNavigatePublic('book-appointment')}
            className="px-5 py-2.5 rounded-xl bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>{loc('Book Your First Appointment', 'पहिली अपॉइंटमेंट बुक करा', 'पहली अपॉइंटमेंट बुक करें', 'પ્રથમ એપોઇન્ટમેન્ટ બુક કરો')}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Confirmed Consultation Card if present */}
          {consultation && (
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
                    alt={consultation.acharyName || 'Pt. Vishnupant Shastri'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#765B00] shrink-0"
                  />
                  <div>
                    <span className="font-serif text-base font-bold text-[#570013] block">
                      {consultation.acharyName || loc(
                        'Pt. Pu. Vishnupant Shastri (Jyotishratna)',
                        'दैवज्ञ पं. पु. विष्णुपंत शास्त्री (ज्योतिषरत्न)',
                        'दैवज्ञ पं. पू. विष्णुपंत शास्त्री (ज्योतिषरत्न)',
                        'દૈવજ્ઞ પં. પૂ. વિષ્ણુપંત શાસ્ત્રી (જ્યોતિષરત્ન)'
                      )}
                    </span>
                    <span className="text-xs text-[#584141] block">
                      {consultation.experience || loc(
                        'Chief Acharya, Rigveda Vibhag',
                        'मुख्य आचार्य, ऋग्वेद विभाग',
                        'मुख्य आचार्य, ऋग्वेद विभाग',
                        'મુખ્ય આચાર્ય, ઋગ્વેદ વિભાગ'
                      )}
                    </span>
                    <span className="text-xs text-[#765B00] font-semibold mt-0.5 block">
                      {loc('Subject:', 'विषय:', 'विषय:', 'વિષય:')} {consultation.subject || 'Vedic Jyotish & Janmapatrika Examination'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#221918]">
                    <span className="material-symbols-outlined text-[#570013] text-base">event</span>
                    <span>{consultation.date} • {consultation.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#584141]">
                    <span className="material-symbols-outlined text-[#765B00] text-base">location_on</span>
                    <span>{consultation.mode} • {consultation.location}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFD979]/40 text-[#795D00] text-[11px] font-bold mt-1">
                    {loc('Confirmed & Verified', 'आरक्षित व निश्चित', 'आरक्षित एवं सत्यापित', 'આરક્ષિત અને ચકાસાયેલ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User Booked Appointments from DB */}
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]"></span>
                  <span className="text-xs font-bold text-[#1B5E20] uppercase">
                    {apt.status === 'confirmed' ? loc('Confirmed Slot', 'निश्चित वेळ', 'सुनिश्चित स्लॉट', 'નિશ્ચિત સ્લોટ') : apt.status}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#584141] font-bold">{apt.id}</span>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#570013]">{apt.serviceName}</h3>
                  <p className="text-xs text-[#584141] mt-0.5">
                    {loc('Domain:', 'विभाग:', 'विभाग:', 'વિભાગ:')} <span className="font-semibold capitalize">{apt.serviceDomain}</span> • {loc('Devotee:', 'यजमान:', 'यजमान:', 'યજમાન:')} {apt.name}
                  </p>
                  {apt.notes && (
                    <p className="text-xs text-[#765B00] italic mt-1 bg-[#FFF0ED] px-2.5 py-1 rounded-lg inline-block">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#221918]">
                    <span className="material-symbols-outlined text-[#570013] text-base">event</span>
                    <span>{apt.slotDate} • {apt.slotTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#584141]">
                    <span className="material-symbols-outlined text-[#765B00] text-base">video_camera_front</span>
                    <span>{apt.consultationMode === 'in-person' ? loc('In-Person Ashram Visit', 'थेट आश्रम भेट', 'प्रत्यक्ष आश्रम भेट', 'રૂબરૂ આશ્રમ મુલાકાત') : loc('Online Video Consultation', 'ऑनलाइन व्हिडिओ सत्र', 'ऑनलाइन वीडियो सत्र', 'ઓનલાઇન વિડિયો સત્ર')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E0BFBF]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#584141]">
                  {loc('Helpline Desk:', 'समन्वयक कक्ष:', 'समन्वयक कक्ष:', 'સંયોજક કક્ષ:')} <span className="font-mono text-[#570013] font-bold">+91 98220 54321</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      showToast(
                        loc(
                          `Appointment slip ${apt.id} details dispatched to ${apt.phone}`,
                          `अपॉइंटमेंट पावती ${apt.id} चा तपशील ${apt.phone} वर पाठवला आहे.`,
                          `अपॉइंटमेंट रसीद ${apt.id} का विवरण ${apt.phone} पर भेजा गया।`,
                          `એપોઇન્ટમેન્ટ પાવતી ${apt.id} ની વિગતો ${apt.phone} પર મોકલાઈ છે.`
                        ),
                        'info'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#FFF0ED] text-[#221918] font-semibold hover:bg-[#FCEAE6] transition-colors cursor-pointer"
                  >
                    {loc('SMS / Slip Details', 'पावती तपशील', 'रसीद विवरण', 'પાવતી વિગત')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
