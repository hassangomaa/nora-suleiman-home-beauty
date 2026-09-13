import React from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * BottomNavBar — modern, comfortable bottom tab bar.
 * 3–5 tabs; active tab shows a rose pill with icon + label inline, inactive tabs show icon only.
 * tabs: [{ key, icon, label, badge }]
 */
export function BottomNavBar({ tabs = [], active, onChange, style = {} }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      background: 'var(--bg-surface-raised)',
      borderTop: '1px solid var(--border-default)',
      paddingBlock: 8, paddingInline: 8,
      gap: 4,
      zIndex: 'var(--z-appbar)', ...style,
    }}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button key={t.key} type="button" role="tab" aria-selected={isActive}
            onClick={() => onChange && onChange(t.key)}
            style={{
              flex: isActive ? '0 1 auto' : '0 0 56px',
              minHeight: 52,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: 'none', cursor: 'pointer',
              padding: isActive ? '10px 18px' : '10px 14px',
              borderRadius: 999,
              background: isActive ? 'var(--bg-tint)' : 'transparent',
              color: isActive ? 'var(--action-primary)' : 'var(--text-secondary)',
              transition: 'flex .25s ease, background .15s ease, color .15s ease, padding .2s ease',
              position: 'relative',
            }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Icon name={t.icon} size={24} fill={isActive} />
              {t.badge && (
                <span style={{
                  position: 'absolute', top: -4, insetInlineEnd: -6,
                  minWidth: 16, height: 16, padding: '0 4px',
                  background: 'var(--error-500)', color: '#fff',
                  font: '700 10px/1 var(--font-latin)',
                  borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg-surface-raised)',
                }}>{typeof t.badge === 'number' ? t.badge : ''}</span>
              )}
            </span>
            {isActive && (
              <span style={{
                font: '600 13px/1 var(--font-base)', color: 'var(--action-primary)', whiteSpace: 'nowrap',
              }}>{t.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
