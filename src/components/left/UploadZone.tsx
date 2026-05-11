import React, { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/base/Button';
import { IconUpload } from '../base/Icons';
import { useDocumentStore } from '@/store/documentStore';

interface UploadZoneProps {
  onError: (msg: string) => void;
}

export const UploadZone = React.memo(function UploadZone({ onError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploadUrl, processingCount } = useDocumentStore();

  const isProcessing = processingCount > 0;

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || isProcessing) return;
      const file = files[0];
      if (!file) return;
      try {
        await uploadFile(file);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Upload failed');
      }
    },
    [uploadFile, onError, isProcessing],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isProcessing) handleFiles(e.dataTransfer.files);
    },
    [handleFiles, isProcessing],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragging(true);
  }, [isProcessing]);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!urlInput.trim() || isProcessing) return;
      try {
        await uploadUrl(urlInput.trim());
        setUrlInput('');
        setIsUrlMode(false);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Invalid URL');
      }
    },
    [urlInput, uploadUrl, onError, isProcessing],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div
        role="button"
        tabIndex={isProcessing ? -1 : 0}
        aria-label="Drop files here or click to upload"
        aria-disabled={isProcessing}
        onClick={() => !isUrlMode && !isProcessing && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => e.key === 'Enter' && !isProcessing && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-2)',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.5 : 1,
          backgroundColor: isDragging ? 'var(--color-primary-subtle)' : 'var(--color-surface-raised)',
          transition: 'all var(--transition-base)',
          userSelect: 'none',
        }}
      >
        <IconUpload size={22} color={isDragging ? 'var(--color-primary)' : 'var(--color-text-tertiary)'} />
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
          {isProcessing ? 'Processing...' : 'Drop files here'}
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', margin: 0 }}>
          {isProcessing ? 'Wait until current document finishes' : 'JPEG, PNG, WebP, PDF'}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        aria-label="File upload input"
        disabled={isProcessing}
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button
          variant="outline"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          disabled={isProcessing}
          aria-label="Browse files"
        >
          Browse files
        </Button>
        <Button
          variant={isUrlMode ? 'navy' : 'outline'}
          size="sm"
          style={{ flex: 1 }}
          onClick={() => !isProcessing && setIsUrlMode(v => !v)}
          disabled={isProcessing}
          aria-label="Toggle URL input"
          aria-expanded={isUrlMode}
        >
          From URL
        </Button>
      </div>

      {isUrlMode && (
        <form
          onSubmit={handleUrlSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            aria-label="Image URL"
            disabled={isProcessing}
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-strong)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              boxSizing: 'border-box',
              opacity: isProcessing ? 0.5 : 1,
            }}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!urlInput.trim() || isProcessing}
          >
            Process URL
          </Button>
        </form>
      )}
    </div>
  );
});
