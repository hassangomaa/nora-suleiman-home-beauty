import React from 'react';

const SIZE = { xs: 16, sm: 20, md: 24, lg: 32, xl: 48 };

/**
 * Icon — Material Symbols Rounded glyph by ligature name.
 * The brand icon set: outline default, filled active variant via `fill`.
 */
export function Icon({
  name,
  size = 'md',
  fill = false,
  mirror = false,
  color,
  weight = 400,
  className = '',
  style = {},
  ...rest
}) {
  const px = typeof size === 'number' ? size : (SIZE[size] || 24);
  return (
    <span
      className={`ms-icon${mirror ? ' ms-icon--mirror' : ''} ${className}`}
      aria-hidden="true"
      data-om-raster="1"
      style={{
        fontSize: px,
        color: color || 'inherit',
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
