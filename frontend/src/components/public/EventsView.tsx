import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { api } from '../../api/client.ts';

interface EventsViewProps {
  onNavigate: (path: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ onNavigate }) => {
  const { showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null);
  const [devoteeName, setDevoteeName] = useState('');
  const [devoteePhone, setDevoteePhone] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remoteEvents, setRemoteEvents] = useState<any[] | null>(null);

  useEffect(() => {
    api.events
      .getAll()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setRemoteEvents(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const defaultEvents = [
    {
      id: 'event-1',
      dateDay: loc('04', '०४', '04', '૦૪'),
      dateMonth: loc('June', 'जून', 'जून', 'જૂન'),
      title: loc(
        'Nirjala Ekadashi Collective Vishnu Sahasranama Chanting',
        'निर्जला एकादशी सामूहिक विष्णुसहस्रनाम पारायण',
        'निर्जला एकादशी सामूहिक विष्णुसहस्रनाम पारायण',
        'નિર્જળા એકાદશી સામૂહિક વિષ્ણુસહસ્રનામ પારાયણ'
      ),
      time: loc(
        '05:30 PM to 08:00 PM IST',
        'सायंकाळी ०५:३० ते ०८:०० IST',
        'सायं 05:30 से 08:00 IST',
        'સાંજે ૦૫:૩૦ થી ૦૮:૦૦ IST'
      ),
      location: loc(
        'Main Yajnashala Auditorium, Veda Bhavan, Pune',
        'यज्ञाश्रम मुख्य सभागृह, वेद भवन, पुणे',
        'यज्ञाश्रम मुख्य सभागार, वेद भवन, पुणे',
        'યજ્ઞાશ્રમ મુખ્ય સભાગૃહ, વેદ ભવન, પુણે'
      ),
      category: loc(
        'Collective Japa & Recitation',
        'सामूहिक जप व पारायण',
        'सामूहिक जप एवं पारायण',
        'સામૂહિક જપ અને પારાયણ'
      ),
      status: loc('Passes Available', 'प्रवेशिका उपलब्ध', 'प्रवेशिका उपलब्ध', 'પ્રવેશિકા ઉપલબ્ધ'),
      desc: loc(
        '1001 devotees gather for synchronized chanting of Sri Vishnu Sahasranama Stotram with Tulsi leaves and sacred Theertha prasad distribution.',
        '१००१ भक्त एकत्र बसून भगवान विष्णूच्या सहस्र नामांचा सस्वर उच्चार करतील. तुळशीपत्र व तीर्थप्रसाद वाटप.',
        '1001 भक्त एकत्र होकर भगवान विष्णु के सहस्त्र नामों का सस्वर पाठ करेंगे। तुलसीदल एवं तीर्थप्रसाद वितरण।',
        '૧૦૦૧ ભક્તો સાથે મળીને ભગવાન વિષ્ણુના સહસ્ર નામોનો સસ્વર પાઠ કરશે. તુલસીપત્ર અને તીર્થપ્રસાદ વિતરણ.'
      ),
    },
    {
      id: 'event-2',
      dateDay: loc('21', '२१', '21', '૨૧'),
      dateMonth: loc('June', 'जून', 'जून', 'જૂન'),
      title: loc(
        'Surya Sankranti Maha Rudrabhishek & Saura Homa',
        'सूर्य संक्रांति महा रुद्राभिषेक व सौर होम',
        'सूर्य संक्रांति महा रुद्राभिषेक एवं सौर होम',
        'સૂર્ય સંક્રાંતિ મહા રુદ્રાભિષેક અને સૌર હોમ'
      ),
      time: loc(
        '07:00 AM to 10:30 AM IST',
        'सकाळी ०७:०० ते १०:३० IST',
        'प्रातः 07:00 से 10:30 IST',
        'સવારે ૦૭:૦૦ થી ૧૦:૩૦ IST'
      ),
      location: loc(
        'Ashram Courtyard • Global Live Stream (1080p)',
        'आश्रम प्रांगण • थेट प्रक्षेपण उपलब्ध (1080p)',
        'आश्रम प्रांगण • लाइव प्रसारण उपलब्ध (1080p)',
        'આશ્રમ પરિસર • લાઇવ પ્રસારણ ઉપલબ્ધ (1080p)'
      ),
      category: loc(
        'Maha Yajna & Homa',
        'महायज्ञ व होम',
        'महायज्ञ एवं होम',
        'મહાયજ્ઞ અને હોમ'
      ),
      status: loc('Live Stream & In-person', 'प्रत्यक्ष व थेट प्रक्षेपण', 'प्रत्यक्ष एवं ऑनलाइन', 'પ્રત્યક્ષ અને ઑનલાઇન'),
      desc: loc(
        'Special Aditya Hridaya Stotra Rudrabhishek on solar ingress for vitality, health, and spiritual radiance.',
        'सूर्य ग्रहाच्या संक्रमण दिनी आरोग्य व तेज वृद्धीसाठी विशेष आदित्यहृदय स्तोत्र संपुटित रुद्राभिषेक.',
        'सूर्य संक्रमण दिवस पर स्वास्थ्य एवं तेज वृद्धि हेतु विशेष आदित्यहृदय स्तोत्र सम्पुटित रुद्राभिषेक।',
        'સૂર્ય સંક્રમણ દિને આરોગ્ય અને તેજ વૃદ્ધિ માટે વિશેષ આદિત્યહૃદય સ્તોત્ર સંપુટિત રુદ્રાભિષેક.'
      ),
    },
    {
      id: 'event-3',
      dateDay: loc('06', '०६', '06', '૦૬'),
      dateMonth: loc('July', 'जुलै', 'जुलाई', 'જુલાઈ'),
      title: loc(
        'Ashadh Ekadashi Pandharpur Wari Mahaprasad & Kirtan',
        'आषाढ शुद्ध एकादशी पंढरपूर वारी महाप्रसाद व कीर्तन',
        'आषाढ़ शुक्ल एकादशी पंढरपुर वारी महाप्रसाद एवं कीर्तन',
        'અષાઢ શુદ્ધ એકાદશી પંઢરપુર વારી મહાપ્રસાદ અને કીર્તન'
      ),
      time: loc(
        '12:00 PM to 04:00 PM IST',
        'दुपारी १२:०० ते ०४:०० IST',
        'दोपहर 12:00 से 04:00 IST',
        'બપોરે ૧૨:૦૦ થી ૦૪:૦૦ IST'
      ),
      location: loc(
        'Annakshetra Hall, Paud Road Complex',
        'अन्नछत्र सभागृह, पौड रोड संकुल',
        'अन्नक्षेत्र सभागार, पौड रोड संकुल',
        'અન્નક્ષેત્ર સભાગૃહ, પૌડ રોડ પરિસર'
      ),
      category: loc(
        'Annadanam & Discourses',
        'अन्नदान व कीर्तन',
        'अन्नदान एवं कीर्तन',
        'અન્નદાન અને કીર્તન'
      ),
      status: loc('Open to All', 'सर्वांसाठी खुले', 'सभी के लिए खुला', 'બધા માટે ખુલ્લું'),
      desc: loc(
        'Free satvik feast for visiting pilgrims and devotional discourses by senior scholarly Haridases.',
        'वारकरी भक्तांसाठी मोफत सात्त्विक भोजन व्यवस्था व ज्येष्ठ कीर्तनकारांचे शास्त्रोक्त प्रवचन.',
        'श्रद्धालु भक्तों हेतु निःशुल्क सात्त्विक भोजन व्यवस्था एवं वरिष्ठ विद्वानों का प्रवचन।',
        'યાત્રાળુ ભક્તો માટે વિનામૂલ્યે સાત્ત્વિક ભોજન વ્યવસ્થા અને વરિષ્ઠ વિદ્વાનોનું શાસ્ત્રોક્ત પ્રવચન.'
      ),
    },
    {
      id: 'event-4',
      dateDay: loc('04', '०४', '04', '૦૪'),
      dateMonth: loc('August', 'ऑगस्ट', 'अगस्त', 'ઓગસ્ટ'),
      title: loc(
        'Shravan Somvar Maharudra Abhishek Series',
        'श्रावण सोमवार महारुद्र अभिषेक अनुष्ठान',
        'श्रावण सोमवार महारुद्र अभिषेक अनुष्ठान',
        'શ્રાવણ સોમવાર મહારુદ્ર અભિષેક અનુષ્ઠાન'
      ),
      time: loc(
        '06:00 AM to 01:00 PM IST',
        'सकाळी ०६:०० ते दुपारी ०१:०० IST',
        'प्रातः 06:00 से दोपहर 01:00 IST',
        'સવારે ૦૬:૦૦ થી બપોરે ૦૧:૦૦ IST'
      ),
      location: loc(
        'Veda Mandir Shiva Sanctum',
        'वेदमंदिर शिव गर्भगृह',
        'वेदमंदिर शिव गर्भगृह',
        'વેદમંદિર શિવ ગર્ભગૃહ'
      ),
      category: loc(
        'Shravan Special',
        'श्रावण विशेष',
        'श्रावण विशेष',
        'શ્રાવણ વિશેષ'
      ),
      status: loc(
        'Sankalpa Booking Open',
        'संकल्प नोंदणी सुरू',
        'संकल्प पंजीकरण खुला',
        'સંકલ્પ નોંધણી શરૂ'
      ),
      desc: loc(
        'First Shravan Somvar with 11,000 Bilva leaves and Panchamrit offerings in an austere Vedic setting.',
        'श्रावणातील पहिल्या सोमवारी ११००० बिल्वपत्र व पंचामृत अभिषेकासह महारुद्र महायज्ञ संपन्न होईल.',
        'श्रावण के प्रथम सोमवार को 11000 बिल्वपत्र एवं पंचामृत अभिषेक सहित महारुद्र महायज्ञ संपन्न होगा।',
        'શ્રાવણના પ્રથમ સોમવારે ૧૧૦૦૦ બિલીપત્ર અને પંચામૃત અભિષેક સાથે મહારુદ્ર મહાયજ્ઞ સંપન્ન થશે.'
      ),
    },
  ];

  const events = remoteEvents && remoteEvents.length > 0 && language === 'en' ? remoteEvents : defaultEvents;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);
    try {
      const res = await api.events.register(selectedEvent.id, {
        name: devoteeName,
        phone: devoteePhone,
        attendees: attendeeCount,
      });
      if (res.success) {
        showToast(
          loc(
            `Your E-Pass for (${selectedEvent.title}) has been successfully reserved! Confirmation: ${res.data?.passNumber || 'EPASS-CONFIRMED'}`,
            `आपला ई-पास (${selectedEvent.title}) साठी यशस्वीरित्या आरक्षित झाला आहे! क्रमांक: ${res.data?.passNumber || 'EPASS-CONFIRMED'}`,
            `आपका ई-पास (${selectedEvent.title}) हेतु सफलतापूर्वक आरक्षित हो गया है! क्रमांक: ${res.data?.passNumber || 'EPASS-CONFIRMED'}`,
            `તમારો ઈ-પાસ (${selectedEvent.title}) માટે સફળતાપૂર્વક આરક્ષિત થયો છે! ક્રમાંક: ${res.data?.passNumber || 'EPASS-CONFIRMED'}`
          ),
          'success'
        );
        setSelectedEvent(null);
        setDevoteeName('');
        setDevoteePhone('');
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error reserving pass', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              'Events & Satsang Calendar',
              'आश्रम उपक्रम व दिनदर्शिका',
              'आश्रम कार्यक्रम एवं पंचांग',
              'આશ્રમ કાર્યક્રમો અને પંચાંગ'
            )}
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-12 space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
            {loc(
              'Satsang & Spiritual Calendar 2025',
              'सत्संग व आध्यात्मिक दिनदर्शिका २०२५',
              'सत्संग एवं आध्यात्मिक कैलेंडर 2025',
              'સત્સંગ અને આધ્યાત્મિક કેલેન્ડર ૨૦૨૫'
            )}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Upcoming Ashram Events & Religious Gatherings',
              'आगामी धार्मिक उपक्रम व व्याख्यानमाला',
              'आगामी धार्मिक कार्यक्रम एवं व्याख्यानमाला',
              'આગામી ધાર્મિક કાર્યક્રમો અને વ્યાખ્યાનમાળા'
            )}
          </h1>
          <p className="text-sm text-[#584141]">
            {loc(
              'Participate in communal Vedic chanting, sacred Ekadashi observances, and philosophical discourses at our Pune campus or through global live broadcasts.',
              'सामूहिक वेदमंत्रोच्चार, पवित्र एकादशी अनुष्ठान आणि तात्त्विक व्याख्यानांमध्ये प्रत्यक्ष अथवा थेट प्रक्षेपणाद्वारे सहभागी व्हा.',
              'सामूहिक वेदमंत्रोच्चार, पवित्र एकादशी अनुष्ठान एवं दार्शनिक प्रवचनों में प्रत्यक्ष अथवा ऑनलाइन सम्मिलित हों।',
              'સામૂહિક વેદમંત્રોચ્ચાર, પવિત્ર એકાદશી અનુષ્ઠાન અને તાત્ત્વિક પ્રવચનોમાં પ્રત્યક્ષ અથવા ઑનલાઇન સહભાગી બનો.'
            )}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl p-6 shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#570013] text-white shrink-0 shadow-xs">
                      <span className="font-serif text-xl font-bold leading-none">{ev.dateDay}</span>
                      <span className="text-[11px] font-semibold opacity-90 mt-1">{ev.dateMonth}</span>
                    </div>
                    <div>
                      <span className="text-[11px] bg-[#FFD979]/40 text-[#795D00] px-2 py-0.5 rounded font-bold">
                        {ev.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#570013] mt-1 leading-snug">
                        {ev.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#584141] leading-relaxed">
                  {ev.desc}
                </p>

                <div className="bg-[#FFF0ED] p-3 rounded-lg text-xs text-[#584141] space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-[#765B00]">schedule</span>
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#765B00]">location_on</span>
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E0BFBF]/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#765B00]">{ev.status}</span>
                <button
                  type="button"
                  onClick={() => setSelectedEvent({ id: ev.id, title: ev.title })}
                  className="px-4 py-2 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
                  <span>{loc('Reserve E-Pass', 'ई-पास आरक्षित करा', 'ई-पास आरक्षित करें', 'ઈ-પાસ આરક્ષિત કરો')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={loc('Event Pass Registration', 'कार्यक्रम प्रवेशिका नोंदणी', 'कार्यक्रम प्रवेशिका पंजीकरण', 'કાર્યક્રમ પ્રવેશિકા નોંધણી')}
        subtitle={selectedEvent?.title || ''}
        maxWidth="md"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {loc('Devotee Full Name *', 'भक्ताचे संपूर्ण नाव *', 'भक्त का पूरा नाम *', 'ભક્તનું પૂરું નામ *')}
            </label>
            <input
              type="text"
              required
              value={devoteeName}
              onChange={(e) => setDevoteeName(e.target.value)}
              placeholder={loc('e.g. Rahul Kulkarni', 'उदा. श्री राहुल कुलकर्णी', 'उदा. श्री राहुल कुलकर्णी', 'દા.ત. શ્રી રાહુલ કુલકર્ણી')}
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {loc('WhatsApp Mobile Number *', 'व्हॉट्सॲप मोबाइल क्रमांक *', 'व्हाट्सएप मोबाइल नंबर *', 'વ્હોટ્સએપ મોબાઈલ નંબર *')}
            </label>
            <input
              type="tel"
              required
              value={devoteePhone}
              onChange={(e) => setDevoteePhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {loc('Number of Attendees', 'उपस्थित व्यक्ती संख्या', 'उपस्थित व्यक्तियों की संख्या', 'ઉપસ્થિત વ્યક્તિઓની સંખ્યા')}
            </label>
            <select
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
            >
              <option value={1}>{loc('1 Person (Individual)', '१ व्यक्ती (वैयक्तिक)', '1 व्यक्ति (व्यक्तिगत)', '૧ વ્યક્તિ (વ્યક્તિગત)')}</option>
              <option value={2}>{loc('2 Persons (Couple)', '२ व्यक्ती (दाम्पत्य)', '2 व्यक्ति (दम्पति)', '૨ વ્યક્તિ (દંપતી)')}</option>
              <option value={4}>{loc('4 Persons (Family Pass)', '४ व्यक्ती (कौटुंबिक)', '4 व्यक्ति (पारिवारिक)', '૪ વ્યક્તિ (કૌટુંબિક)')}</option>
              <option value={6}>{loc('6 Persons (Group)', '६ व्यक्ती (गट)', '6 व्यक्ति (समूह)', '૬ વ્યક્તિ (સમૂહ)')}</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold hover:bg-[#FCEAE6]"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg text-white text-xs font-bold shadow-xs transition-colors ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#570013] hover:bg-[#800020]'
              }`}
            >
              {isSubmitting
                ? loc('Processing...', 'नोंदणी सुरू आहे...', 'प्रक्रिया जारी है...', 'પ્રક્રિયા ચાલુ છે...')
                : loc('Confirm Pass', 'ई-पास निश्चित करा', 'ई-पास निश्चित करें', 'ઈ-પાસ નિશ્ચિત કરો')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
