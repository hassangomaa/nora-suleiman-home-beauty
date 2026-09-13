import * as React from 'react';

export interface RatingStarsProps {
  /** Rating 0–5 (supports .5 for half in display mode). */
  value?: number;
  /** Review count, shown after the value in display mode. */
  count?: number;
  size?: 'xs' | 'sm' | 'md';
  /** Interactive 1–5 input (tap to rate). */
  input?: boolean;
  onChange?: (value: number) => void;
  /** Show the numeric value/count (display mode). Default true. */
  showValue?: boolean;
  style?: React.CSSProperties;
}

export function RatingStars(props: RatingStarsProps): JSX.Element;
