import React from 'react';

interface ConfidenceBarProps {
  value: number;
  showLabel?: boolean;
}

function getConfidenceColor(value: number): string {
  if (value >= 0.9) return 'var(--color-success)';
  if (value >= 0.7) return 'var(--color-warning)';
  return 'var(--color-error)';
}

export const ConfidenceBar = React.memo(function ConfidenceBar({
  value,
  showLabel = true,
}: ConfidenceBarProps) {
  const pct = Math.round(value * 100);
  const color = getConfidenceColor(value);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      role="meter"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence: ${pct}%`}
    >
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-surface-overlay)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-slow)',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color,
            minWidth: 32,
            textAlign: 'right',
          }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
});
