export default function VittaLogo({ size = 28, color = '#ffffff', leafColor = '#4ade80', className = '', showText = false, textColor = '#ffffff' }) {
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
        <linearGradient id="vittaLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="40%" stopColor={leafColor} />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* 1. Central Top Leaf */}
      <path 
        d="M 60 48 C 53 36 53 22 60 12 C 67 22 67 36 60 48 Z" 
        fill="url(#vittaLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="60" y1="44" x2="60" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      {/* 2. Upper Left Leaf */}
      <path 
        d="M 57 50 C 46 40 38 28 34 22 C 45 22 55 35 57 50 Z" 
        fill="url(#vittaLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="55" y1="46" x2="41" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      {/* 3. Upper Right Leaf */}
      <path 
        d="M 63 50 C 74 40 82 28 86 22 C 75 22 65 35 63 50 Z" 
        fill="url(#vittaLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <line x1="65" y1="46" x2="79" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />

      {/* 4. Lower Left Leaf (Wing) */}
      <path 
        d="M 54 58 C 40 53 28 48 20 46 C 29 60 45 64 54 58 Z" 
        fill="url(#vittaLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <path d="M 50 58 C 40 55 32 52 26 49" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" fill="none" />

      {/* 5. Lower Right Leaf (Wing) */}
      <path 
        d="M 66 58 C 80 53 92 48 100 46 C 91 60 75 64 66 58 Z" 
        fill="url(#vittaLeafGrad)" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinejoin="round" 
      />
      <path d="M 70 58 C 80 55 88 52 94 49" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" fill="none" />

      {/* Interlocking Stems */}
      <path 
        d="M 44 63 C 50 67 56 68 58 72 L 58 78" 
        fill="none" 
        stroke={color} 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      <path 
        d="M 76 63 C 70 67 64 68 62 72 L 62 78" 
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
        <span style={{ fontSize: `${Math.max(13, size * 0.42)}px`, fontWeight: 800, letterSpacing: '2.5px', color: textColor, marginTop: '4px', lineHeight: 1.1 }}>
          VITTA
        </span>
        <span style={{ fontSize: `${Math.max(8, size * 0.22)}px`, fontWeight: 700, letterSpacing: '3px', color: leafColor, lineHeight: 1 }}>
          NUTRI
        </span>
      </div>
    );
  }

  return Emblem;
}
