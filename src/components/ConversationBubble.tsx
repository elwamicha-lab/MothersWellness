import React from 'react';
import { GuideAvatar } from './GuideAvatar';

interface GuideBubbleProps {
  children: React.ReactNode;
  speaker?: string;
  isAiGuide?: boolean;
  className?: string;
}

export const GuideBubble: React.FC<GuideBubbleProps> = ({
  children,
  speaker = 'AI Guide',
  isAiGuide = true,
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] animate-fade-in ${className}`}>
      <GuideAvatar size="sm" className="mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-bold text-[#2D2320] tracking-tight">{speaker}</span>
          {isAiGuide && (
            <span className="text-[10px] font-semibold text-[#B8533E] bg-[#FDF1EB] border border-[#F2D7CD] rounded-xs px-1.5 py-0.2">
              AI guide
            </span>
          )}
        </div>
        <div className="bg-[#FFF6F2] border border-[#F4DDD2] text-[#2D2320] text-sm sm:text-base leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm shadow-2xs">
          {children}
        </div>
      </div>
    </div>
  );
};

interface UserBubbleProps {
  children: React.ReactNode;
  className?: string;
}

export const UserBubble: React.FC<UserBubbleProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex justify-end w-full animate-fade-in ${className}`}>
      <div className="max-w-[85%] sm:max-w-[75%] bg-[#EEF6F1] border border-[#D0E4D8] text-[#1D442E] text-sm sm:text-base font-medium px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-2xs text-right">
        {children}
      </div>
    </div>
  );
};
