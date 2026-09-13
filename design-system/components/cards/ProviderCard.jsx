import React from 'react';
import { Icon } from '../foundation/Icon.jsx';
import { Avatar } from '../display/Avatar.jsx';
import { RatingStars } from '../display/RatingStars.jsx';
import { IconButton } from '../actions/IconButton.jsx';

/**
 * ProviderCard — discovery card: avatar, name, specialty, rating, distance, premium, favorite.
 */
export function ProviderCard({
  name,
  specialty,
  image,
  rating = 0,
  reviews,
  distance,
  premium = false,
  premiumLabel = 'ذهبي',
  favorite = false,
  unavailable = false,
  onClick,
  onToggleFavorite,
  style = {},
}) {
  return (
    <div
      role="button"
      onClick={unavailable ? undefined : onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        padding: 'var(--space-4)', background: 'var(--bg-surface-raised)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-1)',
        border: '1px solid var(--border-default)',
        opacity: unavailable ? 0.6 : 1, cursor: unavailable ? 'default' : 'pointer',
        ...style,
      }}
    >
      <Avatar src={image} name={name} size="lg" premium={premium} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          {premium && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, paddingInline: 6, height: 20, borderRadius: 'var(--radius-sm)', background: 'var(--secondary-100)', color: 'var(--secondary-700)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)' }}>
              <Icon name="workspace_premium" size="xs" fill />{premiumLabel}
            </span>
          )}
        </div>
        <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{specialty}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <RatingStars value={rating} count={reviews} size="xs" />
          {distance && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>
              <Icon name="location_on" size="xs" />{distance}
            </span>
          )}
        </div>
        {unavailable && <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--error-500)' }}>غير متاحة حالياً</span>}
      </div>
      <IconButton icon="favorite" label={favorite ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة'} active={favorite}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(); }}
        style={{ color: favorite ? 'var(--primary-500)' : 'var(--text-disabled)', alignSelf: 'flex-start' }} />
    </div>
  );
}
