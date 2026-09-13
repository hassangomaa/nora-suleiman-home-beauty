import * as React from 'react';

export interface NavTab {
  key: string;
  /** Material Symbols ligature name. */
  icon: string;
  label: string;
  /** Number for a count badge, or true for a dot. */
  badge?: number | boolean;
}

export interface BottomNavBarProps {
  tabs: NavTab[];
  /** Active tab key. */
  active?: string;
  onChange?: (key: string) => void;
  style?: React.CSSProperties;
}

export function BottomNavBar(props: BottomNavBarProps): JSX.Element;
