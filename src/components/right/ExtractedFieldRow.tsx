import React, { useCallback } from 'react';
import type { ExtractedField } from '@/domain/document';
import { ConfidenceBar } from '@/components/base/ConfidenceBar';
import { useDocumentStore } from '@/store/documentStore';

interface ExtractedFieldRowProps {
  field: ExtractedField;
  documentId: string;
}

export const ExtractedFieldRow = React.memo(function ExtractedFieldRow({
  field,
  documentId,
}: ExtractedFieldRowProps) {
  const { validateField } = useDocumentStore();

  const handleToggle = useCallback(() => {
    validateField(documentId, field.key);
  }, [documentId, field.key, validateField]);

  return (
    <div
      style={{
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: field.validated
          ? 'var(--color-success-bg)'
          : 'var(--color-surface-raised)',
        border: `1px solid ${field.validated ? 'rgba(0,210,106,0.25)' : 'var(--color-border)'}`,
        transition: 'all var(--transition-fast)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          marginBottom: 6,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {field.label}
          </p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={field.value}
          >
            {field.value}
          </p>
        </div>

        <button
          onClick={handleToggle}
          aria-label={field.validated ? `Unvalidate ${field.label}` : `Validate ${field.label}`}
          aria-pressed={field.validated}
          style={{
            width: 22,
            height: 22,
            borderRadius: 'var(--radius-sm)',
            border: `2px solid ${field.validated ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
            backgroundColor: field.validated ? 'var(--color-primary)' : 'transparent',
            color: field.validated ? 'var(--color-navy)' : 'transparent',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all var(--transition-fast)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          ✓
        </button>
      </div>

      <ConfidenceBar value={field.confidence} />
    </div>
  );
});
