import React from 'react';
import type { DocumentStatus } from '@/domain/document';
import { Badge } from '@/components/base/Badge';

interface ProcessingStatusProps {
  status: DocumentStatus;
  errorMessage: string | null;
}

export const ProcessingStatus = React.memo(function ProcessingStatus({
  status,
  errorMessage,
}: ProcessingStatusProps) {

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
    </div>
  );
});
