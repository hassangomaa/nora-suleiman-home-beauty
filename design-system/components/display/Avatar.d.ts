import * as React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  /** Used for the alt text and the initials fallback. */
  name?: string;
  size?: AvatarSize;
  /** Online status dot (success green) at trailing-bottom. */
  online?: boolean;
  /** Gold premium ring (Gold/Platinum providers). */
  premium?: boolean;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
