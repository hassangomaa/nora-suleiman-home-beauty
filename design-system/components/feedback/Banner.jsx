import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const VARIANT = {
  success: { bg: 'var(--success-100)', fg: 'var(--success-500)', icon: 'check_circle' },
  warning: { bg: 'var(--warning-100)', fg: 'var(--warning-500)', icon: 'warning' },
  error:   { bg: 'var(--error-100)',   fg: 'var(--error-500)',   icon: 'error' },
  info:    { bg: 'var(--info-100)',    fg: 'var(--info-500)',    icon: 'info' },
};

/**
 * Banner — inline status block (success/warning/error/info) with icon + text.
 */
export function Banner({ variant = 'info', title, children, icon, action, onAction, onDismiss, style = {} }) {
  const v = VARIANT[variant] || VARIANT.info;
  return (
    <div role={variant === 'error' ? 'alert' : 'status'} style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-lg)',
      background: v.bg, ...style,
    }}>
      <Icon name={icon || v.icon} size="sm" fill color={v.fg} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)', color: 'var(--text-primary)' }}>{title}</div>}
        {children && <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{children}</div>}
        {action && (
          <button type="button" onClick={onAction} style={{ marginTop: 'var(--space-1)', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: v.fg, font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)' }}>{action}</button>
        )}
      </div>
      {onDismiss && (
        <button type="button" aria-label="إغلاق" onClick={onDismiss} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-secondary)' }}>
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
