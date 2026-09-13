import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

const STATUS = {
  pending:              { ar: 'بانتظار التأكيد', bg: 'var(--warning-100)', fg: 'var(--warning-500)', icon: 'hourglass_top' },
  pending_provider:     { ar: 'بانتظار التأكيد', bg: 'var(--warning-100)', fg: 'var(--warning-500)', icon: 'hourglass_top' },
  confirmed:            { ar: 'مؤكّد',           bg: 'var(--info-100)',    fg: 'var(--info-500)',    icon: 'check' },
  on_the_way:           { ar: 'في الطريق',       bg: 'var(--info-100)',    fg: 'var(--info-500)',    icon: 'directions_car' },
  checked_in:           { ar: 'تم الوصول',       bg: 'var(--info-100)',    fg: 'var(--info-500)',    icon: 'qr_code_scanner' },
  in_progress:          { ar: 'جارٍ التنفيذ',    bg: 'var(--primary-50)',  fg: 'var(--primary-500)', icon: 'auto_awesome' },
  completed:            { ar: 'مكتمل',           bg: 'var(--success-100)', fg: 'var(--success-500)', icon: 'check_circle' },
  cancelled:            { ar: 'ملغي',            bg: 'var(--error-100)',   fg: 'var(--error-500)',   icon: 'cancel' },
  cancelled_by_client:  { ar: 'ملغي',            bg: 'var(--error-100)',   fg: 'var(--error-500)',   icon: 'cancel' },
  cancelled_by_provider:{ ar: 'ملغي',            bg: 'var(--error-100)',   fg: 'var(--error-500)',   icon: 'cancel' },
  reschedule_requested: { ar: 'طلب إعادة جدولة', bg: 'var(--warning-100)', fg: 'var(--warning-500)', icon: 'event_repeat' },
};

/**
 * StatusChip — booking-status pill; icon mandatory (color never alone).
 */
export function StatusChip({ status = 'pending', label, style = {} }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span aria-label={label || s.ar} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
      height: 26, paddingInline: 'var(--space-2)',
      borderRadius: 'var(--radius-sm)', background: s.bg, color: s.fg,
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)', ...style,
    }}>
      <Icon name={s.icon} size="xs" fill />
      {label || s.ar}
    </span>
  );
}
