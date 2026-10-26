import React, { useState, useEffect } from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../api/client.ts';

interface NotificationsViewProps {
  onNavigateModule: (module: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateModule }) => {
  const { showToast } = useDevotee();
  const { loc } = useLanguage();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    api.notifications
      .getAll()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await api.notifications.markAllAsRead();
    } catch {}
    showToast(
      loc(
        'All notifications marked as read',
        'सर्व सूचना वाचल्या म्हणून चिन्हांकित केल्या',
        'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं',
        'બધી સૂચનાઓ વંચાઈ ગઈ તરીકે ચિહ્નિત કરી'
      ),
      'info'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#570013] font-bold">
            {loc(
              'Devotee Sanctum Notifications & Alerts',
              'सूचना व संदेश',
              'भक्त सूचनाएं एवं संदेश',
              'ભક્ત સૂચનાઓ અને સંદેશાઓ'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#584141]">
            {loc(
              'Live ritual broadcasts, upcoming consultations, and tax receipt alerts.',
              'यज्ञ सत्रे, परामर्श वेळा, आणि पावती संदर्भातील थेट संदेश.',
              'यज्ञ सत्र, परामर्श समय एवं रसीद संबंधी प्रत्यक्ष संदेश।',
              'યજ્ઞ સત્રો, પરામર્શ સમય અને પાવતી સંબંધિત જીવંત સંદેશાઓ.'
            )}
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#570013] hover:underline cursor-pointer self-start sm:self-auto"
        >
          {loc('Mark all as read', 'सर्व वाचले म्हणून चिन्हांकित करा', 'सभी पढ़ी हुई चिह्नित करें', 'બધું વંચાઈ ગયું તરીકે ચિહ્નિત કરો')}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E0BFBF]/40 text-center text-xs text-[#584141]">
            {loc("No notifications in your Devotee Sanctum yet.", "आपल्या भक्त कक्षामध्ये सध्या कोणत्याही सूचना नाहीत.", "आपके भक्त कक्ष में अभी कोई सूचना नहीं है।", "આપના ભક્ત કક્ષમાં હાલમાં કોઈ સૂચના નથી.")}
          </div>
        ) : notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              n.unread
                ? 'bg-white border-[#765B00]/40 shadow-xs'
                : 'bg-[#FFF0ED]/60 border-[#E0BFBF]/30 opacity-90'
            }`}
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  n.unread ? 'bg-[#570013] text-white' : 'bg-[#FFF0ED] text-[#765B00]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{n.icon}</span>
              </div>
              <div className="flex flex-col min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#221918]">
                    {loc(n.titleEn, n.titleMr, n.titleHi, n.titleGu)}
                  </span>
                  {n.unread && (
                    <span className="px-1.5 py-0.5 rounded bg-[#BA1A1A] text-white text-[10px] font-bold">
                      {loc('NEW', 'नवीन', 'नया', 'નવું')}
                    </span>
                  )}
                  <span className="text-[11px] text-[#584141] opacity-75">
                    • {loc(n.timeEn, n.timeMr, n.timeHi, n.timeGu)}
                  </span>
                </div>
                <p className="text-xs text-[#584141] leading-relaxed">
                  {loc(n.messageEn, n.messageMr, n.messageHi, n.messageGu)}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateModule(n.actionModule)}
              className="px-3.5 py-2 rounded-lg bg-[#FFF0ED] text-[#570013] text-xs font-bold hover:bg-[#FCEAE6] transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
            >
              {loc(n.actionTextEn, n.actionTextMr, n.actionTextHi, n.actionTextGu)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
