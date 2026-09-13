import * as React from 'react';

export interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  /** Provide to render the trailing filter button. */
  onFilter?: () => void;
  placeholder?: string;
  /** Shows an active-filter dot on the filter button. */
  filterActive?: boolean;
  style?: React.CSSProperties;
}

export function SearchBar(props: SearchBarProps): JSX.Element;
