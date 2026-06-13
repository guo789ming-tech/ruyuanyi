export function LampLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flame-gold" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#D4A853" />
          <stop offset="40%" stopColor="#E0C47A" />
          <stop offset="100%" stopColor="#FCE9A0" />
        </linearGradient>
        <linearGradient id="glow-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCE9A0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Outer glow ring */}
      <circle cx="24" cy="24" r="22" stroke="url(#glow-gold)" strokeWidth="3" fill="none" opacity="0.4" />
      {/* Base/lamp body */}
      <path
        d="M18 38 L18 32 C18 28 22 26 24 24 C26 26 30 28 30 32 L30 38 L18 38Z"
        fill="#D4A853" fillOpacity="0.3" stroke="#D4A853" strokeWidth="1"
      />
      {/* Lamp base bottom */}
      <rect x="16" y="37" width="16" height="3" rx="1.5" fill="#D4A853" />
      <rect x="14" y="40" width="20" height="2" rx="1" fill="#D4A853" fillOpacity="0.5" />
      {/* Flame */}
      <path
        d="M24 8 C20 16, 18 18, 18 22 C18 26, 20.5 30, 24 30 C27.5 30, 30 26, 30 22 C30 18, 28 16, 24 8Z"
        fill="url(#flame-gold)" opacity="0.9"
      />
      {/* Inner flame highlight */}
      <path
        d="M24 14 C22 18, 21 20, 21 22.5 C21 25, 22.3 27, 24 27 C25.7 27, 27 25, 27 22.5 C27 20, 26 18, 24 14Z"
        fill="#FCE9A0" opacity="0.6"
      />
    </svg>
  );
}

// Keep backward compatibility
export function BodhiLogo({ className }: { className?: string }) {
  return <LampLogo className={className} />;
}

export function BodhiLeaf({ className }: { className?: string }) {
  return <LampLogo className={className} />;
}
