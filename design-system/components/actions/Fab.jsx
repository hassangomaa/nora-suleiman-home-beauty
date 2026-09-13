import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * Fab — Floating Action Button, anchored bottom reading-end above the nav bar.
 */
export function Fab({ icon = 'add', label, extended = false, onClick, style = {}, ...rest }) {
  return (
    <button
      type="button"
      className="ns-focusable"
      aria-label={label}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: 56,
        minWidth: 56,
        paddingInline: extended ? 'var(--space-5)' : 0,
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        background: 'var(--action-primary)',
        color: 'var(--text-on-primary)',
        border: 'none',
        boxShadow: 'var(--elevation-3)',
        cursor: 'pointer',
        fontFamily: 'var(--font-base)',
        fontSize: 'var(--type-label-size)',
        fontWeight: 'var(--weight-medium)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size="md" />
      {extended && label}
    </button>
  );
}
