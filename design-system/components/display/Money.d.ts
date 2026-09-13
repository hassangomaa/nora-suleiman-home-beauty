import * as React from 'react';

export interface MoneyProps {
  /** Numeric amount in SAR. */
  amount: number;
  /** Locale — "ar" uses Arabic-Indic digits + ر.س suffix; "en" uses SAR prefix. */
  locale?: 'ar' | 'en';
  /** Size emphasis: inline (h3), lg (h2 checkout), xl (h1 hero). */
  emphasis?: 'inline' | 'lg' | 'xl';
  /** Original price for a strikethrough was/now discount. */
  was?: number;
  /** Trailing unit suffix, e.g. "/الخدمة". */
  suffix?: string;
  /** default | paid (green) | held (warning) | muted. */
  tone?: 'default' | 'paid' | 'held' | 'muted';
  /** Render "مجاناً" / "Free". */
  free?: boolean;
  style?: React.CSSProperties;
}

export function Money(props: MoneyProps): JSX.Element;
