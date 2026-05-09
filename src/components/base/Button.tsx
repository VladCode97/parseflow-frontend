import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline' | 'navy';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-navy)',
    border: 'none',
    fontWeight: 700,
  },
  navy: {
    backgroundColor: 'var(--color-navy)',
    color: '#ffffff',
    border: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
  },
  danger: {
    backgroundColor: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-strong)',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 10px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '7px 14px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '10px 20px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)' },
};

export const Button = React.memo(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity var(--transition-fast), background-color var(--transition-fast)',
        whiteSpace: 'nowrap',
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
    >
      {loading ? (
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : icon}
      {children}
    </button>
  );
});
