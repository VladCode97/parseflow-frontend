import React, { useMemo } from 'react';
import { DocumentPreview } from './DocumentPreview';
import { EmptyState } from '@/components/base/EmptyState';
import { IconSearch } from '../base/Icons';
import { useDocumentStore } from '@/store/documentStore';

export const CenterPanel = React.memo(function CenterPanel() {
  const { documents, selectedId } = useDocumentStore();

  const selectedDocument = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId],
  );

  return (
    <main
      aria-label="Document preview"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-4)',
        minWidth: 0,
        height: '100%',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {selectedDocument ? (
        <DocumentPreview document={selectedDocument} />
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--color-border-strong)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <EmptyState
            icon={<IconSearch size={36} />}
            title="No document selected"
            description="Select a document from the queue or upload a new one to preview it here"
          />
        </div>
      )}
    </main>
  );
});
