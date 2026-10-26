import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../api/client.ts';

interface ContactViewProps {
  onNavigate: (path: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('pooja');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast(
        loc(
          'Please fill all required fields.',
          'कृपया सर्व आवश्यक माहिती भरा.',
          'कृपया सभी आवश्यक जानकारी भरें।',
          'કૃપા કરીને બધી જરૂરી માહિતી ભરો.'
        ),
        'error'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await api.contact.submit({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject,
        message: message.trim(),
      });
      showToast(
        loc(
          'Your inquiry has been received by the Ashram coordination desk. We will contact you within 24 hours.',
          'आपला संदेश आश्रम समन्वय कक्षाला प्राप्त झाला आहे. आम्ही २४ तासांत संपर्क करू.',
          'आपका संदेश आश्रम समन्वय कक्ष को प्राप्त हो गया है। हम 24 घंटों में संपर्क करेंगे।',
          'તમારો સંદેશ આશ્રમ સંકલન કક્ષને મળ્યો છે. અમે ૨૪ કલાકમાં સંપર્ક કરીશું.'
        ),
        'success'
      );
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
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
          <span className="text-[#570013] font-semibold">{t('nav.contact')}</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-12 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
            {loc(
              'Ashram Seva Desk & Helplines',
              'आश्रम सेवा कक्ष व संपर्क केंद्र',
              'आश्रम सेवा कक्ष एवं हेल्पलाइन',
              'આશ્રમ સેવા કક્ષ અને હેલ્પલાઇન'
            )}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Connect with Chaitanya Ved Pratishthan',
              'चैतन्य वेद प्रतिष्ठान संपर्क व मार्गदर्शन केंद्र',
              'चैतन्य वेद प्रतिष्ठान संपर्क एवं मार्गदर्शन केंद्र',
              'ચૈતન્ય વેદ પ્રતિષ્ઠાન સંપર્ક અને માર્ગદર્શન કેન્દ્ર'
            )}
          </h1>
          <p className="text-sm text-[#584141]">
            {loc(
              'Reach out to our ritual coordinators, astrologers, or Gurukul administration for bookings, muhurta inquiries, or donation assistance.',
              'पूजा विधी आयोजन, मुहूर्त विचार, ज्योतिष मार्गदर्शन किंवा देणगी संदर्भात आमच्या समन्वयकांशी संपर्क साधा.',
              'पूजा विधि आयोजन, मुहूर्त विचार, ज्योतिष परामर्श अथवा दान संदर्भ में हमारे समन्वयकों से संपर्क करें।',
              'પૂજા વિધિ આયોજન, મુહૂર્ત વિચાર, જ્યોતિષ પરામર્શ અથવા દાન સંદર્ભે અમારા સંયોજકોનો સંપર્ક કરો.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Particulars (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#570013] border-b border-[#E0BFBF]/30 pb-3">
              {loc('Central Ashram Coordinates', 'मुख्य आश्रम संपर्क तपशील', 'मुख्य आश्रम संपर्क विवरण', 'મુખ્ય આશ્રમ સંપર્ક વિગતો')}
            </h3>

            <div className="space-y-4 text-xs text-[#221918]">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#765B00] mt-0.5 shrink-0">
                  location_on
                </span>
                <div>
                  <span className="font-bold text-[#570013] block">
                    {loc('Central Ashram Campus', 'मुख्य आश्रम संकुल', 'मुख्य आश्रम परिसर', 'મુખ્ય આશ્રમ પરિસર')}
                  </span>
                  <p className="text-[#584141] mt-0.5 leading-relaxed">
                    Ved Bhavan, Maharshi Vidya Nagar, Paud Road, Kothrud, Pune, Maharashtra 411038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#765B00] mt-0.5 shrink-0">
                  schedule
                </span>
                <div>
                  <span className="font-bold text-[#570013] block">
                    {loc('Consultation & Office Timings', 'सल्ला व कार्यालयीन वेळ', 'परामर्श एवं कार्यालयीन समय', 'પરામર્શ અને કાર્યાલય સમય')}
                  </span>
                  <p className="text-[#584141] mt-0.5">
                    {loc(
                      'Monday to Sunday: 09:00 AM – 06:00 PM (IST)',
                      'सोमवार ते रविवार: सकाळी ०९:०० ते संध्याकाळी ०६:०० (भारतीय प्रमाणवेळ)',
                      'सोमवार से रविवार: प्रातः 09:00 से सायं 06:00 (भारतीय मानक समय)',
                      'સોમવાર થી રવિવાર: સવારે ૦૯:૦૦ થી સાંજે ૦૬:૦૦ (ભારતીય માનક સમય)'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#765B00] mt-0.5 shrink-0">
                  call
                </span>
                <div>
                  <span className="font-bold text-[#570013] block">
                    {loc('Helpline & WhatsApp', 'हेल्पलाइन व व्हॉट्सॲप', 'हेल्पलाइन एवं व्हाट्सएप', 'હેલ્પલાઇન અને વ્હોટ્સએપ')}
                  </span>
                  <a href="tel:+919822054321" className="text-[#765B00] font-bold hover:underline block">
                    +91 98220 54321
                  </a>
                  <span className="text-[#584141]">
                    {loc('Office:', 'कार्यालय:', 'कार्यालय:', 'કાર્યાલય:')} 020 2543 8921
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-lg text-[#765B00] mt-0.5 shrink-0">
                  mail
                </span>
                <div>
                  <span className="font-bold text-[#570013] block">
                    {loc('Electronic Mail', 'ई-मेल संपर्क', 'ई-मेल संपर्क', 'ઈ-મેલ સંપર્ક')}
                  </span>
                  <a href="mailto:seva@chaitanyaved.org" className="text-[#570013] hover:underline block">
                    seva@chaitanyaved.org
                  </a>
                  <a href="mailto:accounts@chaitanyaved.org" className="text-[#584141] hover:underline block">
                    accounts@chaitanyaved.org ({loc('80G Tax Inquiries', '८०-जी पावती चौकशी', '80G रसीद पूछताछ', '80G રસીદ પૂછપરછ')})
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FFF0ED] rounded-xl border border-[#E0BFBF]/40 space-y-2">
              <span className="text-xs font-bold text-[#765B00] block uppercase tracking-wider">
                {loc('Direct WhatsApp Support', 'थेट व्हॉट्सॲप साहाय्य', 'सीधा व्हाट्सएप सहयोग', 'સીધો વ્હોટ્સએપ સહયોગ')}
              </span>
              <p className="text-xs text-[#584141]">
                {loc(
                  'Quick questions regarding Sankalpa dates or Puja samagri can be sent directly to our coordinator.',
                  'संकल्प तारीख, पूजा साहित्य किंवा तयारीबद्दल थेट समन्वयकांशी संवाद साधा.',
                  'संकल्प तिथि, पूजा सामग्री अथवा तैयारी के संबंध में सीधे हमारे समन्वयक से संवाद करें।',
                  'સંકલ્પ તારીખ, પૂજા સામગ્રી કે તૈયારી સંદર્ભે સીધો અમારા સંયોજક સાથે સંવાદ કરો.'
                )}
              </p>
              <a
                href="https://wa.me/919822054321"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded text-xs font-bold shadow-xs hover:opacity-90"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>{loc('Chat on WhatsApp', 'व्हॉट्सॲपवर संपर्क करा', 'व्हाट्सएप पर चैट करें', 'વ્હોટ્સએપ પર સંપર્ક કરો')}</span>
              </a>
            </div>
          </div>

          {/* Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-[#E0BFBF]/40 space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#570013] border-b border-[#E0BFBF]/30 pb-3">
              {loc('Send an Online Inquiry', 'ऑनलाइन चौकशी संदेश पाठवा', 'ऑनलाइन पूछताछ संदेश भेजें', 'ઑનલાઇન પૂછપરછ સંદેશ મોકલો')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#221918] block">
                    {loc('Full Name *', 'पूर्ण नाव *', 'पूरा नाम *', 'પૂરું નામ *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={loc('e.g. Rahul Deshpande', 'उदा. श्री राहुल देशपांडे', 'उदा. श्री राहुल देशपांडे', 'દા.ત. શ્રી રાહુલ દેશપાંડે')}
                    className="w-full bg-[#FFF8F6] px-3 py-2 text-sm text-[#221918] rounded-lg border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#221918] block">
                    {loc('Phone Number *', 'भ्रमणध्वनी *', 'मोबाइल नंबर *', 'મોબાઈલ નંબર *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-[#FFF8F6] px-3 py-2 text-sm text-[#221918] rounded-lg border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#221918] block">
                    {loc('Email Address', 'ई-मेल पत्ता', 'ई-मेल पता', 'ઈ-મેલ સરનામું')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#FFF8F6] px-3 py-2 text-sm text-[#221918] rounded-lg border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-bold text-[#221918] block">
                    {loc('Subject / Category', 'विषय / चौकशी प्रकार', 'विषय / पूछताछ प्रकार', 'વિષય / પૂછપરછ પ્રકાર')}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FFF8F6] px-3 py-2 text-sm text-[#221918] rounded-lg border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  >
                    <option value="pooja">
                      {loc('Pooja & Havan Enquiry', 'पूजा व हवन चौकशी', 'पूजा एवं हवन पूछताछ', 'પૂજા અને હવન પૂછપરછ')}
                    </option>
                    <option value="astrology">
                      {loc('Jyotish Kundali Consultation', 'ज्योतिष कुंडली सल्ला', 'ज्योतिष कुंडली परामर्श', 'જ્યોતિષ કુંડળી પરામર્શ')}
                    </option>
                    <option value="gurukul">
                      {loc('Gurukul Admission & Courses', 'गुरुकुल प्रवेश व अभ्यासक्रम', 'गुरुकुल प्रवेश एवं पाठ्यक्रम', 'ગુરુકુળ પ્રવેશ અને અભ્યાસક્રમો')}
                    </option>
                    <option value="donation">
                      {loc('Vidyarthi Adoption & Seva', 'वेद विद्यार्थी दत्तक योजना व सेवा', 'वेद विद्यार्थी दत्तक योजना एवं सेवा', 'વેદ વિદ્યાર્થી દત્તક યોજના અને સેવા')}
                    </option>
                    <option value="tax80g">
                      {loc('80G Tax Exemption Receipt', '८०-जी करसवलत पावती', '80G कर-मुक्त रसीद', '80G કરમુક્ત રસીદ')}
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-bold text-[#221918] block">
                  {loc('Your Message or Inquiry Details *', 'आपला संदेश वा सविस्तर विचारणा *', 'आपका संदेश अथवा विस्तृत विवरण *', 'તમારો સંદેશ અથવા વિગતવાર પૂછપરછ *')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={loc(
                    'Enter your specific questions, preferred dates, or ritual requirements...',
                    'आपला प्रश्न किंवा अपेक्षित पूजेचा दिनांक येथे नमूद करावा...',
                    'अपना प्रश्न अथवा अपेक्षित पूजा तिथि यहाँ दर्ज करें...',
                    'તમારો પ્રશ્ન અથવા અપેક્ષિત પૂજા તારીખ અહીં દાખલ કરો...'
                  )}
                  className="w-full bg-[#FFF8F6] p-3 text-sm text-[#221918] rounded-lg border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSubmitting ? 'sync' : 'send'}
                </span>
                <span>
                  {isSubmitting
                    ? loc('Sending message...', 'संदेश पाठवत आहे...', 'संदेश भेजा जा रहा है...', 'સંદેશ મોકલાઈ રહ્યો છે...')
                    : loc('Submit Inquiry', 'संदेश सादर करा', 'संदेश भेजें', 'સંદેશ મોકલો')}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
