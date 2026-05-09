import React, { useCallback } from 'react';
import type { Document } from '@/domain/document';
import { Badge } from '@/components/base/Badge';
import { Button } from '@/components/base/Button';
import { IconDocument } from '../base/Icons';
import { useDocumentStore } from '@/store/documentStore';

interface DocumentQueueItemProps {
  document: Document;
  isSelected: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DocumentQueueItem = React.memo(function DocumentQueueItem({
  document,
  isSelected,
}: DocumentQueueItemProps) {
  const { selectDocument, removeDocument } = useDocumentStore();

  const handleSelect = useCallback(() => selectDocument(document.id), [document.id, selectDocument]);
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeDocument(document.id);
    },
    [document.id, removeDocument],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`Document: ${document.source.name}`}
      onClick={handleSelect}
      onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
        border: `1px solid ${isSelected ? 'var(--color-primary)' : 'transparent'}`,
        transition: 'all var(--transition-fast)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-surface-overlay)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {document.previewUrl ? (
          <img
            src={document.previewUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <IconDocument size={18} color="var(--color-text-tertiary)" />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {document.source.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
          <Badge status={document.status} />
          {document.source.sizeBytes !== undefined && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {formatBytes(document.source.sizeBytes)}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        aria-label={`Remove ${document.source.name}`}
        style={{ padding: 4, flexShrink: 0, color: 'var(--color-text-tertiary)' }}
      >
        ✕
      </Button>
    </div>
  );
});
