import * as React from 'react';

export interface BannerProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children?: React.ReactNode;
  /** Override the default variant icon. */
  icon?: string;
  /** Inline action link text. */
  action?: string;
  onAction?: () => void;
  /** Provide to render a trailing dismiss ✕. */
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

export function Banner(props: BannerProps): JSX.Element;
