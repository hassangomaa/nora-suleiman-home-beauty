import * as React from 'react';

export type IconButtonVariant = 'standard' | 'tonal' | 'filled';

export interface IconButtonProps {
  /** Material Symbols ligature name. */
  icon: string;
  /** Required accessible label (icon-only control). */
  label: string;
  variant?: IconButtonVariant;
  size?: 'sm' | 'md';
  /** Render the glyph filled. */
  fill?: boolean;
  /** Mirror directional glyph in RTL. */
  mirror?: boolean;
  /** Active/selected toggle (also fills the glyph, sets aria-pressed). */
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
