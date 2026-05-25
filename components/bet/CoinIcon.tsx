interface Props {
  size?: number;
  className?: string;
}

export default function CoinIcon({ size = 16, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="coin-gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#FFF176" />
          <stop offset="50%"  stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </radialGradient>
        <radialGradient id="coin-skin" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#B0FFB0" />
          <stop offset="100%" stopColor="#2ECC71" />
        </radialGradient>
      </defs>

      {/* Coin border glow */}
      <circle cx="12" cy="12" r="11.2" fill="#B8860B" />
      {/* Coin face */}
      <circle cx="12" cy="12" r="10.5" fill="url(#coin-gold)" />
      {/* Inner ring */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="#B8860B" strokeWidth="0.4" opacity="0.5" />

      {/* Alien head */}
      <ellipse cx="12" cy="13" rx="5.8" ry="6.5" fill="url(#coin-skin)" />

      {/* Big oval alien eyes */}
      <ellipse cx="9.6"  cy="12" rx="1.9" ry="2.4" fill="#0d1117" />
      <ellipse cx="14.4" cy="12" rx="1.9" ry="2.4" fill="#0d1117" />

      {/* Eye shine */}
      <ellipse cx="10.2" cy="10.9" rx="0.65" ry="0.85" fill="white" opacity="0.55" />
      <ellipse cx="15.0" cy="10.9" rx="0.65" ry="0.85" fill="white" opacity="0.55" />

      {/* Tiny smile */}
      <path d="M10 15.5 Q12 17 14 15.5" stroke="#1a5c35" strokeWidth="0.75" fill="none" strokeLinecap="round" />

      {/* Antenna */}
      <line x1="12" y1="6.5" x2="12" y2="8.2" stroke="#B8860B" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="12" cy="5.8" r="1.1" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5" />
    </svg>
  );
}
