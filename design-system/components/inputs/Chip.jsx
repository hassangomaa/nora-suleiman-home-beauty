import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * Chip — compact pill for assist / filter (selectable) / removable uses.
 */
export function Chip({
  children,
  leadingIcon,
  selected = false,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const height = size === 'sm' ? 28 : 32;
  return (
    <button
      type="button"
      role={onClick ? 'checkbox' : undefined}
      aria-checked={onClick ? selected : undefined}
      aria-pressed={onClick ? selected : undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className="ns-focusable"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        height,
        minHeight: height,
        paddingInline: 'var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : 'default'),
        background: selected ? 'var(--bg-tint)' : 'var(--bg-surface)',
        border: `1px solid ${selected ? 'var(--primary-300)' : 'var(--border-default)'}`,
        color: disabled ? 'var(--text-disabled)' : (selected ? 'var(--primary-700)' : 'var(--text-primary)'),
        font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
        ...style,
      }}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size="xs" fill={selected} />}
      {children}
      {removable && (
        <span role="button" aria-label="إزالة" onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
          style={{ display: 'inline-flex', cursor: 'pointer', marginInlineStart: 2 }}>
          <Icon name="close" size="xs" />
        </span>
      )}
    </button>
  );
}
