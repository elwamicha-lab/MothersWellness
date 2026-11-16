import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-20"
    >
      <svg
        className="w-full h-full opacity-[0.045] print:opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="futureproof-watermark-pattern"
            width="340"
            height="220"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-24)"
          >
            <text
              x="20"
              y="95"
              fill="#8C3E2D"
              fontFamily="'Plus Jakarta Sans', 'Nunito Sans', sans-serif"
              fontSize="16"
              fontWeight="700"
              letterSpacing="0.16em"
            >
              FUTUREPROOF CONSULTING
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#futureproof-watermark-pattern)" />
      </svg>
    </div>
  );
};
