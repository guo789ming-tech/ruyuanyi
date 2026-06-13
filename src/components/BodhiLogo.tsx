export function BodhiLeaf({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 6 C 22 6, 12 12, 10 22 C 8 32, 14 44, 24 50 C 28 53, 30 56, 31 60 L 32 62 L 33 60 C 34 56, 36 53, 40 50 C 50 44, 56 32, 54 22 C 52 12, 42 6, 32 6 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M32 8 V 60" strokeWidth="1.4" />
      <path d="M32 16 C 26 18, 20 22, 16 28" />
      <path d="M32 16 C 38 18, 44 22, 48 28" />
      <path d="M32 28 C 24 30, 18 36, 16 42" />
      <path d="M32 28 C 40 30, 46 36, 48 42" />
      <path d="M32 42 C 28 46, 26 50, 26 54" />
      <path d="M32 42 C 36 46, 38 50, 38 54" />
    </svg>
  );
}

export function BodhiLogo({ className }: { className?: string }) {
  return <BodhiLeaf className={className} />;
}

export function LampLogo({ className }: { className?: string }) {
  return <BodhiLeaf className={className} />;
}
