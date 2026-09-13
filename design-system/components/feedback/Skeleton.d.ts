import * as React from 'react';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: string;
  /** Render a circle (uses height as diameter). */
  circle?: boolean;
  style?: React.CSSProperties;
}

export function Skeleton(props: SkeletonProps): JSX.Element;
