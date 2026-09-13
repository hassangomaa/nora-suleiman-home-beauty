import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 96 };

/**
 * Avatar — circular image with initials/glyph fallback, optional online dot & premium ring.
 */
export function Avatar({
  src,
  name = '',
  size = 'md',
  online = false,
  premium = false,
  style = {},
  ...rest
}) {
  const px = SIZES[size] || 40;
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  const dot = Math.max(8, Math.round(px * 0.22));

  return (
    <div style={{ position: 'relative', width: px, height: px, flexShrink: 0, ...style }} {...rest}>
      <div style={{
        width: px, height: px, borderRadius: 'var(--radius-full)', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--primary-100)', color: 'var(--primary-700)',
        font: `var(--weight-bold) ${Math.round(px * 0.38)}px/1 var(--font-base)`,
        boxShadow: premium ? '0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--secondary-500)' : 'none',
      }}>
        {src
          ? <img src={src} alt={name} onError={(e) => { e.currentTarget.style.display = 'none'; const t = e.currentTarget.parentElement; t.innerHTML = ''; t.appendChild(document.createTextNode(initials || '')); }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (initials || <Icon name="person" size={Math.round(px * 0.5)} />)}
      </div>
      {online && (
        <span aria-label="متصلة" style={{
          position: 'absolute', insetInlineEnd: 0, bottom: 0,
          width: dot, height: dot, borderRadius: '50%',
          background: 'var(--success-500)', border: '2px solid var(--bg-canvas)',
        }} />
      )}
    </div>
  );
}
