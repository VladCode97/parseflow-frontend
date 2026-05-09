import React from 'react';
import type { LineItem } from '@/domain/document';

interface LineItemsTableProps {
  items: LineItem[];
}

const TH: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 'var(--text-xs)',
  fontWeight: 700,
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  backgroundColor: 'var(--color-surface-raised)',
  borderBottom: '1px solid var(--color-border)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const TD: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-primary)',
  borderBottom: '1px solid var(--color-border)',
  textAlign: 'left',
};

function getScoreColor(confidence: number): string {
  if (confidence >= 0.9) return 'var(--color-primary-text)';
  if (confidence >= 0.7) return 'var(--color-warning)';
  return 'var(--color-error)';
}

export const LineItemsTable = React.memo(function LineItemsTable({ items }: LineItemsTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Line items">
        <thead>
          <tr>
            <th scope="col" style={TH}>#</th>
            <th scope="col" style={TH}>SKU</th>
            <th scope="col" style={TH}>Description</th>
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
              <td style={{ ...TD, color: 'var(--color-text-tertiary)', fontFamily: 'monospace', fontSize: 11 }}>
                {item.sku}
              </td>
              <td
                style={{
                  ...TD,
                  fontWeight: 500,
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
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
                <span style={{ color: getScoreColor(item.confidence), fontWeight: 700 }}>
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
