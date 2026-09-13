import * as React from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols Rounded ligature name, e.g. "favorite", "star", "chevron_left". */
  name: string;
  /** Token size or explicit px. Default "md" (24). */
  size?: IconSize;
  /** Filled variant (active states). Default false (outline). */
  fill?: boolean;
  /** Horizontally mirror in RTL (back/forward chevrons, send). Default false. */
  mirror?: boolean;
  /** CSS color; defaults to currentColor. */
  color?: string;
  /** Optical weight 100–700. Default 400. */
  weight?: number;
}

export function Icon(props: IconProps): JSX.Element;
