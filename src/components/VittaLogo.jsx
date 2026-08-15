export default function VittaLogo({ size = 28, color = '#38bdf8', className = '', showText = false, textColor = '#ffffff' }) {
  const Emblem = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 85" 
      width={size} 
      height={size ? (size * 85 / 100) : 24} 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="vittaHumanLeafGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>

      {/* 1. Head */}
      <circle cx="50" cy="20" r="6" fill="url(#vittaHumanLeafGrad)" />

      {/* 2. Torso / Stem Lines */}
      <path 
        d="M 46 76 L 46 58 C 46 44 48.5 36 44 30" 
        fill="none" 
        stroke="url(#vittaHumanLeafGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 54 76 L 54 58 C 54 44 51.5 36 56 30" 
        fill="none" 
        stroke="url(#vittaHumanLeafGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />

      {/* 3. Left Inner Leaf */}
      <path 
        d="M 46 60 C 35 56 23 44 28 16 C 42 20 48 40 46 60 Z" 
        fill="url(#vittaHumanLeafGrad)" 
      />
      <path 
        d="M 43 56 C 38 42 34 30 29 19" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeOpacity="0.9" 
      />

      {/* 4. Right Inner Leaf */}
      <path 
        d="M 54 60 C 65 56 77 44 72 16 C 58 20 52 40 54 60 Z" 
        fill="url(#vittaHumanLeafGrad)" 
      />
      <path 
        d="M 57 56 C 62 42 66 30 71 19" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeOpacity="0.9" 
      />

      {/* 5. Left Outer Wing / Leaf */}
      <path 
        d="M 44 65 C 28 61 14 50 5 38 C 14 43 30 54 44 65 Z" 
        fill="url(#vittaHumanLeafGrad)" 
      />

      {/* 6. Right Outer Wing / Leaf */}
      <path 
        d="M 56 65 C 72 61 86 50 95 38 C 86 43 70 54 56 65 Z" 
        fill="url(#vittaHumanLeafGrad)" 
      />
    </svg>
  );

  if (showText) {
    return (
      <div className={`vitta-logo-brand ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {Emblem}
        <span style={{ fontSize: `${Math.max(13, size * 0.42)}px`, fontWeight: 900, letterSpacing: '3px', color: textColor, marginTop: '6px', lineHeight: 1.1, fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
          VITTA
        </span>
        <span style={{ fontSize: `${Math.max(8, size * 0.22)}px`, fontWeight: 700, letterSpacing: '4px', color: color, lineHeight: 1, fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
          NUTRI
        </span>
      </div>
    );
  }

  return Emblem;
}
