import * as React from 'react';

export interface BadgeProps {
  /** Numeric count; hidden when 0 unless `dot`. */
  count?: number;
  /** Render a bare dot instead of a count. */
  dot?: boolean;
  /** error (red, default) | premium (gold). */
  tone?: 'error' | 'premium';
  /** Cap before showing "+". Default 99. */
  max?: number;
  locale?: 'ar' | 'en';
  /** Host element to anchor the badge onto (trailing-top). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
