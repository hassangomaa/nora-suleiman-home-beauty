import * as React from 'react';

export interface ListItemProps {
  /** Custom leading node (e.g. Avatar). Overrides leadingIcon. */
  leading?: React.ReactNode;
  /** Material Symbols ligature for a leading icon. */
  leadingIcon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing node (value text, Chip, Switch, etc.). */
  trailing?: React.ReactNode;
  /** Show a trailing drill-in chevron (mirrors in RTL). */
  chevron?: boolean;
  selected?: boolean;
  onClick?: () => void;
  /** Bottom hairline divider. */
  divider?: boolean;
  style?: React.CSSProperties;
}

export function ListItem(props: ListItemProps): JSX.Element;
