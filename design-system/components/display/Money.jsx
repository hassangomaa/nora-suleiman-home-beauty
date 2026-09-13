import React from 'react';

const EMPHASIS = {
  inline: { amount: 'var(--type-h3-size)', lh: 'var(--type-h3-lh)' },
  lg:     { amount: 'var(--type-h2-size)', lh: 'var(--type-h2-lh)' },
  xl:     { amount: 'var(--type-h1-size)', lh: 'var(--type-h1-lh)' },
};

const AR_DIGITS = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabic(n) {
  return String(n).replace(/[0-9]/g, (d) => AR_DIGITS[+d]);
}

/**
 * Money — price/amount display. SAR; Arabic-Indic digits + ر.س suffix in ar.
 */
export function Money({
  amount,
  locale = 'ar',
  emphasis = 'inline',
  was,
  suffix,
  tone = 'default',
  free = false,
  style = {},
}) {
  const e = EMPHASIS[emphasis] || EMPHASIS.inline;
  const color = tone === 'paid' ? 'var(--success-500)'
    : tone === 'held' ? 'var(--warning-500)'
    : tone === 'muted' ? 'var(--text-secondary)'
    : 'var(--text-primary)';

  if (free) {
    return <span style={{ font: `var(--weight-bold) ${e.amount}/${e.lh} var(--font-base)`, color: 'var(--success-500)', ...style }}>{locale === 'ar' ? 'مجاناً' : 'Free'}</span>;
  }

  const fmt = (v) => locale === 'ar' ? toArabic(v.toLocaleString('en-US')) : v.toLocaleString('en-US');
  const unit = locale === 'ar' ? 'ر.س' : 'SAR';

  return (
    <span className="ns-bidi-isolate" style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, color, ...style }}>
      {was != null && (
        <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)' }}>
          {fmt(was)}
        </span>
      )}
      {locale !== 'ar' && <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)' }}>{unit}</span>}
      <span style={{ font: `var(--weight-bold) ${e.amount}/${e.lh} var(--font-base)` }}>{fmt(amount)}</span>
      {locale === 'ar' && <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)' }}>{unit}</span>}
      {suffix && <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>{suffix}</span>}
    </span>
  );
}
