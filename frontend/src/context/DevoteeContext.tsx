import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  DevoteeProfile,
  TaxReceipt,
  RitualRecord,
  JyotishConsultation,
  AstrologyQuestionItem,
} from '../types/index.ts';
import { api, getToken, removeToken } from '../api/client.ts';

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
  isLoading: boolean;
  profile: DevoteeProfile;
  updateProfile: (updated: Partial<DevoteeProfile>) => Promise<void>;
  addFamilyMember: (member: { name: string; relation: string; nakshatra: string }) => Promise<void>;
  deleteFamilyMember: (id: string) => Promise<void>;
  receipts: TaxReceipt[];
  addReceipt: (receipt: TaxReceipt) => Promise<void>;
  rituals: RitualRecord[];
  createRitual: (data: {
    title: string;
    titleMr?: string;
    type?: string;
    sankalpaIntent: string;
    date: string;
    amount: number;
  }) => Promise<void>;
  consultation: JyotishConsultation | null;
  questions: AstrologyQuestionItem[];
  addQuestion: (question: { category: string; question: string; refBhav: string }) => Promise<void>;
  audioState: AudioPlayerState;
  setAudioState: React.Dispatch<React.SetStateAction<AudioPlayerState>>;
  togglePlayAudio: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  refreshSanctumData: () => Promise<void>;
  logout: () => void;
}

const emptyProfile: DevoteeProfile = {
  id: '',
  code: '',
  name: '',
  gotra: '',
  nakshatra: '',
  charan: '',
  rashi: '',
  phone: '',
  email: '',
  address: '',
  dob: '',
  tob: '',
  pob: '',
  kuladaivat: '',
  panNumber: '',
  familyMembers: [],
};

const DevoteeContext = createContext<DevoteeContextType | undefined>(undefined);

export const DevoteeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<DevoteeProfile>(emptyProfile);
  const [receipts, setReceipts] = useState<TaxReceipt[]>([]);
  const [rituals, setRituals] = useState<RitualRecord[]>([]);
  const [consultation, setConsultation] = useState<JyotishConsultation | null>(null);
  const [questions, setQuestions] = useState<AstrologyQuestionItem[]>([]);
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

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshSanctumData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      setProfile(emptyProfile);
      setReceipts([]);
      setRituals([]);
      setConsultation(null);
      setQuestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const [userRes, receiptsRes, ritualsRes, consultRes, questionsRes] = await Promise.allSettled([
        api.auth.getMe(),
        api.donations.getReceipts(),
        api.rituals.getAll(),
        api.astrology.getConsultation(),
        api.astrology.getQuestions(),
      ]);

      if (userRes.status === 'fulfilled' && userRes.value.success) {
        setIsLoggedIn(true);
        const userData = userRes.value.data;
        setProfile({
          id: userData.id,
          code: userData.code || '#CVP-DEVOTEE',
          name: userData.name || '',
          gotra: userData.gotra || '',
          nakshatra: userData.nakshatra || '',
          charan: userData.charan || '१',
          rashi: userData.rashi || '',
          phone: userData.phone || '',
          email: userData.email || '',
          address: userData.address || '',
          dob: userData.dob || '',
          tob: userData.tob || '',
          pob: userData.pob || '',
          kuladaivat: userData.kuladaivat || '',
          panNumber: userData.panNumber || '',
          familyMembers: userData.familyMembers || [],
        });
      } else {
        removeToken();
        setIsLoggedIn(false);
        setProfile(emptyProfile);
      }

      if (receiptsRes.status === 'fulfilled' && receiptsRes.value.success) {
        setReceipts(receiptsRes.value.data || []);
      }

      if (ritualsRes.status === 'fulfilled' && ritualsRes.value.success) {
        setRituals(ritualsRes.value.data || []);
      }

      if (consultRes.status === 'fulfilled' && consultRes.value.success) {
        setConsultation(consultRes.value.data);
      }

      if (questionsRes.status === 'fulfilled' && questionsRes.value.success) {
        setQuestions(questionsRes.value.data || []);
      }
    } catch (err: any) {
      console.warn('Could not sync with backend sanctum:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSanctumData();
  }, [refreshSanctumData]);

  const updateProfile = async (updated: Partial<DevoteeProfile>) => {
    try {
      const { familyMembers: _ignored, id: _id, code: _code, ...payload } = updated as any;
      setProfile((prev) => ({ ...prev, ...updated }));
      await api.devotee.updateProfile(payload);
      showToast('गोत्र व यजमान तपशील यशस्वीरित्या अद्यतनित केले (Profile Updated)', 'success');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const addFamilyMember = async (member: { name: string; relation: string; nakshatra: string }) => {
    try {
      await api.devotee.addFamilyMember(member);
      showToast('कुटुंब सदस्याची नोंद यशस्वीरित्या जोडली (Family Member Added)', 'success');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add family member', 'error');
    }
  };

  const deleteFamilyMember = async (id: string) => {
    try {
      await api.devotee.deleteFamilyMember(id);
      showToast('कुटुंब सदस्याची नोंद हटवली (Family Member Removed)', 'info');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove family member', 'error');
    }
  };

  const addReceipt = async (receipt: TaxReceipt) => {
    try {
      const res = await api.donations.create({
        amount: receipt.amount,
        category: receipt.category,
        purpose: receipt.purpose,
        purposeMr: receipt.purposeMr,
        donorName: receipt.donorName || profile.name || 'Devotee Yajamana',
        donorPhone: profile.phone || '9822054321',
        donorPan: receipt.donorPan || profile.panNumber || undefined,
        mode: receipt.mode,
      });
      const issuedNo = res.data?.receiptNo || res.data?.receipt?.receiptNo || receipt.receiptNo;
      showToast(`नवीन ८०-जी पावती ${issuedNo} यशस्वीरित्या जारी केली!`, 'success');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save donation', 'error');
    }
  };

  const createRitual = async (data: {
    title: string;
    titleMr?: string;
    type?: string;
    sankalpaIntent: string;
    date: string;
    amount: number;
  }) => {
    try {
      await api.rituals.create(data);
      showToast(`अनुष्ठान संकल्प नोंदणी यशस्वी: ${data.title}`, 'success');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to register ritual sankalpa', 'error');
    }
  };

  const addQuestion = async (q: { category: string; question: string; refBhav: string }) => {
    try {
      await api.astrology.submitQuestion(q);
      showToast('आपला प्रश्न दैवज्ञ आचार्यांकडे सखोल अभ्यासासाठी पाठवला आहे.', 'success');
      await refreshSanctumData();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit astrology question', 'error');
    }
  };

  const togglePlayAudio = () => {
    setAudioState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const logout = () => {
    api.auth.logout();
    setIsLoggedIn(false);
    setProfile(emptyProfile);
    setReceipts([]);
    setRituals([]);
    setConsultation(null);
    setQuestions([]);
    showToast('भक्त कक्षातून यशस्वीरित्या बाहेर पडला आहात.', 'info');
  };

  return (
    <DevoteeContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        profile,
        updateProfile,
        addFamilyMember,
        deleteFamilyMember,
        receipts,
        addReceipt,
        rituals,
        createRitual,
        consultation,
        questions,
        addQuestion,
        audioState,
        setAudioState,
        togglePlayAudio,
        toasts,
        showToast,
        dismissToast,
        isLoginModalOpen,
        setIsLoginModalOpen,
        refreshSanctumData,
        logout,
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
