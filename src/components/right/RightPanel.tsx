import React, { useMemo, useState, useCallback } from 'react';
import { ExtractedFieldRow } from './ExtractedFieldRow';
import { LineItemsTable } from './LineItemsTable';
import { ProcessingStatus } from './ProcessingStatus';
import { EmptyState } from '@/components/base/EmptyState';
import { IconChart, IconSearch, IconClipboard } from '../base/Icons';
import { useDocumentStore } from '@/store/documentStore';

type ActiveTab = 'fields' | 'items' | 'json';

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

function TabButton({ label, active, onClick, count }: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: active ? 'var(--color-navy)' : 'transparent',
        color: active ? '#fff' : 'var(--color-text-secondary)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          style={{
            padding: '1px 5px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-overlay)',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export const RightPanel = React.memo(function RightPanel() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('fields');
  const [copied, setCopied] = useState(false);
  const { documents, selectedId } = useDocumentStore();

  const selectedDocument = useMemo(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId],
  );

  const validatedCount = useMemo(
    () => selectedDocument?.extraction?.fields.filter((f) => f.validated).length ?? 0,
    [selectedDocument],
  );

  const fieldCount = selectedDocument?.extraction?.fields.length ?? 0;

  const jsonString = useMemo(
    () => selectedDocument?.extraction
      ? JSON.stringify(selectedDocument.extraction.rawJson, null, 2)
      : '',
    [selectedDocument],
  );

  const handleCopy = useCallback(async () => {
    if (!jsonString) return;
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [jsonString]);

  return (
    <aside
      aria-label="Extraction results"
      style={{
        width: 'var(--panel-right)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderLeft: '1px solid var(--color-border)',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      {!selectedDocument ? (
        <EmptyState
          icon={<IconChart size={36} />}
          title="No document selected"
          description="Select a document to view extracted fields and confidence scores"
        />
      ) : (
        <>
          <ProcessingStatus
            status={selectedDocument.status}
            errorMessage={selectedDocument.errorMessage}
            fieldCount={fieldCount}
            validatedCount={validatedCount}
          />

          {selectedDocument.extraction && (
            <>
              <div
                role="tablist"
                aria-label="Result tabs"
                style={{
                  display: 'flex',
                  gap: 'var(--space-1)',
                  padding: 4,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-overlay)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <TabButton
                  label="Fields"
                  active={activeTab === 'fields'}
                  onClick={() => setActiveTab('fields')}
                  count={fieldCount}
                />
                <TabButton
                  label="Items"
                  active={activeTab === 'items'}
                  onClick={() => setActiveTab('items')}
                  count={selectedDocument.extraction.lineItems.length}
                />
                <TabButton
                  label="JSON"
                  active={activeTab === 'json'}
                  onClick={() => setActiveTab('json')}
                />
              </div>

              <div role="tabpanel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {activeTab === 'fields' && (
                  selectedDocument.extraction.fields.length > 0 ? (
                    selectedDocument.extraction.fields.map((field) => (
                      <ExtractedFieldRow
                        key={field.key}
                        field={field}
                        documentId={selectedDocument.id}
                      />
                    ))
                  ) : (
                    <EmptyState icon={<IconSearch size={28} />} title="No fields extracted" />
                  )
                )}

                {activeTab === 'items' && (
                  selectedDocument.extraction.lineItems.length > 0 ? (
                    <div
                      style={{
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <LineItemsTable items={selectedDocument.extraction.lineItems} />
                    </div>
                  ) : (
                    <EmptyState icon={<IconClipboard size={28} />} title="No line items found" />
                  )
                )}

                {activeTab === 'json' && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={handleCopy}
                      aria-label={copied ? 'Copied' : 'Copy JSON to clipboard'}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${copied ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
                        backgroundColor: copied ? 'var(--color-success-bg)' : 'var(--color-surface)',
                        color: copied ? 'var(--color-primary-text)' : 'var(--color-text-secondary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {copied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <pre
                      aria-label="Raw JSON extraction result"
                      style={{
                        margin: 0,
                        padding: 'var(--space-3)',
                        paddingTop: 40,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        overflowX: 'auto',
                        lineHeight: 1.7,
                        fontFamily: 'monospace',
                      }}
                    >
                      {jsonString}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
});
