import React from 'react';
import type { DocumentStatus } from '@/domain/document';
import { Badge } from '@/components/base/Badge';

interface ProcessingStatusProps {
  status: DocumentStatus;
  errorMessage: string | null;
  fieldCount: number;
  validatedCount: number;
}

export const ProcessingStatus = React.memo(function ProcessingStatus({
  status,
  errorMessage,
  fieldCount,
  validatedCount,
}: ProcessingStatusProps) {
  const progress = fieldCount > 0 ? (validatedCount / fieldCount) * 100 : 0;

  return (
    <div
      style={{
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Processing Status
        </span>
        <Badge status={status} />
      </div>

      {errorMessage && (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
          }}
        >
          {errorMessage}
        </p>
      )}

      {status === 'completed' && fieldCount > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Validation progress
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              {validatedCount}/{fieldCount}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Validation progress: ${Math.round(progress)}%`}
            style={{
              height: 6,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-overlay)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor:
                  progress === 100 ? 'var(--color-primary)' : 'var(--color-navy)',
                borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-slow)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
