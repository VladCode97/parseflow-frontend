import React from 'react';
import type { LineItem } from '@/domain/document';

interface LineItemsTableProps {
  items: LineItem[];
}

const TH: React.CSSProperties = {
  padding: '7px 10px',
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  backgroundColor: 'var(--color-surface-raised)',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
};

const TD: React.CSSProperties = {
  padding: '7px 10px',
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-primary)',
  borderBottom: '1px solid var(--color-border)',
  whiteSpace: 'nowrap',
  textAlign: 'left',
};

function getScoreColor(confidence: number): string {
  if (confidence >= 0.9) return 'var(--color-primary-text)';
  if (confidence >= 0.7) return 'var(--color-warning)';
  return 'var(--color-error)';
}

export const LineItemsTable = React.memo(function LineItemsTable({ items }: LineItemsTableProps) {
  return (
    <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
      <table
        style={{ borderCollapse: 'collapse', minWidth: '100%' }}
        aria-label="Line items"
      >
        <thead>
          <tr>
            <th scope="col" style={TH}>#</th>
            <th scope="col" style={TH}>SKU</th>
            <th scope="col" style={{ ...TH, minWidth: 140 }}>Description</th>
            <th scope="col" style={{ ...TH, textAlign: 'right' }}>Qty</th>
            <th scope="col" style={{ ...TH, textAlign: 'right' }}>Tax</th>
            <th scope="col" style={{ ...TH, textAlign: 'right' }}>Price</th>
            <th scope="col" style={{ ...TH, textAlign: 'right' }}>Total</th>
            <th scope="col" style={{ ...TH, textAlign: 'right' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.index} style={{ backgroundColor: 'var(--color-surface)' }}>
              <td style={{ ...TD, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                {item.index.toString().padStart(2, '0')}
              </td>
              <td style={{ ...TD, color: 'var(--color-text-tertiary)', fontFamily: 'monospace', fontSize: 10 }}>
                {item.sku}
              </td>
              <td
                style={{ ...TD, fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={item.description}
              >
                {item.description}
              </td>
              <td style={{ ...TD, textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ ...TD, textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                {(item.taxRate * 100).toFixed(0)}%
              </td>
              <td style={{ ...TD, textAlign: 'right' }}>{item.unitPrice.toFixed(2)}</td>
              <td style={{ ...TD, textAlign: 'right', fontWeight: 700 }}>{item.total.toFixed(2)}</td>
              <td style={{ ...TD, textAlign: 'right' }}>
                <span style={{ color: getScoreColor(item.confidence), fontWeight: 700, fontSize: 10 }}>
                  {item.confidence.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
