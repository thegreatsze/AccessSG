import Link from 'next/link';

interface Props {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export default function Logo({ variant = 'light', size = 'md' }: Props) {
  const isLight = variant === 'light';
  const wheelColor = isLight ? '#ffffff' : '#1f2937';
  const sgColor = isLight ? '#fdba74' : '#f97316';
  const textColor = isLight ? 'text-white' : 'text-gray-900';
  const dim = size === 'sm' ? 24 : 30;
  const textSize = size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${textColor} hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-700 rounded`}
      aria-label="AccessSG — go to home page"
    >
      <WheelIcon size={dim} color={wheelColor} accentColor={sgColor} />
      <span
        className={`${textSize} leading-none`}
        style={{ fontWeight: 300, letterSpacing: '-0.025em' }}
      >
        Access
        <span style={{ fontWeight: 900, color: sgColor, letterSpacing: '-0.01em' }}>
          SG
        </span>
      </span>
    </Link>
  );
}

function WheelIcon({ size, color, accentColor }: { size: number; color: string; accentColor: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1.5;
  const rimWidth = size * 0.1;
  const hubR = size * 0.12;
  const spokeStart = hubR + 0.5;
  const spokeEnd = outerR - rimWidth - 0.5;

  // 6 spokes evenly spaced
  const spokes = [0, 60, 120, 180, 240, 300].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x1: cx + spokeStart * Math.cos(rad),
      y1: cy + spokeStart * Math.sin(rad),
      x2: cx + spokeEnd * Math.cos(rad),
      y2: cy + spokeEnd * Math.sin(rad),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer tyre ring */}
      <circle cx={cx} cy={cy} r={outerR} stroke={color} strokeWidth={rimWidth} fill="none" />
      {/* Spokes */}
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1} y1={s.y1}
          x2={s.x2} y2={s.y2}
          stroke={color}
          strokeWidth={size * 0.072}
          strokeLinecap="round"
        />
      ))}
      {/* Hub */}
      <circle cx={cx} cy={cy} r={hubR} fill={accentColor} />
    </svg>
  );
}
