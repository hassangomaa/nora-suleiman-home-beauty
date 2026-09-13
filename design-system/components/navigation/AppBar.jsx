import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';

/**
 * AppBar — top header bar: back, title, trailing actions. Raises on scroll.
 */
export function AppBar({
  title,
  onBack,
  actions,
  raised = false,
  transparent = false,
  center = false,
  leading,
  style = {},
}) {
  return (
    <header role="banner" style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      height: 56, paddingInline: 'var(--space-2)',
      background: transparent ? 'transparent' : 'var(--bg-canvas)',
      boxShadow: raised ? 'var(--elevation-2)' : 'none',
      borderBottom: raised ? '1px solid var(--border-default)' : 'none',
      position: 'sticky', top: 0, zIndex: 'var(--z-appbar)',
      ...style,
    }}>
      {leading || (onBack && <IconButton icon="arrow_forward" label="رجوع" mirror onClick={onBack} />)}
      <div style={{
        flex: 1, minWidth: 0,
        font: 'var(--weight-bold) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
        color: 'var(--text-primary)', textAlign: center ? 'center' : 'start',
        paddingInline: 'var(--space-2)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{title}</div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>{actions}</div>}
    </header>
  );
}
