import * as React from 'react';

export interface ChipProps {
  children?: React.ReactNode;
  leadingIcon?: string;
  /** Selected/active filter state. */
  selected?: boolean;
  /** Renders a trailing ✕ remove affordance. */
  removable?: boolean;
  onRemove?: () => void;
  /** Provide to make the chip a selectable filter (role=checkbox). */
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Chip(props: ChipProps): JSX.Element;
