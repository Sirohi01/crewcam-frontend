import { useId } from 'react';

export function CrewcamLogo({ size = 56, className = '' }: { size?: number; className?: string }) {
  const uid = useId();
  const ringId = `crewcamRing-${uid}`;
  const goldId = `crewcamGold-${uid}`;
  const shadowId = `crewcamShadow-${uid}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={ringId} x1="12%" y1="5%" x2="88%" y2="98%">
          <stop offset="0%" stopColor="#7b95c4" />
          <stop offset="25%" stopColor="#33518a" />
          <stop offset="55%" stopColor="#152a52" />
          <stop offset="100%" stopColor="#03060f" />
        </linearGradient>
        <linearGradient id={goldId} x1="8%" y1="3%" x2="92%" y2="97%">
          <stop offset="0%" stopColor="#fff3d0" />
          <stop offset="40%" stopColor="#f5c451" />
          <stop offset="100%" stopColor="#a8690f" />
        </linearGradient>
        <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${shadowId})`}>
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={`url(#${ringId})`}
          strokeWidth="17"
          strokeDasharray="163 51"
          transform="rotate(42.66 50 50)"
        />
        <rect x="70" y="18" width="17" height="17" fill={`url(#${goldId})`} transform="rotate(45 78.5 26.5)" />
        <rect x="70" y="65" width="17" height="17" fill={`url(#${goldId})`} transform="rotate(45 78.5 73.5)" />
      </g>
    </svg>
  );
}
