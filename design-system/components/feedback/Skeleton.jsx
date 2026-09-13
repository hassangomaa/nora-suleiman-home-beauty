import React from 'react';

/**
 * Skeleton — shimmering placeholder shape. Compose to mirror real layouts.
 */
export function Skeleton({ width = '100%', height = 16, radius = 'var(--radius-sm)', circle = false, style = {} }) {
  const r = circle ? 'var(--radius-full)' : radius;
  const dim = circle && typeof height === 'number' ? height : undefined;
  return (
    <span aria-hidden="true" style={{
      display: 'block',
      width: dim || width,
      height,
      borderRadius: r,
      background: 'linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-200) 37%, var(--neutral-100) 63%)',
      backgroundSize: '200% 100%',
      animation: 'ns-shimmer 1.4s ease-in-out infinite',
      ...style,
    }} />
  );
}
