import * as React from 'react';

export interface FabProps {
  /** Material Symbols ligature name. Default "add". */
  icon?: string;
  /** Accessible label; also the visible text when extended. */
  label: string;
  /** Extended FAB (icon + label). */
  extended?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Fab(props: FabProps): JSX.Element;
