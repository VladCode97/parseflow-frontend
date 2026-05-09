import React from 'react';

export const Header = React.memo(function Header() {
  return (
    <header
      style={{
        height: 52,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--space-6)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-navy)',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}
        >
          ParseFlow
        </span>
      </div>

      <div
        aria-hidden="true"
        style={{
          width: 1,
          height: 18,
          backgroundColor: 'rgba(255,255,255,0.15)',
          margin: '0 var(--space-1)',
        }}
      />

      <span
        style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 500,
        }}
      >
        Document Intelligence
      </span>
    </header>
  );
});
