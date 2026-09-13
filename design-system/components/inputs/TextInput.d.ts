import * as React from 'react';

export interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  /** Helper text below the field. */
  helper?: string;
  /** Error message; turns the field into its error state. */
  error?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  id?: string;
  style?: React.CSSProperties;
}

export function TextInput(props: TextInputProps): JSX.Element;
