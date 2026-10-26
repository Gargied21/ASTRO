import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { formatLocalizedNumber } from '../../utils/formatters.ts';

interface AgniSuktaPlayerViewProps {
  onNavigate: (path: string) => void;
}

export const AgniSuktaPlayerView: React.FC<AgniSuktaPlayerViewProps> = ({ onNavigate }) => {
  const { audioState, setAudioState, togglePlayAudio, showToast } = useDevotee();
  const { language, t, loc } = useLanguage();
  const [showIast, setShowIast] = useState(true);
  const [showAnvaya, setShowAnvaya] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number>(1);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  // Playback timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (audioState.isPlaying) {
      timer = setInterval(() => {
        setAudioState((prev) => {
          if (prev.currentTimeSeconds >= prev.totalDurationSeconds) {
            return { ...prev, isPlaying: prev.isLooping, currentTimeSeconds: 0 };
          }
          return { ...prev, currentTimeSeconds: prev.currentTimeSeconds + 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [audioState.isPlaying, setAudioState]);

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleModeChange = (mode: 'samhita' | 'pada' | 'krama') => {
    setAudioState((prev) => ({ ...prev, pathaMode: mode }));
    const labels = {
      samhita: loc('Samhita Patha', 'संहिता पाठ', 'संहिता पाठ', 'સંહિતા પાઠ'),
      pada: loc('Pada Patha', 'पद पाठ', 'पद पाठ', 'પદ પાઠ'),
      krama: loc('Krama Patha', 'क्रम पाठ', 'क्रम पाठ', 'ક્રમ પાઠ'),
    };
    showToast(
      loc(
        `Switched to ${labels[mode]} mode`,
        `${labels[mode]} सुरू केला`,
        `${labels[mode]} प्रारंभ किया`,
        `${labels[mode]} શરૂ કર્યો`
      ),
      'info'
    );
  };

  const handleSpeedChange = (speed: number) => {
    setAudioState((prev) => ({ ...prev, playbackSpeed: speed }));
  };

  const handleJumpVerse = (verseNum: number) => {
    setSelectedVerse(verseNum);
    const verseSeconds = [0, 102, 220, 340];
    setAudioState((prev) => ({
      ...prev,
      currentTimeSeconds: verseSeconds[verseNum] || 0,
      isPlaying: true,
    }));
    showToast(
      loc(
        `Started recitation for Hymn ${verseNum}`,
        `ऋचा ${verseNum} चा स्वाध्याय सुरू केला`,
        `ऋचा ${verseNum} का अध्ययन प्रारंभ हुआ`,
        `ઋચા ${verseNum} નો અધ્યયન શરૂ કર્યો`
      ),
      'info'
    );
  };

  return (
    <div className="flex flex-col w-full bg-[#FFF8F6] min-h-screen">
      {/* Top Heritage Breadcrumb */}
      <section className="w-full bg-[#FFF0ED] py-3 border-b border-[#E0BFBF]/30">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 flex flex-wrap items-center justify-between gap-3 text-xs text-[#584141]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#570013] transition-colors cursor-pointer"
            >
              {t('nav.home')}
            </button>
            <span className="text-[#E0BFBF]">›</span>
            <button
              onClick={() => onNavigate('gurukul')}
              className="hover:text-[#570013] transition-colors cursor-pointer"
            >
              {t('nav.learning')}
            </button>
            <span className="text-[#E0BFBF]">›</span>
            <span>{loc('Rigveda Shakala Samhita', 'ऋग्वेद शाकल संहिता', 'ऋग्वेद शाकल संहिता', 'ઋગ્વેદ શાકલ સંહિતા')}</span>
            <span className="text-[#E0BFBF]">›</span>
            <span className="text-[#765B00] font-bold">
              {loc('Mandala 1 • Agni Sukta (1.1)', 'प्रथम मण्डल • अग्नि सूक्त (१.१)', 'प्रथम मण्डल • अग्नि सूक्त (1.1)', 'પ્રથમ મંડલ • અગ્નિ સૂક્ત (૧.૧)')}
            </span>
          </div>

          <button
            onClick={() => onNavigate('gurukul')}
            className="inline-flex items-center gap-1 text-[#570013] hover:text-[#800020] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{loc('Curriculum Overview', 'अभ्यासक्रम सारांश', 'पाठ्यक्रम सारांश', 'અભ્યાસક્રમ સારાંશ')}</span>
          </button>
        </div>
      </section>

      {/* Title & Scholarly Metadata Strip */}
      <section className="w-full bg-white border-b border-[#E0BFBF]/20">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFD979]/40 text-[#795D00] text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#765B00]">verified</span>
                <span>{loc('Active Learner Console', 'सत्यापित अध्ययनार्थी कक्ष', 'सत्यापित शिक्षार्थी कक्ष', 'ચકાસાયેલ વિદ્યાર્થી કક્ષ')}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold tracking-tight">
                {loc(
                  'Agni Sukta — Mandala 1',
                  'अग्नि सूक्त — प्रथम मण्डल',
                  'अग्नि सूक्त — प्रथम मण्डल',
                  'અગ્નિ સૂક્ત — પ્રથમ મંડલ'
                )}
                <span className="block text-sm sm:text-base text-[#584141] font-sans font-normal mt-0.5">
                  {loc(
                    'Rigveda Samhita 1.1: Complete Adhyayan, Swara Sadhana & Bhashya',
                    'ऋग्वेद संहिता १.१: संपूर्ण अध्ययन, स्वर साधना व भाष्य',
                    'ऋग्वेद संहिता 1.1: संपूर्ण अध्ययन, स्वर साधना एवं भाष्य',
                    'ઋગ્વેદ સંહિતા ૧.૧: સંપૂર્ણ અધ્યયન, સ્વર સાધના અને ભાષ્ય'
                  )}
                </span>
              </h1>
            </div>

            {/* Quick Metrical Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="bg-[#FFF0ED] px-3 py-1.5 rounded-lg border border-[#E0BFBF]/30 text-center">
                <span className="block text-[10px] text-[#765B00] font-bold uppercase tracking-wider">
                  {loc('Rishi', 'ऋषि', 'ऋषि', 'ઋષિ')}
                </span>
                <span className="font-semibold text-[#221918]">
                  {loc('Madhuchhandas', 'मधुच्छन्दाः', 'मधुच्छन्दाः', 'મધુચ્છન્દાસ')}
                </span>
              </div>
              <div className="bg-[#FFF0ED] px-3 py-1.5 rounded-lg border border-[#E0BFBF]/30 text-center">
                <span className="block text-[10px] text-[#765B00] font-bold uppercase tracking-wider">
                  {loc('Chhanda', 'छन्द', 'छन्द', 'છંદ')}
                </span>
                <span className="font-semibold text-[#221918]">
                  {loc('Gayatri (24 syllables)', 'गायत्री (२४ अक्षरे)', 'गायत्री (24 वर्ण)', 'ગાયત્રી (૨૪ અક્ષર)')}
                </span>
              </div>
              <div className="bg-[#FFF0ED] px-3 py-1.5 rounded-lg border border-[#E0BFBF]/30 text-center">
                <span className="block text-[10px] text-[#765B00] font-bold uppercase tracking-wider">
                  {loc('Devata', 'देवता', 'देवता', 'દેવતા')}
                </span>
                <span className="font-semibold text-[#221918]">
                  {loc('Agni', 'अग्निदेव', 'अग्निदेव', 'અગ્નિદેવ')}
                </span>
              </div>
              <div className="bg-[#FFF0ED] px-3 py-1.5 rounded-lg border border-[#E0BFBF]/30 text-center">
                <span className="block text-[10px] text-[#765B00] font-bold uppercase tracking-wider">
                  {loc('Reciter', 'आचार्य', 'आचार्य', 'આચાર્ય')}
                </span>
                <span className="font-semibold text-[#570013]">
                  {loc('Dr. Shripad Bhat (Ghanapathi)', 'वे. मू. डॉ. श्रीपाद भट', 'वे. मू. डॉ. श्रीपाद भट', 'વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Learning Workspace */}
      <div className="max-w-[1240px] mx-auto px-4 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 of 12 cols): Vedic Console & Current Verse */}
          <main className="lg:col-span-8 flex flex-col gap-6">
            {/* Vedic Studio Audio Console Module */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 p-6 space-y-5">
              {/* Header & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#570013] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-xl">graphic_eq</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#765B00] font-bold uppercase tracking-wider">
                      Master Sound Recitation (24-bit 96kHz)
                    </span>
                    <p className="font-serif text-sm sm:text-base text-[#570013] font-bold leading-tight">
                      Mantra {selectedVerse} — Svara Shuddha Uccharan
                    </p>
                  </div>
                </div>

                {/* Patha Mode buttons */}
                <div className="inline-flex rounded-lg bg-white p-1 border border-[#E0BFBF]/40 gap-1 self-start sm:self-auto text-xs">
                  {(['samhita', 'pada', 'krama'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`px-3 py-1 rounded transition-colors font-semibold cursor-pointer ${
                        audioState.pathaMode === mode
                          ? 'bg-[#570013] text-white shadow-xs'
                          : 'text-[#584141] hover:text-[#570013]'
                      }`}
                    >
                      {mode === 'samhita' ? 'संहिता पाठ' : mode === 'pada' ? 'पद पाठ' : 'क्रम पाठ'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Waveform & Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#584141]">
                  <span className="font-bold text-[#570013]">
                    {formatAudioTime(audioState.currentTimeSeconds)}
                  </span>
                  <span className="text-[#765B00] font-serif font-bold tracking-wider">
                    ॥ अनुदात्तः उदात्तः स्वरितः ॥
                  </span>
                  <span>{formatAudioTime(audioState.totalDurationSeconds)}</span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div
                  onClick={() => {
                    setAudioState((prev) => ({
                      ...prev,
                      currentTimeSeconds: Math.floor(Math.random() * prev.totalDurationSeconds),
                    }));
                  }}
                  className="relative w-full h-12 bg-[#FFF0ED] rounded-lg overflow-hidden flex items-end gap-1 px-3 py-1 cursor-pointer border border-[#E0BFBF]/40 group"
                  title="Click to seek"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-[#570013]/10 transition-all pointer-events-none"
                    style={{
                      width: `${(audioState.currentTimeSeconds / audioState.totalDurationSeconds) * 100}%`,
                    }}
                  ></div>
                  {[
                    4, 7, 10, 8, 5, 9, 11, 7, 5, 8, 10, 6, 9, 4, 7, 10, 8, 6, 9, 11, 5, 8, 10, 6, 7, 4,
                    8, 5, 7, 3,
                  ].map((height, idx) => {
                    const isPlayed =
                      idx / 30 <= audioState.currentTimeSeconds / audioState.totalDurationSeconds;
                    return (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all ${
                          isPlayed
                            ? idx % 2 === 0
                              ? 'bg-[#570013]'
                              : 'bg-[#765B00]'
                            : 'bg-[#E0BFBF]'
                        }`}
                        style={{ height: `${height * 3}px` }}
                      ></span>
                    );
                  })}
                </div>
              </div>

              {/* Audio Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Speed Multiplier */}
                <div className="flex items-center gap-1 bg-[#FFF0ED] px-2 py-1 rounded-lg border border-[#E0BFBF]/40 text-xs">
                  <span className="text-[#584141] mr-1">Speed:</span>
                  {[0.75, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        audioState.playbackSpeed === spd
                          ? 'bg-[#570013] text-white font-bold'
                          : 'text-[#221918] hover:bg-white'
                      }`}
                    >
                      {spd === 0.75
                        ? loc('0.75x (Slow)', '०.७५x (मंद)', '0.75x (मंद)', '૦.૭૫x (મંદ)')
                        : spd === 1.0
                        ? loc('1.0x (Normal)', '१.०x (मध्यम)', '1.0x (मध्यम)', '૧.૦x (સામાન્ય)')
                        : loc('1.25x (Fast)', '१.२५x (द्रुत)', '1.25x (द्रुत)', '૧.૨૫x (ઝડપી)')}
                    </button>
                  ))}
                </div>

                {/* Main Play / Replay / Forward Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setAudioState((prev) => ({
                        ...prev,
                        currentTimeSeconds: Math.max(0, prev.currentTimeSeconds - 10),
                      }))
                    }
                    className="w-9 h-9 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#221918] hover:bg-[#FCEAE6] transition-colors cursor-pointer"
                    title="Rewind 10s"
                  >
                    <span className="material-symbols-outlined text-[20px]">replay_10</span>
                  </button>

                  <button
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-full bg-[#570013] text-white flex items-center justify-center hover:bg-[#800020] transition-transform active:scale-95 shadow-md cursor-pointer"
                    title="Play / Pause"
                  >
                    <span className="material-symbols-outlined text-[28px]">
                      {audioState.isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setAudioState((prev) => ({
                        ...prev,
                        currentTimeSeconds: Math.min(prev.totalDurationSeconds, prev.currentTimeSeconds + 10),
                      }))
                    }
                    className="w-9 h-9 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#221918] hover:bg-[#FCEAE6] transition-colors cursor-pointer"
                    title="Forward 10s"
                  >
                    <span className="material-symbols-outlined text-[20px]">forward_10</span>
                  </button>

                  <button
                    onClick={() =>
                      setAudioState((prev) => ({ ...prev, isLooping: !prev.isLooping }))
                    }
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      audioState.isLooping
                        ? 'bg-[#FFD979] text-[#795D00] ring-1 ring-[#765B00]'
                        : 'bg-[#FFF0ED] text-[#584141] hover:bg-[#FCEAE6]'
                    }`}
                    title="Repeat Mantra Loop"
                  >
                    <span className="material-symbols-outlined text-[19px]">repeat_one</span>
                  </button>
                </div>

                {/* Script Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowIast(!showIast)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer border border-[#E0BFBF]/40 ${
                      showIast ? 'bg-[#570013] text-white font-bold' : 'bg-[#FFF0ED] text-[#221918]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">translate</span>
                    <span>IAST Roman</span>
                  </button>

                  <button
                    onClick={() => setShowAnvaya(!showAnvaya)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer border border-[#E0BFBF]/40 ${
                      showAnvaya ? 'bg-[#570013] text-white font-bold' : 'bg-[#FFF0ED] text-[#221918]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">view_list</span>
                    <span>अन्वय (Anvaya)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Svara Notation Legend Guide */}
            <div className="bg-[#FFF0ED] rounded-xl p-4 shadow-xs border border-[#E0BFBF]/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#765B00]">menu_book</span>
                  <span className="text-xs text-[#570013] font-bold">
                    वैदिक स्वर लक्षण मार्गदर्शिका (Vedic Swara Notation Guide):
                  </span>
                </div>
                <span className="text-[11px] text-[#584141]">शौनक प्रातिशाख्य पद्धत</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div className="bg-white p-2.5 rounded-lg border border-[#E0BFBF]/30 flex items-start gap-2">
                  <span className="text-[#765B00] font-bold text-lg leading-none mt-0.5">अ॒</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#221918]">अनुदात्त (Anudātta)</h4>
                    <p className="text-[11px] text-[#584141]">Low tone • Underline stroke under syllable</p>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E0BFBF]/30 flex items-start gap-2">
                  <span className="text-[#570013] font-bold text-lg leading-none mt-0.5">अ</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#221918]">उदात्त (Udātta)</h4>
                    <p className="text-[11px] text-[#584141]">Middle/High natural pitch • Syllable unaccented</p>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-[#E0BFBF]/30 flex items-start gap-2">
                  <span className="text-[#765B00] font-bold text-lg leading-none mt-0.5">अ॑</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#221918]">स्वरित (Svarita)</h4>
                    <p className="text-[11px] text-[#584141]">Rising/Falling high accent • Vertical superscript stroke</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VERSE 1: ACTIVE STUDY MODULE */}
            <article className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#570013] via-[#765B00] to-[#800020]"></div>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#570013] text-white text-xs font-bold">
                      ऋचा १ (Verse 1)
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#765B00] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#765B00] animate-pulse"></span>
                      {loc('Currently Chanting', 'सध्या पठण सुरू', 'वर्तमान पाठ जारी', 'હાલમાં પઠન ચાલુ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        showToast(
                          loc(
                            'Richa 1 Bookmarked',
                            'ऋचा १ बुकमार्क केली',
                            'ऋचा 1 बुकमार्क की गई',
                            'ઋચા ૧ બુકમાર્ક કરી'
                          ),
                          'success'
                        )
                      }
                      className="p-1.5 rounded bg-[#FFF0ED] hover:bg-[#FCEAE6] text-[#584141] transition-colors cursor-pointer"
                      title={loc('Bookmark verse', 'ऋचा बुकमार्क करा', 'ऋचा बुकमार्क करें', 'ઋચા બુકમાર્ક કરો')}
                    >
                      <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          '॥ ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् । होता॑रं रत्न॒धात॑मम् ॥ १ ॥'
                        );
                        showToast(
                          loc(
                            'Vedic mantra copied to clipboard',
                            'वेदमंत्र क्लिपबोर्डवर कॉपी झाला',
                            'वेदमंत्र क्लिपबोर्ड पर कॉपी हुआ',
                            'વેદમંત્ર ક્લિપબોર્ડ પર કૉપી થયો'
                          ),
                          'info'
                        );
                      }}
                      className="p-1.5 rounded bg-[#FFF0ED] hover:bg-[#FCEAE6] text-[#584141] transition-colors cursor-pointer"
                      title={loc('Copy Sanskrit', 'संस्कृत मंत्र कॉपी करा', 'संस्कृत मंत्र कॉपी करें', 'સંસ્કૃત મંત્ર કૉપી કરો')}
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>

                {/* Main Vedic Sanskrit Display */}
                <div className="bg-[#FFF8F6] rounded-xl p-6 text-center border border-[#E0BFBF]/30 shadow-inner">
                  <p
                    className="font-serif text-xl sm:text-2xl text-[#570013] font-bold tracking-wide select-all"
                    style={{ lineHeight: '2.2' }}
                  >
                    ॥ ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् ।<br className="hidden sm:inline" />
                    होता॑रं रत्न॒धात॑मम् ॥ १ ॥
                  </p>

                  {/* IAST Transliteration */}
                  {showIast && (
                    <div className="mt-3 pt-2 text-[#584141] text-xs sm:text-sm italic tracking-wider border-t border-[#E0BFBF]/20">
                      oṃ agnimm īḷe purohitaṃ yajñasya devam ṛtvijam |<br />
                      hotāraṃ ratnadhātamam || 1 ||
                    </div>
                  )}
                </div>

                {/* Word-by-Word Nirukta Shastric Breakdown */}
                {showAnvaya && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base text-[#570013] font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#765B00] text-[20px]">
                          auto_stories
                        </span>
                        <span>पदच्छेद व अन्वय (Word-by-Word Shastric Nirukta)</span>
                      </h3>
                      <span className="text-xs text-[#765B00] font-semibold">अन्वय क्रम: १-३-४-५-६-७-८-२</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">अग्निम् (Agnim)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            द्वितीया एकवचन
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">चैतन्यस्वरूप अग्निदेवाला (To the luminous flame)</p>
                        <p className="text-[#584141] text-[11px]">Root: अग् + नि प्रत्यय — अग्रगण्य, पुढे गमन करणारा.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">ईळे (Īḷe)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            लट् लकार (उत्तम पुरुष)
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">मी स्तवन करतो (I praise reverently)</p>
                        <p className="text-[#584141] text-[11px]">Root: ईड् स्तुतौ (Rigvedic retroflex ळ sound).</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">पुरोहितम् (Purohitam)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            कर्म पद
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">अग्रभागी स्थापित (The foremost guide & priest)</p>
                        <p className="text-[#584141] text-[11px]">पुरः + हितम् — जो यज्ञात प्रथम स्थान धारण करतो.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">यज्ञस्य (Yajñasya)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            षष्ठी एकवचन
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">लोककल्याणकारी यज्ञाचा (Of sacred cosmic order)</p>
                        <p className="text-[#584141] text-[11px]">यज् देवपूजासंगतिकरणदानेषु धातूपासून निष्पन्न.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">देवम् (Devam)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            विशेषण
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">दिव्य प्रकाशमय (The radiant divine energy)</p>
                        <p className="text-[#584141] text-[11px]">दिव् दाने वा द्योतने वा — द्योतमान स्वभाव.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">ऋत्विजम् (Ṛtvijam)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            विशेषण
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">ऋतूनुसार यजन करवणारा (Seasonal officiating priest)</p>
                        <p className="text-[#584141] text-[11px]">ऋतौ यजति इति ऋत्विक्.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">होतारम् (Hotāram)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            तृतीया कारक
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">हवि अर्पण करणारा (The cosmic invoker)</p>
                        <p className="text-[#584141] text-[11px]">हू दानादनयोः / आह्वाने — जो देवांना आमंत्रित करतो.</p>
                      </div>

                      <div className="bg-[#FFF0ED] p-3 rounded-lg border border-[#E0BFBF]/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#570013]">रत्नधातमम् (Ratnadhātamam)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#765B00]">
                            अतिशयार्थ प्रत्यय
                          </span>
                        </div>
                        <p className="text-[#221918] font-medium">परम श्रेष्ठ आध्यात्मिक रत्ने देणारा (Bestower of treasures)</p>
                        <p className="text-[#584141] text-[11px]">रत्नानि अतिशयेन दधाति इति रत्नधातमः.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Philosophical Translation Callout */}
                <div className="bg-[#FFF0ED] p-4 rounded-xl border border-[#E0BFBF]/30 space-y-2">
                  <span className="text-xs text-[#765B00] font-bold uppercase tracking-wider">
                    भावार्थ व दार्शनिक रहस्य (Philosophical Essence & Translation)
                  </span>
                  <p className="text-sm text-[#221918] italic leading-relaxed">
                    “I adore Agni, the foremost divine minister of sacrifice, the radiant presiding priest of seasonal rites, the supreme summoner who invites divine energies into human consciousness, and the granter of unparalleled spiritual and material treasures.”
                  </p>
                  <p className="text-xs text-[#584141] leading-relaxed pt-1">
                    <strong>मराठी भावार्थ:</strong> “यज्ञाचे पुरोहित, दिव्य दीप्तीमान, ऋतूनुसार यज्ञ सिद्ध करणारे, देवांचे आवाहन करणारे आणि अलौकिक रत्नांचे (तेज, ओज, आध्यात्मिक ऐश्वर्य) परम दाता असलेल्या अग्निदेवाची मी अंतःकरणाने स्तुती करतो.”
                  </p>
                </div>
              </div>
            </article>

            {/* VERSE 2 */}
            <article className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 p-6 space-y-3 opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#570013] text-xs font-semibold">
                  ऋचा २ (Verse 2)
                </span>
                <button
                  type="button"
                  onClick={() => handleJumpVerse(2)}
                  className="px-3 py-1 rounded bg-[#FCEAE6] text-[#570013] hover:bg-[#570013] hover:text-white transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">play_circle</span>
                  <span>Jump & Study Verse 2</span>
                </button>
              </div>
              <div className="text-center py-2">
                <p className="font-serif text-base sm:text-lg text-[#221918] font-bold" style={{ lineHeight: '2' }}>
                  ॥ अ॒ग्निः पूर्वे॑भि॒रृषि॑भि॒रीड्यो॒ नूत॑नैरु॒त ।<br className="hidden sm:inline" />
                  स दे॒वाँ एह व॑क्षति ॥ २ ॥
                </p>
                <p className="text-xs text-[#584141] italic mt-1">
                  agniḥ pūrvebhir ṛṣibhir īḍyo nūtanair uta | sa devāṃ eha vakṣati || 2 ||
                </p>
              </div>
              <p className="text-xs text-[#584141] leading-relaxed">
                <strong>सार:</strong> पूर्वकालीन भृगु-अंगिरा इत्यादी महान ऋषींनी ज्या अग्निचे स्तवन केले, तसेच वर्तमानकालीन साधकही ज्याची उपासना करतात — तो अग्निदेव येथे सर्व देवमंडळाला घेऊन येवो.
              </p>
            </article>

            {/* VERSE 3 */}
            <article className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 p-6 space-y-3 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#584141] text-xs font-semibold">
                  ऋचा ३ (Verse 3)
                </span>
                <button
                  type="button"
                  onClick={() => handleJumpVerse(3)}
                  className="px-3 py-1 rounded bg-[#FFF0ED] text-[#584141] hover:text-[#570013] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">play_circle</span>
                  <span>Jump & Study Verse 3</span>
                </button>
              </div>
              <div className="text-center py-2">
                <p className="font-serif text-base sm:text-lg text-[#584141] font-bold" style={{ lineHeight: '2' }}>
                  ॥ अ॒ग्निना॑ र॒यिम॑श्नव॒त्पोष॑मे॒व दि॒वेदि॑वे ।<br className="hidden sm:inline" />
                  य॒शसं॑ वी॒रव॑त्तमम् ॥ ३ ॥
                </p>
              </div>
              <p className="text-xs text-[#584141] leading-relaxed">
                <strong>सार:</strong> त्या अग्निदेवाच्या कृपेने साधकाला प्रतिदिन वृद्धिंगत होणारे ऐश्वर्य, यश आणि श्रेष्ठ पराक्रमी संतती / सामर्थ्य प्राप्त होते.
              </p>
            </article>

            {/* Archival Material Download Drawer */}
            <div className="bg-[#FFF0ED] rounded-xl p-5 border border-[#E0BFBF]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#570013]">
                  {loc(
                    'Authentic Vedic Study Materials',
                    'प्रामाणिक वैदिक अभ्यास साहित्य',
                    'प्रमाणिक वैदिक अध्ययन सामग्री',
                    'પ્રમાણિત વૈદિક અભ્યાસ સામગ્રી'
                  )}
                </h4>
                <p className="text-xs text-[#584141]">
                  {loc(
                    'Download authentic manuscript transcriptions & audio masters for offline study.',
                    'ऑफलाईन साधनेसाठी अस्सल हस्तलिखित प्रती व ऑडिओ डाउनलोड करा.',
                    'ऑफ़लाइन अध्ययन हेतु प्रामाणिक पांडुलिपि प्रतिलिपियां एवं ऑडियो डाउनलोड करें।',
                    'ઓફલાઇન અભ્યાસ માટે હસ્તપ્રત લિપિ અને ઉચ્ચ ગુણવત્તાવાળા ઑડિયો ડાઉનલોડ કરો.'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    showToast(
                      loc(
                        'Downloading Agni Sukta Bhashya PDF...',
                        'अग्नि सूक्त भाष्य पीडीएफ डाउनलोड सुरू झाले...',
                        'अग्नि सूक्त भाष्य पीडीएफ डाउनलोड प्रारंभ हुआ...',
                        'અગ્નિ સૂક્ત ભાષ્ય પીડીએફ ડાઉનલોડ શરૂ થયું...'
                      ),
                      'info'
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-white text-[#570013] hover:bg-[#FCEAE6] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#765B00]">picture_as_pdf</span>
                  <span>{loc('Agni Sukta Bhashya (PDF)', 'अग्नि सूक्त भाष्य (PDF)', 'अग्नि सूक्त भाष्य (PDF)', 'અગ્નિ સૂક્ત ભાષ્ય (PDF)')}</span>
                </button>
                <button
                  onClick={() =>
                    showToast(
                      loc(
                        'Downloading 24-Bit Studio FLAC Audio...',
                        '२४-बिट स्टुडिओ ऑडिओ मास्टर डाउनलोड सुरू झाले...',
                        '24-बिट स्टूडियो ऑडियो मास्टर डाउनलोड प्रारंभ हुआ...',
                        '૨૪-બિટ સ્ટુડિયો ઑડિયો માસ્ટર ડાઉનલોડ શરૂ થયું...'
                      ),
                      'info'
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                  <span>
                    {loc(
                      'Studio FLAC (28 MB)',
                      'स्टुडिओ FLAC (२८ MB)',
                      'स्टूडियो FLAC (28 MB)',
                      'સ્ટુડિયો FLAC (૨૮ MB)'
                    )}
                  </span>
                </button>
              </div>
            </div>
          </main>

          {/* Right Column (4 of 12 cols): Syllabus Navigation & Acharya Guidance */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Syllabus Navigation Card */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 p-5 space-y-4">
              <div className="space-y-2 pb-2 border-b border-[#E0BFBF]/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#765B00] font-bold uppercase tracking-wider">
                    {loc('Course Track & Syllabus Progress', 'पाठ्यक्रम प्रगती', 'पाठ्यक्रम प्रगति', 'અભ્યાસક્રમ પ્રગતિ')}
                  </span>
                  <span className="text-xs text-[#570013] font-bold">
                    {formatLocalizedNumber('4', language)} / {formatLocalizedNumber('12', language)} {loc('Lessons', 'पाठ', 'पाठ', 'પાઠ')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FFF0ED] overflow-hidden">
                  <div className="h-full bg-[#765B00] rounded-full" style={{ width: '33.3%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#584141]">
                  <span>{formatLocalizedNumber('33', language)}% {loc('Completed', 'पूर्ण', 'पूर्ण', 'પૂર્ણ')}</span>
                  <span>{loc('Rigveda Beginner Level', 'ऋग्वेद प्रारंभिक स्तर', 'ऋग्वेद प्रारंभिक स्तर', 'ઋગ્વેદ પ્રારંભિક સ્તર')}</span>
                </div>
              </div>

              {/* Module Hierarchy */}
              <div className="space-y-2 text-xs">
                {/* Module 1 */}
                <div className="p-2.5 rounded-lg bg-[#FFF0ED] flex items-center justify-between text-[#570013] font-semibold">
                  <span>{loc('Module 1: Vedic Svara Intro & Rules', 'विभाग १: वैदिक स्वर परिचय व नियम', 'विभाग 1: वैदिक स्वर परिचय एवं नियम', 'વિભાગ ૧: વૈદિક સ્વર પરિચય અને નિયમો')}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#765B00]">check_circle</span>
                </div>

                {/* Module 2: Active */}
                <div className="p-3 rounded-lg bg-[#FCEAE6] space-y-2 border border-[#E0BFBF]/40">
                  <div className="flex items-center justify-between text-[#570013] font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#765B00]">play_circle</span>
                      <span>{loc('Module 2: Agni Sukta Complete Study', 'विभाग २: अग्नि सूक्त संपूर्ण अध्ययन', 'विभाग 2: अग्नि सूक्त संपूर्ण अध्ययन', 'વિભાગ ૨: અગ્નિ સૂક્ત સંપૂર્ણ અધ્યયન')}</span>
                    </span>
                    <span className="text-[#765B00] text-[10px] font-bold">{loc('In Progress', 'चालू', 'प्रगति पर', 'ચાલુ')}</span>
                  </div>
                  <div className="space-y-1.5 pl-3">
                    <div className="flex items-center justify-between text-[#584141] py-1">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[#765B00]">check</span>
                        <span>{loc('2.1 Madhucchanda Rishi & Viniyoga', '२.१ मधुच्छन्दा ऋषि व विनियोग', '2.1 मधुच्छन्दा ऋषि एवं विनियोग', '૨.૧ મધુચ્છંદા ઋષિ અને વિનિયોગ')}</span>
                      </span>
                      <span className="text-[10px] text-[#765B00]">{loc('Completed', 'पूर्ण', 'पूर्ण', 'પૂર્ણ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#570013] font-bold bg-white rounded px-2 py-1.5 shadow-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#570013]">
                          record_voice_over
                        </span>
                        <span>{loc('2.2 Richa 1: Pada Patha & Svara Distinction', '२.२ ऋचा १: पदपाठ व स्वरभेद', '2.2 ऋचा 1: पदपाठ एवं स्वरभेद', '૨.૨ ઋચા ૧: પદપાઠ અને સ્વરભેદ')}</span>
                      </span>
                      <span className="text-[10px] bg-[#570013] text-white px-1.5 py-0.5 rounded">
                        {loc('Playing', 'वाजत आहे', 'बज रहा है', 'વાગી રહ્યું છે')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#584141] py-1">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">lock_open</span>
                        <span>{loc('2.3 Richas 2 & 3: Sandhi & Yati Rules', '२.३ ऋचा २ व ३: सन्धी व यति नियम', '2.3 ऋचा 2 व 3: संधि एवं यति नियम', '૨.૩ ઋચા ૨ અને ૩: સંધિ અને યતિ નિયમો')}</span>
                      </span>
                      <span className="text-[10px]">{formatLocalizedNumber('10', language)} {loc('min', 'मि.', 'मि.', 'મિનિટ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#584141] py-1">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">lock_open</span>
                        <span>{loc('2.4 Richas 4 to 9: Purnahuti & Ghana Patha', '२.४ ऋचा ४ ते ९: पूर्णाहुती व घनपाठ', '2.4 ऋचा 4 से 9: पूर्णाहुति एवं घनपाठ', '૨.૪ ઋચા ૪ થી ૯: પૂર્ણાહુતિ અને ઘનપાઠ')}</span>
                      </span>
                      <span className="text-[10px]">{formatLocalizedNumber('22', language)} {loc('min', 'मि.', 'मि.', 'મિનિટ')}</span>
                    </div>
                  </div>
                </div>

                {/* Module 3: Locked */}
                <div className="p-2.5 rounded-lg bg-[#FFF0ED] opacity-60 flex items-center justify-between text-[#584141]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>{loc('Module 3: Purusha Sukta Vidhi & Nyasa', 'विभाग ३: पुरुष सूक्त विधी व न्यास', 'विभाग 3: पुरुष सूक्त विधि एवं न्यास', 'વિભાગ ૩: પુરુષ સૂક્ત વિધિ અને ન્યાસ')}</span>
                  </div>
                  <span className="text-[10px]">{loc('Next Level', 'पुढील स्तर', 'अगला स्तर', 'આગલું સ્તર')}</span>
                </div>
              </div>
            </div>

            {/* Acharya Guidance & Caution */}
            <div className="bg-[#FFF0ED] rounded-xl shadow-xs border border-[#E0BFBF]/40 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr8sUQmJU_ddYYDQH_FMwyANmppwuhlKmDsC5agsgu5KLGBNnUEFsVOF6m15896lNDYI-WoYxiQUZMAZoOsET-3jNqm5ya9xYYvno9QMEb0YtSqayVEXsdRFxneOxrarysM1PGql_ztJhegdgmB91BGP6qVO85cdueBUI2WlMdx2bT445bfplMTx06IH5xwtN-JQqBknbNd6eoI5dLvQ7AtBOIItTrgpB8d-5-qsTL_jfw6eenEEBLIQ"
                  alt="Acharya Shridhar Ghanapathi"
                  className="w-12 h-12 rounded-full object-cover shadow-xs border border-[#E0BFBF]"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#570013]">
                    {loc('Guru Guidance (Upadesha)', 'आचार्य मार्गदर्शन', 'आचार्य मार्गदर्शन', 'આચાર્ય માર્ગદર્શન')}
                  </h4>
                  <p className="text-xs text-[#765B00] font-medium">
                    {loc('Dr. Shripad Bhat (Ghanapathi)', 'वे. मू. डॉ. श्रीपाद भट (घनापाठी)', 'वे. मू. डॉ. श्रीपाद भट (घनापाठी)', 'વે. મૂ. ડૉ. શ્રીપાદ ભટ્ટ (ઘનાપાઠી)')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg text-[#584141] text-xs space-y-1.5 border border-[#E0BFBF]/30">
                <div className="flex items-center gap-1 text-[#570013] font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#765B00]">warning</span>
                  <span>{loc('Vocal Precision Note:', 'उच्चारण सावधता:', 'उच्चारण सावधानी:', 'ઉચ્ચારણ સાવધાની:')}</span>
                </div>
                <p className="leading-relaxed">
                  {loc(
                    "When pronouncing 'अग्निमीळे', the Vedic 'ळ' sound should touch the palate gently. In 'पु॒रोहि॑तं', the Anudatta svara on 'पु' should descend naturally without strain on the throat.",
                    "“अग्निमीळे मधील 'ळे' चा उच्चार वैदिक 'ळ' कारानुसार जीभ टाळ्याला अलगद टेकवून करावा. 'पु॒रोहि॑तं' म्हणताना 'पु' वरील अनुदात्त स्वर खाली उतरताना कंठावर अनावश्यक दाब येऊ देऊ नये.”",
                    "“अग्निमीळे में 'ळे' का उच्चारण वैदिक 'ळ' कारानुसार जिह्वा को तालु से स्पर्श कराकर करें। 'पु॒रोहि॑तं' में 'पु' पर अनुदात्त स्वर का उच्चारण कंठ पर बिना दबाव के सहज रूप से करें।”",
                    "“અગ્નિમીળે માં 'ળે' નો ઉચ્ચાર વૈદિક 'ળ' કારાનુસાર જીભને તાળવે સ્પર્શ કરાવીને કરવો. 'પુ॒રોહિ॑તં' માં 'પુ' પર અનુદાત્ત સ્વરનો ઉચ્ચાર કંઠ પર દબાણ વગર સહજ કરવો.”"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  showToast(loc('Your doubt has been submitted. Acharya will address it in the next session.', 'आपली शंका नोंदवली गेली आहे. आचार्य पुढील सत्रात उत्तर देतील.', 'आपकी शंका दर्ज हो गई है। आचार्य आगामी सत्र में समाधान करेंगे।', 'આપની શંકા નોંધાઈ ગઈ છે. આચાર્ય આગામી સત્રમાં સમાધાન કરશે.'), 'success')
                }
                className="w-full py-2.5 px-3 rounded-lg bg-[#570013] text-white hover:bg-[#800020] text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                <span>{loc('Ask Acharya / Clarification', 'आचार्यांना विचारा / शंका निरसन', 'आचार्य से पूछें / शंका समाधान', 'આચાર્યને પૂછો / શંકા સમાધાન')}</span>
              </button>
            </div>

            {/* Daily Sadhana Streak Tracker */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E0BFBF]/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#765B00] font-bold uppercase tracking-wider">
                  {loc('Daily Vedic Sadhana', 'दैनिक वेद साधना', 'दैनिक वेद साधना', 'દૈનિક વેદ સાધના')}
                </span>
                <div className="inline-flex items-center gap-1 bg-[#FFD979] px-2 py-0.5 rounded text-[#795D00] text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  <span>{loc('14-Day Streak', '१४ दिवस अखंड', '14 दिन निरंतर', '૧૪ દિવસ અવિરત')}</span>
                </div>
              </div>
              <p className="text-xs text-[#584141] leading-relaxed">
                {loc(
                  'Submit your 1-minute vocal recitation for automated Svara validation and personal Acharya feedback.',
                  'स्वर शुद्धतेसाठी आपले १ मिनिटांचे पठण रेकॉर्ड करा, आचार्य वैयक्तिक मार्गदर्शन करतील.',
                  'स्वर शुद्धता के लिए अपना 1 मिनट का पाठ रिकॉर्ड करें, आचार्य व्यक्तिगत मार्गदर्शन करेंगे।',
                  'સ્વર શુદ્ધતા માટે આપનું ૧ મિનિટનું પઠન રેકોર્ડ કરો, આચાર્ય વ્યક્તિગત માર્ગદર્શન આપશે.'
                )}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRecordingModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#FFF0ED] hover:bg-[#FCEAE6] text-[#570013] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#E0BFBF]/40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">mic</span>
                  <span>{loc('Record Chanting', 'उच्चार रेकॉर्ड करा', 'उच्चारण रिकॉर्ड करें', 'ઉચ્ચારણ રેકોર્ડ કરો')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard/learning')}
                  className="p-2 rounded-lg bg-[#FFF0ED] hover:bg-[#FCEAE6] text-[#584141] transition-colors border border-[#E0BFBF]/40 cursor-pointer"
                  title={loc('Learning History', 'स्वाध्याय इतिहास', 'अध्ययन इतिहास', 'અધ્યયન ઇતિહાસ')}
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </button>
              </div>
            </div>

            {/* Archival Edition Reference Note */}
            <div className="bg-[#FFF0ED] rounded-xl p-4 border border-[#E0BFBF]/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[#765B00] text-[20px]">all_inclusive</span>
              </div>
              <div>
                <p className="text-xs text-[#765B00] font-bold">
                  {loc('Tradition Preservation Trust', 'परंपरा संवर्धन विश्वस्त संस्था', 'परंपरा संवर्धन न्यास', 'પરંપરા સંવર્ધન ટ્રસ્ટ')}
                </p>
                <p className="text-[11px] text-[#584141] leading-snug">
                  {loc(
                    'All texts checked against Pune Vaidika Samshodhana Mandala critical editions (1933).',
                    'सर्व संहिता पाठ पुणे वैदिक संशोधन मंडळ अधिकृत ग्रंथांशी (१९३३) ताडून पाहिलेले आहेत.',
                    'सभी संहिता पाठ पुणे वैदिक संशोधन मंडल के अधिकृत संस्करण (1933) से प्रमाणित हैं।',
                    'બધા સંહિતા પાઠ પુણે વૈદિક સંશોધન મંડળના અધિકૃત ગ્રંથો (૧૯૩૩) સાથે પ્રમાણિત કરેલા છે.'
                  )}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Audio Recording Practice Modal */}
      {isRecordingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#241B19]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
        >
          <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-2xl space-y-4 border border-[#E0BFBF]/40 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0BFBF]/30">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#FFDADA] text-[#570013] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">mic</span>
                </span>
                <h3 className="font-serif text-base font-bold text-[#570013]">
                  {loc(
                    'Vedic Recitation Audio Test',
                    'सस्वर मंत्रोच्चार ध्वनी चाचणी',
                    'सस्वर मंत्रोच्चार ऑडियो परीक्षण',
                    'સસ્વર મંત્રોચ્ચાર ઑડિયો પરીક્ષણ'
                  )}
                </h3>
              </div>
              <button
                onClick={() => setIsRecordingModalOpen(false)}
                className="text-[#584141] hover:text-[#570013]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 bg-[#FFF0ED] rounded-xl flex flex-col items-center justify-center space-y-3 text-center border border-[#E0BFBF]/30">
              <div className="w-16 h-16 rounded-full bg-white text-[#570013] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-3xl">mic</span>
              </div>
              <div className="text-xs text-[#584141]">
                {loc(
                  'Hymn 1 — Press the button below to start Vedic pronunciation recording.',
                  'ऋचा १ — सस्वर उच्चारण ध्वनीमुद्रण सुरू करण्यासाठी खालील बटण दाबा.',
                  'ऋचा 1 — सस्वर उच्चारण रिकॉर्डिंग प्रारंभ करने के लिए नीचे दिया गया बटन दबाएँ।',
                  'ઋચા ૧ — સસ્વર ઉચ્ચારણ રેકોર્ડિંગ શરૂ કરવા નીચેનું બટન દબાવો.'
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRecordingModalOpen(false);
                  showToast(
                    loc(
                      'Your pronunciation recording has been sent to the Acharya for evaluation!',
                      'आपले उच्चार रेकॉर्डिंग आचार्यांकडे मूल्यांकनासाठी पाठवले आहे!',
                      'आपकी उच्चारण रिकॉर्डिंग आचार्य मूल्यांकन हेतु भेज दी गई है!',
                      'તમારું ઉચ્ચારણ રેકોર્ડિંગ આચાર્ય મૂલ્યાંકન માટે મોકલી દેવાયું છે!'
                    ),
                    'success'
                  );
                }}
                className="w-full py-2.5 rounded-lg bg-[#570013] text-white text-xs font-bold hover:bg-[#800020] transition-colors cursor-pointer"
              >
                {loc('Start Recording & Submit', 'रेकॉर्ड सुरू करा व सादर करा', 'रिकॉर्डिंग प्रारंभ कर जमा करें', 'રેકોર્ડ શરૂ કરો અને રજૂ કરો')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
