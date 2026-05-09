import React from 'react';
import type { DocumentStatus } from '@/domain/document';

interface BadgeProps {
  status: DocumentStatus;
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
  idle: {
    label: 'Idle',
    color: 'var(--color-text-tertiary)',
    bg: 'var(--color-surface-overlay)',
  },
  queued: {
    label: 'Queued',
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
  },
  processing: {
    label: 'Processing',
    color: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--color-primary-text)',
    bg: 'var(--color-success-bg)',
  },
  failed: {
    label: 'Failed',
    color: 'var(--color-error)',
    bg: 'var(--color-error-bg)',
  },
};

export const Badge = React.memo(function Badge({ status }: BadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={`Status: ${config.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: config.color,
        backgroundColor: config.bg,
        whiteSpace: 'nowrap',
      }}
    >
      {status === 'processing' && (
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: config.color,
            animation: 'pulse 1.2s ease-in-out infinite',
          }}
        />
      )}
      {config.label}
    </span>
  );
});
