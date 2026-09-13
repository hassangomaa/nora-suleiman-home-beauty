import React from 'react';

const AR_DIGITS = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const toArabic = (n) => String(n).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);

/**
 * Badge — count pill or dot overlay. Wrap a host element to anchor it.
 */
export function Badge({ count, dot = false, tone = 'error', children, locale = 'ar', max = 99, style = {} }) {
  const bg = tone === 'premium' ? 'var(--secondary-500)' : 'var(--error-500)';
  const show = dot || count > 0;
  const label = count > max ? `${locale === 'ar' ? toArabic(max) + '+' : max + '+'}` : (locale === 'ar' ? toArabic(count) : count);

  const badge = show && (
    <span style={{
      position: children ? 'absolute' : 'static',
      insetInlineEnd: children ? -4 : undefined,
      top: children ? -4 : undefined,
      minWidth: dot ? 8 : 16, height: dot ? 8 : 16,
      paddingInline: dot ? 0 : 4,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: bg, color: 'var(--neutral-0)',
      font: 'var(--weight-bold) var(--type-overline-size)/1 var(--font-base)',
      border: children ? '2px solid var(--bg-canvas)' : 'none',
      boxSizing: 'content-box',
    }}>
      {!dot && label}
    </span>
  );

  if (!children) return badge || null;
  return <span style={{ position: 'relative', display: 'inline-flex', ...style }}>{children}{badge}</span>;
}
