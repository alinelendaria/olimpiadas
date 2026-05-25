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
      {/* Coin shadow/border */}
      <circle cx="12" cy="12" r="11.5" fill="#92650a" />
      {/* Coin face — gold */}
      <circle cx="12" cy="11.5" r="10.8" fill="#FFD700" />
      {/* Coin highlight top-left */}
      <ellipse cx="8" cy="6" rx="3.5" ry="2" fill="#FFF176" opacity="0.5" transform="rotate(-30 8 6)" />
      {/* Inner ring */}
      <circle cx="12" cy="11.5" r="9.2" fill="none" stroke="#B8860B" strokeWidth="0.5" opacity="0.6" />

      {/* Alien head — green */}
      <ellipse cx="12" cy="13" rx="5.8" ry="6.2" fill="#4ade80" />
      {/* Alien head shadow bottom */}
      <ellipse cx="12" cy="16" rx="4.5" ry="2.5" fill="#22c55e" opacity="0.5" />

      {/* Big oval alien eyes — dark */}
      <ellipse cx="9.5"  cy="12" rx="1.9" ry="2.4" fill="#111827" />
      <ellipse cx="14.5" cy="12" rx="1.9" ry="2.4" fill="#111827" />

      {/* Eye shine */}
      <ellipse cx="10.1" cy="10.9" rx="0.65" ry="0.85" fill="white" opacity="0.6" />
      <ellipse cx="15.1" cy="10.9" rx="0.65" ry="0.85" fill="white" opacity="0.6" />

      {/* Smile */}
      <path d="M10 15.5 Q12 17 14 15.5" stroke="#15803d" strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Antenna stem */}
      <line x1="12" y1="6.8" x2="12" y2="8.5" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" />
      {/* Antenna ball */}
      <circle cx="12" cy="6" r="1.2" fill="#FFD700" stroke="#92650a" strokeWidth="0.6" />
      {/* Antenna ball shine */}
      <circle cx="11.5" cy="5.5" r="0.4" fill="white" opacity="0.7" />
    </svg>
  );
}
