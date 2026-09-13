import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const SIZES = {
  sm: { height: 36, padInline: 'var(--space-3)', font: 'var(--type-label-size)' },
  md: { height: 44, padInline: 'var(--space-4)', font: 'var(--type-label-size)' },
  lg: { height: 48, padInline: 'var(--space-5)', font: 'var(--type-label-size)' },
};

function variantStyle(variant, pressed) {
  switch (variant) {
    case 'secondary':
      return { background: 'var(--bg-surface)', color: 'var(--action-primary)', border: '1px solid var(--border-strong)' };
    case 'ghost':
      return { background: 'transparent', color: 'var(--action-primary)', border: '1px solid transparent' };
    case 'destructive':
      return { background: 'var(--error-500)', color: 'var(--neutral-0)', border: '1px solid transparent' };
    default:
      return {
        background: pressed ? 'var(--action-primary-pressed)' : 'var(--action-primary)',
        color: 'var(--text-on-primary)',
        border: '1px solid transparent',
        boxShadow: 'var(--elevation-1)',
      };
  }
}

/**
 * Button — primary action control. Variants: primary | secondary | ghost | destructive.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const sz = SIZES[size] || SIZES.lg;
  const isDisabled = disabled || loading;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    minHeight: sz.height,
    height: sz.height,
    paddingInline: sz.padInline,
    width: fullWidth ? '100%' : undefined,
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-base)',
    fontSize: sz.font,
    fontWeight: 'var(--weight-medium)',
    lineHeight: 'var(--type-label-lh)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'background .15s ease, box-shadow .15s ease, transform .05s ease',
    userSelect: 'none',
    ...variantStyle(variant),
  };

  const disabledStyle = isDisabled
    ? { background: variant === 'ghost' ? 'transparent' : 'var(--neutral-200)', color: 'var(--text-disabled)', border: '1px solid transparent', boxShadow: 'none' }
    : {};

  return (
    <button
      type={type}
      className="ns-focusable"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={isDisabled ? undefined : onClick}
      style={{ ...base, ...disabledStyle, ...style }}
      onMouseDown={(e) => { if (!isDisabled) e.currentTarget.style.transform = 'scale(0.985)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {loading ? (
        <span style={{
          width: 16, height: 16, borderRadius: '50%',
          border: '2px solid currentColor', borderTopColor: 'transparent',
          animation: 'ns-spin .7s linear infinite', opacity: 0.9,
        }} />
      ) : (
        <>
          {leadingIcon && <Icon name={leadingIcon} size="sm" />}
          {children}
          {trailingIcon && <Icon name={trailingIcon} size="sm" mirror />}
        </>
      )}
    </button>
  );
}
