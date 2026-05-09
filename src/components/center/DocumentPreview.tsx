import React, { useState, useCallback } from 'react';
import type { Document } from '@/domain/document';
import { Button } from '@/components/base/Button';
import { IconClock } from '../base/Icons';

interface DocumentPreviewProps {
  document: Document;
}

export const DocumentPreview = React.memo(function DocumentPreview({
  document,
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(() => setZoom(z => Math.min(z + 0.25, 3)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.25)), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const isImage = document.source.mimeType?.startsWith('image/') ?? true;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '60%',
          }}
        >
          {document.source.name}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            aria-label="Zoom out"
            disabled={zoom <= 0.25}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            −
          </Button>
          <button
            onClick={resetZoom}
            aria-label={`Current zoom: ${Math.round(zoom * 100)}%. Click to reset`}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-overlay)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
              minWidth: 48,
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            aria-label="Zoom in"
            disabled={zoom >= 3}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            +
          </Button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        {document.previewUrl ? (
          isImage ? (
            <img
              src={document.previewUrl}
              alt={`Preview of ${document.source.name}`}
              style={{
                maxWidth: '100%',
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                transition: 'transform var(--transition-base)',
              }}
            />
          ) : (
            <iframe
              src={document.previewUrl}
              title={`Preview of ${document.source.name}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
              }}
            />
          )
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <IconClock size={40} color="var(--color-text-tertiary)" />
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0 }}>
              Processing document...
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
