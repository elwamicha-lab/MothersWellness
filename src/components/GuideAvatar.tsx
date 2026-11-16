import React from 'react';

interface GuideAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GuideAvatar: React.FC<GuideAvatarProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  return (
    <div
      aria-label="AI Guide Avatar"
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-[#FFF5F0] to-[#F5ECE5] border border-[#F0D5C7] shadow-2xs text-[#B8533E] ${sizeClasses} ${className}`}
    >
      {/* Abstract friendly icon: speech bubble with a gentle sprouting leaf */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3/5 h-3/5 text-[#B8533E]"
      >
        {/* Soft speech bubble in warm blush-rose */}
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" fill="#FDF1EC" stroke="#C46049" />
        {/* Gentle organic leaf in the center in soft sage */}
        <path
          d="M12 8c2.5 0 4.5 1.8 4.5 4.5 0 2.5-2.2 4-4.5 4-2.5 0-4.5-1.8-4.5-4.5C7.5 9.5 9.5 8 12 8z"
          fill="#EAF4EE"
          stroke="#3B7754"
          strokeWidth="1.5"
        />
        <path d="M12 8v8" stroke="#3B7754" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Small subtle sprout dot indicator in warm amber/terracotta */}
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#C46049] rounded-full border-2 border-white" />
    </div>
  );
};
