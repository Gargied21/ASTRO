import React, { useState } from 'react';
import offlineLogo from '../../assets/logo.png';

// Authentic circular Sri Yantra seal local offline asset
const AUTHENTIC_LOGO_URL = offlineLogo || '/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textClassName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative shrink-0 rounded-full overflow-hidden p-0.5 ring-1 ring-[#C9A64B]/50 shadow-sm bg-[#570013] ${sizeClasses[size]}`}>
        {!hasError ? (
          <img
            src={AUTHENTIC_LOGO_URL}
            alt="चैतन्य वेद प्रतिष्ठान मुद्रा"
            className="w-full h-full object-cover rounded-full"
            onError={() => {
              // Try fallback to /logo.png before showing SVG fallback
              if (AUTHENTIC_LOGO_URL !== '/logo.png') {
                const target = document.querySelector(`img[alt="चैतन्य वेद प्रतिष्ठान मुद्रा"]`) as HTMLImageElement;
                if (target && target.src !== window.location.origin + '/logo.png') {
                  target.src = '/logo.png';
                  return;
                }
              }
              setHasError(true);
            }}
            loading="eager"
          />
        ) : (
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" fill="#570013" stroke="#C9A64B" strokeWidth="2" />
            <polygon points="50,15 85,75 15,75" stroke="#C9A64B" strokeWidth="1.5" fill="none" />
            <polygon points="50,85 15,25 85,25" stroke="#C9A64B" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="50" r="8" fill="#C9A64B" />
            <text x="50" y="54" fill="#570013" fontSize="8" fontWeight="bold" textAnchor="middle">ॐ</text>
          </svg>
        )}
      </div>

      {showText && (
        <div className={`flex flex-col leading-tight ${textClassName}`}>
          <span className="font-serif font-bold text-base tracking-tight text-[#570013]">
            Chaitanya Ved Pratishthan
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#765b00] tracking-wider">
              चैतन्य वेद प्रतिष्ठान
            </span>
            <span className="text-neutral-300 text-[10px]">•</span>
            <span className="text-[11px] text-[#584141]/80 italic">
              Vedic Research & Rituals
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
