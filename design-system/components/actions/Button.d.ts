import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Material Symbols ligature name at reading-start. */
  leadingIcon?: string;
  /** Material Symbols ligature name at reading-end (mirrors in RTL). */
  trailingIcon?: string;
  loading?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
