import React, { useState } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedNumber } from '../../utils/formatters.ts';

export const GurukulLearningView: React.FC = () => {
  const { audioState, setAudioState, togglePlayAudio, showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    setRecordSeconds(0);
    const interval = setInterval(() => {
      setRecordSeconds((p) => p + 1);
    }, 1000);
    (window as any).__recInterval = interval;
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    clearInterval((window as any).__recInterval);
  };

  const handleSubmitRecord = () => {
    clearInterval((window as any).__recInterval);
    setIsRecordModalOpen(false);
    setIsRecording(false);
    showToast(
      loc(
        'Your Vedic mantra audio recording has been successfully submitted for Acharya pronunciation review! (Ref: #REC-7829-05)',
        'आपले वेदमंत्रोच्चार ध्वनीमुद्रण आचार्य परीक्षणासाठी यशस्वीरित्या पाठवण्यात आले आहे! (Ref: #REC-7829-05)',
        'आपकी वेदमंत्र ऑडियो रिकॉर्डिंग आचार्य उच्चारण परीक्षण हेतु सफलतापूर्वक भेज दी गई है! (Ref: #REC-7829-05)',
        'તમારું વેદમંત્ર ઑડિયો રેકોર્ડિંગ આચાર્ય ઉચ્ચારણ પરીક્ષણ માટે સફળતાપૂર્વક મોકલવામાં આવ્યું છે! (Ref: #REC-7829-05)'
      ),
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header Strip & Streak Ribbon */}
      <div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-xs border border-[#E0BFBF]/40">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#584141]">
          <div className="flex items-center gap-1.5">
            <span>{t('devoteeSanctum')}</span>
            <span className="opacity-50">/</span>
            <span className="text-[#570013] font-bold">{t('nav.learning')}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDF94] text-[#251A00] text-xs font-bold">
              <span className="material-symbols-outlined text-sm leading-none">local_fire_department</span>
              <span>
                {loc(
                  '14-Day Continuous Vedic Sadhana',
                  '१४ दिवस अखंड साधना (14-Day Streak)',
                  '14-दिवसीय निरंतर वेद साधना',
                  '૧૪-દિવસીય અખંડ વેદ સાધના'
                )}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#221918] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm text-[#570013]">timer</span>
              <span>
                {loc(
                  'Total Study Hours: 28h 40m',
                  'एकूण साधना वेळ: २८ तास ४० मिनिटे',
                  'कुल अध्ययन समय: 28 घंटे 40 मिनट',
                  'કુલ અધ્યયન સમય: ૨૮ કલાક ૪૦ મિનિટ'
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold tracking-tight">
              {loc(
                'My Gurukul Learning & Veda Sadhana Suite',
                'माझा गुरुकुल स्वाध्याय व वेद साधना कक्ष',
                'मेरा गुरुकुल स्वाध्याय एवं वेद साधना कक्ष',
                'મારો ગુરુકુળ સ્વાધ્યાય અને વેદ સાધના કક્ષ'
              )}
            </h1>
            <p className="text-xs sm:text-sm text-[#584141]">
              {loc(
                'Shruti Parampara & Authentic Vedic Chanting • Direct learning under vetted Ghanapathis with pronunciation validation.',
                'श्रुतिपरंपरा व सस्वर वेदमंत्रोच्चार • प्रत्यक्ष गुरुमुखातून अध्ययन व उच्चार शुद्धीकरण',
                'श्रुति परंपरा एवं सस्वर वेदमंत्रोच्चार • गुरुमुख से प्रत्यक्ष अध्ययन एवं उच्चारण शुद्धीकरण।',
                'શ્રુતિ પરંપરા અને સસ્વર વેદમંત્રોચ્ચાર • ગુરુમુખથી પ્રત્યક્ષ અધ્યયન અને ઉચ્ચારણ શુદ્ધિકરણ.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold shadow-xs hover:bg-[#800020] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">mic</span>
              <span>
                {loc(
                  'Record My Chanting / Audio Test',
                  'माझा उच्चार तपासा / ऑडिओ सादर करा',
                  'मेरा उच्चारण परीक्षण / ऑडियो रिकॉर्ड करें',
                  'મારું ઉચ્ચારણ પરીક્ષણ / ઑડિયો રેકોર્ડ કરો'
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Recitation Audio Console */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#E0BFBF]/40 overflow-hidden flex flex-col">
        <div className="px-6 py-3 bg-[#FFF0ED] flex flex-wrap items-center justify-between gap-2 border-b border-[#E0BFBF]/30">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-[#570013] text-white font-bold">
              {loc('Current Lesson', 'चालू स्वाध्याय', 'वर्तमान पाठ', 'ચાલુ સ્વાધ્યાય')}
            </span>
            <span className="font-bold text-[#221918]">
              {loc('Rigveda Shakala Samhita - Mandala 1', 'ऋग्वेद शाकल संहिता - प्रथम मण्डल', 'ऋग्वेद शाकल संहिता - प्रथम मण्डल', 'ઋગ્વેદ શાકલ સંહિતા - પ્રથમ મંડલ')}
            </span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="text-[#584141] hidden sm:inline">
              {loc('Lesson 4 / 12 • Agni Sukta (1.1)', 'पाठ क्र. ४ / १२ • अग्नि सूक्त (१.१)', 'पाठ 4 / 12 • अग्नि सूक्त (1.1)', 'પાઠ ૪ / ૧૨ • અગ્નિ સૂક્ત (૧.૧)')}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#FFDF94] text-[#251A00] font-semibold">
            {loc('Udatta • Anudatta • Svarita Chanted with Vedic Accents', 'उदात्त • अनुदात्त • स्वरित सस्वर पाठ', 'उदात्त • अनुदात्त • स्वरित सस्वर पाठ', 'ઉદાત્ત • અનુદાત્ત • સ્વરિત સસ્વર પાઠ')}
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Synchronized Shloka Block */}
          <div className="p-6 rounded-xl bg-[#FFF8F6] border border-[#E0BFBF]/30 space-y-4 text-center">
            <div className="flex items-center justify-between text-xs text-[#584141]">
              <span className="text-[#570013] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#765B00]">auto_awesome</span>
                <span>{loc('Shaunakiya Pratishakhya Accent-Notated Samhita', 'शौनकीय प्रतिशाख्य स्वर-चिन्हांकित संहिता', 'शौनकीय प्रतिशाख्य स्वर-चिन्हांकित संहिता', 'શૌનકીય પ્રતિશાખ્ય સ્વર-ચિહ્નાંકિત સંહિતા')}</span>
              </span>
              <span className="text-[#765B00] font-medium">
                {loc('Guru Chanting: Vedamurti Dr. Shripad Bhat (Ghanapathi)', 'गुरुमुख उच्चार: वे. मू. डॉ. श्रीपाद भट (घनापाठी)', 'गुरुमुख उच्चारण: वे. मू. डॉ. श्रीपाद भट (घनापाठी)', 'ગુરુમુખ ઉચ્ચારણ: વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ (ઘનાપાઠી)')}
              </span>
            </div>

            <p
              className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#570013] font-bold tracking-wide select-all notranslate"
              style={{ lineHeight: '2.2' }}
            >
              ॥ ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् ।<br className="hidden sm:inline" />
              होता॑रं रत्न॒धात॑मम् ॥ १ ॥
            </p>

            <span className="text-xs text-[#765B00] font-semibold inline-block">
              {loc('Rigveda Mandala 1 • Sukta 1 • Richa 1', 'ऋग्वेद अ. १ • सू. १ • ऋचा १', 'ऋग्वेद मं. 1 • सू. 1 • ऋचा 1', 'ઋગ્વેદ મં. ૧ • સૂ. ૧ • ઋચા ૧')}
            </span>

            {/* Word by word breakdown grid */}
            <div className="bg-[#FFF0ED] rounded-xl p-3 text-left border border-[#E0BFBF]/30">
              <span className="text-xs font-bold text-[#570013] block mb-2">
                {loc('Pada-Patha & Nirukta Etymological Breakdown:', 'पदपाठ व निरुक्त अर्थविवरण (Word-by-word Breakdown):', 'पदपाठ एवं निरुक्त शब्दार्थ विवरण:', 'પદપાઠ અને નિરુક્ત શબ્દાર્થ વિવરણ:')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-[#E0BFBF]/30">
                  <span className="font-bold text-[#570013] block notranslate">अ॒ग्निम्</span>
                  <span className="text-[11px] text-[#584141]">{loc('To Agni (Primary)', 'अग्नीला (सर्वप्रथम)', 'अग्निदेव को (सर्वप्रथम)', 'અગ્નિદેવને (સૌપ્રથમ)')}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#E0BFBF]/30">
                  <span className="font-bold text-[#570013] block notranslate">ई॒ळे</span>
                  <span className="text-[11px] text-[#584141]">{loc('I praise / invoke', 'मी स्तवन करतो', 'मैं स्तुति करता हूँ', 'હું સ્તુતિ કરું છું')}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#E0BFBF]/30">
                  <span className="font-bold text-[#570013] block notranslate">पु॒रः-हि॑तम्</span>
                  <span className="text-[11px] text-[#584141]">{loc('Chief Priest of Yajna', 'यज्ञाचे पुरोहित', 'यज्ञ के मुख्य पुरोहित', 'યજ્ઞના મુખ્ય પુરોહિત')}</span>
                </div>
                <div className="p-2 rounded bg-white border border-[#E0BFBF]/30">
                  <span className="font-bold text-[#570013] block notranslate">य॒ज्ञस्य॑</span>
                  <span className="text-[11px] text-[#584141]">{loc('Of the Sacrifice/Yajna', 'यज्ञाचे रक्षक', 'यज्ञ के अधिष्ठाता', 'યજ્ઞના રક્ષક')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Console Waveform & Controls */}
          <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#584141]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#570013] text-white font-bold text-[10px]">
                  {loc('Svarita Audio', 'सस्वर ध्वनी', 'सस्वर ध्वनि', 'સસ્વર ધ્વનિ')}
                </span>
                <span className="font-bold text-[#221918]">
                  {loc('Richa 1: ', 'ऋचा १: ', 'ऋचा 1: ', 'ઋચા ૧: ')}{formatAudioTime(audioState.currentTimeSeconds)}
                </span>
              </div>
              <span>{loc('Total: ', 'एकूण: ', 'कुल: ', 'કુલ: ')}{formatAudioTime(audioState.totalDurationSeconds)}</span>
            </div>

            {/* Simulated 35 Waveform Bars */}
            <div className="w-full h-11 bg-white rounded-lg p-2 flex items-center justify-between gap-1 border border-[#E0BFBF]/30 cursor-pointer">
              {[
                3, 5, 8, 6, 9, 10, 7, 4, 8, 10, 6, 9, 11, 8, 5, 7, 9, 11, 6, 8, 10, 7, 5, 8, 4, 6, 9,
                7, 5, 8, 3, 6, 9, 4, 2,
              ].map((h, i) => {
                const isPast =
                  i / 35 <= audioState.currentTimeSeconds / audioState.totalDurationSeconds;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full ${
                      isPast ? (i % 2 === 0 ? 'bg-[#570013]' : 'bg-[#765B00]') : 'bg-[#E0BFBF]'
                    }`}
                    style={{ height: `${h * 3}px` }}
                  ></div>
                );
              })}
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setAudioState((p) => ({
                      ...p,
                      currentTimeSeconds: Math.max(0, p.currentTimeSeconds - 10),
                    }))
                  }
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#584141] hover:bg-[#FCEAE6] border border-[#E0BFBF]/30 cursor-pointer"
                  title="-10s"
                >
                  <span className="material-symbols-outlined text-base">replay_10</span>
                </button>
                <button
                  onClick={togglePlayAudio}
                  className="w-10 h-10 rounded-full bg-[#570013] text-white flex items-center justify-center hover:bg-[#800020] shadow-sm active:scale-95 transition-all cursor-pointer"
                  title="Play / Pause"
                >
                  <span className="material-symbols-outlined text-xl">
                    {audioState.isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button
                  onClick={() =>
                    setAudioState((p) => ({
                      ...p,
                      currentTimeSeconds: Math.min(p.totalDurationSeconds, p.currentTimeSeconds + 10),
                    }))
                  }
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#584141] hover:bg-[#FCEAE6] border border-[#E0BFBF]/30 cursor-pointer"
                  title="+10s"
                >
                  <span className="material-symbols-outlined text-base">forward_10</span>
                </button>
                <button
                  onClick={() => setAudioState((p) => ({ ...p, isLooping: !p.isLooping }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-[#E0BFBF]/30 cursor-pointer ${
                    audioState.isLooping ? 'bg-[#FFD979] text-[#795D00]' : 'bg-white text-[#584141]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">repeat</span>
                  <span>{loc('Mantra Loop', 'मंत्र आवर्तन', 'मंत्र पुनरावृत्ति', 'મંત્ર આવર્તન')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex bg-white rounded-lg p-0.5 border border-[#E0BFBF]/30 font-semibold">
                  {[1.0, 0.75, 0.5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setAudioState((p) => ({ ...p, playbackSpeed: spd }))}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        audioState.playbackSpeed === spd
                          ? 'bg-[#570013] text-white font-bold'
                          : 'text-[#584141]'
                      }`}
                    >
                      {spd === 1.0
                        ? loc('1.0x', '१.०x', '1.0x', '૧.૦x')
                        : spd === 0.75
                        ? loc('0.75x (Practice)', '०.७५x (सराव)', '0.75x (अभ्यास)', '૦.૭૫x (અભ્યાસ)')
                        : loc('0.5x', '०.५x', '0.5x', '૦.૫x')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Tracks & Acharya Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Enrolled tracks */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
            <h2 className="font-serif text-base font-bold text-[#570013]">
              {loc('My Enrolled Learning Tracks', 'माझे नोंदणीकृत अभ्यासक्रम', 'मेरे पंजीकृत पाठ्यक्रम', 'મારા નોંધાયેલા અભ્યાસક્રમો')}
            </h2>
            <span className="text-xs text-[#765B00] font-semibold">{loc('3 Tracks Active', '३ अभ्यासक्रम सक्रिय', '3 पाठ्यक्रम सक्रिय', '૩ અભ્યાસક્રમ સક્રિય')}</span>
          </div>

          <div className="space-y-3">
            {/* Course 1 */}
            <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#570013] text-white font-bold">
                      {loc('Current Lesson', 'चालू पाठ', 'वर्तमान पाठ', 'ચાલુ પાઠ')}
                    </span>
                    <span className="text-xs text-[#584141]">{loc('Vedic Branch: Shakala Samhita', 'वेदमंत्र शाखा: शाकल संहिता', 'वेदमंत्र शाखा: शाकल संहिता', 'વેદમંત્ર શાખા: શાકલ સંહિતા')}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#221918]">
                    {loc('Rigveda Shakala Samhita Study (Foundation)', 'ऋग्वेद शाकल संहिता अध्ययन (प्रारंभिक)', 'ऋग्वेद शाकल संहिता अध्ययन (प्रारंभिक)', 'ઋગ્વેદ શાકલ સંહિતા અધ્યયન (પ્રારંભિક)')}
                  </h3>
                  <span className="text-xs text-[#584141]">{loc('Acharya: Dr. Shripad Bhat', 'आचार्य: वे. मू. डॉ. श्रीपाद भट', 'आचार्य: वे. मू. डॉ. श्रीपाद भट', 'આચાર્ય: વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ')}</span>
                </div>
                <button
                  onClick={() => showToast(loc('Lesson session started', 'स्वाध्याय सुरू केला आहे', 'अध्ययन सत्र प्रारंभ हुआ', 'અધ્યયન સત્ર શરૂ થયું'), 'info')}
                  className="px-3 py-1.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors cursor-pointer shrink-0"
                >
                  {loc('Resume Study', 'स्वाध्याय सुरू ठेवा', 'अध्ययन जारी रखें', 'અધ્યયન ચાલુ રાખો')}
                </button>
              </div>
              <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-[#E0BFBF]/30">
                <div className="h-full bg-[#570013] rounded-full" style={{ width: '33.3%' }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-[#584141]">
                <span>{loc('Progress', 'प्रगती', 'प्रगति', 'પ્રગતિ')}</span>
                <span className="font-bold text-[#570013]">{loc('33% (4/12 Lessons)', '३३% (४/१२ पाठ)', '33% (4/12 पाठ)', '૩૩% (૪/૧૨ પાઠ)')}</span>
              </div>
            </div>

            {/* Course 2 */}
            <div className="p-4 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFDF94] text-[#251A00] font-bold">
                      {loc('Live Class', 'थेट वर्ग', 'लाइव कक्षा', 'લાઇવ વર્ગ')}
                    </span>
                    <span className="text-xs text-[#584141]">{loc('Vyakarana Vedanga', 'व्याकरण वेदांग', 'व्याकरण वेदांग', 'વ્યાકરણ વેદાંગ')}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#221918]">
                    {loc('Sanskrit Chanting & Paninian Grammar', 'संस्कृत संभाषण व पाणिनीय व्याकरण', 'संस्कृत संभाषण एवं पाणिनीय व्याकरण', 'સંસ્કૃત સંભાષણ અને પાણિનીય વ્યાકરણ')}
                  </h3>
                  <span className="text-xs text-[#584141]">{loc('Acharya: Dr. Madhavshastri Godbole', 'आचार्य: डॉ. माधवशास्त्री गोडबोले', 'आचार्य: डॉ. माधव शास्त्री गोडबोले', 'આચાર્ય: ડૉ. માધવશાસ્ત્રી ગોડબોલે')}</span>
                </div>
                <a
                  href="https://zoom.us"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FFD979] text-[#795D00] text-xs font-bold hover:bg-[#FFDF94] transition-colors flex items-center gap-1 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">videocam</span>
                  <span>{loc('Zoom Link', 'Zoom लिंक', 'Zoom लिंक', 'Zoom લિંક')}</span>
                </a>
              </div>
              <div className="p-2.5 rounded bg-white text-xs text-[#584141] flex items-center gap-2 border border-[#E0BFBF]/30">
                <span className="material-symbols-outlined text-base text-[#570013]">event</span>
                <span>{loc('Next Session: Saturday, Jun 1, 2024 • 08:30 AM IST', 'पुढील सत्र: शनिवार, १ जून २०२४ • सकाळी ०८:३० AM IST', 'अगला सत्र: शनिवार, 1 जून 2024 • प्रातः 08:30 AM IST', 'આગામી સત્ર: શનિવાર, ૧ જૂન ૨૦૨૪ • સવારે ૦૮:૩૦ AM IST')}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white overflow-hidden border border-[#E0BFBF]/30">
                <div className="h-full bg-[#765B00] rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Acharya Review */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-[#E0BFBF]/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#570013] text-xl">record_voice_over</span>
              <h2 className="font-serif text-base font-bold text-[#570013]">{loc('Pronunciation Evaluation & Review', 'उच्चार शुद्धता परीक्षण', 'उच्चारण शुद्धता परीक्षण', 'ઉચ્ચારણ શુદ્ધતા પરીક્ષણ')}</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#FFDADA] text-[#570013] text-[10px] font-bold">
              {loc('Verified', 'सत्यापित', 'प्रमाणित', 'પ્રમાણિત')}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#584141] uppercase">{loc('Submission Details:', 'सादरीकरण तपशील:', 'प्रस्तुति विवरण:', 'રજૂઆત વિગતો:')}</span>
              <h4 className="font-serif text-sm font-bold text-[#221918]">{loc('Agni Sukta Hymns 1 & 2', 'अग्नि सूक्त मंत्र क्र. १ व २', 'अग्नि सूक्त मंत्र 1 व 2', 'અગ્નિ સૂક્ત મંત્ર ૧ અને ૨')}</h4>
              <span className="text-[11px] text-[#765B00]"><span className="font-mono">#REC-7829-04</span>{loc(' • May 26, 2024', ' • २६ मे २०२४', ' • 26 मई 2024', ' • ૨૬ મે ૨૦૨૪')}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FFF0ED] text-center border border-[#E0BFBF]/30 shrink-0">
              <span className="font-serif text-2xl font-bold text-[#570013] leading-none">
                {formatLocalizedNumber('92', language)}%
              </span>
              <span className="text-[10px] text-[#765B00] font-bold mt-0.5">{loc('Accuracy Score', 'शुद्धता स्कोअर', 'शुद्धता स्कोर', 'શુદ્ધતા સ્કોર')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded bg-[#FFF0ED]">
              <span className="text-[#584141] block">{loc('Udatta Pitch', 'उदात्त स्वर', 'उदात्त स्वर', 'ઉદાત્ત સ્વર')}</span>
              <span className="text-[#570013] font-bold">{loc('Excellent (95%)', 'उत्कृष्ट (९५%)', 'उत्कृष्ट (95%)', 'ઉત્કૃષ્ટ (૯૫%)')}</span>
            </div>
            <div className="p-2 rounded bg-[#FFF0ED]">
              <span className="text-[#584141] block">{loc('Anudatta Pitch', 'अनुदात्त स्वर', 'अनुदात्त स्वर', 'અનુદાત્ત સ્વર')}</span>
              <span className="text-[#570013] font-bold">{loc('Flawless (90%)', 'संधी शुद्ध (९०%)', 'संधि शुद्ध (90%)', 'સંધિ શુદ્ધ (૯૦%)')}</span>
            </div>
            <div className="p-2 rounded bg-[#FFF0ED]">
              <span className="text-[#584141] block">{loc('Phonetics / Varna', 'वर्णोच्चार', 'वर्णोच्चारण', 'વર્ણોચ્ચારણ')}</span>
              <span className="text-[#570013] font-bold">{loc('Accurate (91%)', 'शुद्ध (९१%)', 'शुद्ध (91%)', 'શુદ્ધ (૯૧%)')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#570013] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {loc('V', 'वि', 'वि', 'વિ')}
              </div>
              <div>
                <span className="font-bold text-[#570013] block">
                  {loc('Acharya V. M. Vinayakshastri Joshi', 'आचार्य वे. मू. विनायकशास्त्री जोशी', 'आचार्य वे. मू. विनायक शास्त्री जोशी', 'આચાર્ય વે. મૂ. વિનાયકશાસ્ત્રી જોશી')}
                </span>
                <span className="text-[10px] text-[#584141]">
                  {loc('Head Examiner, Veda Vidyapeeth', 'मुख्य परीक्षक, वेद विद्यापीठ', 'मुख्य परीक्षक, वेद विद्यापीठ', 'મુખ્ય પરીક્ષક, વેદ વિદ્યાપીઠ')}
                </span>
              </div>
            </div>
            <p className="text-[#221918] italic leading-relaxed bg-white p-2.5 rounded-lg border border-[#E0BFBF]/30">
              {loc(
                '"Udatta and Anudatta accents are highly satisfactory. However, in the second mantra, take care while intoning \'Ratnadhatamam\' to keep the cadence steady. Approved to advance to the next hymn."',
                '"उदात्त व अनुदात्त उच्चार समाधानकारक आहेत. मात्र दुसऱ्या मंत्रातील \'रत्नधातमम्\' उच्चारताना अक्षरावरील आघात किंचित संथ असावा. पुढील पाठाकडे जाण्यास अनुमती."',
                '"उदात्त एवं अनुदात्त उच्चारण संतोषजनक हैं। यद्यपि दूसरे मंत्र में \'रत्नधातमम्\' का उच्चारण करते समय थोड़ा संयत रहें। अगले पाठ की अनुमति दी जाती है।"',
                '"ઉદાત્ત અને અનુદાત્ત ઉચ્ચારણ સંતોષકારક છે. પરંતુ બીજા મંત્રમાં \'રત્નધાતમમ્\' ઉચ્ચારતી વખતે લય થોડો શાંત રાખવો. આગલા પાઠ તરફ આગળ વધવાની પરવાનગી."'
              )}
            </p>
          </div>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="w-full py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>{loc('Submit New Practice Audio (#REC-05)', 'नवीन सराव रेकॉर्डिंग पाठवा (#REC-05)', 'नया अभ्यास ऑडियो भेजें (#REC-05)', 'નવું અભ્યાસ રેકોર્ડિંગ મોકલો (#REC-05)')}</span>
          </button>
        </div>
      </div>

      {/* Record Modal */}
      {isRecordModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#241B19]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
        >
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E0BFBF]/40">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#570013] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">mic</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-[#570013]">
                  {loc('Vedic Mantra Audio Recitation Submission', 'सस्वर मंत्रोच्चार सादरीकरण', 'सस्वर मंत्रोच्चार प्रस्तुति', 'સસ્વર મંત્રોચ્ચાર રજૂઆત')}
                </h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-[#584141] hover:text-[#570013]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#221918] mb-1">
                  {loc('Selected Lesson:', 'निवडलेला पाठ:', 'चयनित पाठ:', 'પસંદ કરેલો પાઠ:')}
                </label>
                <select className="w-full p-2.5 rounded-lg bg-[#FFF8F6] text-xs text-[#221918] border border-[#E0BFBF]/50 focus:outline-none">
                  <option>{loc('Rigveda Mandala 1 • Agni Sukta Hymns 1 to 9', 'ऋग्वेद प्रथम मण्डल • अग्नि सूक्त मंत्र १ ते ९', 'ऋग्वेद प्रथम मण्डल • अग्नि सूक्त मंत्र 1 से 9', 'ઋગ્વેદ પ્રથમ મંડલ • અગ્નિ સૂક્ત મંત્ર ૧ થી ૯')}</option>
                  <option>{loc('Sri Sukta (Rigveda Khila) • Complete 16 Richas', 'श्रीसूक्त (ऋग्वेद परिशिष्ट) • संपूर्ण १६ ऋचा', 'श्रीसूक्त (ऋग्वेद परिशिष्ट) • संपूर्ण 16 ऋचा', 'શ્રીસૂક્ત (ઋગ્વેદ પરિશિષ્ટ) • સંપૂર્ણ ૧૬ ઋચા')}</option>
                  <option>{loc('Purusha Sukta • Chapter 31 (Shukla Yajurveda)', 'पुरुषसूक्त • अध्याय ३१ (शुक्ल यजुर्वेद)', 'पुरुषसूक्त • अध्याय 31 (शुक्ल यजुर्वेद)', 'પુરુષસૂક્ત • અધ્યાય ૩૧ (શુક્લ યજુર્વેદ)')}</option>
                </select>
              </div>

              <div className="p-6 rounded-xl bg-[#FFF0ED] border border-[#E0BFBF]/30 flex flex-col items-center justify-center space-y-3 text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-[#BA1A1A] text-white animate-pulse'
                      : 'bg-white text-[#570013] shadow-xs'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">mic</span>
                </div>

                <div className="space-y-0.5">
                  <span className="font-mono text-2xl font-bold text-[#570013]">
                    {formatAudioTime(recordSeconds)}
                  </span>
                  <p className="text-xs text-[#584141]">
                    {isRecording
                      ? loc('Recording in progress... Please chant calmly with proper Vedic accents.', 'रेकॉर्डिंग सुरू आहे... शांतपणे व सस्वर उच्चारण करा.', 'रिकॉर्डिंग जारी है... कृपया शांत भाव से सस्वर उच्चारण करें।', 'રેકોર્ડિંગ ચાલુ છે... શાંતિથી સસ્વર ઉચ્ચારણ કરો.')
                      : loc('Press start when ready.', 'तयार झाल्यावर सुरू करा.', 'तैयार होने पर प्रारंभ करें।', 'તૈયાર થાઓ ત્યારે શરૂ કરો.')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecord}
                      className="px-4 py-2 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">fiber_manual_record</span>
                      <span>{loc('Start Recording', 'रेकॉर्ड सुरू करा', 'रिकॉर्डिंग प्रारंभ करें', 'રેકોર્ડ શરૂ કરો')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecord}
                      className="px-4 py-2 rounded-lg bg-[#BA1A1A] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">stop</span>
                      <span>{loc('Stop Recording', 'थांबवा', 'रोकें', 'અટકાવો')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E0BFBF]/30">
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#FFF0ED] text-[#221918] text-xs font-semibold"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmitRecord}
                className="px-5 py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] shadow-xs cursor-pointer"
              >
                {loc('Submit for Evaluation', 'परीक्षणासाठी सादर करा', 'परीक्षण हेतु जमा करें', 'પરીક્ષણ માટે રજૂ કરો')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

