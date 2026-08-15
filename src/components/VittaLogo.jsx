export default function VittaLogo({ size = 28, color = '#ffffff', leafColor = '#38bdf8', className = '', showText = false, textColor = '#ffffff' }) {
  const Emblem = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 100" 
      width={size} 
      height={size ? (size * 100 / 120) : 24} 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="vittaSiteLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="45%" stopColor={leafColor} />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* 1. Central Top Leaf */}
      <path 
        d="M 60 46 C 53 34 53 20 60 10 C 67 20 67 34 60 46 Z" 
        fill="url(#vittaSiteLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="60" y1="42" x2="60" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />

      {/* 2. Upper Left Leaf */}
      <path 
        d="M 57 48 C 45 38 36 26 32 20 C 43 20 54 33 57 48 Z" 
        fill="url(#vittaSiteLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="55" y1="44" x2="39" y2="26" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />

      {/* 3. Upper Right Leaf */}
      <path 
        d="M 63 48 C 75 38 84 26 88 20 C 77 20 66 33 63 48 Z" 
        fill="url(#vittaSiteLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="65" y1="44" x2="81" y2="26" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" />

      {/* 4. Lower Left Wing Leaf */}
      <path 
        d="M 53 57 C 39 52 26 47 17 45 C 27 60 44 64 53 57 Z" 
        fill="url(#vittaSiteLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <path d="M 49 57 C 38 54 29 51 23 48" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" fill="none" />

      {/* 5. Lower Right Wing Leaf */}
      <path 
        d="M 67 57 C 81 52 94 47 103 45 C 93 60 76 64 67 57 Z" 
        fill="url(#vittaSiteLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <path d="M 71 57 C 82 54 91 51 97 48" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.8" fill="none" />

      {/* Interlocking Stems */}
      <path 
        d="M 42 62 C 49 66 55 68 57 72 L 57 76" 
        fill="none" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      <path 
        d="M 78 62 C 71 66 65 68 63 72 L 63 76" 
        fill="none" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
    </svg>
  );

  if (showText) {
    return (
      <div className={`vitta-logo-brand ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {Emblem}
        <span style={{ fontSize: `${Math.max(13, size * 0.42)}px`, fontWeight: 900, letterSpacing: '3px', color: textColor, marginTop: '4px', lineHeight: 1.1, fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
          VITTA
        </span>
        <span style={{ fontSize: `${Math.max(8, size * 0.22)}px`, fontWeight: 700, letterSpacing: '4px', color: leafColor, lineHeight: 1, fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
          NUTRI
        </span>
      </div>
    );
  }

  return Emblem;
}
