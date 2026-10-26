import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DevoteeProfile,
  TaxReceipt,
  RitualRecord,
  JyotishConsultation,
} from '../types/index.ts';
import {
  mockDevoteeProfile,
  mockTaxReceipts,
  mockRituals,
  mockConsultation,
} from '../data/dashboardData.ts';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AudioPlayerState {
  isPlaying: boolean;
  trackTitle: string;
  verseTitle: string;
  reciter: string;
  pathaMode: 'samhita' | 'pada' | 'krama';
  playbackSpeed: number; // 0.75, 1.0, 1.25
  isLooping: boolean;
  currentTimeSeconds: number;
  totalDurationSeconds: number;
}

interface DevoteeContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  profile: DevoteeProfile;
  updateProfile: (updated: Partial<DevoteeProfile>) => void;
  receipts: TaxReceipt[];
  addReceipt: (receipt: TaxReceipt) => void;
  rituals: RitualRecord[];
  consultation: JyotishConsultation;
  addQuestion: (question: { category: string; question: string; refBhav: string }) => void;
  audioState: AudioPlayerState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioPlayerState>>;
  togglePlayAudio: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const DevoteeContext = createContext<DevoteeContextType | undefined>(undefined);

export const DevoteeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in so user can instantly preview the Sanctum screens
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<DevoteeProfile>(mockDevoteeProfile);
  const [receipts, setReceipts] = useState<TaxReceipt[]>(mockTaxReceipts);
  const [rituals, setRituals] = useState<RitualRecord[]>(mockRituals);
  const [consultation, setConsultation] = useState<JyotishConsultation>(mockConsultation);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    trackTitle: 'Mantra 1 — Svara Shuddha Uccharan',
    verseTitle: 'अग्नि सूक्त (१.१) • प्रथम मण्डल',
    reciter: 'वे. मू. डॉ. श्रीपाद भट (घनापाठी)',
    pathaMode: 'samhita',
    playbackSpeed: 1.0,
    isLooping: false,
    currentTimeSeconds: 102, // 01:42
    totalDurationSeconds: 515, // 08:35
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateProfile = (updated: Partial<DevoteeProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast('गोत्र व यजमान तपशील यशस्वीरित्या अद्यतनित केले (Profile Updated)', 'success');
  };

  const addReceipt = (receipt: TaxReceipt) => {
    setReceipts((prev) => [receipt, ...prev]);
    showToast(`नवीन ८०-जी पावती ${receipt.receiptNo} यशस्वीरित्या जारी केली!`, 'success');
  };

  const addQuestion = (q: { category: string; question: string; refBhav: string }) => {
    const newQ = {
      id: `q${Date.now()}`,
      category: q.category,
      question: q.question,
      status: 'Reviewed by Shastriji',
      refBhav: q.refBhav,
    };
    setConsultation((prev) => ({
      ...prev,
      questions: [...prev.questions, newQ],
    }));
    showToast('आपला प्रश्न दैवज्ञ आचार्यांकडे सखोल अभ्यासासाठी पाठवला आहे.', 'success');
  };

  const togglePlayAudio = () => {
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  return (
    <DevoteeContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        profile,
        updateProfile,
        receipts,
        addReceipt,
        rituals,
        consultation,
        addQuestion,
        audioState,
        setAudioState,
        togglePlayAudio,
        toasts,
        showToast,
        dismissToast,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </DevoteeContext.Provider>
  );
};

export const useDevotee = () => {
  const context = useContext(DevoteeContext);
  if (!context) {
    throw new Error('useDevotee must be used within a DevoteeProvider');
  }
  return context;
};
