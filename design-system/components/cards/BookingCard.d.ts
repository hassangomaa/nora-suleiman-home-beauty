import * as React from 'react';
import type { BookingStatus } from '../feedback/StatusChip';

export interface BookingCardProps {
  status?: BookingStatus;
  service: string;
  providerName: string;
  providerImage?: string;
  /** Date label, e.g. "٢٩ يونيو ٢٠٢٦". */
  date?: string;
  /** Time label, e.g. "٣:٠٠ م". */
  time?: string;
  address?: string;
  price?: number;
  /** Context action buttons (reschedule / cancel / review). */
  actions?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function BookingCard(props: BookingCardProps): JSX.Element;
