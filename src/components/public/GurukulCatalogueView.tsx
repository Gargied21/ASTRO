import React, { useState } from 'react';
import { gurukulCourses, dinacharyaSchedule } from '../../data/gurukulData.ts';
import { GurukulCourse } from '../../types/index.ts';
import { Modal } from '../common/Modal.tsx';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedCurrency, formatLocalizedNumber } from '../../utils/formatters.ts';

interface GurukulCatalogueViewProps {
  onNavigate: (path: string) => void;
}

export const GurukulCatalogueView: React.FC<GurukulCatalogueViewProps> = ({ onNavigate }) => {
  const { showToast } = useDevotee();
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  const [enquiryCourse, setEnquiryCourse] = useState<string | null>(null);

  // Enquiry modal form
  const [applicantName, setApplicantName] = useState('');
  const [applicantAge, setApplicantAge] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [backgroundNotes, setBackgroundNotes] = useState('');

  const filterTabs = [
    {
      id: 'all',
      label:
        language === 'gu'
          ? 'બધા અભ્યાસક્રમ'
          : language === 'hi'
          ? 'सभी पाठ्यक्रम'
          : language === 'mr'
          ? 'सर्व अभ्यासक्रम'
          : 'All Courses',
    },
    {
      id: 'residential',
      label:
        language === 'gu'
          ? 'આવાસીય વેદ પાઠશાળા'
          : language === 'hi'
          ? 'आवासीय वेद पाठशाला'
          : language === 'mr'
          ? 'निवासी वेद पाठशाळा'
          : 'Residential Veda Pathshala',
    },
    {
      id: 'weekend',
      label:
        language === 'gu'
          ? 'સાપ્તાહિક સંસ્કૃત અને સ્તોત્ર'
          : language === 'hi'
          ? 'સાપ્તાહિક સંસ્કૃત તેમજ સ્તોત્ર'
          : language === 'mr'
          ? 'साप्ताहिक संस्कृत व स्तोत्र'
          : 'Weekend Sanskrit & Stotra',
    },
    {
      id: 'paurohitya',
      label:
        language === 'gu'
          ? 'કર્મકાંડ અને પૌરોહિત્ય'
          : language === 'hi'
          ? 'कर्मकांड एवं पौरोहित्य'
          : language === 'mr'
          ? 'कर्मकांड व पौरोहित्य'
          : 'Karmakanda & Yadnik',
    },
    {
      id: 'online',
      label:
        language === 'gu'
          ? 'ઑનલાઇન ગ્લોબલ અધ્યયન'
          : language === 'hi'
          ? 'ऑनलाइन वैश्विक अध्ययन'
          : language === 'mr'
          ? 'ऑनलाईन जागतिक अध्ययन'
          : 'Online Global Studies',
    },
  ];

  const filteredCourses = gurukulCourses.filter((course) => {
    if (activeFilter === 'all') return true;
    return course.category === activeFilter;
  });

  const toggleDetails = (courseId: string) => {
    setExpandedDetails((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      language === 'gu'
        ? `ધન્યવાદ! ${enquiryCourse} માટે આપની પ્રવેશ અરજી ગુરુકુળ કાર્યાલયમાં જમા થઈ ગઈ છે.`
        : language === 'hi'
        ? `धन्यवाद! ${enquiryCourse} हेतु आपका आवेदन गुरुकुल कार्यालय में जमा हो गया है।`
        : language === 'mr'
        ? `धन्यवाद! ${enquiryCourse} साठी आपला प्रवेश अर्ज गुरुकुल कार्यालयात सादर झाला आहे. आमचे आचार्य संपर्क करतील.`
        : `Thank you! Your admission enquiry for ${enquiryCourse} has been submitted to the Gurukul office. Our Acharya will contact you shortly.`;
    showToast(msg, 'success');
    setEnquiryCourse(null);
    setApplicantName('');
    setApplicantPhone('');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Heritage Breadcrumb */}
      <div className="w-full bg-[#FFF0ED] py-3 border-b border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex items-center justify-between text-xs text-[#584141]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#570013] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#765B00]">home</span>
              <span>{t('nav.home')}</span>
            </button>
            <span className="text-[#E0BFBF]">/</span>
            <span className="text-[#570013] font-semibold">
              {language === 'gu'
                ? 'ગુરુકુળ વેદ પાઠશાળા અને અધ્યયન કેન્દ્ર'
                : language === 'hi'
                ? 'गुरुकुल वेद पाठशाला एवं अध्ययन केंद्र'
                : language === 'mr'
                ? 'गुरुकुल वेद पाठशाळा व अध्ययन केंद्र'
                : 'Gurukul Veda Pathshala & Learning Centre'}
            </span>
          </nav>
          <span className="text-xs text-[#765B00] font-semibold hidden sm:inline notranslate">
            ॥ गुरुकुल परंपरा व वेद संरक्षणम् ॥
          </span>
        </div>
      </div>

      {/* Hero Editorial Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#FFF0ED] via-[#FFF8F6] to-white pb-14 pt-8">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <span className="px-3 py-1 rounded bg-[#FFDF94] text-[#251A00] text-xs tracking-wider uppercase font-bold w-fit">
                {language === 'gu' ? 'પરંપરાગત વૈદિક વિદ્યા' : language === 'hi' ? 'परंपरागत वैदिक विद्या' : language === 'mr' ? 'परंपरागत वैदिक विद्या' : 'Traditional Vedic Scholarship'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#570013] font-bold tracking-tight leading-tight">
                {language === 'gu'
                  ? 'સાંગવેદ અધ્યયન, વ્યાકરણ અને સંસ્કાર શિક્ષણ'
                  : language === 'hi'
                  ? 'सांगवेद अध्ययन, व्याकरण एवं संस्कार शिक्षण'
                  : language === 'mr'
                  ? 'सांगवेद अध्ययन, व्याकरण व संस्कार शिक्षण'
                  : 'Authentic Veda Adhyayan, Shastric Wisdom & Sanskrit Pathshala'}
                <span className="block mt-2 font-serif text-xl sm:text-2xl text-[#765B00] font-medium">
                  {language === 'gu'
                    ? 'પ્રામાણિક ગુરુ-શિષ્ય પરંપરા'
                    : language === 'hi'
                    ? 'प्रामाणिक गुरु-शिष्य परंपरा'
                    : language === 'mr'
                    ? 'सांगवेद अध्ययन, व्याकरण व संस्कार शिक्षण'
                    : 'Classical Guru-Shishya Tradition & Holistic Shastric Wisdom'}
                </span>
              </h1>
              <p className="text-base text-[#584141] leading-relaxed">
                {language === 'gu'
                  ? 'અખંડ મૌખિક શ્રુતિ પરંપરાનું જતન. વંદનીય ઘનપાઠી ગુરુજીઓના માર્ગદર્શન હેઠળ ઋગ્વેદ અને શુક્લ યજુર્વેદનું સસ્વર અધ્યયન, સંસ્કૃત સંભાષણ અને કર્મકાંડ પ્રશિક્ષણ.'
                  : language === 'hi'
                  ? 'अखंड मौखिक श्रुति परंपरा का संरक्षण। घनपाठी गुरुजनों के सान्निध्य में ऋग्वेद एवं शुक्ल यजुर्वेद का सस्वर अध्ययन, संस्कृत संभाषण एवं कर्मकांड प्रमाणन।'
                  : language === 'mr'
                  ? 'प्रामाणिक गुरु-शिष्य परंपरेतून वेदांचे अखंड मौखिक संरक्षण. पूज्य घनापाठींच्या मार्गदर्शनाखाली ऋग्वेद व शुक्ल यजुर्वेद सस्वर अध्ययन, संस्कृत संभाषण व कर्मकांड पदविका.'
                  : 'Preserving millennia of unbroken oral transmission through classical Guru-Shishya Parampara. Under the tutelage of reverent Ghanapathis, students undergo meticulous Swara-shuddha Rigveda and Shukla Yajurveda adhyayan, weekend Sanskrit Sambhashan, and practical Karmakanda certification.'}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-white p-3 rounded-lg border border-[#E0BFBF]/40 shadow-xs flex flex-col gap-0.5">
                  <span className="material-symbols-outlined text-[#765B00] text-lg">verified</span>
                  <span className="text-xs font-bold text-[#570013]">{t('home.trust1')}</span>
                  <span className="text-[10px] text-[#584141]">{t('home.trust1Sub')}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E0BFBF]/40 shadow-xs flex flex-col gap-0.5">
                  <span className="material-symbols-outlined text-[#765B00] text-lg">person_celebrate</span>
                  <span className="text-xs font-bold text-[#570013]">{t('home.trust2')}</span>
                  <span className="text-[10px] text-[#584141]">{t('home.trust2Sub')}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E0BFBF]/40 shadow-xs flex flex-col gap-0.5">
                  <span className="material-symbols-outlined text-[#765B00] text-lg">soup_kitchen</span>
                  <span className="text-xs font-bold text-[#570013]">
                    {language === 'gu' ? '૧૦૦% નિઃશુલ્ક સેવા' : language === 'hi' ? '100% निःशुल्क सेवा' : language === 'mr' ? '१००% मोफत सेवा' : '100% Free Seva'}
                  </span>
                  <span className="text-[10px] text-[#584141]">
                    {language === 'gu' ? 'ભોજન અને નિવાસ' : language === 'hi' ? 'आहार एवं आवास' : language === 'mr' ? 'अन्नछत्र व निवास' : 'Food & Lodging'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E0BFBF]/40 shadow-xs flex flex-col gap-0.5">
                  <span className="material-symbols-outlined text-[#765B00] text-lg">volunteer_activism</span>
                  <span className="text-xs font-bold text-[#570013]">
                    {language === 'gu' ? 'દાન / ૮૦-જી' : language === 'hi' ? 'दान / 80G' : language === 'mr' ? 'दान / ८०-जी' : '80G Tax Exemption'}
                  </span>
                  <span className="text-[10px] text-[#584141]">
                    {language === 'gu' ? 'કરમુક્તિ પાત્ર' : language === 'hi' ? 'कर कटौती योग्य' : language === 'mr' ? 'करसवलत पात्र' : 'Tax Deductible'}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#courses-catalogue"
                  className="px-6 py-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-all shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  <span>{language === 'gu' ? 'અભ્યાસક્રમો જુઓ' : language === 'hi' ? 'पाठ्यक्रम देखें' : language === 'mr' ? 'अभ्यासक्रम सूची पहा' : 'View Courses'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('gurukul-agni-sukta')}
                  className="px-5 py-3 rounded-lg bg-white border border-[#E0BFBF]/60 text-[#765B00] text-xs font-bold hover:bg-[#FFF0ED] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">headphones</span>
                  <span>{language === 'gu' ? 'ઑડિયો અધ્યયન પ્લેયર' : language === 'hi' ? 'ऑडियो अध्ययन प्लेयर' : language === 'mr' ? 'ऑडिओ स्वाध्याय प्लेयर' : 'Audio Adhyayan Player'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden shadow-xl bg-[#FCEAE6] border border-[#E0BFBF]/40">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-cATCSMk4rqrbEcUosA2iWNFN0qHNCsKsYRlcb1sWLQgGuM9qOBHVSrT6jYdTIosgXWE_w4yoVxqpcn-u3iGV0RXxxvBVctylHKwOcgzUn9NpHKpErTQ5dQT_wSWkzI7omSjqM36sqTO9RcGh4qRw-rTu2NL-buYUo9AX5KtlOZutqKUSYLZ3m0DjriG9lc1qbIt45yn3r4_qUMM1akvI1QZhCxr0Nu10YdoBaYhdpxm7u9DCW-DU2A"
                  alt="Vedic Gurukul Courtyard in Pune"
                  className="w-full h-[360px] object-cover"
                />
                <div className="p-4 bg-white flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#570013]">
                      {language === 'gu' ? 'શૈક્ષણિક સત્ર ૨૦૨૫–૨૬' : language === 'hi' ? 'शैक्षणिक सत्र 2025–26' : language === 'mr' ? 'शैक्षणिक वर्ष २०२५–२६' : 'Academic Session 2025–26'}
                    </h4>
                    <p className="text-xs text-[#584141]">
                      {language === 'gu' ? 'આવાસીય બેચ શ્રાવણ પૂર્ણિમાથી શરૂ' : language === 'hi' ? 'आवासीय बैच श्रावण पूर्णिमा से प्रारंभ' : language === 'mr' ? 'निवासी तुकड्या श्रावण पौर्णिमेपासून सुरू' : 'Residential batch begins Shravan Purnima'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#FFDF94] text-[#251A00] text-[10px] font-bold uppercase">
                    {language === 'gu' ? 'પ્રવેશ શરૂ' : language === 'hi' ? 'प्रवेश प्रारंभ' : language === 'mr' ? 'प्रवेश सुरू' : 'Admissions Open'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Filter Tabs */}
      <section className="w-full bg-[#FFF0ED] py-6 border-y border-[#E0BFBF]/30" id="courses-catalogue">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#765B00] font-semibold uppercase tracking-wider">
              {language === 'gu' ? 'પાઠશાળા અને અભ્યાસક્રમ' : language === 'hi' ? 'पाठशाला एवं पाठ्यक्रम' : language === 'mr' ? 'पाठशाळा व अभ्यासक्रम' : 'Pathshala & Curriculum'}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#570013] font-bold">
              {language === 'gu' ? 'પવિત્ર અધ્યયન શાખાઓ' : language === 'hi' ? 'પવિત્ર अध्ययन शाखाएं' : language === 'mr' ? 'पवित्र स्वाध्याय शाखा' : 'Sacred Study Disciplines'}
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#570013] text-white shadow-xs'
                    : 'bg-white text-[#584141] hover:text-[#570013] border border-[#E0BFBF]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Grid */}
      <section className="w-full bg-white py-12">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseTitle =
                language === 'gu'
                  ? course.titleGu || course.titleEn
                  : language === 'hi'
                  ? course.titleHi || course.titleMr
                  : language === 'mr'
                  ? course.titleMr
                  : course.titleEn;

              const courseDesc =
                language === 'gu'
                  ? course.descriptionGu || course.descriptionEn
                  : language === 'hi'
                  ? course.descriptionHi || course.descriptionMr
                  : language === 'mr'
                  ? course.descriptionMr
                  : course.descriptionEn;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-xs hover:shadow-lg transition-all border border-[#E0BFBF]/40 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="h-2 bg-[#570013] w-full"></div>
                  <div className="p-6 flex flex-col space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#FFDADA] text-[#570013] text-xs font-bold">
                        {language === 'gu' ? course.categoryLabelGu || course.categoryLabel : language === 'hi' ? course.categoryLabelHi || course.categoryLabel : language === 'mr' ? course.categoryLabelMr || course.categoryLabel : course.categoryLabel}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#765B00] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>
                          {language === 'gu'
                            ? formatLocalizedNumber(course.duration.replace('Years', 'વર્ષ').replace('Months', 'મહિના').replace('Weeks', 'અઠવાડિયા').replace('Year Diploma', 'વર્ષ ડિપ્લોમા').replace('Ongoing Series', 'સતત શ્રેણી'), 'gu')
                            : language === 'hi'
                            ? formatLocalizedNumber(course.duration.replace('Years', 'वर्ष').replace('Months', 'माह').replace('Weeks', 'सप्ताह').replace('Year Diploma', 'वर्ष डिप्लोमा').replace('Ongoing Series', 'निरंतर श्रृंखला'), 'hi')
                            : language === 'mr'
                            ? formatLocalizedNumber(course.duration.replace('Years', 'वर्षे').replace('Months', 'महिने').replace('Weeks', 'आठवडे').replace('Year Diploma', 'वर्ष पदविका').replace('Ongoing Series', 'अखंड व्याख्यानमाला'), 'mr')
                            : course.duration}
                        </span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg text-[#570013] font-bold group-hover:text-[#800020] transition-colors leading-snug">
                        {courseTitle}
                      </h3>
                      {language !== 'en' && (
                        <p className="text-xs text-[#765B00] font-semibold mt-0.5">
                          ({course.titleEn})
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#584141] leading-relaxed line-clamp-3">
                      {courseDesc}
                    </p>

                    <div className="bg-[#FFF0ED] rounded-lg p-3 space-y-1.5 text-xs text-[#584141]">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#221918]">
                          {language === 'gu' ? 'પાત્રતા:' : language === 'hi' ? 'पात्रता:' : language === 'mr' ? 'पात्रता:' : 'Eligibility:'}
                        </span>
                        <span className="text-right truncate ml-2">
                          {language === 'en'
                            ? course.eligibility.replace('निःशुल्क', 'Free')
                            : language === 'mr'
                            ? course.eligibility.includes('Age 8-14')
                              ? 'उपनयन संस्कार संपन्न (वय वर्षे ८ ते १४)'
                              : course.eligibility.includes('Upanayana')
                              ? 'उपनयन संस्कार संपन्न'
                              : course.eligibility.includes('passionate about Sanskrit')
                              ? 'संस्कृत जिज्ञासू (सर्व वयोगट)'
                              : course.eligibility.includes('globally')
                              ? 'सर्व भाविकांसाठी खुली'
                              : course.eligibility.includes('reading ability')
                              ? 'मूलभूत संस्कृत वाचन ज्ञान'
                              : course.eligibility.includes('Open to All')
                              ? 'सर्वांसाठी विनामूल्य'
                              : course.eligibility
                            : language === 'hi'
                            ? course.eligibility.includes('Age 8-14')
                              ? 'उपनयन संस्कार संपन्न (आयु 8-14 वर्ष)'
                              : course.eligibility.includes('Upanayana')
                              ? 'उपनयन संस्कार संपन्न'
                              : course.eligibility.includes('passionate about Sanskrit')
                              ? 'संस्कृत जिज्ञासु (सभी आयु वर्ग)'
                              : course.eligibility.includes('globally')
                              ? 'समस्त भक्तों हेतु सुलभ'
                              : course.eligibility.includes('reading ability')
                              ? 'प्राथमिक संस्कृत पठन ज्ञान'
                              : course.eligibility.includes('Open to All')
                              ? 'सभी के लिए निःशुल्क'
                              : course.eligibility
                            : course.eligibility.includes('Age 8-14')
                            ? 'ઉપનયન સંસ્કાર સંપન્ન (ઉંમર ૮-૧૪)'
                            : course.eligibility.includes('Upanayana')
                            ? 'ઉપનયન સંસ્કાર સંપન્ન'
                            : course.eligibility.includes('passionate about Sanskrit')
                            ? 'સંસ્કૃત જિજ્ઞાસુ (દરેક વયજૂથ)'
                            : course.eligibility.includes('globally')
                            ? 'દરેક ભક્તો માટે સુલભ'
                            : course.eligibility.includes('reading ability')
                            ? 'પ્રાથમિક સંસ્કૃત વાંચન જ્ઞાન'
                            : course.eligibility.includes('Open to All')
                            ? 'સૌ માટે નિઃશુલ્ક'
                            : course.eligibility}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#221918]">
                          {language === 'gu' ? 'શુલ્ક / સેવા:' : language === 'hi' ? 'शुल्क / सेवा:' : language === 'mr' ? 'शुल्क / सेवा:' : 'Seva:'}
                        </span>
                        <span className="text-[#765B00] font-bold">
                          {language === 'mr'
                            ? course.seva.includes('Scholarship')
                              ? '१००% मोफत शिष्यवृत्ती (भाविक पुरस्कृत)'
                              : course.seva.includes('Food & Lodging')
                              ? '१००% मोफत निवास व भोजन'
                              : course.seva.includes('2,500')
                              ? '₹ २,५०० (साहित्य समाविष्ट)'
                              : course.seva.includes('Self-Paced')
                              ? 'विनामूल्य डिजिटल स्वाध्याय'
                              : course.seva.includes('15,000')
                              ? '₹ १५,००० / वर्ष'
                              : course.seva.includes('Voluntary')
                              ? 'ऐच्छिक सहयोग समर्पण'
                              : course.seva
                            : language === 'hi'
                            ? course.seva.includes('Scholarship')
                              ? '100% निःशुल्क छात्रवृत्ति'
                              : course.seva.includes('Food & Lodging')
                              ? '100% निःशुल्क आवास एवं भोजन'
                              : course.seva.includes('2,500')
                              ? '₹ 2,500 (सामग्री सम्मिलित)'
                              : course.seva.includes('Self-Paced')
                              ? 'निःशुल्क डिजिटल अध्ययन'
                              : course.seva.includes('15,000')
                              ? '₹ 15,000 / वर्ष'
                              : course.seva.includes('Voluntary')
                              ? 'स्वैच्छिक सहयोग समर्पण'
                              : course.seva
                            : language === 'gu'
                            ? course.seva.includes('Scholarship')
                              ? '૧૦૦% નિઃશુલ્ક શિષ્યવૃત્તિ'
                              : course.seva.includes('Food & Lodging')
                              ? '૧૦૦% નિઃશુલ્ક આવાસ અને ભોજન'
                              : course.seva.includes('2,500')
                              ? '₹ ૨,૫૦૦ (સામગ્રી સામેલ)'
                              : course.seva.includes('Self-Paced')
                              ? 'નિઃશુલ્ક ડિજિટલ અધ્યયન'
                              : course.seva.includes('15,000')
                              ? '₹ ૧૫,૦૦૦ / વર્ષ'
                              : course.seva.includes('Voluntary')
                              ? 'સ્વૈચ્છિક દાન સમર્પણ'
                              : course.seva
                            : course.seva}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#221918]">
                          {language === 'gu' ? 'આચાર્ય:' : language === 'hi' ? 'आचार्य:' : language === 'mr' ? 'आचार्य:' : 'Faculty:'}
                        </span>
                        <span className="text-right truncate ml-2">
                          {language === 'en'
                            ? course.acharya.includes('श्रीपाद भट (घनापाठी)')
                              ? 'Ve. Mu. Dr. Shripad Bhat (Ghanapathi)'
                              : course.acharya.includes('गणेशबुवा रानडे')
                              ? 'Pt. Ganeshbua Ranade (Yajnik Visharad)'
                              : course.acharya.includes('माधवशास्त्री')
                              ? 'Dr. Madhavshastri Godbole (Sanskrit Scholar)'
                              : course.acharya.includes('श्रीपाद भट व सहकारी')
                              ? 'Ve. Mu. Dr. Shripad Bhat & Faculty'
                              : course.acharya.includes('विद्याधर शास्त्री')
                              ? 'Pt. Vidyadhar Shastri (Karmakanda Scholar)'
                              : course.acharya.includes('विद्वत्परिषद')
                              ? 'Ve. Mu. Dr. Shripad Bhat & Vidwat Parishad'
                              : course.acharya
                            : course.acharya}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEnquiryCourse(courseTitle)}
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors text-center cursor-pointer shadow-xs"
                      >
                        {language === 'gu' ? 'પ્રવેશ અરજી' : language === 'hi' ? 'प्रवेश आवेदन' : language === 'mr' ? 'प्रवेश चौकशी' : 'Admission Enquiry'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleDetails(course.id)}
                        className="py-2.5 px-3 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-semibold hover:bg-[#FCEAE6] transition-colors cursor-pointer"
                      >
                        {expandedDetails[course.id]
                          ? language === 'gu' ? 'બંધ કરો' : language === 'hi' ? 'बंद करें' : language === 'mr' ? 'लपवा' : 'Hide'
                          : language === 'gu' ? 'વિગતો' : language === 'hi' ? 'विवरण' : language === 'mr' ? 'तपशील' : 'Details'}
                      </button>
                    </div>

                    {course.isFeaturedAudio && (
                      <button
                        type="button"
                        onClick={() => onNavigate('gurukul-agni-sukta')}
                        className="w-full py-2 px-3 rounded-lg bg-[#FFDF94] text-[#251A00] text-xs font-bold hover:bg-[#FFD979] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">headphones</span>
                        <span>{language === 'gu' ? 'અગ્નિસૂક્ત ઑડિયો કન્સોલ' : language === 'hi' ? 'अग्निसूक्त ऑडियो कंसोल' : language === 'mr' ? 'अग्निसूक्त ध्वनीमुद्रण कन्सोल' : 'Agnisukta Audio Console'}</span>
                      </button>
                    )}

                    {expandedDetails[course.id] && (
                      <div className="mt-2 p-3 bg-[#FFF0ED] rounded-lg text-xs text-[#584141] space-y-1 animate-in fade-in duration-150">
                        <p className="font-bold text-[#570013]">
                          {language === 'gu' ? 'અભ્યાસક્રમ મુખ્ય વિષયો:' : language === 'hi' ? 'पाठ्यक्रम मुख्य बिंदु:' : language === 'mr' ? 'अभ्यासक्रमातील प्रमुख घटक:' : 'Curriculum Highlights:'}
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          {course.syllabusHighlights.map((hl, i) => (
                            <li key={i}>{hl}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Recitation Console Callout */}
      <section className="w-full bg-[#FFF0ED] py-14">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-[#E0BFBF]/40 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#765B00] uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-[#765B00] animate-pulse"></span>
                <span>{language === 'gu' ? 'ઇન્ટરેક્ટિવ સ્વર પાઠ કન્સોલ' : language === 'hi' ? 'इंटरैक्टिव स्वर पाठ कंसोल' : language === 'mr' ? 'सस्वर वेद स्वाध्याय कन्सोल' : 'Interactive Vedic Recitation Console'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                {language === 'gu'
                  ? 'ઋગ્વેદ અગ્નિસૂક્ત વૈદિક સ્વરાઘાત સાથે શીખો'
                  : language === 'hi'
                  ? 'ऋग्वेद अग्निसूक्त वैदिक स्वराघात सहित सीखें'
                  : language === 'mr'
                  ? 'ऋग्वेद अग्निसूक्त वैदिक स्वराघातांसह शिका'
                  : 'Learn Rigveda Agnisukta with Authentic Vedic Accents'}
              </h2>
              <p className="text-sm text-[#584141] leading-relaxed">
                {language === 'gu'
                  ? 'ઉચ્ચ ગુણવત્તાવાળા સ્ટુડિયો રેકોર્ડિંગ્સ સાંભળો, સંહિતા પાઠ, પદ પાઠ અને ક્રમ પાઠ વચ્ચે સ્વિચ કરો.'
                  : language === 'hi'
                  ? 'उच्च गुणवत्ता वाले स्टूडियो पाठ सुनें, संहिता पाठ, पद पाठ एवं क्रम पाठ के साथ शुद्ध उच्चारण सीखें।'
                  : language === 'mr'
                  ? '२४-बिट उच्च दर्जाचे ध्वनीमुद्रण ऐका, संहिता पाठ, पद पाठ व क्रम पाठ यातील फरक अभ्यासा.'
                  : 'Listen to 24-bit high-fidelity studio recitations, and compare Samhita, Pada, and Krama patha modes.'}
              </p>
              <div className="p-3.5 bg-[#FFF0ED] rounded-lg text-center font-serif text-base sm:text-lg text-[#570013] font-semibold notranslate">
                ॥ ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् । होता॑रं रत्न॒धात॑मम् ॥ १ ॥
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('gurukul-agni-sukta')}
                className="px-6 py-3.5 rounded-xl bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                <span>{language === 'gu' ? 'અગ્નિસૂક્ત પ્લેયર શરૂ કરો' : language === 'hi' ? 'अग्निसूक्त प्लेयर खोलें' : language === 'mr' ? 'अग्निसूक्त प्लेयर सुरू करा' : 'Open Agnisukta Player'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('resources')}
                className="px-5 py-3 rounded-xl bg-[#FFF0ED] text-[#570013] text-xs font-semibold hover:bg-[#FCEAE6] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>{language === 'gu' ? 'સ્તોત્ર પીડીએફ ડાઉનલોડ' : language === 'hi' ? 'स्तोत्र पीडीएफ डाउनलोड' : language === 'mr' ? 'स्तोत्र PDF डाउनलोड करा' : 'Download Stotra PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Ashram Dinacharya (5 Slots) */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
              {language === 'gu' ? 'આશ્રમ સાધના શિસ્ત' : language === 'hi' ? 'आश्रम साधना अनुशासन' : language === 'mr' ? 'कठोर आध्यात्मिक दिनचर्या' : 'Ashram Sadhana Discipline'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
              {language === 'gu' ? 'આશ્રમ દિનચર્યા' : language === 'hi' ? 'આશ્રમ દિનચર્યા' : language === 'mr' ? 'आश्रम दिनचर्या' : 'Ashram Dinacharya'}
            </h2>
            <p className="text-sm text-[#584141]">
              {language === 'gu'
                ? 'વૈદિક જ્ઞાન માત્ર પુસ્તકીય નથી, પરંતુ બ્રહ્મ મુહૂર્તથી રાત્રિ સ્તોત્ર આરાધના સુધીની તપોમય જીવન પદ્ધતિ છે.'
                : language === 'hi'
                ? 'वैदिक अध्ययन केवल बौद्धिक नहीं, अपितु ब्रह्म मुहूर्त से सायं तक अनुशासित जीवनशैली है।'
                : language === 'mr'
                ? 'वेदविद्या केवळ पुस्तकी नाही; ब्राह्म मुहूर्तापासून सायं दीप आराधनेपर्यंतची ही एक अखंड तपोमयी जीवनशैली आहे.'
                : 'Vedic scholarship transcends textbooks; it is a disciplined lifestyle from Brahma Muhurta to evening prayer.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {dinacharyaSchedule.map((item, index) => {
              const itemTitle =
                language === 'gu'
                  ? item.titleGu || item.titleEn
                  : language === 'hi'
                  ? item.titleHi || item.titleMr
                  : language === 'mr'
                  ? item.titleMr
                  : item.titleEn;

              const itemDesc =
                language === 'gu'
                  ? item.descGu || item.descEn
                  : language === 'hi'
                  ? item.descHi || item.descMr
                  : language === 'mr'
                  ? item.descMr
                  : item.descEn;

              return (
                <div
                  key={index}
                  className="bg-[#FFF0ED] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3 border border-[#E0BFBF]/30 hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-white text-[#570013] text-xs font-bold inline-block mb-2 shadow-2xs">
                      {formatLocalizedNumber(item.time, language)}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-[#570013]">
                      {itemTitle}
                    </h4>
                    <p className="text-xs text-[#584141] mt-1.5 leading-relaxed">
                      {itemDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#765B00] text-[11px] font-semibold pt-2 border-t border-[#E0BFBF]/30">
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{language === 'mr' ? item.titleMr : language === 'hi' ? item.titleHi || item.titleMr : language === 'gu' ? item.titleGu || item.titleEn : item.titleEn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vidyarthi Dattak Yojana (Sponsorship Banner) */}
      <section className="w-full bg-[#FFF0ED] py-16">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-[#E0BFBF]/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-[#765B00] text-white text-xs font-semibold uppercase tracking-wider notranslate">
                    ॥ विद्यादानं महादानम् ॥
                  </span>
                  <span className="text-xs text-[#765B00] font-bold">
                    {language === 'gu' ? '૧૦૦% ૮૦-જી કરમુક્તિ પાત્ર' : language === 'hi' ? '100% 80G कर कटौती योग्य' : language === 'mr' ? '१००% ८०-जी करसवलत पात्र' : '100% 80G Tax Deductible'}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
                  {language === 'gu'
                    ? 'વિદ્યાર્થી દત્તક યોજના'
                    : language === 'hi'
                    ? 'विद्यार्थी दत्तक योजना'
                    : language === 'mr'
                    ? 'विद्यार्थी दत्तक योजना'
                    : 'Student Sponsorship Scheme'}
                </h3>
                <p className="text-sm text-[#584141] leading-relaxed">
                  {language === 'gu'
                    ? 'દર વર્ષે શ્રદ્ધાળુ પરિવારના યુવાન બ્રહ્મચારીઓ ૭ થી ૧૦ વર્ષ વેદ સંરક્ષણ માટે અર્પણ કરે છે. આપ એક વિદ્યાર્થીના દૂધ, સાત્ત્વિક આહાર, વસ્ત્ર અને ચિકિત્સા ખર્ચને પ્રાયોજિત કરી શકો છો.'
                    : language === 'hi'
                    ? 'प्रतिवर्ष मेधावी ब्रह्मचारी 7 से 10 वर्ष वेद संरक्षण हेतु समर्पित करते हैं। आप एक विद्यार्थी के सात्त्विक आहार, वस्त्र एवं शिक्षण की सेवा ले सकते हैं।'
                    : language === 'mr'
                    ? 'दरवर्षी ग्रामीण व निष्ठावंत कुटुंबांतील होतकरू बटू ७ ते १० वर्षे वेदसंरक्षणासाठी समर्पित करतात. आपण एका विद्यार्थ्याच्या दूध, सात्त्विक भोजन, ग्रंथ व औषधोपचाराचा भार स्वीकारू शकता.'
                    : 'Every year earnest young students commit 7 to 10 years towards preserving our ancient Vedic heritage. You can sponsor a student’s nutrition, clothing, books, and medical care.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30">
                    <span className="text-xs text-[#765B00] font-bold block uppercase">
                      {language === 'gu' ? 'માસિક સેવા' : language === 'hi' ? 'માસિક સેવા' : language === 'mr' ? 'मासिक सहयोग' : 'Monthly Sponsorship'}
                    </span>
                    <span className="font-serif text-2xl text-[#570013] font-bold">
                      {formatLocalizedCurrency(3000, language)} <span className="text-xs font-normal text-[#584141]">/ {language === 'gu' ? 'મહિનો' : language === 'hi' ? 'माह' : language === 'mr' ? 'महिना' : 'month'}</span>
                    </span>
                    <p className="text-[11px] text-[#584141] mt-1">
                      {language === 'gu' ? 'એક વિદ્યાર્થીનું પોષણ, દૂધ અને પુસ્તકો.' : language === 'hi' ? 'एक विद्यार्थी का पोषण, दूध एवं पुस्तकें।' : language === 'mr' ? 'एका बटूचे पोषण, दूध व औषधोपचार.' : 'Nourishment, milk, and textbooks for one Vidyarthi.'}
                    </p>
                  </div>
                  <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30">
                    <span className="text-xs text-[#765B00] font-bold block uppercase">
                      {language === 'gu' ? 'વાર્ષિક દત્તક' : language === 'hi' ? 'વાર્ષિક દત્તક' : language === 'mr' ? 'वार्षिक दत्तक' : 'Annual Sponsorship'}
                    </span>
                    <span className="font-serif text-2xl text-[#570013] font-bold">
                      {formatLocalizedCurrency(36000, language)} <span className="text-xs font-normal text-[#584141]">/ {language === 'gu' ? 'વર્ષ' : language === 'hi' ? 'वर्ष' : language === 'mr' ? 'वर्ष' : 'year'}</span>
                    </span>
                    <p className="text-[11px] text-[#584141] mt-1">
                      {language === 'gu' ? 'સંપૂર્ણ શૈક્ષણિક વર્ષ માટે આશ્રય અને પ્રગતિ અહેવાલ.' : language === 'hi' ? 'સંપૂર્ણ વર્ષ કા સંવર્ધન તેમજ પ્રગતિ વિવરણ.' : language === 'mr' ? 'संपूर्ण शैक्षणिक वर्षाचे पालकत्व व वार्षिक प्रगती अहवाल.' : 'Full annual foster care with bi-annual progress reports.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 bg-[#FFF0ED] p-6 rounded-xl border border-[#E0BFBF]/30 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFDF94] text-[#795D00] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[36px]">volunteer_activism</span>
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#570013] font-bold">
                    {language === 'gu' ? 'વિદ્યાર્થી દત્તક લો' : language === 'hi' ? 'विद्यार्थी दत्तक लें' : language === 'mr' ? 'विद्यार्थी दत्तक घ्या' : 'Sponsor a Vidyarthi'}
                  </h4>
                  <p className="text-xs text-[#584141] mt-1">
                    {language === 'gu' ? 'સંકલ્પ આશીર્વાદ અને વિદ્યાર્થી તરફથી પત્ર મેળવો.' : language === 'hi' ? 'संकल्प आशीर्वाद एवं छात्र से पत्र प्राप्त करें।' : language === 'mr' ? 'संकल्प आशीर्वाद व विद्यार्थ्याचे पत्र प्राप्त करा.' : 'Receive Sankalpa blessings and student progress updates.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('donate')}
                  className="w-full py-3 px-4 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>{language === 'gu' ? 'ઑનલાઇન દાન કરો' : language === 'hi' ? 'ऑनलाइन दान करें' : language === 'mr' ? 'दत्तक सेवा समर्पित करा' : 'Sponsor Online'}</span>
                </button>
                <span className="text-[11px] text-[#584141]">
                  {language === 'gu' ? '૮૦-જી કરમુક્તિ પાવતી તુરંત મળે છે' : language === 'hi' ? '80G कर रसीद तुरंत प्राप्त होगी' : language === 'mr' ? '८०-जी करसवलत पावती त्वरित मिळते' : 'Instant 80G tax exemption receipt'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Enquiry Modal */}
      <Modal
        isOpen={Boolean(enquiryCourse)}
        onClose={() => setEnquiryCourse(null)}
        title={language === 'gu' ? 'ગુરુકુળ પ્રવેશ અરજી' : language === 'hi' ? 'गुरुकुल प्रवेश पूछताछ' : language === 'mr' ? 'गुरुकुल प्रवेश अर्ज' : 'Gurukul Admission Enquiry'}
        subtitle={enquiryCourse || ''}
        maxWidth="lg"
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {language === 'gu' ? 'વિદ્યાર્થી / અરજદારનું પૂરું નામ *' : language === 'hi' ? 'विद्यार्थी / आवेदक का पूरा नाम *' : language === 'mr' ? 'विद्यार्थी / अर्जदाराचे पूर्ण नाव *' : 'Applicant Full Name *'}
            </label>
            <input
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Aditya Sharma' : 'उदा. आदित्य शर्मा'}
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
                {language === 'gu' ? 'ઉંમર *' : language === 'hi' ? 'आयु *' : language === 'mr' ? 'वय *' : 'Age *'}
              </label>
              <input
                type="number"
                min="7"
                max="75"
                required
                value={applicantAge}
                onChange={(e) => setApplicantAge(e.target.value)}
                placeholder={language === 'en' ? 'e.g. 12 or 35' : 'उदा. 12 किंवा 35'}
                className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
                {language === 'gu' ? 'વ્હોટ્સએપ મોબાઇલ *' : language === 'hi' ? 'व्हाट्सएप मोबाइल *' : language === 'mr' ? 'व्हॉट्सअ‍ॅप मोबाईल *' : 'WhatsApp Mobile *'}
              </label>
              <input
                type="tel"
                required
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {language === 'gu' ? 'ઇમેઇલ એડ્રેસ' : language === 'hi' ? 'ईमेल पता' : language === 'mr' ? 'ईमेल' : 'Email Address'}
            </label>
            <input
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#221918] font-bold mb-1">
              {language === 'gu' ? 'પૂર્વ વૈદિક / સંસ્કૃત પૃષ્ઠભૂમિ' : language === 'hi' ? 'पूर्व वैदिक / संस्कृत पृष्ठभूमि' : language === 'mr' ? 'पूर्व ज्ञान व संस्कृत पार्श्वभूमी' : 'Prior Vedic / Sanskrit Background'}
            </label>
            <textarea
              rows={2}
              value={backgroundNotes}
              onChange={(e) => setBackgroundNotes(e.target.value)}
              placeholder={language === 'gu' ? 'પૂર્વ જ્ઞાન, ઉપનયન સંસ્કાર સ્થિતિ...' : language === 'hi' ? 'पूर्व ज्ञान, उपनयन संस्कार स्थिति...' : language === 'mr' ? 'पूर्व ज्ञान, उपनयन संस्कार स्थिती, किंवा उद्देश...' : 'Prior learning, Upanayana status, or aspirations...'}
              className="w-full px-3 py-2 rounded-lg bg-[#FFF8F6] text-[#221918] text-sm border border-[#E0BFBF]/50 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEnquiryCourse(null)}
              className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold hover:bg-[#FCEAE6] cursor-pointer"
            >
              {t('action.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs cursor-pointer"
            >
              {language === 'gu' ? 'અરજી સબમિટ કરો' : language === 'hi' ? 'आवेदन जमा करें' : language === 'mr' ? 'अर्ज सादर करा' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
