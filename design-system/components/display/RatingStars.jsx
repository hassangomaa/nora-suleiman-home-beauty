import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const GLYPH = { display: 'xs', input: 'md' };

/**
 * RatingStars — gold stars, display (read-only w/ value+count) or input (1–5).
 */
export function RatingStars({
  value = 0,
  count,
  size = 'sm',
  input = false,
  onChange,
  showValue = true,
  style = {},
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div role={input ? 'slider' : 'img'} aria-label={`${value} من ٥`}
      aria-valuenow={input ? value : undefined} aria-valuemin={input ? 1 : undefined} aria-valuemax={input ? 5 : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', ...style }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {stars.map((s) => {
          const filled = value >= s;
          const half = !filled && value >= s - 0.5;
          return input ? (
            <button key={s} type="button" aria-label={`${s} نجوم`} onClick={() => onChange && onChange(s)}
              style={{ border: 'none', background: 'transparent', padding: 2, cursor: 'pointer', display: 'inline-flex', minWidth: 0 }}>
              <Icon name="star" size={size} fill={filled} color={filled ? 'var(--secondary-500)' : 'var(--neutral-300)'} />
            </button>
          ) : (
            <Icon key={s} name={half ? 'star_half' : 'star'} size={size}
              fill={filled || half} color={(filled || half) ? 'var(--secondary-500)' : 'var(--neutral-300)'} />
          );
        })}
      </span>
      {showValue && !input && (
        <span className="ns-ltr" style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)', color: 'var(--text-secondary)' }}>
          {value}{count != null ? ` (${count})` : ''}
        </span>
      )}
    </div>
  );
}
