export default function VittaLogo({ size = 24, color = 'currentColor', className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={className}
      fill="none" 
      stroke={color} 
      strokeWidth="5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Central Vertical Stem */}
      <line x1="50" y1="58" x2="50" y2="84" strokeWidth="5.5" />

      {/* Top Vertical Leaf */}
      <path d="M 50 58 C 36 44 36 26 50 14 C 64 26 64 44 50 58 Z" />
      {/* Top Leaf Vein */}
      <line x1="50" y1="56" x2="50" y2="25" strokeWidth="4" />

      {/* Left Tilted Leaf */}
      <path d="M 50 58 C 34 50 20 42 15 34 C 18 52 32 68 50 58 Z" />
      {/* Left Leaf Vein */}
      <path d="M 50 58 C 38 52 28 44 21 38" strokeWidth="4" />

      {/* Right Tilted Leaf */}
      <path d="M 50 58 C 66 50 80 42 85 34 C 82 52 68 68 50 58 Z" />
      {/* Right Leaf Vein */}
      <path d="M 50 58 C 62 52 72 44 79 38" strokeWidth="4" />
    </svg>
  );
}
