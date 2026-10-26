import React from 'react';
import { PoojaService } from '../../types/index.ts';
import { Modal } from '../common/Modal.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedCurrency, formatLocalizedNumber } from '../../utils/formatters.ts';

interface PoojaDetailModalProps {
  pooja: PoojaService | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

export const PoojaDetailModal: React.FC<PoojaDetailModalProps> = ({
  pooja,
  isOpen,
  onClose,
  onBook,
}) => {
  const { language, t } = useLanguage();
  if (!pooja) return null;

  const title =
    language === 'gu'
      ? pooja.nameGu || pooja.nameEn
      : language === 'hi'
      ? pooja.nameHi || pooja.nameMr
      : language === 'mr'
      ? pooja.nameMr
      : pooja.nameEn;

  const subtitle =
    language === 'gu'
      ? pooja.categoryLabelGu || pooja.category
      : language === 'hi'
      ? pooja.categoryLabelHi || pooja.category
      : language === 'mr'
      ? pooja.categoryLabelMr || pooja.category
      : pooja.categoryLabelEn || pooja.category;

  const formatLineage = (lin: string) => {
    if (language === 'mr') {
      return lin
        .replace('Rigvedic Shakala Samhita', 'ऋग्वेदीय शाकल संहिता')
        .replace('Krishna Yajurveda Taittiriya Samhita', 'कृष्ण यजुर्वेद तैत्तिरीय संहिता')
        .replace('Shukla Yajurveda Madhyandina', 'शुक्ल यजुर्वेद माध्यंदिन शाखा')
        .replace('Classical Smarta Vidhana', 'अथर्ववेद व स्मार्त विधान')
        .replace('Atharva Veda & Smarta Vidhana', 'अथर्ववेद व स्मार्त विधान')
        .replace('Rigvedic Ashvalayana Sutra', 'ऋग्वेदीय आश्वलायन सूत्र')
        .replace('Baudhayana Shrauta Sutra', 'बौधायन श्रौत सूत्र');
    }
    if (language === 'hi') {
      return lin
        .replace('Rigvedic Shakala Samhita', 'ऋग्वेदीय शाकल संहिता')
        .replace('Krishna Yajurveda Taittiriya Samhita', 'कृष्ण यजुर्वेद तैत्तिरीय संहिता')
        .replace('Shukla Yajurveda Madhyandina', 'शुक्ल यजुर्वेद माध्यंदिन शाखा')
        .replace('Classical Smarta Vidhana', 'अथर्ववेद एवं स्मार्त विधान')
        .replace('Atharva Veda & Smarta Vidhana', 'अथर्ववेद एवं स्मार्त विधान')
        .replace('Rigvedic Ashvalayana Sutra', 'ऋग्वेदीय आश्वलायन सूत्र')
        .replace('Baudhayana Shrauta Sutra', 'बौधायन श्रौत सूत्र');
    }
    if (language === 'gu') {
      return lin
        .replace('Rigvedic Shakala Samhita', 'ઋગ્વેદીય શાકલ સંહિતા')
        .replace('Krishna Yajurveda Taittiriya Samhita', 'કૃષ્ણ યજુર્વેદ તૈત્તિરીય સંહિતા')
        .replace('Shukla Yajurveda Madhyandina', 'શુક્લ યજુર્વેદ માધ્યંદિન શાખા')
        .replace('Classical Smarta Vidhana', 'અથર્વવેદ અને સ્માર્ત વિધાન')
        .replace('Atharva Veda & Smarta Vidhana', 'અથર્વવેદ અને સ્માર્ત વિધાન')
        .replace('Rigvedic Ashvalayana Sutra', 'ઋગ્વેદીય આશ્વલાયન સૂત્ર')
        .replace('Baudhayana Shrauta Sutra', 'બૌધાયન શ્રૌત સૂત્ર');
    }
    return lin;
  };

  const formatPoojaDuration = (dur: string) => {
    if (language === 'en') {
      return dur.replace('दैनिक ३ तास', '3 hours daily').replace('दररोज ५ तास', '5 hours daily');
    }
    if (language === 'mr') {
      return formatLocalizedNumber(
        dur
          .replace('3 – 7 Days', '३ ते ७ दिवस')
          .replace('5 Days', '५ दिवस')
          .replace('3.5 Hours', '३.५ तास')
          .replace('4 Hours', '४ तास')
          .replace('4.5 Hours', '४.५ तास')
          .replace('3 Hours', '३ तास'),
        'mr'
      );
    }
    if (language === 'hi') {
      return formatLocalizedNumber(
        dur
          .replace('3 – 7 Days', '3 से 7 दिन')
          .replace('5 Days', '5 दिन')
          .replace('3.5 Hours', '3.5 घंटे')
          .replace('4 Hours', '4 घंटे')
          .replace('4.5 Hours', '4.5 घंटे')
          .replace('3 Hours', '3 घंटे')
          .replace('दैनिक ३ तास', 'दैनिक 3 घंटे')
          .replace('दररोज ५ तास', 'प्रतिदिन 5 घंटे'),
        'hi'
      );
    }
    if (language === 'gu') {
      return formatLocalizedNumber(
        dur
          .replace('3 – 7 Days', '૩ થી ૭ દિવસ')
          .replace('5 Days', '૫ દિવસ')
          .replace('3.5 Hours', '૩.૫ કલાક')
          .replace('4 Hours', '૪ કલાક')
          .replace('4.5 Hours', '૪.૫ કલાક')
          .replace('3 Hours', '૩ કલાક')
          .replace('दैनिक ३ तास', 'રોજ ૩ કલાક')
          .replace('દરરોજ ૫ तास', 'દરરોજ ૫ કલાક'),
        'gu'
      );
    }
    return dur;
  };

  const formatPoojaPandits = (pnd: string) => {
    if (language === 'mr') {
      return pnd
        .replace('3 to 5 Ved-Murti Pandits', '३ ते ५ वेदमूर्ती पंडित')
        .replace('2 Ghanapathis', '२ घनपाठी')
        .replace('4 to 11 Ved-Murti Acharyas', '४ ते ११ वेदमूर्ती आचार्य')
        .replace('2 to 3 Senior Acharyas', '२ ते ३ ज्येष्ठ आचार्य')
        .replace('7 to 9 Ghanapathis', '७ ते ९ घनपाठी')
        .replace('2 Shastris', '२ शास्त्री');
    }
    if (language === 'hi') {
      return pnd
        .replace('3 to 5 Ved-Murti Pandits', '3 से 5 वेदमूर्ति पंडित')
        .replace('2 Ghanapathis', '2 घनपाठी')
        .replace('4 to 11 Ved-Murti Acharyas', '4 से 11 वेदमूर्ति आचार्य')
        .replace('2 to 3 Senior Acharyas', '2 से 3 वरिष्ठ आचार्य')
        .replace('7 to 9 Ghanapathis', '7 से 9 घनपाठी')
        .replace('2 Shastris', '2 शास्त्री');
    }
    if (language === 'gu') {
      return pnd
        .replace('3 to 5 Ved-Murti Pandits', '૩ થી ૫ વેદમૂર્તિ પંડિત')
        .replace('2 Ghanapathis', '૨ ઘનપાઠી')
        .replace('4 to 11 Ved-Murti Acharyas', '૪ થી ૧૧ વેદમૂર્તિ આચાર્ય')
        .replace('2 to 3 Senior Acharyas', '૨ થી ૩ વરિષ્ઠ આચાર્ય')
        .replace('7 to 9 Ghanapathis', '૭ થી ૯ ઘનપાઠી')
        .replace('2 Shastris', '૨ શાસ્ત્રી');
    }
    return pnd;
  };

  const formatPoojaPriceLabel = (pooja: PoojaService) => {
    const amountStr = formatLocalizedCurrency(pooja.price, language);
    if (pooja.priceLabel.includes('onwards')) {
      if (language === 'mr') return `${amountStr} पासून पुढे`;
      if (language === 'hi') return `${amountStr} से प्रारंभ`;
      if (language === 'gu') return `${amountStr} થી શરૂ`;
      return `${amountStr} onwards`;
    }
    return amountStr;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="xl"
    >
      <div className="flex flex-col gap-5">
        {/* Banner Image */}
        <div className="relative h-48 w-full rounded-lg overflow-hidden bg-[#FCEAE6]">
          <img
            src={pooja.image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="bg-[#570013] text-white text-xs px-2.5 py-1 rounded font-semibold">
              {formatLineage(pooja.lineage)}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-[#570013] font-bold text-sm px-3 py-1 rounded shadow-xs">
            {formatPoojaPriceLabel(pooja)}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#570013] uppercase tracking-wider">
            {language === 'gu'
              ? 'શાસ્ત્રોક્ત વિવરણ'
              : language === 'hi'
              ? 'शास्त्रोक्त विवरण'
              : language === 'mr'
              ? 'शास्त्रोक्त स्वरूप व विवरण'
              : 'Shastric Description'}
          </h4>
          <p className="text-sm text-[#584141] leading-relaxed">
            {pooja.longDescriptionEn}
          </p>
          <p className="text-xs text-[#765B00] italic leading-relaxed bg-[#FFF0ED] p-2.5 rounded-lg border border-[#E0BFBF]/30">
            <strong>
              {language === 'gu'
                ? 'પરંપરા વિવરણ:'
                : language === 'hi'
                ? 'परंपरा विवरण:'
                : language === 'mr'
                ? 'वेदार्थ व भावार्थ:'
                : 'Tradition & Purport:'}
            </strong>{' '}
            {pooja.longDescriptionMr}
          </p>
        </div>

        {/* Quick Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-[#221918]">
          <div className="bg-[#FFF0ED] p-2.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#584141] uppercase">
              {language === 'gu' ? 'સમયગાળો' : language === 'hi' ? 'अवधि' : language === 'mr' ? 'कालावधी' : 'Duration'}
            </span>
            <span className="font-semibold text-[#570013] mt-0.5">{formatPoojaDuration(pooja.duration)}</span>
          </div>
          <div className="bg-[#FFF0ED] p-2.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#584141] uppercase">
              {language === 'gu' ? 'વિદ્વાન' : language === 'hi' ? 'विद्वान' : language === 'mr' ? 'ऋत्विज' : 'Priests'}
            </span>
            <span className="font-semibold text-[#570013] mt-0.5">{formatPoojaPandits(pooja.pandits)}</span>
          </div>
          <div className="bg-[#FFF0ED] p-2.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#584141] uppercase">
              {language === 'gu' ? 'માધ્યમ' : language === 'hi' ? 'माध्यम' : language === 'mr' ? 'माध्यम' : 'Mode'}
            </span>
            <span className="font-semibold text-[#570013] mt-0.5">
              {pooja.mode.includes('online')
                ? language === 'gu'
                  ? 'ઑનલાઇન અને આશ્રમ'
                  : language === 'hi'
                  ? 'ऑनलाइन एवं आश्रम'
                  : language === 'mr'
                  ? 'ऑनलाईन व आश्रम'
                  : 'Online & Ashram'
                : language === 'gu'
                ? 'આશ્રમ / ઘર'
                : language === 'hi'
                ? 'आश्रम / घर'
                : language === 'mr'
                ? 'आश्रम / निवासस्थानी'
                : 'At Ashram / Home'}
            </span>
          </div>
          <div className="bg-[#FFF0ED] p-2.5 rounded-lg flex flex-col">
            <span className="text-[10px] text-[#584141] uppercase">
              {language === 'gu' ? 'સામગ્રી' : language === 'hi' ? 'सामग्री' : language === 'mr' ? 'सामग्री' : 'Samagri'}
            </span>
            <span className="font-semibold text-[#765B00] mt-0.5">
              {language === 'gu' ? '૧૦૦% શુદ્ધ' : language === 'hi' ? '100% शुद्ध' : language === 'mr' ? '१००% सेंद्रिय' : '100% Organic'}
            </span>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#570013] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#765B00]">star</span>
            <span>
              {language === 'gu'
                ? 'મુખ્ય આધ્યાત્મિક લાભ'
                : language === 'hi'
                ? 'प्रमुख आध्यात्मिक लाभ'
                : language === 'mr'
                ? 'प्रमुख फलश्रुती व आध्यात्मिक लाभ'
                : 'Spiritual Benefits'}
            </span>
          </h4>
          <ul className="space-y-1.5 text-xs text-[#584141]">
            {pooja.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#765B00] shrink-0 mt-0.5">
                  check_circle
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Included items */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-[#570013] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#765B00]">checklist</span>
            <span>
              {language === 'gu'
                ? 'વિધિમાં સમાવિષ્ટ ઘટકો'
                : language === 'hi'
                ? 'विधि में सम्मिलित घटक'
                : language === 'mr'
                ? 'विधीमध्ये अंतर्भूत घटक'
                : 'Included Ritual Protocols'}
            </span>
          </h4>
          <ul className="space-y-1.5 text-xs text-[#584141]">
            {pooja.includedItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#570013] shrink-0 mt-0.5">
                  task_alt
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E0BFBF]/30 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#584141]">
              {language === 'gu' ? 'સેવા દક્ષિણા' : language === 'hi' ? 'सेवा दक्षिणा' : language === 'mr' ? 'सेवा दक्षिणा' : 'Seva Dakshina'}
            </span>
            <span className="text-lg font-bold text-[#570013]">{formatPoojaPriceLabel(pooja)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#FFF0ED] text-[#221918] hover:bg-[#FCEAE6] text-xs font-semibold transition-colors cursor-pointer"
            >
              {t('ui.close')}
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(pooja.id);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span>{t('action.bookSankalpa')}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
