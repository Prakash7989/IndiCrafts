import React from 'react';

export const TribalPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <pattern id="tribal-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M20 5 L25 15 L35 15 L27 22 L30 32 L20 25 L10 32 L13 22 L5 15 L15 15 Z"
          fill="currentColor"
          opacity="0.1"
        />
        <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.2" />
      </pattern>
      <rect width="200" height="40" fill="url(#tribal-pattern)" />
    </svg>
  );
};

export const TribalDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 60"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        <g>
          {[...Array(6)].map((_, i) => (
            <g key={i} transform={`translate(${i * 200 + 100}, 30)`}>
              <circle cx="0" cy="0" r="8" fill="currentColor" opacity="0.2" />
              <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.4" />
              <path
                d="M-20,-10 L0,0 L20,-10 M-20,10 L0,0 L20,10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};