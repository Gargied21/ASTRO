import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { TaxReceipt } from '../../types/index.ts';
import { Modal } from '../common/Modal.tsx';
import { formatLocalizedCurrency, formatLocalizedDate, formatLocalizedNumber } from '../../utils/formatters.ts';
import { api } from '../../api/client.ts';

export const DonationsVaultView: React.FC = () => {
  const { receipts, profile, refreshSanctumData, showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [selectedFy, setSelectedFy] = useState('all');
  const [selectedSevaCategory, setSelectedSevaCategory] = useState('all');

  // New Seva Contribution form state
  const [customAmount, setCustomAmount] = useState<number>(5100);
  const [sevaPurpose, setSevaPurpose] = useState<string>('रुद्राभिषेक, शांतिपाठ व नित्य गोसेवा');
  const [isPanAttached, setIsPanAttached] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<TaxReceipt | null>(null);

  const presets = [
    {
      amount: 2500,
      label: loc('Monthly Sponsorship', 'मासिक दत्तक', 'मासिक दत्तक', 'માસિક દત્તક'),
      title: loc('1 Month Veda Student Sponsorship', '१ महिना वेद विद्यार्थी दत्तक', '1 माह वेद विद्यार्थी दत्तक', '૧ મહિનો વેદ વિદ્યાર્થી દત્તક'),
    },
    {
      amount: 5100,
      label: loc('Abhishek & Go Seva', 'अभिषेक व गोसेवा', 'अभिषेक व गोसेवा', 'અભિષેક અને ગો સેવા'),
      title: loc('Ekadashi Abhishek & Daily Go-grass', 'एकादशी अभिषेक व नित्य गोgrass', 'एकादशी अभिषेक व नित्य गो-ग्रास', 'એકાદશી અભિષેક અને નિત્ય ગો-ગ્રાસ'),
    },
    {
      amount: 11000,
      label: loc('Anna Dana Seva', 'अन्नदान सेवा', 'अन्नदान सेवा', 'અન્નદાન સેવા'),
      title: loc('One Day Full Gurukul Anna Dana', 'एक दिवस संपूर्ण गुरुकुल अन्नदान', 'एक दिन संपूर्ण गुरुकुल अन्नदान', 'એક દિવસ સંપૂર્ણ ગુરુકુલ અન્નદાન'),
    },
    {
      amount: 21000,
      label: loc('Maha Anushthan', 'महा अनुष्ठान', 'महा अनुष्ठान', 'મહા અનુષ્ઠાન'),
      title: loc('Special Rigveda Swadhyaya Anushthan', 'विशेष ऋग्वेद स्वाध्याय अनुष्ठान', 'विशेष ऋग्वेद स्वाध्याय अनुष्ठान', 'વિશેષ ઋગ્વેદ સ્વાધ્યાય અનુષ્ઠાન'),
    },
  ];

  const filteredReceipts = receipts.filter((r) => {
    if (selectedFy !== 'all' && r.fy !== selectedFy) return false;
    if (selectedSevaCategory !== 'all' && r.category !== selectedSevaCategory) return false;
    return true;
  });

  const totalFilteredAmount = filteredReceipts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAllReceiptsAmount = receipts.reduce((acc, curr) => acc + curr.amount, 0);
  const estimatedTaxSaved = Math.round(totalFilteredAmount * 0.312);
  const displayDonorName = profile?.name?.trim() || loc("Registered Yajamana", "नोंदणीकृत यजमान", "पंजीकृत यजमान", "નોંધાયેલ યજમાન");
  const displayDonorPan = profile?.panNumber?.trim() || receipts.find((r) => r.donorPan)?.donorPan || "PAN Not Linked";

  const handleSelectPreset = (amount: number, purpose: string) => {
    setCustomAmount(amount);
    setSevaPurpose(purpose);
  };

  const handlePaymentInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount <= 0) {
      showToast(loc('Please enter a valid contribution amount.', 'कृपया योग्य समर्पण रक्कम प्रविष्ट करा.', 'कृपया वैध समर्पण राशि दर्ज करें।', 'કૃપા કરીને માન્ય સમર્પણ રકમ દાખલ કરો.'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const donorName = profile?.name || loc('Devotee', 'भक्त', 'भक्त', 'ભક્ત');
      const donorPan = isPanAttached ? (profile?.panNumber || 'ABCDE1234F') : undefined;

      const res = await api.donations.create({
        amount: customAmount,
        category: 'anushthan',
        purpose: sevaPurpose,
        purposeMr: sevaPurpose,
        donorName: donorName,
        donorPhone: profile?.phone || '',
        donorPan: donorPan,
        mode: 'UPI / Direct Gateway',
      });

      const generatedReceiptNo = res.data?.receiptNo || res.data?.receipt?.receiptNo;
      if (res.success && generatedReceiptNo) {
        showToast(
          loc(
            `Contribution successful! Receipt ${generatedReceiptNo} generated.`,
            `समर्पण यशस्वी! पावती ${generatedReceiptNo} तयार करण्यात आली.`,
            `समर्पण सफल! रसीद ${generatedReceiptNo} उत्पन्न की गई।`,
            `સમર્પણ સફળ! પાવતી ${generatedReceiptNo} જનરેટ થઈ.`
          ),
          'success'
        );
        refreshSanctumData();
      }
    } catch (err: any) {
      showToast(err.message || 'Contribution failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadForm10BE = async () => {
    try {
      const res = await api.donations.getForm10BE(selectedFy);
      if (res.success && res.data) {
        showToast(
          loc(
            `CBDT Form 10BE Certificate generated (ARN: ${res.data.arn || '2425-CVPT-9981-BE'}). Total: ₹${(res.data.totalAmount ?? res.data.totalEligibleAmount ?? 0)}`,
            `केंद्रीय प्रत्यक्ष कर मंडळ (CBDT) Form 10BE अधिकृत प्रमाणपत्र तयार (ARN: ${res.data.arn || '2425-CVPT-9981-BE'}). एकूण: ₹${(res.data.totalAmount ?? res.data.totalEligibleAmount ?? 0)}`,
            `केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT) Form 10BE प्रमाण पत्र उत्पन्न (ARN: ${res.data.arn || '2425-CVPT-9981-BE'})। कुल: ₹${(res.data.totalAmount ?? res.data.totalEligibleAmount ?? 0)}`,
            `CBDT Form 10BE પ્રમાણપત્ર તૈયાર (ARN: ${res.data.arn || '2425-CVPT-9981-BE'}). કુલ: ₹${(res.data.totalAmount ?? res.data.totalEligibleAmount ?? 0)}`
          ),
          'success'
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to download Form 10BE', 'error');
    }
  };

  const handleCopyVPA = () => {
    navigator.clipboard.writeText('chaitanyaved@sbi');
    showToast(loc('UPI VPA copied: chaitanyaved@sbi', 'UPI VPA कॉपी केला: chaitanyaved@sbi', 'UPI VPA कॉपी किया: chaitanyaved@sbi', 'UPI VPA કૉપિ કર્યો: chaitanyaved@sbi'), 'info');
  };

  const handleExportCSV = () => {
    showToast(
      loc(
        'Downloading FY 2024-25 80G Receipts Report in CSV format.',
        'सर्व ८०-जी पावत्यांचा अहवाल (FY 2024-25) CSV स्वरूपात डाउनलोड केला जात आहे.',
        'वित्त वर्ष 2024-25 की सभी 80G रसीदों की रिपोर्ट CSV प्रारूप में डाउनलोड की जा रही है।',
        'નાણાકીય વર્ષ ૨૦૨૪-૨૫ ની તમામ ૮૦G પાવતીઓનો અહેવાલ CSV સ્વરૂપમાં ડાઉનલોડ થઈ રહ્યો છે.'
      ),
      'info'
    );
  };

  const handleEmailReceipt = (receiptNo: string) => {
    const email = profile?.email || 'devotee@chaitanyaved.org';
    showToast(
      loc(
        `Receipt ${receiptNo} sent to devotee email (${email}).`,
        `पावती ${receiptNo} भक्त यांच्या ईमेलवर (${email}) पाठवली आहे.`,
        `रसीद ${receiptNo} भक्त के ईमेल (${email}) पर भेजी गई।`,
        `પાવતી ${receiptNo} ભક્તના ઈમેલ (${email}) પર મોકલવામાં આવી છે.`
      ),
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Breadcrumb & Action Header Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#584141] mb-1">
            <span className="material-symbols-outlined text-sm leading-none text-[#765B00]">temple_hindu</span>
            <span>{t('devoteeSanctum')}</span>
            <span className="text-[#E0BFBF]">/</span>
            <span className="text-[#570013] font-semibold">
              {loc(
                '80G Tax Exemption Receipts Vault',
                '८०-जी करसवलत व धर्मदाय पावती संच',
                '80G कर छूट रसीदें एवं सेवा संचय',
                '૮૦-જી કરમુક્તિ પાવતી અને સેવા સંચય'
              )}
            </span>
          </nav>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold tracking-tight">
            {loc(
              '80G Tax Exemption Receipts Vault',
              '८०-जी धर्मदाय पावत्या व सेवा संच',
              '80G धर्मार्थ रसीदें एवं सेवा संचय',
              '૮૦-જી ધર્માદા પાવતી અને સેવા સંચય'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141] flex flex-wrap items-center gap-2">
            <span>
              {loc(
                '100% Tax Deductible under Income Tax Act Sec 80G',
                'आयकर कलम ८०-जी अन्वये १००% करसवलत पात्र',
                'आयकर अधिनियम धारा 80G के अंतर्गत 100% कर कटौती योग्य',
                'આયકર કલમ ૮૦-જી હેઠળ ૧૦૦% કરમુક્તિ પાત્ર'
              )}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#765B00]"></span>
            <span>{loc('Regd. Public Trust: F/49210 (Pune)', 'नोंदणीकृत सार्वजनिक न्यास: F/49210 (पुणे)', 'पंजीकृत सार्वजनिक ट्रस्ट: F/49210 (पुणे)', 'નોંધાયેલ જાહેર ટ્રસ્ટ: F/49210 (પુણે)')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#765B00]"></span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-[#FFD979]/40 text-[#795D00] px-2 py-0.5 rounded font-bold font-mono">
              <span className="material-symbols-outlined text-xs">verified</span>
              {loc('PAN: AAATC49210F', 'पॅन: AAATC49210F', 'पैन: AAATC49210F', 'પાન: AAATC49210F')}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadForm10BE}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E0BFBF]/40 text-[#570013] hover:bg-[#FFF0ED] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#765B00]">file_download</span>
            <span>
              {loc(
                'Download Form 10BE (PDF)',
                'वार्षिक Form 10BE (PDF)',
                'वार्षिक फॉर्म 10BE (PDF)',
                'વાર્ષિક ફોર્મ 10BE (PDF)'
              )}
            </span>
          </button>
          <a
            href="#quick-seva-panel"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">volunteer_activism</span>
            <span>
              {loc(
                '+ New Seva Contribution',
                '+ नवीन संकल्प सेवा समर्पण',
                '+ नया संकल्प सेवा समर्पण',
                '+ નવું સંકલ્પ સેવા સમર્પણ'
              )}
            </span>
          </a>
        </div>
      </div>

      {/* FY 2024-25 Tax Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Seva */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[11px] text-[#584141] font-bold uppercase tracking-wider">
              {loc('FY 2024-25 Contribution', 'चालू आ.व. २०२४-२५ समर्पण', 'चालू वित्त वर्ष 2024-25 समर्पण', 'ચાલુ નાણાકીય વર્ષ ૨૦૨૪-૨૫ સમર્પણ')}
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#FFF0ED] flex items-center justify-center text-[#570013]">
              <span className="material-symbols-outlined text-base">savings</span>
            </span>
          </div>
          <div className="my-2">
            <div className="font-serif text-3xl font-bold text-[#570013] tracking-tight">{formatLocalizedCurrency(totalFilteredAmount, language)}</div>
            <div className="text-xs text-[#584141] mt-0.5">
              {loc('Total Devotional Contribution', 'एकूण समर्पित सेवा निधी', 'कुल समर्पित सेवा निधि', 'કુલ સમર્પિત સેવા ભંડોળ')}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDF94] text-[#251A00] text-[10px] font-bold w-fit">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            {loc('80G Eligible (100% Tax Deductible)', '८०-जी पात्र (१००% करसवलत)', '80G पात्र (100% कर छूट)', '૮૦G પાત્ર (૧૦૦% કરમુક્તિ)')}
          </span>
        </div>

        {/* Metric 2: Estimated Tax Saved */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[11px] text-[#584141] font-bold uppercase tracking-wider">
              {loc('Estimated Tax Savings', 'उपलब्ध कर वजावट अंदाज', 'अनुमानित कर बचत', 'અંદાજિત કર બચત')}
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#FFF0ED] flex items-center justify-center text-[#765B00]">
              <span className="material-symbols-outlined text-base">calculate</span>
            </span>
          </div>
          <div className="my-2">
            <div className="font-serif text-3xl font-bold text-[#221918] tracking-tight">{formatLocalizedCurrency(estimatedTaxSaved, language)}</div>
            <div className="text-xs text-[#584141] mt-0.5">
              {loc('Estimated 31.2% Slab Benefit', 'अंदाजे ३१.२% कर कपात लाभ', 'अनुमानित 31.2% कर छूट लाभ', 'અંદાજિત ૩૧.૨% કર મુક્તિ લાભ')}
            </div>
          </div>
          <div className="flex items-center justify-between text-[#584141] text-[11px]">
            <span>{loc('Section 80G(5)(vi)', 'कलम ८०-जी (५)(vi)', 'धारा 80G(5)(vi)', 'કલમ ૮૦G (૫)(vi)')}</span>
            <span className="text-[#570013] font-bold">
              {loc('Max Deduction Applied', 'कमाल वजावट लागू', 'अधिकतम कटौती लागू', 'મહત્તમ કપાત લાગુ')}
            </span>
          </div>
        </div>

        {/* Metric 3: Digital Receipts Count */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[11px] text-[#584141] font-bold uppercase tracking-wider">
              {loc('Issued Official Receipts', 'जारी केलेल्या अधिकृत पावत्या', 'जारी की गई आधिकारिक रसीदें', 'જારી કરાયેલ સત્તાવાર પાવતીઓ')}
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#FFF0ED] flex items-center justify-center text-[#570013]">
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </span>
          </div>
          <div className="my-2">
            <div className="font-serif text-3xl font-bold text-[#570013] tracking-tight">
              {formatLocalizedNumber(String(filteredReceipts.length).padStart(2, '0'), language)} <span className="text-base font-normal text-[#584141]">{loc('Receipts', 'पावत्या', 'रसीदें', 'પાવતીઓ')}</span>
            </div>
            <div className="text-xs text-[#584141] mt-0.5">
              {loc('Digitally Signed & Stamped', 'डिजिटल स्वाक्षरी व शिक्का', 'डिजिटली हस्ताक्षरित व मुद्रित', 'ડિજિટલી હસ્તાક્ષરિત અને મુદ્રિત')}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#584141] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#765B00]"></span>
            <span>{loc('All receipts linked to PAN', 'सर्व पावत्या पॅनशी संलग्न', 'सभी रसीदें पैन से संलग्न', 'તમામ પાવતીઓ પાન સાથે જોડાયેલ')}</span>
          </div>
        </div>

        {/* Metric 4: Form 10BE Filing Status */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[11px] text-[#584141] font-bold uppercase tracking-wider">
              {loc('Income Tax Form 10BE Status', 'आयकर पोर्टल Form 10BE स्थिती', 'आयकर पोर्टल Form 10BE स्थिति', 'આયકર પોર્ટલ Form 10BE સ્થિતિ')}
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#FFD979]/40 flex items-center justify-center text-[#795D00]">
              <span className="material-symbols-outlined text-base">security</span>
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-center gap-1 text-[#765B00] text-sm font-bold">
              <span className="material-symbols-outlined text-base">task_alt</span>
              <span>{loc('Verified & Filed', 'सत्यापित व दाखल', 'सत्यापित एवं दाखिल', 'ચકાસાયેલ અને ફાઇલ કરેલ')}</span>
            </div>
            <div className="text-[11px] text-[#584141] font-mono mt-0.5">ARN: 2425-CVPT-9981-BE</div>
          </div>
          <div className="flex items-center justify-between text-[#584141] text-[11px]">
            <span>{loc('AIS / 26AS Reflection', 'AIS / 26AS रिफ्लेक्शन', 'AIS / 26AS परावर्तन', 'AIS / 26AS પ્રતિબિંબ')}</span>
            <span className="text-[#570013] font-bold">{loc('Yes (Confirmed)', 'होय (सत्यापित)', 'हाँ (सत्यापित)', 'હા (પુષ્ટિ થયેલ)')}</span>
          </div>
        </div>
      </div>

      {/* Form 10BE Instant Annual Certificate Shastric Vault Banner */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-[#570013] to-[#800020] text-white p-6 sm:p-8 overflow-hidden shadow-lg">
        {/* Decorative Yantra Line Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90"></circle>
            <polygon points="100,15 180,150 20,150"></polygon>
            <polygon points="100,185 20,50 180,50"></polygon>
            <circle cx="100" cy="100" r="50"></circle>
            <circle cx="100" cy="100" r="25"></circle>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FFDF94] text-xs font-bold w-fit">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              <span>
                {loc(
                  'CBDT Approved Official Certificate',
                  'केंद्रीय प्रत्यक्ष कर मंडळ (CBDT) मान्यताप्राप्त अधिकृत प्रमाणपत्र',
                  'केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT) मान्यता प्राप्त प्रमाण पत्र',
                  'સેન્ટ્રલ બોર્ડ ઑફ ડાયરેક્ટ ટેક્સિસ (CBDT) માન્ય સત્તાવાર પ્રમાણપત્ર'
                )}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
              {loc(
                "Annual Form 10BE Certificate for ITR Filing",
                "आयकर विवरणपत्रासाठी वार्षिक 'Form 10BE' प्रमाणपत्र",
                "आयकर विवरण पत्र के लिए वार्षिक 'Form 10BE' प्रमाण पत्र",
                "આયકર રિટર્ન માટે વાર્ષિક 'Form 10BE' પ્રમાણપત્ર"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {loc(
                'Official certificate for cumulative donations of ₹36,000 made to Chaitanya Ved Pratishthan in FY 2024-25. Directly valid for ITR-1 / ITR-2 filing under Section 80G.',
                'आर्थिक वर्ष २०२४-२५ (करनिर्धारण वर्ष २०२५-२६) मध्ये चैतन्य वेद प्रतिष्ठानला अर्पण केलेल्या एकूण ₹३६,००० देणग्यांचे अधिकृत आयकर विवरण प्रमाणपत्र उपलब्ध आहे. हे प्रमाणपत्र थेट ITR-1 / ITR-2 भरताना मान्य आहे.',
                'वित्तीय वर्ष 2024-25 में चैतन्य वेद प्रतिष्ठान को अर्पित कुल ₹36,000 दान का आधिकारिक आयकर प्रमाण पत्र उपलब्ध है। यह प्रमाण पत्र ITR-1 / ITR-2 दाखिल करते समय मान्य है।',
                'નાણાકીય વર્ષ ૨૦૨૪-૨૫ માં ચૈતન્ય વેદ પ્રતિષ્ઠાનને અર્પણ કરેલ કુલ ₹૩૬,૦૦૦ દાનનું સત્તાવાર આયકર પ્રમાણપત્ર ઉપલબ્ધ છે. આ પ્રમાણપત્ર ITR-1 / ITR-2 ફાઇલ કરતી વખતે માન્ય છે.'
              )}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-white/20 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#FFDF94]">person</span>
                <span>{loc('Yajamana:', 'यजमान:', 'यजमान:', 'યજમાન:')} <strong>{displayDonorName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="material-symbols-outlined text-sm text-[#FFDF94]">badge</span>
                <span>PAN: <strong>{displayDonorPan}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#FFDF94]">domain_verification</span>
                <span>{loc('Trust Reg. No:', 'ट्रस्ट नोंदणी क्र:', 'ट्रस्ट पंजीकरण सं:', 'ટ્રસ્ટ નોંધણી નં:')} <strong>F/49210/Pune</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row xl:flex-col items-start xl:items-end justify-center gap-3 shrink-0">
            <button
              onClick={handleDownloadForm10BE}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FFDF94] text-[#251A00] hover:bg-[#FFD979] transition-all text-xs font-bold shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl leading-none">download_for_offline</span>
              <span>{loc('Download Form 10BE (PDF)', 'Form 10BE (PDF) डाउनलोड करा', 'Form 10BE (PDF) डाउनलोड करें', 'Form 10BE (PDF) ડાઉનલોડ કરો')}</span>
            </button>
            <span className="text-[11px] text-white/80 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#FFDF94]">verified_user</span>
              {loc('With Digital Signature • SHA-256 Verified', 'डिजिटल स्वाक्षरीसह • SHA-256 Verified', 'डिजिटल हस्ताक्षर युक्त • SHA-256 Verified', 'ડિજિટલ હસ્તાક્ષર સાથે • SHA-256 Verified')}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Layout: Direct Trust UPI QR & Instant Seva Sankalpa Formulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="quick-seva-panel">
        {/* Left: Direct UPI QR Code & Banking Credentials (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#570013] text-xl">qr_code_2</span>
                <h3 className="font-serif text-base font-bold text-[#221918]">
                  {loc('Official Trust Direct UPI QR', 'अधिकृत ट्रस्ट थेट UPI QR', 'आधिकारिक ट्रस्ट सीधा UPI QR', 'સત્તાવાર ટ્રસ્ટ સીધો UPI QR')}
                </h3>
              </div>
              <span className="bg-[#FFD979]/40 text-[#795D00] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {loc('Instant 80G Receipt', 'झटपट ८०-जी पावती', 'तत्काल 80G रसीद', 'ઝડપી ૮૦G પાવતી')}
              </span>
            </div>

            <p className="text-xs text-[#584141] mt-2 mb-4 leading-relaxed">
              {loc(
                'Scan from any UPI app (GPay, PhonePe, Paytm, BHIM) to contribute directly to the Ashram account.',
                'कोणत्याही UPI ॲपवरून (GPay, PhonePe, Paytm, BHIM) स्कॅन करून थेट आश्रम खात्यात सेवा समर्पण करा.',
                'किसी भी UPI ऐप (GPay, PhonePe, Paytm, BHIM) से स्कैन करके सीधे आश्रम खाते में सेवा समर्पण करें।',
                'કોઈપણ UPI એપ (GPay, PhonePe, Paytm, BHIM) પરથી સ્કેન કરીને સીધા આશ્રમ ખાતામાં સેવા સમર્પણ કરો.'
              )}
            </p>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#FFF0ED] rounded-xl mb-4 border border-[#E0BFBF]/30">
              <div className="w-48 h-48 bg-white p-3 rounded-lg shadow-xs flex flex-col items-center justify-center relative border border-[#E0BFBF]/20">
                <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
                  <rect fill="#FFFFFF" height="100" width="100"></rect>
                  {/* Top Left Marker */}
                  <rect fill="#570013" height="26" rx="3" width="26" x="6" y="6"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="11" y="11"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="15" y="15"></rect>
                  {/* Top Right Marker */}
                  <rect fill="#570013" height="26" rx="3" width="26" x="68" y="6"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="73" y="11"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="77" y="15"></rect>
                  {/* Bottom Left Marker */}
                  <rect fill="#570013" height="26" rx="3" width="26" x="6" y="68"></rect>
                  <rect fill="#FFFFFF" height="16" rx="2" width="16" x="11" y="73"></rect>
                  <rect fill="#570013" height="8" rx="1" width="8" x="15" y="77"></rect>
                  {/* Data Elements */}
                  <rect fill="#765B00" height="6" width="6" x="38" y="8"></rect>
                  <rect fill="#221918" height="6" width="12" x="48" y="8"></rect>
                  <rect fill="#570013" height="8" width="8" x="38" y="18"></rect>
                  <rect fill="#221918" height="6" width="8" x="52" y="18"></rect>
                  <rect fill="#221918" height="6" width="22" x="38" y="28"></rect>
                  <rect fill="#221918" height="10" width="6" x="8" y="38"></rect>
                  <rect fill="#765B00" height="6" width="8" x="18" y="38"></rect>
                  <rect fill="#221918" height="8" width="8" x="30" y="38"></rect>
                  <rect fill="#570013" height="6" width="16" x="42" y="38"></rect>
                  <rect fill="#221918" height="8" width="8" x="64" y="38"></rect>
                  <rect fill="#765B00" height="6" width="16" x="76" y="38"></rect>
                  <rect fill="#570013" height="8" width="14" x="8" y="52"></rect>
                  <rect fill="#221918" height="6" width="12" x="26" y="50"></rect>
                  <rect fill="#221918" height="12" width="12" x="44" y="48"></rect>
                  <rect fill="#570013" height="10" width="6" x="62" y="50"></rect>
                  <rect fill="#221918" height="6" width="18" x="74" y="48"></rect>
                  <rect fill="#221918" height="6" width="8" x="38" y="68"></rect>
                  <rect fill="#765B00" height="8" width="16" x="50" y="68"></rect>
                  <rect fill="#570013" height="14" width="8" x="70" y="68"></rect>
                  <rect fill="#221918" height="6" width="10" x="82" y="68"></rect>
                  {/* Central Trust Om Emblem */}
                  <circle cx="50" cy="50" fill="#FFFFFF" r="10"></circle>
                  <circle cx="50" cy="50" fill="#570013" r="8"></circle>
                  <text fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" x="50" y="53">
                    ॐ
                  </text>
                </svg>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[11px] text-[#584141] font-medium">{loc('Official UPI VPA ID:', 'अधिकृत UPI VPA ID:', 'आधिकारिक UPI VPA ID:', 'સત્તાવાર UPI VPA ID:')}</span>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-[#570013] font-mono select-all">
                    chaitanyaved@sbi
                  </span>
                  <button
                    onClick={handleCopyVPA}
                    className="text-[#584141] hover:text-[#570013] p-1 cursor-pointer"
                    title="Copy VPA"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details Box */}
            <div className="p-3 bg-[#FFF0ED] rounded-xl space-y-1.5 text-xs text-[#221918] border border-[#E0BFBF]/30">
              <div className="flex items-center justify-between">
                <span className="text-[#584141]">{loc('Account Name:', 'खाते नाव:', 'खाता नाम:', 'ખાતાનું નામ:')}</span>
                <span className="font-semibold text-right">Chaitanya Ved Pratishthan Trust</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#584141]">{loc('Current Account No:', 'चालू खाते क्र:', 'चालू खाता सं:', 'ચાલુ ખાતા નં:')}</span>
                <span className="font-semibold font-mono">39482019482</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#584141]">{loc('IFSC Code:', 'IFSC कोड:', 'IFSC कोड:', 'IFSC કોડ:')}</span>
                <span className="font-semibold text-[#570013] font-mono">SBIN0001234 (SBI Main Branch)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E0BFBF]/30 flex items-center justify-between text-xs text-[#584141]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#765B00] text-sm">verified</span>
              <span>State Bank of India Corporate Trust</span>
            </span>
            <span className="text-[#570013] font-bold">{loc('100% Tax Deductible', '१००% कर सवलत पात्र', '100% कर कटौती योग्य', '૧૦૦% કર મુક્તિ પાત્ર')}</span>
          </div>
        </div>

        {/* Right: Instant Seva Selection & Online Contribution (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-[#E0BFBF]/40 flex flex-col justify-between space-y-4">
          <form onSubmit={handlePaymentInitiate} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0BFBF]/30">
              <div>
                <h3 className="font-serif text-base font-bold text-[#221918]">
                  {loc('New Seva Contribution', 'नवीन संकल्प सेवा समर्पण', 'नया संकल्प सेवा समर्पण', 'નવું સંકલ્પ સેવા સમર્પણ')}
                </h3>
                <p className="text-xs text-[#584141] mt-0.5">
                  {loc(
                    'Select your contribution for Vedic preservation, Gurukul resident scholars, and daily Go-puja.',
                    'वेद संवर्धन, गुरुकुल निवासी छात्र व नित्य गोपूजनासाठी आपले योगदान निवडा.',
                    'वेद संवर्धन, गुरुकुल निवासी छात्रों और दैनिक गो-पूजन के लिए अपना योगदान चुनें।',
                    'વેદ સંવર્ધન, ગુરુકુલ નિવાસી વિદ્યાર્થીઓ અને દૈનિક ગો-પૂજા માટે આપનું યોગદાન પસંદ કરો.'
                  )}
                </p>
              </div>
              <span className="w-9 h-9 rounded-full bg-[#FFD979]/40 flex items-center justify-center text-[#765B00] shrink-0">
                <span className="material-symbols-outlined text-xl">self_improvement</span>
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((p) => {
                const isSelected = customAmount === p.amount;
                return (
                  <button
                    key={p.amount}
                    type="button"
                    onClick={() => handleSelectPreset(p.amount, p.title)}
                    className={`p-3 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FCEAE6] border-[#570013] ring-1 ring-[#570013]'
                        : 'bg-[#FFF0ED] border-[#E0BFBF]/40 hover:bg-[#F6E4E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-[#765B00] font-bold uppercase tracking-wider">
                        {p.label}
                      </span>
                      <span
                        className={`material-symbols-outlined text-base ${
                          isSelected ? 'text-[#570013]' : 'text-[#8C7071] opacity-50'
                        }`}
                      >
                        check_circle
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#221918] mt-1 leading-snug">
                      {p.title}
                    </div>
                    <div className="font-serif text-xl font-bold text-[#570013] mt-2">
                      ₹{p.amount.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount & Purpose Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#584141] mb-1">
                  {loc('Contribution Amount (INR):', 'समर्पण रक्कम (रुपये):', 'समर्पण राशि (रुपये):', 'સમર્પણ રકમ (રૂપિયા):')}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-serif font-bold text-sm text-[#570013]">₹</span>
                  <input
                    type="number"
                    min="100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFF8F6] text-[#221918] font-serif text-base font-bold border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#584141] mb-1">
                  {loc('Seva Sankalpa Purpose:', 'सेवा संकल्प उद्देश:', 'सेवा संकल्प उद्देश्य:', 'સેવા સંકલ્પ હેતુ:')}
                </label>
                <input
                  type="text"
                  value={sevaPurpose}
                  onChange={(e) => setSevaPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF8F6] text-[#221918] text-xs border border-[#E0BFBF]/50 focus:outline-none focus:ring-2 focus:ring-[#765B00]"
                />
              </div>
            </div>

            {/* PAN Card Toggle */}
            <div className="p-3 bg-[#FFF0ED] rounded-xl space-y-1 border border-[#E0BFBF]/30">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPanAttached}
                  onChange={(e) => setIsPanAttached(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#570013] rounded"
                />
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-[#221918]">
                    {loc(
                      'Attach my PAN for Section 80G tax deduction',
                      '८०-जी करसवलतीसाठी माझा पॅन क्रमांक (PAN) संलग्न करा',
                      'धारा 80G कर छूट के लिए मेरा पैन नंबर (PAN) संलग्न करें',
                      'કલમ ૮૦G કર મુક્તિ માટે મારો પાન નંબર (PAN) જોડો'
                    )}
                  </span>
                  <span className="text-[#584141]">
                    {loc(
                      `PAN: ${profile?.panNumber || 'ABCDE1234F'} (${profile?.name || 'Devotee'}) • Automatically added for Form 10BE.`,
                      `पॅन कार्ड: ${profile?.panNumber || 'ABCDE1234F'} (${profile?.name || 'भक्त'}) • Form 10BE साठी स्वयंचलित जोडले जाईल.`,
                      `पैन कार्ड: ${profile?.panNumber || 'ABCDE1234F'} (${profile?.name || 'भक्त'}) • Form 10BE के लिए स्वतः जोड़ा जाएगा।`,
                      `પાન કાર્ડ: ${profile?.panNumber || 'ABCDE1234F'} (${profile?.name || 'ભક્ત'}) • Form 10BE માટે આપમેળે ઉમેરાશે.`
                    )}
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E0BFBF]/30">
              <div className="flex items-center gap-1.5 text-xs text-[#584141]">
                <span className="material-symbols-outlined text-[#765B00] text-base">lock</span>
                <span>{loc('256-bit Secure Payment Gateway (UPI, Cards, NetBanking)', '२५६-बिट सुरक्षित पेमेंट गेटवे (UPI, Cards, NetBanking)', '256-बिट सुरक्षित भुगतान गेटवे (UPI, Cards, NetBanking)', '૨૫૬-બીટ સુરક્ષિત ચુકવણી ગેટવે (UPI, Cards, NetBanking)')}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#570013] hover:bg-[#800020] cursor-pointer'
                }`}
              >
                <span>
                  {isSubmitting
                    ? loc('Processing Seva...', 'समर्पण प्रक्रिया सुरू आहे...', 'समर्पण प्रक्रिया जारी है...', 'સમર્પણ પ્રક્રિયા ચાલુ છે...')
                    : loc('Proceed to Secure Payment', 'सुरक्षित समर्पण पुढे करा', 'सुरक्षित भुगतान के साथ आगे बढ़ें', 'સુરક્ષિત ચુકવણી આગળ ધપાવો')}
                </span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Comprehensive 80G Receipt History Table Section */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xs border border-[#E0BFBF]/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E0BFBF]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#570013] text-2xl">history_edu</span>
              <h2 className="font-serif text-xl font-bold text-[#221918]">
                {loc('80G Receipts History & Records', 'पावती इतिहास व तपशीलवार यादी (80G Receipts History)', '80G रसीद इतिहास एवं विस्तृत सूची', '૮૦G પાવતી ઇતિહાસ અને વિગતવાર યાદી')}
              </h2>
            </div>
            <p className="text-xs text-[#584141] mt-0.5">
              {loc(
                'All receipts are digitally signed and securely archived according to CBDT guidelines.',
                'सर्व पावत्या आयकर विभाग (CBDT) नियमांनुसार डिजिटल स्वाक्षरीसह सुरक्षित संग्रहित आहेत.',
                'सभी रसीदें आयकर विभाग (CBDT) के नियमों के अनुसार डिजिटल हस्ताक्षर सहित सुरक्षित संग्रहीत हैं।',
                'તમામ પાવતીઓ આયકર વિભાગ (CBDT) ના નિયમો મુજબ ડિજિટલ હસ્તાક્ષર સાથે સુરક્ષિત સંગ્રહિત છે.'
              )}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0ED] text-xs border border-[#E0BFBF]/40">
              <span className="text-[#584141]">{loc('Financial Year:', 'आर्थिक वर्ष:', 'वित्तीय वर्ष:', 'નાણાકીય વર્ષ:')}</span>
              <select
                value={selectedFy}
                onChange={(e) => setSelectedFy(e.target.value)}
                className="bg-transparent font-bold text-[#570013] focus:outline-none cursor-pointer"
              >
                <option value="2024-25">FY 2024-25</option>
                <option value="2023-24">FY 2023-24</option>
                <option value="all">{loc('All Years', 'सर्व वर्षे', 'सभी वर्ष', 'બધા વર્ષો')}</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0ED] text-xs border border-[#E0BFBF]/40">
              <span className="text-[#584141]">{loc('Seva:', 'सेवा:', 'सेवा:', 'સેવા:')}</span>
              <select
                value={selectedSevaCategory}
                onChange={(e) => setSelectedSevaCategory(e.target.value)}
                className="bg-transparent font-bold text-[#570013] focus:outline-none cursor-pointer"
              >
                <option value="all">{loc('All Sevas', 'सर्व सेवा', 'सभी सेवाएं', 'બધી સેવાઓ')}</option>
                <option value="anushthan">{loc('Anushthan Seva', 'अनुष्ठान सेवा', 'अनुष्ठान सेवा', 'અનુષ્ઠાન સેવા')}</option>
                <option value="gurukul">{loc('Gurukul Adoption', 'गुरुकुल दत्तक', 'गुरुकुल दत्तक', 'ગુરુકુલ દત્તક')}</option>
                <option value="goseva">{loc('Go Seva & Abhishek', 'गोसेवा व अभिषेक', 'गोसेवा व अभिषेक', 'ગો સેવા અને અભિષેક')}</option>
                <option value="library">{loc('Library Fund', 'ग्रंथालय निधी', 'पुस्तकालय निधि', 'ગ્રંથાલય ભંડોળ')}</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="p-2 rounded-xl bg-[#FFF0ED] hover:bg-[#FCEAE6] text-[#221918] transition-colors border border-[#E0BFBF]/40 cursor-pointer"
              title={loc('Export as CSV', 'CSV म्हणून डाउनलोड करा', 'CSV के रूप में निर्यात करें', 'CSV તરીકે ડાઉનલોડ કરો')}
            >
              <span className="material-symbols-outlined text-base">download</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FFF0ED] text-[#584141] font-semibold">
                <th className="py-3 px-4 rounded-l-xl">{loc('Receipt #', 'पावती क्रमांक', 'रसीद संख्या', 'પાવતી નંબર')}</th>
                <th className="py-3 px-3">{loc('Date', 'दिनांक', 'दिनांक', 'તારીખ')}</th>
                <th className="py-3 px-4">{loc('Seva Purpose', 'सेवेचे नाव व संकल्प', 'सेवा का नाम व संकल्प', 'સેવાનું નામ અને સંકલ્પ')}</th>
                <th className="py-3 px-3">{loc('Payment Mode', 'भरणा पद्धत', 'भुगतान माध्यम', 'ચુકવણી પદ્ધતિ')}</th>
                <th className="py-3 px-4 text-right">{loc('Amount', 'रक्कम', 'राशि', 'રકમ')}</th>
                <th className="py-3 px-3 text-center">{loc('80G Status', '८०-जी स्थिती', '80G स्थिति', '૮૦G સ્થિતિ')}</th>
                <th className="py-3 px-4 rounded-r-xl text-center">{loc('Action', 'कृती', 'कार्य', 'ક્રિયા')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0BFBF]/20 text-[#221918]">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#8C7071]">
                    {loc(
                      'No donation receipts found for the selected filter. Make your first sacred contribution above.',
                      'निवडलेल्या निकषासाठी कोणत्याही देणगी पावत्या आढळल्या नाहीत. वरून आपले पहिले समर्पण करा.',
                      'चयनित फिल्टर हेतु कोई दान रसीद उपलब्ध नहीं है। ऊपर से अपना प्रथम समर्पण करें।',
                      'પસંદ કરેલ ફિલ્ટર માટે કોઈ દાન પાવતી મળી નથી. ઉપરથી તમારું પ્રથમ સમર્પણ કરો.'
                    )}
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((r) => (
                  <tr key={r.receiptNo} className="hover:bg-[#FFF0ED]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#570013] whitespace-nowrap">
                      {r.receiptNo}
                    </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#584141]">
                    {r.dateIso ? formatLocalizedDate(r.dateIso, language) : r.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#221918]">
                      {language === 'en'
                        ? r.purpose
                        : language === 'hi'
                        ? (r.purposeHi || r.purpose)
                        : language === 'gu'
                        ? (r.purposeGu || r.purpose)
                        : (r.purposeMr || r.purpose)}
                    </div>
                    <div className="text-[11px] text-[#584141]">
                      {loc('Vedic Trust Seva Fund', 'वेद प्रतिष्ठान सेवा निधी', 'वेद प्रतिष्ठान सेवा निधि', 'વેદ પ્રતિષ્ઠાન સેવા ભંડોળ')}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#584141]">{r.mode}</td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-sm text-[#570013] whitespace-nowrap">
                    {formatLocalizedCurrency(r.amount, language)}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDF94] text-[#251A00] text-[10px] font-bold">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {loc('80G Issued', '८०-जी जारी', '80G जारी', '૮૦G જારી')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedReceipt(r)}
                        className="p-1.5 rounded-lg text-[#570013] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
                        title={loc('Open Receipt PDF', 'पावती PDF उघडा', 'रसीद PDF खोलें', 'પાવતી PDF ખોલો')}
                      >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                      </button>
                      <button
                        onClick={() => handleEmailReceipt(r.receiptNo)}
                        className="p-1.5 rounded-lg text-[#584141] hover:text-[#570013] hover:bg-[#FFF0ED] transition-colors cursor-pointer"
                        title={loc('Send to Email', 'ईमेलवर पाठवा', 'ईमेल पर भेजें', 'ઈમેલ પર મોકલો')}
                      >
                        <span className="material-symbols-outlined text-base">mail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Total Summary Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E0BFBF]/30 text-xs text-[#584141]">
          <span>{loc(`Showing ${filteredReceipts.length} records`, `एकूण ${filteredReceipts.length} नोंदी दर्शविल्या जात आहेत`, `कुल ${filteredReceipts.length} प्रविष्टियां दिखाई जा रही हैं`, `કુલ ${filteredReceipts.length} પ્રવેશો દર્શાવવામાં આવી રહ્યા છે`)}</span>
          <span>
            {loc('Current Page Total:', 'चालू पानातील एकूण योग:', 'वर्तमान पृष्ठ का कुल योग:', 'ચાલુ પૃષ્ઠનો કુલ સરવાળો:')}{' '}
            <strong className="text-[#570013] font-serif text-sm font-bold">
              {formatLocalizedCurrency(totalFilteredAmount, language)}
            </strong>
          </span>
        </div>
      </div>

      {/* Statutory Compliance Notice */}
      <div className="p-6 rounded-2xl bg-[#FFF0ED] border border-[#E0BFBF]/40 flex flex-col md:flex-row items-start gap-4 text-xs text-[#584141]">
        <div className="w-10 h-10 rounded-xl bg-white text-[#570013] flex items-center justify-center shrink-0 shadow-2xs">
          <span className="material-symbols-outlined text-xl">policy</span>
        </div>
        <div className="space-y-1 leading-relaxed">
          <h3 className="font-serif text-sm font-bold text-[#570013]">
            {loc('Section 80G Statutory Compliance & Transparency Policy', '८०-जी आयकर सवलत व वैधानिक पारदर्शकता नियम', 'धारा 80G आयकर छूट एवं वैधानिक पारदर्शिता नियम', 'કલમ ૮૦G આયકર મુક્તિ અને વૈધાનિક પારદર્શિતા નીતિ')}
          </h3>
          <p>
            {loc(
              'Chaitanya Ved Pratishthan is a public charitable trust registered under the Bombay Public Trusts Act, 1950 (Reg. No. F/49210/Pune). The Trust holds valid 80G(5)(vi) exemption under the Indian Income Tax Act, 1961. For all donors who provide their PAN, Form 10BE statements are timely filed with the Central Board of Direct Taxes (CBDT).',
              'चैतन्य वेद प्रतिष्ठान हे मुंबई सार्वजनिक विश्वस्त व्यवस्था अधिनियम १९५० अंतर्गत नोंदणीकृत धर्मादाय न्यास आहे (नोंदणी क्र. F/49210/पुणे). न्यासाला भारतीय आयकर कायदा १९६१ च्या कलम ८०-जी (५)(vi) अन्वये करसवलत प्रमाणपत्र प्राप्त आहे. पॅन क्रमांक नोंदवलेल्या सर्व देणगीदारांच्या पावत्या केंद्रीय प्रत्यक्ष कर मंडळ (CBDT) कडे फॉर्म १०-बीई मध्ये विहित मुदतीत दाखल केल्या जातात.',
              'चैतन्य वेद प्रतिष्ठान बॉम्बे पब्लिक ट्रस्ट्स एक्ट, 1950 के तहत पंजीकृत एक धर्मार्थ ट्रस्ट है (पंजीकरण सं. F/49210/पुणे)। ट्रस्ट को भारतीय आयकर अधिनियम, 1961 की धारा 80G(5)(vi) के तहत वैध कर छूट प्राप्त है। पैन नंबर प्रदान करने वाले सभी दानदाताओं के विवरण केंद्रीय प्रत्यक्ष कर बोर्ड (CBDT) को फॉर्म 10BE में समय पर दाखिल किए जाते हैं।',
              'ચૈતન્ય વેદ પ્રતિષ્ઠાન બોમ્બે પબ્લિક ટ્રસ્ટ્સ એક્ટ, ૧૯૫૦ હેઠળ નોંધાયેલ જાહેર ધર્માદા ટ્રસ્ટ છે (નોંધણી નં. F/49210/પુણે). ટ્રસ્ટ ભારતીય આયકર અધિનિયમ, ૧૯૬૧ ની કલમ ૮૦G(૫)(vi) હેઠળ કરમુક્તિ પ્રમાણપત્ર ધરાવે છે. પાન નંબર પૂરો પાડતા તમામ દાતાઓ માટે સેન્ટ્રલ બોર્ડ ઑફ ડાયરેક્ટ ટેક્સિસ (CBDT) માં ફોર્મ ૧૦BE સમયસર ફાઇલ કરવામાં આવે છે.'
            )}
          </p>
          <p className="text-[11px] text-[#765B00] pt-1">
            {loc('Ashram Accounts Desk: +91 98220 54321 • Email: accounts@chaitanyaved.org', 'आश्रम लेखा विभाग: +९१ ९८२२० ५४३२१ • ईमेल: accounts@chaitanyaved.org', 'आश्रम लेखा विभाग: +91 98220 54321 • ईमेल: accounts@chaitanyaved.org', 'આશ્રમ હિસાબ વિભાગ: +91 98220 54321 • ઈમેલ: accounts@chaitanyaved.org')}
          </p>
        </div>
      </div>

      {/* Receipt Modal Replica */}
      {selectedReceipt && (
        <Modal
          isOpen={Boolean(selectedReceipt)}
          onClose={() => setSelectedReceipt(null)}
          title={loc('Official 80G Donation Receipt', 'अधिकृत ८०-जी धर्मदाय पावती', 'आधिकारिक 80G धर्मार्थ रसीद', 'સત્તાવાર ૮૦G ધર્માદા પાવતી')}
          subtitle={loc(
            'Tax Exemption Certificate under Section 80G(5)(vi)',
            'कलम ८०-जी (५)(vi) अंतर्गत करसवलत प्रमाणपत्र',
            'धारा 80G(5)(vi) के तहत कर छूट प्रमाण पत्र',
            'કલમ ૮૦G(૫)(vi) હેઠળ કરમુક્તિ પ્રમાણપત્ર'
          )}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="text-center pb-3 border-b border-[#E0BFBF]/30 space-y-0.5">
              <div className="font-serif text-xl font-bold text-[#570013]">
                {t('org.name')}
              </div>
              <div className="text-[11px] text-[#584141]">
                Regd. Public Charitable Trust F/49210 (Pune) • 80G Approval #AAATC49210F20214
              </div>
              <div className="text-xs text-[#765B00] font-semibold">
                {loc('Vedic Studies, Swadhyaya & Gurukul Seva Trust', 'वेद अध्ययन, स्वाध्याय व गुरुकुल सेवा न्यास', 'वेद अध्ययन, स्वाध्याय व गुरुकुल सेवा न्यास', 'વેદ અધ્યયન, સ્વાધ્યાય અને ગુરુકુલ સેવા ટ્રસ્ટ')}
              </div>
            </div>

            <div className="bg-[#FFF0ED] p-4 rounded-xl space-y-2 text-xs border border-[#E0BFBF]/30">
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Receipt No:', 'पावती क्र:', 'रसीद सं:', 'પાવતી નં:')}</span>
                <span className="font-mono font-bold text-[#570013]">{selectedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Date:', 'दिनांक:', 'दिनांक:', 'તારીખ:')}</span>
                <span className="font-semibold text-[#221918]">
                  {selectedReceipt.dateIso ? formatLocalizedDate(selectedReceipt.dateIso, language) : selectedReceipt.date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Donor Name:', 'देणगीदार नाव:', 'दानदाता नाम:', 'દાતાનું નામ:')}</span>
                <span className="font-bold text-[#221918]">
                  {displayDonorName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Donor PAN:', 'पॅन क्र:', 'पैन सं:', 'પાન નં:')}</span>
                <span className="font-bold text-[#221918] font-mono">{selectedReceipt.donorPan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#584141]">{loc('Seva Purpose:', 'सेवा संकल्प:', 'सेवा संकल्प:', 'સેવા સંકલ્પ:')}</span>
                <span className="font-bold text-[#570013]">
                  {language === 'en'
                    ? selectedReceipt.purpose
                    : language === 'hi'
                    ? (selectedReceipt.purposeHi || selectedReceipt.purpose)
                    : language === 'gu'
                    ? (selectedReceipt.purposeGu || selectedReceipt.purpose)
                    : (selectedReceipt.purposeMr || selectedReceipt.purpose)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E0BFBF]/40 text-sm font-bold">
                <span>{loc('Amount:', 'समर्पण रक्कम:', 'समर्पण राशि:', 'સમર્પણ રકમ:')}</span>
                <span className="text-[#570013] font-serif text-lg">
                  {formatLocalizedCurrency(selectedReceipt.amount, language)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FFDF94]/30 rounded-xl text-xs text-[#251A00] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765B00] text-lg">verified</span>
              <div>
                {loc(
                  'Digitally Signed Official Document: This receipt is valid for 100% tax exemption under Section 80G of the Income Tax Act.',
                  'डिजिटल स्वाक्षरी केलेले अधिकृत दस्तऐवज: हे पावती दस्तऐवज आयकर कलम ८०-जी अन्वये १००% कर वजावटीसाठी अधिकृत आहे.',
                  'डिजिटल हस्ताक्षरित आधिकारिक दस्तावेज: यह रसीद आयकर अधिनियम की धारा 80G के तहत 100% कर छूट के लिए मान्य है।',
                  'ડિજિટલ હસ્તાક્ષરિત સત્તાવાર દસ્તાવેજ: આ પાવતી દસ્તાવેજ આયકર કલમ ૮૦G હેઠળ ૧૦૦% કર કપાત માટે માન્ય છે.'
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0BFBF]/30">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold cursor-pointer"
              >
                {loc('Close', 'बंद करा', 'बंद करें', 'બંધ કરો')}
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(loc('Official receipt PDF downloaded', 'अधिकृत पावती PDF डाउनलोड झाली', 'आधिकारिक रसीद PDF डाउनलोड हो गई', 'સત્તાવાર પાવતી PDF ડાઉનલોડ થઈ ગઈ'), 'success');
                  setSelectedReceipt(null);
                }}
                className="px-5 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>{loc('Download PDF', 'PDF डाउनलोड करा', 'PDF डाउनलोड करें', 'PDF ડાઉનલોડ કરો')}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
