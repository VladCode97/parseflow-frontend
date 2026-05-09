import React, { useState, useCallback } from 'react';
import { UploadZone } from './UploadZone';
import { DocumentQueueItem } from './DocumentQueueItem';
import { EmptyState } from '@/components/base/EmptyState';
import { IconFolder } from '../base/Icons';
import { useDocumentStore } from '@/store/documentStore';

export const LeftPanel = React.memo(function LeftPanel() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { documents, selectedId } = useDocumentStore();

  const handleError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  }, []);

  return (
    <aside
      aria-label="Document queue"
      style={{
        width: 'var(--panel-left)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderRight: '1px solid var(--color-border)',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 var(--space-3)',
          }}
        >
          Upload
        </h2>
        <UploadZone onError={handleError} />
        {errorMsg && (
          <p
            role="alert"
            style={{
              marginTop: 'var(--space-2)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </p>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <h2
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            margin: '0 0 var(--space-3)',
          }}
        >
          Queue
          {documents.length > 0 && (
            <span
              style={{
                marginLeft: 6,
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-overlay)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              {documents.length}
            </span>
          )}
        </h2>

        {documents.length === 0 ? (
          <EmptyState
            icon={<IconFolder size={36} />}
            title="No documents yet"
            description="Upload a file or paste an image URL to get started"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {documents.map((doc) => (
              <DocumentQueueItem
                key={doc.id}
                document={doc}
                isSelected={doc.id === selectedId}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});
