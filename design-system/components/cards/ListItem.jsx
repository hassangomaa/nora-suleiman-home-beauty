import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * ListItem — leading (icon/avatar) + primary/secondary text + trailing (value/chevron/control).
 */
export function ListItem({
  leading,
  leadingIcon,
  title,
  subtitle,
  trailing,
  chevron = false,
  selected = false,
  onClick,
  divider = false,
  style = {},
}) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={onClick ? 'ns-focusable' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        minHeight: 56, padding: 'var(--space-3) var(--space-4)',
        background: selected ? 'var(--bg-tint)' : 'transparent',
        borderBottom: divider ? '1px solid var(--border-default)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {leading || (leadingIcon && (
        <span style={{ color: 'var(--text-secondary)', display: 'inline-flex' }}><Icon name={leadingIcon} size="sm" /></span>
      ))}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: subtitle ? 'normal' : 'nowrap' }}>{title}</div>
        {subtitle && <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{subtitle}</div>}
      </div>
      {trailing}
      {chevron && <Icon name="chevron_left" size="sm" mirror color="var(--text-disabled)" />}
    </div>
  );
}
