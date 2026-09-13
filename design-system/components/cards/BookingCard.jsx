import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Money } from '../display/Money.jsx';
import { StatusChip } from '../feedback/StatusChip.jsx';
import { Avatar } from '../display/Avatar.jsx';

/**
 * BookingCard — status-colored card: status chip, service+provider, date/time, address, price, actions.
 */
export function BookingCard({
  status = 'pending',
  service,
  providerName,
  providerImage,
  date,
  time,
  address,
  price,
  actions,
  onClick,
  style = {},
}) {
  const cancelled = String(status).startsWith('cancelled');
  return (
    <div role="button" onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      padding: 'var(--space-4)', background: 'var(--bg-surface-raised)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-1)',
      border: '1px solid var(--border-default)', cursor: onClick ? 'pointer' : 'default',
      opacity: cancelled ? 0.7 : 1, ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <StatusChip status={status} />
        <Icon name="chevron_left" size="sm" mirror color="var(--text-disabled)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Avatar src={providerImage} name={providerName} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service}</div>
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{providerName}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>
        {(date || time) && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Icon name="event" size="sm" />{date}{time ? ` · ${time}` : ''}
          </span>
        )}
        {address && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Icon name="location_on" size="sm" />{address}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-default)' }}>
        {price != null ? <Money amount={price} /> : <span />}
        {actions && <div style={{ display: 'flex', gap: 'var(--space-2)' }}>{actions}</div>}
      </div>
    </div>
  );
}
