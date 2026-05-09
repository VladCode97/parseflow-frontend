import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-10)',
        textAlign: 'center',
        color: 'var(--color-text-tertiary)',
      }}
    >
      <div style={{ opacity: 0.35, color: 'var(--color-text-secondary)' }}>{icon}</div>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 'var(--text-xs)', margin: 0, maxWidth: 200, lineHeight: 1.6, color: 'var(--color-text-tertiary)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
});
