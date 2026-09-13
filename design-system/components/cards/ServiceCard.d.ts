import * as React from 'react';

export interface ServiceCardProps {
  name: string;
  description?: string;
  image?: string;
  /** Price in SAR. */
  price: number;
  /** Original price for a was/now discount. */
  was?: number;
  /** Duration label, e.g. "٤٥ دقيقة". */
  duration?: string;
  ctaLabel?: string;
  onBook?: () => void;
  style?: React.CSSProperties;
}

export function ServiceCard(props: ServiceCardProps): JSX.Element;
