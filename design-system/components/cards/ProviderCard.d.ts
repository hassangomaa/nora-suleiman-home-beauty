import * as React from 'react';

export interface ProviderCardProps {
  name: string;
  specialty: string;
  /** Avatar image URL; falls back to initials. */
  image?: string;
  rating?: number;
  reviews?: number;
  /** Distance/area string, e.g. "٢٫٣ كم". */
  distance?: string;
  /** Gold/Platinum boosted — shows ring + badge. */
  premium?: boolean;
  premiumLabel?: string;
  favorite?: boolean;
  /** Dim + "غير متاحة حالياً" (not accepting bookings). */
  unavailable?: boolean;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  style?: React.CSSProperties;
}

export function ProviderCard(props: ProviderCardProps): JSX.Element;
