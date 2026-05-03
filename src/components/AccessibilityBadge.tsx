interface Props {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function AccessibilityBadge({ score, showLabel = false, size = 'md' }: Props) {
  const color = score >= 80 ? 'bg-green-100 text-green-800 border-green-300'
    : score >= 50 ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-red-100 text-red-800 border-red-300';

  const label = score >= 80 ? 'Accessible' : score >= 50 ? 'Partial' : 'Barriers';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${color} ${sizeClass}`}
      aria-label={`Accessibility score: ${score} out of 100, ${label}`}
    >
      <span aria-hidden="true">
        {score >= 80 ? '✓' : score >= 50 ? '⚠' : '✗'}
      </span>
      {showLabel ? label : `${score}`}
    </span>
  );
}
