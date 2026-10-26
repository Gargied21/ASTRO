import React from 'react';
import { useDevotee } from '../../context/DevoteeContext.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDevotee();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const bgStyles =
          toast.type === 'success'
            ? 'bg-[#570013] text-white border-l-4 border-[#C9A64B]'
            : toast.type === 'error'
            ? 'bg-[#BA1A1A] text-white'
            : 'bg-[#221918] text-[#FFF8F6] border-l-4 border-[#765B00]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg shadow-xl text-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${bgStyles}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg shrink-0">
                {toast.type === 'success' ? 'verified' : toast.type === 'error' ? 'error' : 'info'}
              </span>
              <span className="font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/80 hover:text-white p-1 rounded transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
