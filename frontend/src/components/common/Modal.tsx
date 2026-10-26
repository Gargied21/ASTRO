import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241B19]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-xl shadow-2xl border border-[#E0BFBF]/40 overflow-hidden my-auto animate-in zoom-in-95 duration-150`}
      >
        {/* Top Sacred Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#570013] via-[#765B00] to-[#800020]"></div>

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-7 pb-3 flex items-start justify-between gap-4 border-b border-[#E0BFBF]/30">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-serif text-xl sm:text-2xl text-[#570013] font-bold tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#584141] font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-[#584141] hover:text-[#570013] p-1.5 rounded-full hover:bg-[#FCEAE6] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
