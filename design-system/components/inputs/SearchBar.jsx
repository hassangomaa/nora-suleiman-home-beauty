import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * SearchBar — rounded query field with a non-mirrored lens and optional clear/filter.
 */
export function SearchBar({
  value,
  onChange,
  onClear,
  onFilter,
  placeholder = 'ابحثي عن خدمة أو مقدّمة',
  filterActive = false,
  style = {},
  ...rest
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: 44,
        paddingInline: 'var(--space-3)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-full)',
      }}>
        <Icon name="search" size="sm" color="var(--text-secondary)" />
        <input
          type="search"
          role="searchbox"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-base)', fontSize: 'var(--type-body-size)',
            color: 'var(--text-primary)', textAlign: 'start',
          }}
          {...rest}
        />
        {value && (
          <button type="button" aria-label="مسح" onClick={onClear}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-secondary)' }}>
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
      {onFilter && (
        <button type="button" aria-label="تصفية" onClick={onFilter} className="ns-focusable"
          style={{
            position: 'relative', width: 44, height: 44, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)', background: filterActive ? 'var(--bg-tint)' : 'var(--bg-surface)',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: filterActive ? 'var(--action-primary)' : 'var(--text-secondary)',
          }}>
          <Icon name="tune" size="sm" />
          {filterActive && <span style={{ position: 'absolute', top: 8, insetInlineEnd: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--action-primary)' }} />}
        </button>
      )}
    </div>
  );
}
