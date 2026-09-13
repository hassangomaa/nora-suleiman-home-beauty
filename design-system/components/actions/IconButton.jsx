import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

function variantStyle(variant) {
  switch (variant) {
    case 'tonal':
      return { background: 'var(--bg-tint)', color: 'var(--action-primary)' };
    case 'filled':
      return { background: 'var(--action-primary)', color: 'var(--text-on-primary)' };
    default:
      return { background: 'transparent', color: 'var(--text-primary)' };
  }
}

/**
 * IconButton — single-glyph control with a 44pt hit area. Always needs an accessible label.
 */
export function IconButton({
  icon,
  label,
  variant = 'standard',
  size = 'md',
  fill = false,
  mirror = false,
  active = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const glyph = size === 'sm' ? 'sm' : 'md';
  return (
    <button
      type="button"
      className="ns-focusable"
      aria-label={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        width: 'var(--touch-min)',
        height: 'var(--touch-min)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .15s ease',
        ...variantStyle(variant),
        ...(disabled ? { color: 'var(--text-disabled)', background: 'transparent' } : {}),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={glyph} fill={fill || active} mirror={mirror} />
    </button>
  );
}
