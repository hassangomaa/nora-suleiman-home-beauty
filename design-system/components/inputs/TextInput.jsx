import React, { useState } from 'react';
import { Icon } from '../foundation/Icon.jsx';

/**
 * TextInput — labelled text field with optional icons, helper/error text.
 */
export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  helper,
  error,
  leadingIcon,
  trailingIcon,
  type = 'text',
  multiline = false,
  rows = 3,
  disabled = false,
  dir,
  id,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const fieldId = id || `ns-input-${Math.random().toString(36).slice(2, 8)}`;
  const borderColor = error ? 'var(--error-500)' : focused ? 'var(--action-primary)' : 'var(--border-default)';

  const fieldStyle = {
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: 'var(--space-2)',
    minHeight: 48,
    padding: 'var(--space-3)',
    background: disabled ? 'var(--neutral-100)' : 'var(--bg-surface-raised)',
    border: `${focused || error ? 1.5 : 1}px solid ${borderColor}`,
    borderRadius: 'var(--radius-md)',
    boxShadow: focused && !error ? '0 0 0 2px var(--focus-ring)' : 'none',
    transition: 'border-color .15s ease, box-shadow .15s ease',
  };

  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-base)',
    fontSize: 'var(--type-body-lg-size)',
    lineHeight: 'var(--type-body-lg-lh)',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
    resize: multiline ? 'vertical' : undefined,
    textAlign: 'start',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', ...style }}>
      {label && (
        <label htmlFor={fieldId} style={{
          font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
          color: focused && !error ? 'var(--action-primary)' : 'var(--text-primary)',
        }}>{label}</label>
      )}
      <div style={fieldStyle}>
        {leadingIcon && <Icon name={leadingIcon} size="sm" color="var(--text-secondary)" />}
        {multiline ? (
          <textarea
            id={fieldId} rows={rows} value={value} placeholder={placeholder} disabled={disabled} dir={dir}
            aria-invalid={!!error} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={inputStyle} {...rest}
          />
        ) : (
          <input
            id={fieldId} type={type} value={value} placeholder={placeholder} disabled={disabled} dir={dir}
            aria-invalid={!!error} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={inputStyle} {...rest}
          />
        )}
        {error
          ? <Icon name="error" size="sm" color="var(--error-500)" />
          : trailingIcon && <Icon name={trailingIcon} size="sm" color="var(--text-secondary)" />}
      </div>
      {(error || helper) && (
        <span style={{
          font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
          color: error ? 'var(--error-500)' : 'var(--text-secondary)',
        }}>{error || helper}</span>
      )}
    </div>
  );
}
