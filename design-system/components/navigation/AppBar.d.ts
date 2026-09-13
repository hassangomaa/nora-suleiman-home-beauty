import * as React from 'react';

export interface AppBarProps {
  title?: React.ReactNode;
  /** Provide to show the back IconButton (chevron mirrors in RTL). */
  onBack?: () => void;
  /** Trailing action nodes (IconButtons / Badge). */
  actions?: React.ReactNode;
  /** Raised state (shadow + divider) on scroll. */
  raised?: boolean;
  transparent?: boolean;
  /** Center the title. */
  center?: boolean;
  /** Custom leading node (overrides the back button). */
  leading?: React.ReactNode;
  style?: React.CSSProperties;
}

export function AppBar(props: AppBarProps): JSX.Element;
