import * as React from 'react';

export type BookingStatus =
  | 'pending' | 'pending_provider' | 'confirmed' | 'on_the_way' | 'checked_in'
  | 'in_progress' | 'completed' | 'cancelled' | 'cancelled_by_client'
  | 'cancelled_by_provider' | 'reschedule_requested';

export interface StatusChipProps {
  status?: BookingStatus;
  /** Override the default Arabic label. */
  label?: string;
  style?: React.CSSProperties;
}

export function StatusChip(props: StatusChipProps): JSX.Element;
