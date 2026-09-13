import * as React from 'react';

export interface EmptyStateProps {
  /** Material Symbols ligature for the centered glyph. */
  icon?: string;
  title?: string;
  children?: React.ReactNode;
  /** CTA button label. */
  cta?: string;
  onCta?: () => void;
  style?: React.CSSProperties;
}

export function EmptyState(props: EmptyStateProps): JSX.Element;
