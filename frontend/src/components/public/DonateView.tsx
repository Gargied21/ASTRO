import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedCurrency } from '../../utils/formatters.ts';
import { api } from '../../api/client.ts';

interface DonateViewProps {
  onNavigate: (path: string) => void;
}

export const DonateView: React.FC<DonateViewProps> = ({ onNavigate }) => {
  const { showToast, refreshSanctumData } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number>(3000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [selectedSeva, setSelectedSeva] = useState('vidyarthi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sevaPresets = [
    {
      amount: 1500,
      label: loc('Daily Cow Seva (Gau Grass)', 'नित्य गोग्रास व गोसेवा', 'नित्य गो-ग्रास एवं गोसेवा', 'નિત્ય ગો-ગ્રાસ અને ગૌસેવા'),
    },
    {
      amount: 3000,
      label: loc('1-Month Student Sponsorship', '१ महिना वेद बटू दत्तक', '1 माह वेद विद्यार्थी दत्तक', '૧ મહિનો વેદ વિદ્યાર્થી દત્તક'),
    },
    {
      amount: 11000,
      label: loc('1-Day Gurukul Annadanam', '१ दिवस गुरुकुल अन्नदान', '1 दिवस गुरुकुल अन्नदान', '૧ દિવસ ગુરુકુળ અન્નદાન'),
    },
    {
      amount: 36000,
      label: loc('Annual Full Student Sponsorship', '१ वर्ष संपूर्ण विद्यार्थी दत्तक', '1 वर्ष संपूर्ण विद्यार्थी दत्तक', '૧ વર્ષ સંપૂર્ણ વિદ્યાર્થી દત્તક'),
    },
  ];

  const handleCopyVpa = () => {
    navigator.clipboard.writeText('chaitanyaved@sbi');
    showToast(
      loc('UPI VPA copied: chaitanyaved@sbi', 'UPI VPA कॉपी केला: chaitanyaved@sbi', 'UPI VPA कॉपी किया: chaitanyaved@sbi', 'UPI VPA કૉપિ કર્યો: chaitanyaved@sbi'),
      'info'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    if (finalAmount <= 0) {
      showToast(
        loc('Please enter a valid contribution amount', 'कृपया योग्य समर्पण रक्कम प्रविष्ट करा', 'कृपया वैध समर्पण राशि प्रविष्ट करें', 'કૃપા કરીને માન્ય સમર્પણ રકમ દાખલ કરો'),
        'error'
      );
      return;
    }

    const sevaNames = {
      vidyarthi: {
        en: 'Vedic Student Sponsorship (Adoption Scheme)',
        mr: 'वेद विद्यार्थी दत्तक योजना',
        hi: 'वेद विद्यार्थी दत्तक योजना',
        gu: 'વેદ વિદ્યાર્થી દત્તક યોજના',
      },
      gau: {
        en: 'Daily Cow Care & Goshala Seva',
        mr: 'नित्य गोग्रास व गोशाळा सेवा',
        hi: 'नित्य गो-ग्रास एवं गोशाला सेवा',
        gu: 'નિત્ય ગો-ગ્રાસ અને ગૌશાળા સેવા',
      },
      annadanam: {
        en: 'Gurukul Annakshetra Prasad Seva',
        mr: 'गुरुकुल अन्नछत्र व प्रसाद सेवा',
        hi: 'गुरुकुल अन्नक्षेत्र एवं प्रसाद सेवा',
        gu: 'ગુરુકુળ અન્નક્ષેત્ર અને પ્રસાદ સેવા',
      },
      library: {
        en: 'Ancient Palm Manuscript Preservation & Veda Library',
        mr: 'प्राचीन हस्तलिखित जतन व ग्रंथालय निधी',
        hi: 'प्राचीन पांडुलिपि संरक्षण एवं ग्रंथालय निधि',
        gu: 'પ્રાચીન હસ્તપ્રત સંરક્ષણ અને ગ્રંથાલય ભંડોળ',
      },
      corpus: {
        en: 'General Ashram Corpus & Infrastructure Fund',
        mr: 'सामान्य आश्रम संवर्धन निधी',
        hi: 'सामान्य आश्रम संवर्धन निधि',
        gu: 'સામાન્ય આશ્રમ સંવર્ધન ભંડોળ',
      },
    };

    const targetSeva = sevaNames[selectedSeva as keyof typeof sevaNames] || sevaNames.vidyarthi;

    try {
      setIsSubmitting(true);
      const res = await api.donations.create({
        amount: finalAmount,
        category: selectedSeva === 'vidyarthi' ? 'gurukul' : selectedSeva === 'gau' ? 'goseva' : selectedSeva === 'library' ? 'library' : 'anushthan',
        purpose: targetSeva.en,
        purposeMr: targetSeva.mr,
        purposeHi: targetSeva.hi,
        purposeGu: targetSeva.gu,
        donorName: donorName.trim() || loc('Devout Patron', 'धर्मप्रेमी यजमान', 'धर्मप्रेमी यजमान', 'ધર્મપ્રેમી યજમાન'),
        donorPhone: donorPhone.trim() || '9822054321',
        donorPan: donorPan.trim() || undefined,
        mode: 'Razorpay UPI',
      });

      const receipt = res.data;
      await refreshSanctumData();

      showToast(
        loc(
          `Contribution successful! Tax receipt ${receipt.receiptNo} generated and available in Devotee Sanctum.`,
          `समर्पण यशस्वी! पावती ${receipt.receiptNo} जारी झाली. भक्त कक्षात उपलब्ध आहे.`,
          `समर्पण सफल! रसीद ${receipt.receiptNo} जारी की गई। भक्त कक्ष में उपलब्ध है।`,
          `સમર્પણ સફળ! રસીદ ${receipt.receiptNo} જારી કરવામાં આવી. ભક્ત કક્ષમાં ઉપલબ્ધ છે.`
        ),
        'success'
      );
      setCustomAmount('');
    } catch (err: any) {
      showToast(err.message || 'Donation submission failed', 'error');
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
              'Donations & 80G Seva',
              '८०-जी करसवलत देणगी व सेवा',
              '80G कर-मुक्त दान एवं सेवा',
              '80G કરમુક્ત દાન અને સેવા'
            )}
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-12 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD979]/40 text-[#795D00] text-xs font-bold uppercase tracking-wider">
            <span className="notranslate">॥ परोपकाराय पुण्याय ॥</span> • {loc('100% Tax Deductible under 80G', 'कलम ८०-जी कर सवलत पात्र', 'धारा 80G के अंतर्गत कर-मुक्त', 'કલમ 80G હેઠળ કરમુક્ત')}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#570013] font-bold tracking-tight">
            {loc(
              'Support Vedic Preservation & Gurukul Vidyarthis',
              'वेद संवर्धन, गुरुकुल छात्र दत्तक व गोसेवा समर्पण',
              'वेद संवर्धन, गुरुकुल छात्र दत्तक एवं गोसेवा समर्पण',
              'વેદ સંવર્ધન, ગુરુકુળ વિદ્યાર્થી દત્તક અને ગૌસેવા સમર્પણ'
            )}
          </h1>
          <p className="text-sm text-[#584141] leading-relaxed">
            {loc(
              'All donations made to Chaitanya Ved Pratishthan (Regd. Public Charitable Trust F/49210/Pune) are 100% tax-deductible under Section 80G(5)(vi) of the Income Tax Act. Instant digitally signed receipts are issued and filed under Form 10BE with CBDT.',
              'चैतन्य वेद प्रतिष्ठानला (नोंदणीकृत सार्वजनिक धर्मादाय ट्रस्ट F/49210/पुणे) दिलेले सर्व समर्पण आयकर कायद्याच्या कलम ८०-जी अंतर्गत १००% करसवलतीस पात्र आहे. तात्काळ डिजिटल स्वाक्षरीसह पावती दिली जाते व फॉर्म १०-बीई सीबीडीटीकडे दाखल केला जातो.',
              'चैतन्य वेद प्रतिष्ठान (पंजीकृत सार्वजनिक धर्मार्थ न्यास F/49210/पुणे) को दिया गया समस्त दान आयकर अधिनियम की धारा 80G के अंतर्गत कर-मुक्त है। डिजिटल हस्ताक्षरित रसीद तत्काल प्रदान की जाती है।',
              'ચૈતન્ય વેદ પ્રતિષ્ઠાન (નોંધાયેલ સાર્વજનિક ચેરિટેબલ ટ્રસ્ટ F/49210/પુણે) ને આપેલું તમામ દાન આવકવેરા કાયદાની કલમ 80G હેઠળ કરમુક્ત છે. ત્વરિત ડિજિટલ હસ્તાક્ષરિત રસીદ આપવામાં આવે છે.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#E0BFBF]/40 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#570013] border-b border-[#E0BFBF]/30 pb-3">
              {loc('Contribute Online (80G Receipt)', 'ऑनलाइन सेवा समर्पण (८०-जी पावती)', 'ऑनलाइन सेवा समर्पण (80G रसीद)', 'ઑનલાઇન સેવા સમર્પણ (80G રસીદ)')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#221918] block uppercase">
                  {loc('1. Choose Seva Intent', '१. सेवा योजना निवडा', '1. सेवा योजना चुनें', '૧. સેવા યોજના પસંદ કરો')}
                </label>
                <select
                  value={selectedSeva}
                  onChange={(e) => setSelectedSeva(e.target.value)}
                  className="w-full bg-[#FFF8F6] p-2.5 rounded-lg border border-[#E0BFBF]/50 text-[#221918] text-xs focus:outline-none"
                >
                  <option value="vidyarthi">
                    {loc('Vedic Student Adoption Scheme', 'वेद विद्यार्थी दत्तक योजना', 'वेद विद्यार्थी दत्तक योजना', 'વેદ વિદ્યાર્થી દત્તક યોજના')}
                  </option>
                  <option value="gau">
                    {loc('Daily Goshala & Cow Care (Gau Grass)', 'नित्य गो grass व गोशाळा सेवा', 'नित्य गो-ग्रास एवं गोशाला सेवा', 'નિત્ય ગો-ગ્રાસ અને ગૌશાળા સેવા')}
                  </option>
                  <option value="annadanam">
                    {loc('Gurukul Annakshetra & Prasad Seva', 'गुरुकुल अन्नछत्र व प्रसाद सेवा', 'गुरुकुल अन्नक्षेत्र एवं प्रसाद सेवा', 'ગુરુકુળ અન્નક્ષેત્ર અને પ્રસાદ સેવા')}
                  </option>
                  <option value="library">
                    {loc('Ancient Palm Manuscript Preservation & Veda Library', 'प्राचीन हस्तलिखित जतन व ग्रंथालय निधी', 'प्राचीन पांडुलिपि संरक्षण एवं ग्रंथालय निधि', 'પ્રાચીન હસ્તપ્રત સંરક્ષણ અને ગ્રંથાલય ભંડોળ')}
                  </option>
                  <option value="corpus">
                    {loc('General Ashram Corpus & Development Fund', 'सामान्य आश्रम संवर्धन निधी', 'सामान्य आश्रम संवर्धन निधि', 'સામાન્ય આશ્રમ સંવર્ધન ભંડોળ')}
                  </option>
                </select>
              </div>

              {/* Amount Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#221918] block uppercase">
                  {loc('2. Select Amount', '२. समर्पण रक्कम निवडा', '2. समर्पण राशि चुनें', '૨. સમર્પણ રકમ પસંદ કરો')}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {sevaPresets.map((p) => {
                    const isSelected = selectedAmount === p.amount && !customAmount;
                    return (
                      <button
                        key={p.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(p.amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#570013] text-white border-transparent shadow-xs'
                            : 'bg-[#FFF0ED] text-[#221918] border-[#E0BFBF]/40 hover:bg-[#FCEAE6]'
                        }`}
                      >
                        <span className="font-serif font-bold text-base block">
                          {formatLocalizedCurrency(p.amount, language)}
                        </span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-[#FFDF94]' : 'text-[#584141]'}`}>
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative pt-2">
                  <span className="absolute left-3 top-4.5 font-bold text-sm text-[#570013]">₹</span>
                  <input
                    type="number"
                    placeholder={loc('Other Custom Amount', 'इतर ऐच्छिक रक्कम', 'अन्य ऐच्छिक राशि', 'અન્ય ઐચ્છિક રકમ')}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-[#FFF8F6] pl-8 pr-3 py-2.5 rounded-lg border border-[#E0BFBF]/50 text-[#221918] text-xs focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  />
                </div>
              </div>

              {/* Donor Credentials for 80G */}
              <div className="space-y-3 pt-2 border-t border-[#E0BFBF]/30">
                <span className="text-xs font-bold text-[#570013] block uppercase">
                  {loc('3. Donor PAN Details for Form 10BE', '३. करसवलतीसाठी देणगीदार तपशील (PAN)', '3. कर-छूट हेतु दानदाता विवरण (PAN)', '૩. કરમુક્તિ માટે દાતા વિગતો (PAN)')}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#584141] block mb-1">
                      {loc('Donor Full Name (As on PAN) *', 'देणगीदाराचे पूर्ण नाव (पॅन प्रमाणे) *', 'दानदाता का पूरा नाम (पैन अनुसार) *', 'દાતાનું પૂરું નામ (પાન મુજબ) *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={loc('e.g. Rajesh S. Kulkarni', 'उदा. राजेश शांताराम कुळकर्णी', 'उदा. राजेश शांताराम कुलकर्णी', 'દા.ત. રાજેશ શાંતારામ કુલકર્ણી')}
                      className="w-full bg-[#FFF8F6] p-2 rounded-lg border border-[#E0BFBF]/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#584141] block mb-1">
                      {loc('PAN Number *', 'पॅन क्रमांक *', 'पैन संख्या *', 'પાન નંબર *')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full bg-[#FFF8F6] p-2 rounded-lg border border-[#E0BFBF]/50 uppercase font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#584141] block mb-1">
                    {loc('Mobile Number (for SMS & WhatsApp Receipt)', 'भ्रमणध्वनी (पावती SMS व WhatsApp साठी)', 'मोबाइल नंबर (SMS एवं WhatsApp रसीद हेतु)', 'મોબાઈલ નંબર (SMS અને WhatsApp રસીદ માટે)')}
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-[#FFF8F6] p-2 rounded-lg border border-[#E0BFBF]/50 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting ? 'bg-[#800020]/70 cursor-not-allowed' : 'bg-[#570013] hover:bg-[#800020]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isSubmitting ? 'sync' : 'lock'}
                </span>
                <span>
                  {isSubmitting
                    ? loc('Recording Contribution & Generating 80G...', 'समर्पण नोंदवत आहे व पावती तयार होत आहे...', 'समर्पण दर्ज हो रहा है एवं 80G रसीद तैयार हो रही है...', 'સમર્પણ નોંધાઈ રહ્યું છે અને 80G રસીદ જનરેટ થઈ રહી છે...')
                    : loc('Pay & Generate 80G Receipt', 'सुरक्षित समर्पण करा (८०-जी पावती मिळवा)', 'सुरक्षित समर्पण करें (80G रसीद प्राप्त करें)', 'સુરક્ષિત સમર્પણ કરો (80G રસીદ મેળવો)')}
                </span>
              </button>
            </form>
          </div>

          {/* Right Direct Banking & QR (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#E0BFBF]/40 space-y-4 text-center">
              <span className="text-xs font-bold text-[#765B00] uppercase tracking-wider block">
                {loc('Direct Bank Transfer (NEFT / RTGS / IMPS)', 'थेट ट्रस्ट बँक खात्यात भरणा', 'सीधे बैंक खाते में अंतरण', 'સીધું બેંક ખાતામાં ટ્રાન્સફર')}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#570013]">
                State Bank of India Corporate Account
              </h3>

              <div className="w-44 h-44 mx-auto bg-[#FFF0ED] p-3 rounded-xl border border-[#E0BFBF]/40 flex items-center justify-center">
                <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
                  <rect fill="#FFFFFF" height="100" width="100"></rect>
                  <rect fill="#570013" height="26" rx="3" width="26" x="6" y="6"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="11" y="11"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="15" y="15"></rect>
                  <rect fill="#570013" height="26" rx="3" width="26" x="68" y="6"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="73" y="11"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="77" y="15"></rect>
                  <rect fill="#570013" height="26" rx="3" width="26" x="6" y="68"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="11" y="73"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="15" y="77"></rect>
                  <rect fill="#765B00" height="6" width="6" x="38" y="8"></rect>
                  <rect fill="#221918" height="6" width="12" x="48" y="8"></rect>
                  <rect fill="#570013" height="8" width="8" x="38" y="18"></rect>
                  <circle cx="50" cy="50" fill="#570013" r="8"></circle>
                  <text fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" x="50" y="53">ॐ</text>
                </svg>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs">
                <span className="font-mono font-bold text-[#570013]">chaitanyaved@sbi</span>
                <button
                  onClick={handleCopyVpa}
                  className="p-1 hover:text-[#570013] text-[#584141] cursor-pointer"
                  title="Copy UPI VPA"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFF0ED] text-left text-xs space-y-1 border border-[#E0BFBF]/30">
                <div className="flex justify-between">
                  <span className="text-[#584141]">{loc('Account Name:', 'खातेदाराचे नाव:', 'खातेदार का नाम:', 'ખાતાધારકનું નામ:')}</span>
                  <span className="font-semibold text-right">Chaitanya Ved Pratishthan Trust</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#584141]">{loc('Account No:', 'खाते क्रमांक:', 'खाता संख्या:', 'ખાતા નંબર:')}</span>
                  <span className="font-bold text-[#221918]">39482019482 (Current A/c)</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[#584141]">IFSC Code:</span>
                  <span className="font-bold text-[#570013]">SBIN0001234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#584141]">{loc('Branch:', 'शाखा:', 'शाखा:', 'શાખા:')}</span>
                  <span>SBI Main Branch, Pune</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E0BFBF]/40 text-xs text-[#584141] space-y-2">
              <span className="font-bold text-[#570013] block">
                {loc('How to receive your 80G Tax Exemption Certificate?', '८०-जी आयकर पावती कशी मिळवाल?', '80G आयकर रसीद कैसे प्राप्त करें?', '80G આવકવેરા રસીદ કેવી રીતે મેળવવી?')}
              </span>
              <p className="leading-relaxed">
                {loc(
                  'After transferring funds via NEFT/RTGS or UPI, please email your transaction UTR number, PAN and address to accounts@chaitanyaved.org. A digitally signed 80G receipt and Form 10BE acknowledgement will be issued within 24 hours.',
                  'NEFT/RTGS किंवा UPI ने रक्कम पाठवल्यानंतर त्याचा UTR संदर्भ क्रमांक आणि आपले नाव accounts@chaitanyaved.org वर ईमेल करा. २४ तासांत डिजिटल स्वाक्षरीसह पावती पाठवली जाईल.',
                  'NEFT/RTGS अथवा UPI द्वारा राशि प्रेषित करने के उपरांत UTR संदर्भ संख्या एवं अपना पैन विवरण accounts@chaitanyaved.org पर ईमेल करें। 24 घंटे में डिजिटल हस्ताक्षरित रसीद प्रेषित की जाएगी।',
                  'NEFT/RTGS અથવા UPI દ્વારા રકમ મોકલ્યા પછી તેનો UTR સંદર્ભ નંબર અને તમારી વિગતો accounts@chaitanyaved.org પર ઈમેલ કરો. ૨૪ કલાકમાં ડિજિટલ હસ્તાક્ષરિત રસીદ મોકલવામાં આવશે.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
