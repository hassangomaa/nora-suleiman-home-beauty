import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Button } from '../actions/Button.jsx';

/**
 * EmptyState — centered glyph + title + supportive text + optional CTA.
 */
export function EmptyState({ icon = 'inbox', title, children, cta, onCta, style = {} }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 'var(--space-3)', padding: 'var(--space-8) var(--space-6)', ...style,
    }}>
      <span style={{
        width: 80, height: 80, borderRadius: 'var(--radius-full)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-tint)', color: 'var(--primary-400)',
      }}>
        <Icon name={icon} size="xl" />
      </span>
      {title && <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)' }}>{title}</div>}
      {children && <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', maxWidth: 280 }}>{children}</div>}
      {cta && <div style={{ marginTop: 'var(--space-2)' }}><Button onClick={onCta}>{cta}</Button></div>}
    </div>
  );
}
