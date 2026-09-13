import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Money } from '../display/Money.jsx';
import { Button } from '../actions/Button.jsx';

/**
 * ServiceCard — thumbnail, name, 2-line desc, price + duration, book CTA.
 */
export function ServiceCard({
  name,
  description,
  image,
  price,
  was,
  duration,
  ctaLabel = 'احجزي',
  onBook,
  style = {},
}) {
  return (
    <div style={{
      display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-4)',
      background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--elevation-1)', border: '1px solid var(--border-default)', ...style,
    }}>
      <div style={{
        width: 72, height: 72, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-300)',
      }}>
        {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="spa" size="lg" />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        {description && (
          <span style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Money amount={price} was={was} />
            {duration && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>
                <Icon name="schedule" size="xs" />{duration}
              </span>
            )}
          </div>
          <Button size="sm" onClick={onBook}>{ctaLabel}</Button>
        </div>
      </div>
    </div>
  );
}
