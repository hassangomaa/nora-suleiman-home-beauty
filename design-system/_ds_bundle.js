/* @ds-bundle: {"format":3,"namespace":"NoraSuleimanHomeBeautyDesignSystem_5b646a","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Fab","sourcePath":"components/actions/Fab.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"BookingCard","sourcePath":"components/cards/BookingCard.jsx"},{"name":"ListItem","sourcePath":"components/cards/ListItem.jsx"},{"name":"ProviderCard","sourcePath":"components/cards/ProviderCard.jsx"},{"name":"ServiceCard","sourcePath":"components/cards/ServiceCard.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Money","sourcePath":"components/display/Money.jsx"},{"name":"RatingStars","sourcePath":"components/display/RatingStars.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"StatusChip","sourcePath":"components/feedback/StatusChip.jsx"},{"name":"Icon","sourcePath":"components/foundation/Icon.jsx"},{"name":"Chip","sourcePath":"components/inputs/Chip.jsx"},{"name":"SearchBar","sourcePath":"components/inputs/SearchBar.jsx"},{"name":"TextInput","sourcePath":"components/inputs/TextInput.jsx"},{"name":"AppBar","sourcePath":"components/navigation/AppBar.jsx"},{"name":"BottomNavBar","sourcePath":"components/navigation/BottomNavBar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"374b79188966","components/actions/Fab.jsx":"079840ba4a6e","components/actions/IconButton.jsx":"4ed839d2eeda","components/cards/BookingCard.jsx":"1335152e5e83","components/cards/ListItem.jsx":"a6cffb3d5326","components/cards/ProviderCard.jsx":"f5a75728b160","components/cards/ServiceCard.jsx":"d7388452234f","components/display/Avatar.jsx":"8ca3a4057919","components/display/Money.jsx":"e0a8a8e25fc4","components/display/RatingStars.jsx":"8480835bb898","components/feedback/Badge.jsx":"eaee8cc7ceeb","components/feedback/Banner.jsx":"0c1f41606b55","components/feedback/EmptyState.jsx":"fa791e81ba88","components/feedback/Skeleton.jsx":"d12262b66d7b","components/feedback/StatusChip.jsx":"63ebd447d2f2","components/foundation/Icon.jsx":"39437a7a1c23","components/inputs/Chip.jsx":"c02297db124f","components/inputs/SearchBar.jsx":"8b14ff1c8814","components/inputs/TextInput.jsx":"5070dcecfbb3","components/navigation/AppBar.jsx":"14b580943125","components/navigation/BottomNavBar.jsx":"92f38b1744d5","ui_kits/client-app/app-brand-icons.jsx":"16d9f2789bbd","ui_kits/client-app/app-data.js":"6e72e9e1cb6f","ui_kits/client-app/app-logo-asset.js":"28d7513a50ca","ui_kits/client-app/app-screens-account.jsx":"bebc90cb6a43","ui_kits/client-app/app-screens-booking.jsx":"341ed3a1c47d","ui_kits/client-app/app-screens-discover.jsx":"75549ec89c71","ui_kits/client-app/app-screens-more.jsx":"d6ac2c4a8a7f","ui_kits/client-app/app-screens-onboarding.jsx":"5cd1864ecf8f","ui_kits/client-app/app-screens-provider.jsx":"b79b025f4e46"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.NoraSuleimanHomeBeautyDesignSystem_5b646a = window.NoraSuleimanHomeBeautyDesignSystem_5b646a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Money.jsx
try { (() => {
const EMPHASIS = {
  inline: {
    amount: 'var(--type-h3-size)',
    lh: 'var(--type-h3-lh)'
  },
  lg: {
    amount: 'var(--type-h2-size)',
    lh: 'var(--type-h2-lh)'
  },
  xl: {
    amount: 'var(--type-h1-size)',
    lh: 'var(--type-h1-lh)'
  }
};
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabic(n) {
  return String(n).replace(/[0-9]/g, d => AR_DIGITS[+d]);
}

/**
 * Money — price/amount display. SAR; Arabic-Indic digits + ر.س suffix in ar.
 */
function Money({
  amount,
  locale = 'ar',
  emphasis = 'inline',
  was,
  suffix,
  tone = 'default',
  free = false,
  style = {}
}) {
  const e = EMPHASIS[emphasis] || EMPHASIS.inline;
  const color = tone === 'paid' ? 'var(--success-500)' : tone === 'held' ? 'var(--warning-500)' : tone === 'muted' ? 'var(--text-secondary)' : 'var(--text-primary)';
  if (free) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        font: `var(--weight-bold) ${e.amount}/${e.lh} var(--font-base)`,
        color: 'var(--success-500)',
        ...style
      }
    }, locale === 'ar' ? 'مجاناً' : 'Free');
  }
  const fmt = v => locale === 'ar' ? toArabic(v.toLocaleString('en-US')) : v.toLocaleString('en-US');
  const unit = locale === 'ar' ? 'ر.س' : 'SAR';
  return /*#__PURE__*/React.createElement("span", {
    className: "ns-bidi-isolate",
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 4,
      color,
      ...style
    }
  }, was != null && /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'line-through',
      color: 'var(--text-secondary)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)'
    }
  }, fmt(was)), locale !== 'ar' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)'
    }
  }, unit), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `var(--weight-bold) ${e.amount}/${e.lh} var(--font-base)`
    }
  }, fmt(amount)), locale === 'ar' && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)'
    }
  }, unit), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, suffix));
}
Object.assign(__ds_scope, { Money });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Money.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabic = n => String(n).replace(/[0-9]/g, d => AR_DIGITS[+d]);

/**
 * Badge — count pill or dot overlay. Wrap a host element to anchor it.
 */
function Badge({
  count,
  dot = false,
  tone = 'error',
  children,
  locale = 'ar',
  max = 99,
  style = {}
}) {
  const bg = tone === 'premium' ? 'var(--secondary-500)' : 'var(--error-500)';
  const show = dot || count > 0;
  const label = count > max ? `${locale === 'ar' ? toArabic(max) + '+' : max + '+'}` : locale === 'ar' ? toArabic(count) : count;
  const badge = show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: children ? 'absolute' : 'static',
      insetInlineEnd: children ? -4 : undefined,
      top: children ? -4 : undefined,
      minWidth: dot ? 8 : 16,
      height: dot ? 8 : 16,
      paddingInline: dot ? 0 : 4,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: bg,
      color: 'var(--neutral-0)',
      font: 'var(--weight-bold) var(--type-overline-size)/1 var(--font-base)',
      border: children ? '2px solid var(--bg-canvas)' : 'none',
      boxSizing: 'content-box'
    }
  }, !dot && label);
  if (!children) return badge || null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, badge);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
/**
 * Skeleton — shimmering placeholder shape. Compose to mirror real layouts.
 */
function Skeleton({
  width = '100%',
  height = 16,
  radius = 'var(--radius-sm)',
  circle = false,
  style = {}
}) {
  const r = circle ? 'var(--radius-full)' : radius;
  const dim = circle && typeof height === 'number' ? height : undefined;
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'block',
      width: dim || width,
      height,
      borderRadius: r,
      background: 'linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-200) 37%, var(--neutral-100) 63%)',
      backgroundSize: '200% 100%',
      animation: 'ns-shimmer 1.4s ease-in-out infinite',
      ...style
    }
  });
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/foundation/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48
};

/**
 * Icon — Material Symbols Rounded glyph by ligature name.
 * The brand icon set: outline default, filled active variant via `fill`.
 */
function Icon({
  name,
  size = 'md',
  fill = false,
  mirror = false,
  color,
  weight = 400,
  className = '',
  style = {},
  ...rest
}) {
  const px = typeof size === 'number' ? size : SIZE[size] || 24;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `ms-icon${mirror ? ' ms-icon--mirror' : ''} ${className}`,
    "aria-hidden": "true",
    "data-om-raster": "1",
    style: {
      fontSize: px,
      color: color || 'inherit',
      fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      ...style
    }
  }, rest), name);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundation/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 36,
    padInline: 'var(--space-3)',
    font: 'var(--type-label-size)'
  },
  md: {
    height: 44,
    padInline: 'var(--space-4)',
    font: 'var(--type-label-size)'
  },
  lg: {
    height: 48,
    padInline: 'var(--space-5)',
    font: 'var(--type-label-size)'
  }
};
function variantStyle(variant, pressed) {
  switch (variant) {
    case 'secondary':
      return {
        background: 'var(--bg-surface)',
        color: 'var(--action-primary)',
        border: '1px solid var(--border-strong)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--action-primary)',
        border: '1px solid transparent'
      };
    case 'destructive':
      return {
        background: 'var(--error-500)',
        color: 'var(--neutral-0)',
        border: '1px solid transparent'
      };
    default:
      return {
        background: pressed ? 'var(--action-primary-pressed)' : 'var(--action-primary)',
        color: 'var(--text-on-primary)',
        border: '1px solid transparent',
        boxShadow: 'var(--elevation-1)'
      };
  }
}

/**
 * Button — primary action control. Variants: primary | secondary | ghost | destructive.
 */
function Button({
  children,
  variant = 'primary',
  size = 'lg',
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const sz = SIZES[size] || SIZES.lg;
  const isDisabled = disabled || loading;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    minHeight: sz.height,
    height: sz.height,
    paddingInline: sz.padInline,
    width: fullWidth ? '100%' : undefined,
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-base)',
    fontSize: sz.font,
    fontWeight: 'var(--weight-medium)',
    lineHeight: 'var(--type-label-lh)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'background .15s ease, box-shadow .15s ease, transform .05s ease',
    userSelect: 'none',
    ...variantStyle(variant)
  };
  const disabledStyle = isDisabled ? {
    background: variant === 'ghost' ? 'transparent' : 'var(--neutral-200)',
    color: 'var(--text-disabled)',
    border: '1px solid transparent',
    boxShadow: 'none'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: "ns-focusable",
    disabled: isDisabled,
    "aria-busy": loading || undefined,
    onClick: isDisabled ? undefined : onClick,
    style: {
      ...base,
      ...disabledStyle,
      ...style
    },
    onMouseDown: e => {
      if (!isDisabled) e.currentTarget.style.transform = 'scale(0.985)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'ns-spin .7s linear infinite',
      opacity: 0.9
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: "sm"
  }), children, trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: "sm",
    mirror: true
  })));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/Fab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fab — Floating Action Button, anchored bottom reading-end above the nav bar.
 */
function Fab({
  icon = 'add',
  label,
  extended = false,
  onClick,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ns-focusable",
    "aria-label": label,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: 56,
      minWidth: 56,
      paddingInline: extended ? 'var(--space-5)' : 0,
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'var(--action-primary)',
      color: 'var(--text-on-primary)',
      border: 'none',
      boxShadow: 'var(--elevation-3)',
      cursor: 'pointer',
      fontFamily: 'var(--font-base)',
      fontSize: 'var(--type-label-size)',
      fontWeight: 'var(--weight-medium)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "md"
  }), extended && label);
}
Object.assign(__ds_scope, { Fab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Fab.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function variantStyle(variant) {
  switch (variant) {
    case 'tonal':
      return {
        background: 'var(--bg-tint)',
        color: 'var(--action-primary)'
      };
    case 'filled':
      return {
        background: 'var(--action-primary)',
        color: 'var(--text-on-primary)'
      };
    default:
      return {
        background: 'transparent',
        color: 'var(--text-primary)'
      };
  }
}

/**
 * IconButton — single-glyph control with a 44pt hit area. Always needs an accessible label.
 */
function IconButton({
  icon,
  label,
  variant = 'standard',
  size = 'md',
  fill = false,
  mirror = false,
  active = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const glyph = size === 'sm' ? 'sm' : 'md';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: "ns-focusable",
    "aria-label": label,
    "aria-pressed": active || undefined,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    style: {
      width: 'var(--touch-min)',
      height: 'var(--touch-min)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background .15s ease',
      ...variantStyle(variant),
      ...(disabled ? {
        color: 'var(--text-disabled)',
        background: 'transparent'
      } : {}),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: glyph,
    fill: fill || active,
    mirror: mirror
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cards/ListItem.jsx
try { (() => {
/**
 * ListItem — leading (icon/avatar) + primary/secondary text + trailing (value/chevron/control).
 */
function ListItem({
  leading,
  leadingIcon,
  title,
  subtitle,
  trailing,
  chevron = false,
  selected = false,
  onClick,
  divider = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: onClick ? 'button' : undefined,
    tabIndex: onClick ? 0 : undefined,
    onClick: onClick,
    className: onClick ? 'ns-focusable' : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      minHeight: 56,
      padding: 'var(--space-3) var(--space-4)',
      background: selected ? 'var(--bg-tint)' : 'transparent',
      borderBottom: divider ? '1px solid var(--border-default)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, leading || leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: subtitle ? 'normal' : 'nowrap'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, subtitle)), trailing, chevron && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron_left",
    size: "sm",
    mirror: true,
    color: "var(--text-disabled)"
  }));
}
Object.assign(__ds_scope, { ListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ListItem.jsx", error: String((e && e.message) || e) }); }

// components/cards/ServiceCard.jsx
try { (() => {
/**
 * ServiceCard — thumbnail, name, 2-line desc, price + duration, book CTA.
 */
function ServiceCard({
  name,
  description,
  image,
  price,
  was,
  duration,
  ctaLabel = 'احجزي',
  onBook,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--bg-surface-raised)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--elevation-1)',
      border: '1px solid var(--border-default)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-300)'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "spa",
    size: "lg"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Money, {
    amount: price,
    was: was
  }), duration && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "schedule",
    size: "xs"
  }), duration)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onBook
  }, ctaLabel))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 96
};

/**
 * Avatar — circular image with initials/glyph fallback, optional online dot & premium ring.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  online = false,
  premium = false,
  style = {},
  ...rest
}) {
  const px = SIZES[size] || 40;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
  const dot = Math.max(8, Math.round(px * 0.22));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: px,
      height: px,
      flexShrink: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: px,
      height: px,
      borderRadius: 'var(--radius-full)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--primary-100)',
      color: 'var(--primary-700)',
      font: `var(--weight-bold) ${Math.round(px * 0.38)}px/1 var(--font-base)`,
      boxShadow: premium ? '0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--secondary-500)' : 'none'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    onError: e => {
      e.currentTarget.style.display = 'none';
      const t = e.currentTarget.parentElement;
      t.innerHTML = '';
      t.appendChild(document.createTextNode(initials || ''));
    },
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "person",
    size: Math.round(px * 0.5)
  })), online && /*#__PURE__*/React.createElement("span", {
    "aria-label": "\u0645\u062A\u0635\u0644\u0629",
    style: {
      position: 'absolute',
      insetInlineEnd: 0,
      bottom: 0,
      width: dot,
      height: dot,
      borderRadius: '50%',
      background: 'var(--success-500)',
      border: '2px solid var(--bg-canvas)'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/RatingStars.jsx
try { (() => {
const GLYPH = {
  display: 'xs',
  input: 'md'
};

/**
 * RatingStars — gold stars, display (read-only w/ value+count) or input (1–5).
 */
function RatingStars({
  value = 0,
  count,
  size = 'sm',
  input = false,
  onChange,
  showValue = true,
  style = {}
}) {
  const stars = [1, 2, 3, 4, 5];
  return /*#__PURE__*/React.createElement("div", {
    role: input ? 'slider' : 'img',
    "aria-label": `${value} من ٥`,
    "aria-valuenow": input ? value : undefined,
    "aria-valuemin": input ? 1 : undefined,
    "aria-valuemax": input ? 5 : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, stars.map(s => {
    const filled = value >= s;
    const half = !filled && value >= s - 0.5;
    return input ? /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      "aria-label": `${s} نجوم`,
      onClick: () => onChange && onChange(s),
      style: {
        border: 'none',
        background: 'transparent',
        padding: 2,
        cursor: 'pointer',
        display: 'inline-flex',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "star",
      size: size,
      fill: filled,
      color: filled ? 'var(--secondary-500)' : 'var(--neutral-300)'
    })) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      key: s,
      name: half ? 'star_half' : 'star',
      size: size,
      fill: filled || half,
      color: filled || half ? 'var(--secondary-500)' : 'var(--neutral-300)'
    });
  })), showValue && !input && /*#__PURE__*/React.createElement("span", {
    className: "ns-ltr",
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, value, count != null ? ` (${count})` : ''));
}
Object.assign(__ds_scope, { RatingStars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/RatingStars.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProviderCard.jsx
try { (() => {
/**
 * ProviderCard — discovery card: avatar, name, specialty, rating, distance, premium, favorite.
 */
function ProviderCard({
  name,
  specialty,
  image,
  rating = 0,
  reviews,
  distance,
  premium = false,
  premiumLabel = 'ذهبي',
  favorite = false,
  unavailable = false,
  onClick,
  onToggleFavorite,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "button",
    onClick: unavailable ? undefined : onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--bg-surface-raised)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--elevation-1)',
      border: '1px solid var(--border-default)',
      opacity: unavailable ? 0.6 : 1,
      cursor: unavailable ? 'default' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: image,
    name: name,
    size: "lg",
    premium: premium
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, name), premium && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      paddingInline: 6,
      height: 20,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--secondary-100)',
      color: 'var(--secondary-700)',
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "workspace_premium",
    size: "xs",
    fill: true
  }), premiumLabel)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, specialty), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.RatingStars, {
    value: rating,
    count: reviews,
    size: "xs"
  }), distance && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "location_on",
    size: "xs"
  }), distance)), unavailable && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--error-500)'
    }
  }, "\u063A\u064A\u0631 \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u0627\u064B")), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "favorite",
    label: favorite ? 'إزالة من المفضّلة' : 'إضافة للمفضّلة',
    active: favorite,
    onClick: e => {
      e.stopPropagation();
      onToggleFavorite && onToggleFavorite();
    },
    style: {
      color: favorite ? 'var(--primary-500)' : 'var(--text-disabled)',
      alignSelf: 'flex-start'
    }
  }));
}
Object.assign(__ds_scope, { ProviderCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProviderCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
const VARIANT = {
  success: {
    bg: 'var(--success-100)',
    fg: 'var(--success-500)',
    icon: 'check_circle'
  },
  warning: {
    bg: 'var(--warning-100)',
    fg: 'var(--warning-500)',
    icon: 'warning'
  },
  error: {
    bg: 'var(--error-100)',
    fg: 'var(--error-500)',
    icon: 'error'
  },
  info: {
    bg: 'var(--info-100)',
    fg: 'var(--info-500)',
    icon: 'info'
  }
};

/**
 * Banner — inline status block (success/warning/error/info) with icon + text.
 */
function Banner({
  variant = 'info',
  title,
  children,
  icon,
  action,
  onAction,
  onDismiss,
  style = {}
}) {
  const v = VARIANT[variant] || VARIANT.info;
  return /*#__PURE__*/React.createElement("div", {
    role: variant === 'error' ? 'alert' : 'status',
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      background: v.bg,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || v.icon,
    size: "sm",
    fill: true,
    color: v.fg,
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, children), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      marginTop: 'var(--space-1)',
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      color: v.fg,
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)'
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u0625\u063A\u0644\u0627\u0642",
    onClick: onDismiss,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'inline-flex',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: "sm"
  })));
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
/**
 * EmptyState — centered glyph + title + supportive text + optional CTA.
 */
function EmptyState({
  icon = 'inbox',
  title,
  children,
  cta,
  onCta,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-8) var(--space-6)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 80,
      height: 80,
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-tint)',
      color: 'var(--primary-400)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: "xl"
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      maxWidth: 280
    }
  }, children), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusChip.jsx
try { (() => {
const STATUS = {
  pending: {
    ar: 'بانتظار التأكيد',
    bg: 'var(--warning-100)',
    fg: 'var(--warning-500)',
    icon: 'hourglass_top'
  },
  pending_provider: {
    ar: 'بانتظار التأكيد',
    bg: 'var(--warning-100)',
    fg: 'var(--warning-500)',
    icon: 'hourglass_top'
  },
  confirmed: {
    ar: 'مؤكّد',
    bg: 'var(--info-100)',
    fg: 'var(--info-500)',
    icon: 'check'
  },
  on_the_way: {
    ar: 'في الطريق',
    bg: 'var(--info-100)',
    fg: 'var(--info-500)',
    icon: 'directions_car'
  },
  checked_in: {
    ar: 'تم الوصول',
    bg: 'var(--info-100)',
    fg: 'var(--info-500)',
    icon: 'qr_code_scanner'
  },
  in_progress: {
    ar: 'جارٍ التنفيذ',
    bg: 'var(--primary-50)',
    fg: 'var(--primary-500)',
    icon: 'auto_awesome'
  },
  completed: {
    ar: 'مكتمل',
    bg: 'var(--success-100)',
    fg: 'var(--success-500)',
    icon: 'check_circle'
  },
  cancelled: {
    ar: 'ملغي',
    bg: 'var(--error-100)',
    fg: 'var(--error-500)',
    icon: 'cancel'
  },
  cancelled_by_client: {
    ar: 'ملغي',
    bg: 'var(--error-100)',
    fg: 'var(--error-500)',
    icon: 'cancel'
  },
  cancelled_by_provider: {
    ar: 'ملغي',
    bg: 'var(--error-100)',
    fg: 'var(--error-500)',
    icon: 'cancel'
  },
  reschedule_requested: {
    ar: 'طلب إعادة جدولة',
    bg: 'var(--warning-100)',
    fg: 'var(--warning-500)',
    icon: 'event_repeat'
  }
};

/**
 * StatusChip — booking-status pill; icon mandatory (color never alone).
 */
function StatusChip({
  status = 'pending',
  label,
  style = {}
}) {
  const s = STATUS[status] || STATUS.pending;
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": label || s.ar,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      height: 26,
      paddingInline: 'var(--space-2)',
      borderRadius: 'var(--radius-sm)',
      background: s.bg,
      color: s.fg,
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: "xs",
    fill: true
  }), label || s.ar);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/cards/BookingCard.jsx
try { (() => {
/**
 * BookingCard — status-colored card: status chip, service+provider, date/time, address, price, actions.
 */
function BookingCard({
  status = 'pending',
  service,
  providerName,
  providerImage,
  date,
  time,
  address,
  price,
  actions,
  onClick,
  style = {}
}) {
  const cancelled = String(status).startsWith('cancelled');
  return /*#__PURE__*/React.createElement("div", {
    role: "button",
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      background: 'var(--bg-surface-raised)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--elevation-1)',
      border: '1px solid var(--border-default)',
      cursor: onClick ? 'pointer' : 'default',
      opacity: cancelled ? 0.7 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusChip, {
    status: status
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron_left",
    size: "sm",
    mirror: true,
    color: "var(--text-disabled)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: providerImage,
    name: providerName,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, service), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, providerName))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, (date || time) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "event",
    size: "sm"
  }), date, time ? ` · ${time}` : ''), address && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "location_on",
    size: "sm"
  }), address)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-2)',
      paddingTop: 'var(--space-2)',
      borderTop: '1px solid var(--border-default)'
    }
  }, price != null ? /*#__PURE__*/React.createElement(__ds_scope.Money, {
    amount: price
  }) : /*#__PURE__*/React.createElement("span", null), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, actions)));
}
Object.assign(__ds_scope, { BookingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/BookingCard.jsx", error: String((e && e.message) || e) }); }

// components/inputs/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Chip — compact pill for assist / filter (selectable) / removable uses.
 */
function Chip({
  children,
  leadingIcon,
  selected = false,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const height = size === 'sm' ? 28 : 32;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: onClick ? 'checkbox' : undefined,
    "aria-checked": onClick ? selected : undefined,
    "aria-pressed": onClick ? selected : undefined,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    className: "ns-focusable",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      height,
      minHeight: height,
      paddingInline: 'var(--space-3)',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
      background: selected ? 'var(--bg-tint)' : 'var(--bg-surface)',
      border: `1px solid ${selected ? 'var(--primary-300)' : 'var(--border-default)'}`,
      color: disabled ? 'var(--text-disabled)' : selected ? 'var(--primary-700)' : 'var(--text-primary)',
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
      ...style
    }
  }, rest), leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: "xs",
    fill: selected
  }), children, removable && /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "\u0625\u0632\u0627\u0644\u0629",
    onClick: e => {
      e.stopPropagation();
      onRemove && onRemove();
    },
    style: {
      display: 'inline-flex',
      cursor: 'pointer',
      marginInlineStart: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: "xs"
  })));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/Chip.jsx", error: String((e && e.message) || e) }); }

// components/inputs/SearchBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SearchBar — rounded query field with a non-mirrored lens and optional clear/filter.
 */
function SearchBar({
  value,
  onChange,
  onClear,
  onFilter,
  placeholder = 'ابحثي عن خدمة أو مقدّمة',
  filterActive = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: 44,
      paddingInline: 'var(--space-3)',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-full)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: "sm",
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    role: "searchbox",
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-base)',
      fontSize: 'var(--type-body-size)',
      color: 'var(--text-primary)',
      textAlign: 'start'
    }
  }, rest)), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u0645\u0633\u062D",
    onClick: onClear,
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      display: 'inline-flex',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: "sm"
  }))), onFilter && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "\u062A\u0635\u0641\u064A\u0629",
    onClick: onFilter,
    className: "ns-focusable",
    style: {
      position: 'relative',
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      background: filterActive ? 'var(--bg-tint)' : 'var(--bg-surface)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: filterActive ? 'var(--action-primary)' : 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "tune",
    size: "sm"
  }), filterActive && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      insetInlineEnd: 8,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--action-primary)'
    }
  })));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/inputs/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * TextInput — labelled text field with optional icons, helper/error text.
 */
function TextInput({
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
    transition: 'border-color .15s ease, box-shadow .15s ease'
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
    textAlign: 'start'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
      color: focused && !error ? 'var(--action-primary)' : 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: fieldStyle
  }, leadingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: leadingIcon,
    size: "sm",
    color: "var(--text-secondary)"
  }), multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    id: fieldId,
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    dir: dir,
    "aria-invalid": !!error,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: inputStyle
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    dir: dir,
    "aria-invalid": !!error,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: inputStyle
  }, rest)), error ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "error",
    size: "sm",
    color: "var(--error-500)"
  }) : trailingIcon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: "sm",
    color: "var(--text-secondary)"
  })), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: error ? 'var(--error-500)' : 'var(--text-secondary)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/inputs/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppBar.jsx
try { (() => {
/**
 * AppBar — top header bar: back, title, trailing actions. Raises on scroll.
 */
function AppBar({
  title,
  onBack,
  actions,
  raised = false,
  transparent = false,
  center = false,
  leading,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    role: "banner",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height: 56,
      paddingInline: 'var(--space-2)',
      background: transparent ? 'transparent' : 'var(--bg-canvas)',
      boxShadow: raised ? 'var(--elevation-2)' : 'none',
      borderBottom: raised ? '1px solid var(--border-default)' : 'none',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-appbar)',
      ...style
    }
  }, leading || onBack && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow_forward",
    label: "\u0631\u062C\u0648\u0639",
    mirror: true,
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      font: 'var(--weight-bold) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)',
      textAlign: center ? 'center' : 'start',
      paddingInline: 'var(--space-2)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)'
    }
  }, actions));
}
Object.assign(__ds_scope, { AppBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNavBar.jsx
try { (() => {
/**
 * BottomNavBar — modern, comfortable bottom tab bar.
 * 3–5 tabs; active tab shows a rose pill with icon + label inline, inactive tabs show icon only.
 * tabs: [{ key, icon, label, badge }]
 */
function BottomNavBar({
  tabs = [],
  active,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      background: 'var(--bg-surface-raised)',
      borderTop: '1px solid var(--border-default)',
      paddingBlock: 8,
      paddingInline: 8,
      gap: 4,
      zIndex: 'var(--z-appbar)',
      ...style
    }
  }, tabs.map(t => {
    const isActive = t.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      role: "tab",
      "aria-selected": isActive,
      onClick: () => onChange && onChange(t.key),
      style: {
        flex: isActive ? '0 1 auto' : '0 0 56px',
        minHeight: 52,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        border: 'none',
        cursor: 'pointer',
        padding: isActive ? '10px 18px' : '10px 14px',
        borderRadius: 999,
        background: isActive ? 'var(--bg-tint)' : 'transparent',
        color: isActive ? 'var(--action-primary)' : 'var(--text-secondary)',
        transition: 'flex .25s ease, background .15s ease, color .15s ease, padding .2s ease',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 24,
      fill: isActive
    }), t.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -4,
        insetInlineEnd: -6,
        minWidth: 16,
        height: 16,
        padding: '0 4px',
        background: 'var(--error-500)',
        color: '#fff',
        font: '700 10px/1 var(--font-latin)',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--bg-surface-raised)'
      }
    }, typeof t.badge === 'number' ? t.badge : '')), isActive && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-base)',
        color: 'var(--action-primary)',
        whiteSpace: 'nowrap'
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { BottomNavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNavBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-brand-icons.jsx
try { (() => {
/* Brand mark inline-SVG icons for auth + payments.
   These render crisply at any size and are bundled with the standalone HTML. */

function AppleMark({
  size = 22,
  color = '#fff'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size * 1.22,
    viewBox: "0 0 22 27",
    fill: color,
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.3 14.3c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1s-2.4-1.1-4-1c-2.1 0-4 1.2-5 3-2.2 3.8-.6 9.4 1.5 12.5 1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.2-1s2.5 1 4.2 1c1.7 0 2.8-1.5 3.9-3 1.2-1.7 1.7-3.4 1.7-3.5-.1-.1-3.3-1.3-3.3-5.2zM15.2 5c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.9-3.7 1.9-.8.9-1.6 2.4-1.4 3.9 1.4.1 2.9-.7 3.8-1.7z"
  }));
}
function GoogleMark({
  size = 20
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z",
    fill: "#4285F4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z",
    fill: "#34A853"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.42 3.46 1.18 4.95l3.66-2.84Z",
    fill: "#FBBC05"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z",
    fill: "#EA4335"
  }));
}

/* Apple Pay — uses the real wordmark PNG asset (inlined as data URI by app-logo-asset.js). */
function ApplePayLogo({
  height = 22
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: window.__APPLE_PAY_LOGO,
    alt: "Apple Pay",
    style: {
      height,
      width: 'auto',
      display: 'block',
      objectFit: 'contain'
    }
  });
}

/* Mada — Saudi national payment brand. Inline SVG wordmark with their
   signature blue + green color stack. */
function MadaLogo({
  height = 22
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 110 40",
    style: {
      height,
      width: 'auto',
      display: 'block'
    },
    xmlns: "http://www.w3.org/2000/svg",
    "aria-label": "mada"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "110",
    height: "40",
    rx: "6",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("text", {
    x: "55",
    y: "20",
    textAnchor: "middle",
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "15",
    fill: "#2D2E83"
  }, "mada"), /*#__PURE__*/React.createElement("rect", {
    x: "20",
    y: "26",
    width: "22",
    height: "3",
    rx: "1.5",
    fill: "#84BD00"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "44",
    y: "26",
    width: "22",
    height: "3",
    rx: "1.5",
    fill: "#F58220"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "68",
    y: "26",
    width: "22",
    height: "3",
    rx: "1.5",
    fill: "#2D2E83"
  }));
}

/* STC Pay — Saudi telecom wallet. Their brand is purple with a curved 'p'. */
function StcPayLogo({
  height = 22
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 110 40",
    style: {
      height,
      width: 'auto',
      display: 'block'
    },
    xmlns: "http://www.w3.org/2000/svg",
    "aria-label": "STC Pay"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "110",
    height: "40",
    rx: "6",
    fill: "#4F008C"
  }), /*#__PURE__*/React.createElement("text", {
    x: "14",
    y: "26",
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "16",
    fill: "#fff"
  }, "stc"), /*#__PURE__*/React.createElement("text", {
    x: "48",
    y: "26",
    fontFamily: "Inter, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "16",
    fill: "#fff",
    fontStyle: "italic"
  }, "pay"));
}

/* Visa wordmark */
function VisaLogo({
  height = 16
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 80 26",
    style: {
      height,
      width: 'auto',
      display: 'block'
    },
    xmlns: "http://www.w3.org/2000/svg",
    "aria-label": "Visa"
  }, /*#__PURE__*/React.createElement("text", {
    x: "40",
    y: "20",
    textAnchor: "middle",
    fontFamily: "Inter, Arial, sans-serif",
    fontStyle: "italic",
    fontWeight: "900",
    fontSize: "22",
    fill: "#1A1F71"
  }, "VISA"));
}
Object.assign(window, {
  AppleMark,
  GoogleMark,
  ApplePayLogo,
  MadaLogo,
  StcPayLogo,
  VisaLogo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-brand-icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-data.js
try { (() => {
/* Mock data for the Home Beauty client app UI kit. */
window.NSData = {
  area: 'حي الياسمين، الرياض',
  specialties: [{
    key: 'makeup',
    label: 'ميك أب',
    icon: 'palette'
  }, {
    key: 'hair',
    label: 'شعر',
    icon: 'content_cut'
  }, {
    key: 'nails',
    label: 'أظافر',
    icon: 'back_hand'
  }, {
    key: 'skin',
    label: 'عناية بالبشرة',
    icon: 'spa'
  }, {
    key: 'henna',
    label: 'حنّاء',
    icon: 'format_paint'
  }, {
    key: 'bridal',
    label: 'عرايس',
    icon: 'face_retouching_natural'
  }],
  // Real photography from Unsplash (CDN hot-link). Falls back to initials/gradient if a URL 404s.
  providers: [{
    id: 'p1',
    name: 'لطيفة العتيبي',
    specialty: 'ميك أب · عناية بالبشرة',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    portfolio: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80', 'https://images.unsplash.com/photo-1522335789203-aaa2f6ee3eaf?w=500&q=80', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80', 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=500&q=80'],
    rating: 4.9,
    reviews: 214,
    distance: '٢٫٣ كم',
    premium: true,
    premiumLabel: 'ذهبي',
    area: 'حي الياسمين',
    bio: 'خبيرة تجميل معتمدة بخبرة ٨ سنوات في مكياج السهرات والعرايس. أستخدم منتجات عالمية تدوم طوال المناسبة.',
    services: [{
      id: 's1',
      name: 'ميك أب سهرة',
      desc: 'إطلالة كاملة تدوم طوال المناسبة بأجود المنتجات العالمية',
      price: 250,
      duration: '٦٠ دقيقة',
      durationMin: 60
    }, {
      id: 's2',
      name: 'ميك أب عروس',
      desc: 'باقة العروس الكاملة: مكياج، تسريحة، وبروفة قبل اليوم',
      price: 850,
      duration: '١٨٠ دقيقة',
      durationMin: 180
    }, {
      id: 's3',
      name: 'مكياج ناعم نهاري',
      desc: 'لمسة طبيعية مناسبة للدوام والمناسبات النهارية',
      price: 180,
      duration: '٤٥ دقيقة',
      durationMin: 45
    }],
    addons: [{
      id: 'a1',
      name: 'تركيب رموش',
      price: 60
    }, {
      id: 'a2',
      name: 'تسريحة شعر',
      price: 120
    }],
    reviewsList: [{
      name: 'ريم ا.',
      rating: 5,
      text: 'احترافية عالية والنتيجة فاقت توقعاتي، التزمت بالموعد تماماً.',
      date: 'قبل ٣ أيام'
    }, {
      name: 'سارة م.',
      rating: 5,
      text: 'مكياج راقٍ ودام طوال الحفلة، أنصح فيها بشدة.',
      date: 'قبل أسبوع'
    }, {
      name: 'هند ع.',
      rating: 4,
      text: 'جميل جداً، بس تأخرت شوي عن الموعد.',
      date: 'قبل أسبوعين'
    }]
  }, {
    id: 'p2',
    name: 'سارة المطيري',
    specialty: 'تصفيف وقص الشعر',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    portfolio: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80', 'https://images.unsplash.com/photo-1554519515-242161756769?w=500&q=80', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80'],
    rating: 4.7,
    reviews: 96,
    distance: '٣٫١ كم',
    premium: false,
    area: 'حي النرجس',
    bio: 'مصففة شعر متخصصة في القصات العصرية والتسريحات.',
    services: [{
      id: 's4',
      name: 'قص وتصفيف',
      desc: 'قص احترافي مع تصفيف يناسب شكل وجهك',
      price: 180,
      duration: '٥٠ دقيقة',
      durationMin: 50
    }, {
      id: 's5',
      name: 'سشوار وتمويج',
      desc: 'تسريحة سشوار مع تمويج ناعم',
      price: 120,
      duration: '٤٠ دقيقة',
      durationMin: 40
    }],
    addons: [{
      id: 'a3',
      name: 'حمام كريم',
      price: 90
    }],
    reviewsList: [{
      name: 'نوف ل.',
      rating: 5,
      text: 'قصة رائعة وذوق عالٍ.',
      date: 'قبل ٥ أيام'
    }, {
      name: 'دانة ك.',
      rating: 4,
      text: 'النتيجة حلوة والتعامل لطيف.',
      date: 'قبل ١٠ أيام'
    }]
  }, {
    id: 'p3',
    name: 'منى الزهراني',
    specialty: 'العناية بالأظافر',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    portfolio: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80', 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&q=80', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&q=80', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80'],
    rating: 4.8,
    reviews: 143,
    distance: '١٫٨ كم',
    premium: true,
    premiumLabel: 'بلاتيني',
    area: 'حي الملقا',
    bio: 'فنية أظافر معتمدة، تركيب وتصميم بأحدث التقنيات.',
    services: [{
      id: 's6',
      name: 'مانيكير وباديكير',
      desc: 'عناية كاملة باليدين والقدمين مع طلاء',
      price: 160,
      duration: '٧٠ دقيقة',
      durationMin: 70
    }, {
      id: 's7',
      name: 'تركيب أظافر جل',
      desc: 'تركيب وتصميم أظافر جل يدوم لأسابيع',
      price: 220,
      duration: '٩٠ دقيقة',
      durationMin: 90
    }],
    addons: [{
      id: 'a4',
      name: 'رسم فني',
      price: 50
    }],
    reviewsList: [{
      name: 'لمى س.',
      rating: 5,
      text: 'إبداع حقيقي، الأظافر صارت تحفة!',
      date: 'قبل يومين'
    }]
  }, {
    id: 'p4',
    name: 'أمل القحطاني',
    specialty: 'حنّاء ونقش',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    portfolio: ['https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&q=80', 'https://images.unsplash.com/photo-1610228291167-19fbc6c2c2a3?w=500&q=80', 'https://images.unsplash.com/photo-1610198327830-f2e3fb1e8b71?w=500&q=80', 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=500&q=80'],
    rating: 4.6,
    reviews: 58,
    distance: '٤٫٢ كم',
    premium: false,
    area: 'حي العقيق',
    unavailable: true,
    bio: 'نقّاشة حنّاء بخبرة في النقش الخليجي والهندي.',
    services: [{
      id: 's8',
      name: 'نقش حنّاء كامل',
      desc: 'نقش لليدين والقدمين بتصاميم مميزة',
      price: 200,
      duration: '٩٠ دقيقة',
      durationMin: 90
    }],
    addons: [],
    reviewsList: []
  }],
  bookings: [{
    id: 'b1',
    status: 'confirmed',
    service: 'ميك أب سهرة',
    providerName: 'لطيفة العتيبي',
    providerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    date: '٢٩ يونيو ٢٠٢٦',
    time: '٣:٠٠ م',
    address: 'حي الياسمين، الرياض',
    price: 250,
    scope: 'upcoming',
    providerId: 'p1',
    serviceId: 's1'
  }, {
    id: 'b2',
    status: 'on_the_way',
    service: 'مانيكير وباديكير',
    providerName: 'منى الزهراني',
    providerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    date: 'اليوم',
    time: '٥:٣٠ م',
    address: 'حي الياسمين، الرياض',
    price: 160,
    scope: 'upcoming',
    providerId: 'p3',
    serviceId: 's6'
  }, {
    id: 'b3',
    status: 'completed',
    service: 'قص وتصفيف',
    providerName: 'سارة المطيري',
    providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    date: '١٠ يونيو ٢٠٢٦',
    time: '١:٠٠ م',
    address: 'حي الياسمين، الرياض',
    price: 180,
    scope: 'past',
    providerId: 'p2',
    serviceId: 's4'
  }, {
    id: 'b4',
    status: 'cancelled_by_client',
    service: 'سشوار وتمويج',
    providerName: 'سارة المطيري',
    providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    date: '٢ يونيو ٢٠٢٦',
    time: '١١:٠٠ ص',
    address: 'حي الياسمين، الرياض',
    price: 120,
    scope: 'past',
    providerId: 'p2',
    serviceId: 's5'
  }],
  notifications: [{
    id: 'n1',
    type: 'success',
    icon: 'check_circle',
    title: 'تم تأكيد حجزكِ',
    body: 'لطيفة العتيبي أكّدت موعد ميك أب السهرة يوم الإثنين ٢٩ يونيو ٣:٠٠ م',
    time: 'قبل ٥ دقائق',
    unread: true
  }, {
    id: 'n2',
    type: 'info',
    icon: 'directions_car',
    title: 'المقدّمة في الطريق',
    body: 'منى الزهراني في طريقها إليكِ — تصل خلال ١٥ دقيقة',
    time: 'قبل ١٢ دقيقة',
    unread: true
  }, {
    id: 'n3',
    type: 'warning',
    icon: 'event_repeat',
    title: 'تذكير: حجزكِ غداً',
    body: 'سيبدأ موعدكِ مع لطيفة العتيبي خلال ٢٤ ساعة',
    time: 'قبل ساعة',
    unread: true
  }, {
    id: 'n4',
    type: 'info',
    icon: 'star',
    title: 'لا تنسي تقييم زيارتكِ الأخيرة',
    body: 'كيف كانت تجربتكِ مع سارة المطيري؟',
    time: 'قبل يومين',
    unread: false
  }, {
    id: 'n5',
    type: 'success',
    icon: 'card_giftcard',
    title: 'خصم ١٥٪ على أوّل حجز عرايس',
    body: 'سارية حتى ٣٠ يونيو',
    time: 'قبل ٣ أيام',
    unread: false
  }],
  chats: [{
    id: 'c1',
    providerId: 'p1',
    name: 'لطيفة العتيبي',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    last: 'تمام، سأصل عند الساعة ٣:٠٠ م كما هو مجدول 💕',
    time: '٢:٤٠ م',
    unread: 2,
    online: true,
    messages: [{
      from: 'me',
      text: 'السلام عليكم، حجزت معكِ ميك أب لسهرة الإثنين',
      time: '٢:٢١ م'
    }, {
      from: 'them',
      text: 'وعليكم السلام أهلاً وسهلاً، نوّرتِ. كل شي جاهز للموعد.',
      time: '٢:٣٥ م'
    }, {
      from: 'me',
      text: 'تمام، أحب الستايل الناعم — هل تحتاجين أي شي إضافي؟',
      time: '٢:٣٧ م'
    }, {
      from: 'them',
      text: 'تمام، سأصل عند الساعة ٣:٠٠ م كما هو مجدول 💕',
      time: '٢:٤٠ م'
    }]
  }, {
    id: 'c2',
    providerId: 'p3',
    name: 'منى الزهراني',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    last: 'أنا في الطريق — وصلت لحي الياسمين تقريباً',
    time: '٥:١٥ م',
    unread: 0,
    online: true,
    messages: []
  }, {
    id: 'c3',
    providerId: 'p2',
    name: 'سارة المطيري',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    last: 'شكراً لكِ على التقييم 🌸',
    time: 'أمس',
    unread: 0,
    online: false,
    messages: []
  }],
  premium: {
    plans: [{
      id: 'm',
      name: 'شهري',
      price: 49,
      period: 'شهر',
      save: null
    }, {
      id: 'y',
      name: 'سنوي',
      price: 399,
      period: 'سنة',
      save: 'وفّري ٣٢٪',
      featured: true
    }],
    perks: [{
      icon: 'local_offer',
      title: 'خصم ١٠٪ على كل حجز',
      body: 'بدون حد أدنى، يطبّق تلقائياً قبل الدفع.'
    }, {
      icon: 'verified',
      title: 'مقدّمات معتمدة فقط',
      body: 'وصول حصري لأفضل المقدّمات المميّزات.'
    }, {
      icon: 'priority_high',
      title: 'أولوية في الحجز',
      body: 'فرص حجز في أوقات الذروة قبل الجميع.'
    }, {
      icon: 'redeem',
      title: 'كاش باك ٥٪',
      body: 'يُعاد للمحفظة بعد كل حجز مكتمل.'
    }, {
      icon: 'support_agent',
      title: 'دعم مخصّص ٢٤/٧',
      body: 'فريق متخصّص لأعضاء بريميوم.'
    }]
  },
  paymentMethods: [{
    id: 'pm1',
    label: 'مدى',
    sub: 'البنك الأهلي السعودي',
    last4: '٤٢١٨',
    icon: 'credit_card',
    brand: 'mada',
    default: true
  }, {
    id: 'pm2',
    label: 'Apple Pay',
    sub: 'iPhone — وجه ID',
    last4: '',
    icon: 'apple',
    brand: 'apple'
  }, {
    id: 'pm3',
    label: 'STC Pay',
    sub: 'محفظة',
    last4: '٧٧٦٦',
    icon: 'account_balance_wallet',
    brand: 'stcpay'
  }],
  slots: {
    morning: ['٩:٠٠ ص', '١٠:٠٠ ص', '١١:٠٠ ص'],
    afternoon: ['١:٠٠ م', '٢:٠٠ م', '٣:٠٠ م', '٤:٠٠ م'],
    evening: ['٦:٠٠ م', '٧:٠٠ م', '٨:٠٠ م']
  },
  days: [{
    d: 'الأحد',
    n: '٢٨'
  }, {
    d: 'الإثنين',
    n: '٢٩'
  }, {
    d: 'الثلاثاء',
    n: '٣٠'
  }, {
    d: 'الأربعاء',
    n: '١'
  }, {
    d: 'الخميس',
    n: '٢'
  }, {
    d: 'الجمعة',
    n: '٣'
  }, {
    d: 'السبت',
    n: '٤'
  }],
  addresses: [{
    id: 'ad1',
    label: 'المنزل',
    text: 'حي الياسمين، شارع الأمير، الرياض',
    default: true
  }, {
    id: 'ad2',
    label: 'العمل',
    text: 'حي العليا، برج المملكة، الرياض',
    default: false
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-data.js", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-logo-asset.js
try { (() => {
window.__BRAND_LOGO = 'data:image/png;base64,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';
window.__APPLE_PAY_LOGO = 'data:image/png;base64,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';
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-logo-asset.js", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-account.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Account screens: Bookings list, Profile */
const DS_A = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;
function BookingsScreen({
  nav,
  bookings
}) {
  const {
    AppBar,
    BookingCard,
    EmptyState,
    Button,
    Chip
  } = DS_A;
  const [tab, setTab] = React.useState('upcoming');
  const list = bookings.filter(b => b.scope === tab);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u062D\u062C\u0648\u0632\u0627\u062A\u064A",
    raised: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      padding: '0 var(--space-4) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    selected: tab === 'upcoming',
    onClick: () => setTab('upcoming')
  }, "\u0627\u0644\u0642\u0627\u062F\u0645\u0629"), /*#__PURE__*/React.createElement(Chip, {
    selected: tab === 'past',
    onClick: () => setTab('past')
  }, "\u0627\u0644\u0633\u0627\u0628\u0642\u0629")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: '0 var(--space-4) var(--space-7)'
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: tab === 'upcoming' ? 'event_busy' : 'history',
    title: tab === 'upcoming' ? 'لا حجوزات قادمة' : 'لا حجوزات سابقة',
    cta: tab === 'upcoming' ? 'تصفّحي الخدمات' : undefined,
    onCta: () => nav('home')
  }, tab === 'upcoming' ? 'ابدئي بحجز خدمتك الأولى' : 'حجوزاتك المكتملة ستظهر هنا') : list.map(b => /*#__PURE__*/React.createElement(BookingCard, _extends({
    key: b.id
  }, b, {
    onClick: () => nav('booking-detail', {
      id: b.id
    }),
    actions: b.status === 'completed' ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: e => {
        e.stopPropagation && e.stopPropagation();
        nav('rate', {
          bookingId: b.id
        });
      }
    }, "\u062A\u0642\u064A\u064A\u0645") : b.status === 'confirmed' || b.status === 'on_the_way' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "\u0625\u0644\u063A\u0627\u0621"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "\u0625\u0639\u0627\u062F\u0629 \u062C\u062F\u0648\u0644\u0629")) : null
  })))));
}
function ProfileScreen({
  nav
}) {
  const {
    AppBar,
    Avatar,
    Button,
    ListItem,
    Icon
  } = DS_A;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u062D\u0633\u0627\u0628\u064A",
    raised: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "\u0631\u064A\u0645 \u0627\u0644\u0634\u0645\u0631\u064A",
    size: "xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0631\u064A\u0645 \u0627\u0644\u0634\u0645\u0631\u064A"), /*#__PURE__*/React.createElement("span", {
    className: "ns-ltr",
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "+966 5X XXX XXXX"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    leadingIcon: "edit"
  }, "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      borderTop: '1px solid var(--border-default)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, [['location_on', 'العناوين المحفوظة', '٢ عناوين', 'addresses'], ['credit_card', 'طرق الدفع', 'مدى •••• ٤٢١٨', 'payment-methods'], ['favorite', 'المفضّلة', '٣ مقدّمات', 'favorites'], ['notifications', 'الإشعارات', 'مفعّلة', 'notifications'], ['chat_bubble', 'المحادثات', '', 'chats'], ['help', 'الدعم والمساعدة', '', 'support'], ['settings', 'الإعدادات', '', 'settings']].map((row, i, arr) => /*#__PURE__*/React.createElement(ListItem, {
    key: row[1],
    leadingIcon: row[0],
    title: row[1],
    trailing: row[2] && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
        color: 'var(--text-secondary)'
      }
    }, row[2]),
    chevron: true,
    divider: i < arr.length - 1,
    onClick: () => nav(row[3])
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
      color: '#fff',
      margin: 'var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: 'pointer'
    },
    onClick: () => nav('premium')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--secondary-500)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workspace_premium",
    size: "md",
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-bold) var(--type-h3-size)/1.2 var(--font-base)'
    }
  }, "\u0627\u0646\u0636\u0645\u064A \u0644\u0628\u0631\u064A\u0645\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      opacity: 0.9
    }
  }, "\u062E\u0635\u0645 \u0661\u0660\u066A \u0639\u0644\u0649 \u0643\u0644 \u062D\u062C\u0632 + \u0643\u0627\u0634 \u0628\u0627\u0643 \u0665\u066A")), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron_left",
    size: "sm",
    mirror: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(ListItem, {
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'var(--secondary-100)',
        color: 'var(--secondary-700)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "store",
      size: "sm",
      fill: true
    })),
    title: "\u0643\u0648\u0646\u064A \u0645\u0642\u062F\u0651\u0645\u0629 \u062E\u062F\u0645\u0629",
    subtitle: "\u0627\u0628\u062F\u0626\u064A \u0627\u0644\u0639\u0645\u0644 \u0648\u0627\u0633\u062A\u0642\u0628\u0644\u064A \u062D\u062C\u0648\u0632\u0627\u062A\u0643",
    chevron: true,
    onClick: () => nav('provider-setup', {
      role: 'provider',
      via: 'phone'
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    fullWidth: true,
    leadingIcon: "logout",
    style: {
      color: 'var(--error-500)'
    }
  }, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C")));
}
Object.assign(window, {
  BookingsScreen,
  ProfileScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-account.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-booking.jsx
try { (() => {
/* Booking flow screens: BookingCreate, ReviewPay, Confirmation */
const DS_B = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;
function BookingCreateScreen({
  nav,
  provider,
  service,
  addresses,
  slotsData,
  days,
  total
}) {
  const {
    AppBar,
    ListItem,
    Icon,
    Button,
    Chip,
    Banner
  } = DS_B;
  const [addr, setAddr] = React.useState(addresses[0].id);
  const [day, setDay] = React.useState(1);
  const [slot, setSlot] = React.useState('٣:٠٠ م');
  const ok = addr && slot;
  const slotGrid = (group, list, labelKey) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-overline-weight) var(--type-overline-size)/1 var(--font-base)',
      letterSpacing: '.06em',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-2)'
    }
  }, labelKey), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-2)'
    }
  }, list.map(t => {
    const sel = slot === t;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => setSlot(t),
      style: {
        height: 40,
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${sel ? 'var(--primary-300)' : 'var(--border-default)'}`,
        background: sel ? 'var(--bg-tint)' : 'var(--bg-surface)',
        color: sel ? 'var(--primary-700)' : 'var(--text-primary)',
        font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)',
        cursor: 'pointer'
      }
    }, t);
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0627\u062D\u062C\u0632\u064A \u0645\u0648\u0639\u062F\u0643",
    raised: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 'var(--space-5)'
    }
  }, addresses.map((a, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: a.id,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `2px solid ${addr === a.id ? 'var(--primary-500)' : 'var(--border-strong)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, addr === a.id && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: 'var(--primary-500)'
      }
    })),
    title: a.label,
    subtitle: a.text,
    divider: i < addresses.length,
    onClick: () => setAddr(a.id)
  })), /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "add_location_alt",
    title: "\u0623\u0636\u064A\u0641\u064A \u0639\u0646\u0648\u0627\u0646\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B",
    chevron: true,
    onClick: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      marginBottom: 'var(--space-5)'
    }
  }, days.map((d, i) => {
    const sel = day === i;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setDay(i),
      style: {
        flexShrink: 0,
        width: 64,
        height: 76,
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
        background: sel ? 'var(--primary-500)' : 'var(--bg-surface-raised)',
        color: sel ? '#fff' : 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
        opacity: 0.85
      }
    }, d.d), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) 22px/1 var(--font-base)'
      }
    }, d.n));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-3)'
    }
  }, "\u0627\u0644\u0648\u0642\u062A"), slotGrid('morning', slotsData.morning, 'الصباح'), slotGrid('afternoon', slotsData.afternoon, 'الظهر'), slotGrid('evening', slotsData.evening, 'المساء'), /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "info",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "\u0627\u0644\u0645\u062F\u0629 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A\u0629 ", service.duration, " \u2014 \u062A\u0638\u0647\u0631 \u0641\u0642\u0637 \u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0644\u0644\u0645\u062F\u0651\u0629 \u0627\u0644\u0643\u0627\u0645\u0644\u0629.")), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, days[day].d, " ", days[day].n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.2 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u0644\u0633\u0627\u0639\u0629 ", slot)), /*#__PURE__*/React.createElement(Button, {
    disabled: !ok,
    onClick: () => nav('review', {
      id: provider.id,
      serviceId: service.id,
      total,
      day: days[day],
      slot,
      addr
    })
  }, "\u0645\u062A\u0627\u0628\u0639\u0629"))));
}
function ReviewPayScreen({
  nav,
  provider,
  service,
  total,
  day,
  slot,
  addrText
}) {
  const {
    AppBar,
    Avatar,
    Icon,
    Money,
    Banner,
    Button,
    ListItem
  } = DS_B;
  const [method, setMethod] = React.useState('mada');
  const [paying, setPaying] = React.useState(false);
  const travel = 15;
  const grand = total + travel;
  const methods = [{
    id: 'mada',
    label: 'مدى',
    sub: '•••• ٤٢١٨',
    icon: 'credit_card'
  }, {
    id: 'apple',
    label: 'Apple Pay',
    sub: 'iPhone',
    icon: 'apple'
  }, {
    id: 'stc',
    label: 'STC Pay',
    sub: 'محفظة',
    icon: 'account_balance_wallet'
  }, {
    id: 'add',
    label: 'إضافة بطاقة',
    sub: 'مدى / Visa / Mastercard',
    icon: 'add'
  }];
  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      nav('confirmed', {
        id: provider.id,
        serviceId: service.id,
        total: grand,
        day,
        slot,
        addrText
      });
    }, 1200);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0645\u0631\u0627\u062C\u0639\u0629 \u0648\u062F\u0641\u0639",
    raised: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: provider.name,
    size: "md",
    premium: provider.premium
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, service.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, provider.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "event",
    size: "sm"
  }), day.d, " ", day.n, " \u064A\u0648\u0646\u064A\u0648 \xB7 ", slot), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "sm"
  }), addrText), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "schedule",
    size: "sm"
  }), service.duration))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0633\u0639\u0631"), [['الخدمة', total - travel - (total - service.price - travel)], ['إضافات', total - service.price], ['رسوم الانتقال', travel]].filter(r => r[1] > 0).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, k), /*#__PURE__*/React.createElement(Money, {
    amount: v
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement(Money, {
    amount: grand,
    emphasis: "lg"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)',
      margin: 'var(--space-5) 0 var(--space-2)'
    }
  }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, methods.map((m, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: m.id,
    divider: i < methods.length - 1,
    leading: /*#__PURE__*/React.createElement(Icon, {
      name: m.icon,
      size: "sm",
      color: method === m.id ? 'var(--primary-500)' : 'var(--text-secondary)'
    }),
    title: m.label,
    subtitle: m.sub,
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: `2px solid ${method === m.id ? 'var(--primary-500)' : 'var(--border-strong)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, method === m.id && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--primary-500)'
      }
    })),
    onClick: () => setMethod(m.id)
  }))), /*#__PURE__*/React.createElement(Banner, {
    variant: "warning",
    icon: "lock",
    style: {
      marginTop: 'var(--space-4)'
    },
    title: "\u0633\u064A\u064F\u062D\u062C\u0632 \u0627\u0644\u0645\u0628\u0644\u063A \u0648\u0644\u0646 \u064A\u064F\u062E\u0635\u0645"
  }, "\u064A\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0644\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u0628\u0639\u062F \u0627\u0643\u062A\u0645\u0627\u0644 \u0627\u0644\u062E\u062F\u0645\u0629 \u0641\u0642\u0637 (\u0646\u0638\u0627\u0645 \u0627\u0644\u062D\u0645\u0627\u064A\u0629)."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      marginTop: 'var(--space-3)',
      textAlign: 'center'
    }
  }, "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0625\u0644\u063A\u0627\u0621: \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0643\u0627\u0645\u0644 \u0642\u0628\u0644 \u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u0623\u0648 \u0642\u0628\u0644 \u0662\u0664 \u0633\u0627\u0639\u0629 \xB7 \u0665\u0660\u066A \u0642\u0628\u0644 \u0666\u2013\u0662\u0664 \u0633\u0627\u0639\u0629 \xB7 \u0644\u0627 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0642\u0628\u0644 \u0623\u0642\u0644 \u0645\u0646 \u0666 \u0633\u0627\u0639\u0627\u062A.")), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    loading: paying,
    leadingIcon: "lock",
    onClick: pay
  }, "\u0627\u062F\u0641\u0639\u064A \u0648\u0623\u0643\u0651\u062F\u064A \u0627\u0644\u062D\u062C\u0632 \xB7 ", grand, " \u0631.\u0633")));
}
function ConfirmationScreen({
  nav,
  provider,
  service,
  total,
  day,
  slot,
  addrText
}) {
  const {
    AppBar,
    Icon,
    StatusChip,
    Banner,
    Money,
    Button,
    Avatar
  } = DS_B;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062D\u062C\u0632"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-7) var(--space-5)',
      background: 'var(--bg-tint)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: '50%',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--success-500)',
      boxShadow: 'var(--elevation-3)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check_circle",
    size: 64,
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)',
      textAlign: 'center'
    }
  }, "\u062A\u0645 \u062D\u062C\u0632 \u0645\u0648\u0639\u062F\u0643"), /*#__PURE__*/React.createElement(StatusChip, {
    status: "pending_provider",
    label: "\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0629"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      maxWidth: 280
    }
  }, "\u0633\u0646\u0630\u0643\u0651\u0631\u0643 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0639\u062F \u0628\u0640\u0662\u0664 \u0633\u0627\u0639\u0629 \u0648\u0642\u0628\u0644 \u0633\u0627\u0639\u062A\u064A\u0646\u060C \u0648\u0633\u062A\u0635\u0644\u0643 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0628\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u062C\u0632.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: provider.name,
    size: "md",
    premium: provider.premium
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, service.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, provider.name)), /*#__PURE__*/React.createElement(Money, {
    amount: total
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "event",
    size: "sm"
  }), day.d, " ", day.n, " \u064A\u0648\u0646\u064A\u0648 \xB7 ", slot), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "sm"
  }), addrText))), /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "qr_code",
    title: "\u0631\u0645\u0632 \u0627\u0644\u062F\u062E\u0648\u0644",
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "\u0633\u064A\u0638\u0647\u0631 \u0631\u0645\u0632 QR \u0644\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u0639\u0646\u062F \u0648\u0635\u0648\u0644\u0647\u0627 \u2014 \u062A\u0623\u0643\u064A\u062F \u062F\u062E\u0648\u0644 \u0622\u0645\u0646."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => nav('home')
  }, "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('bookings')
  }, "\u0639\u0631\u0636 \u0627\u0644\u062D\u062C\u0632"))));
}
Object.assign(window, {
  BookingCreateScreen,
  ReviewPayScreen,
  ConfirmationScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-booking.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-discover.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Discovery screens: Home, Provider Profile, Service Detail */
const DS = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;
function Hero({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-tint)',
      padding: 'var(--space-4) var(--space-4) var(--space-5)'
    }
  }, children);
}
function SectionHeader({
  children,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-4)',
      marginTop: 'var(--space-5)',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, children), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--action-primary)',
      font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)',
      cursor: 'pointer'
    }
  }, action));
}
function HomeScreen({
  nav,
  data,
  fav,
  toggleFav
}) {
  const {
    AppBar,
    SearchBar,
    Chip,
    ProviderCard,
    Icon,
    IconButton,
    Badge
  } = DS;
  const [spec, setSpec] = React.useState(null);
  const list = data.providers;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "sm",
    fill: true,
    color: "var(--primary-500)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-base)'
    }
  }, data.area), /*#__PURE__*/React.createElement(Icon, {
    name: "expand_more",
    size: "sm",
    color: "var(--text-secondary)"
  })), /*#__PURE__*/React.createElement(Badge, {
    count: 3
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "notifications",
    label: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A",
    onClick: () => nav('notifications')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 4
    }
  }, "\u0623\u0647\u0644\u0627\u064B \u0631\u064A\u0645 \uD83C\uDF38"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      marginBottom: 'var(--space-4)'
    }
  }, "\u0627\u0628\u062D\u062B\u064A \u0639\u0646 \u0645\u0642\u062F\u0651\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0644\u0643\u0650"), /*#__PURE__*/React.createElement(SearchBar, {
    value: "",
    onChange: () => {},
    placeholder: "\u0627\u0628\u062D\u062B\u064A \u0639\u0646 \u062E\u062F\u0645\u0629 \u0623\u0648 \u0645\u0642\u062F\u0651\u0645\u0629",
    onFilter: () => {}
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      overflowX: 'auto',
      padding: 'var(--space-4)',
      scrollbarWidth: 'none'
    }
  }, data.specialties.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.key,
    onClick: () => setSpec(spec === s.key ? null : s.key),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      flexShrink: 0,
      width: 68
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: spec === s.key ? 'var(--primary-500)' : 'var(--bg-tint)',
      color: spec === s.key ? '#fff' : 'var(--primary-500)',
      transition: 'all .15s'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: "lg",
    fill: spec === s.key
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--type-caption-size)/1.2 var(--font-base)',
      color: 'var(--text-primary)',
      textAlign: 'center'
    }
  }, s.label)))), /*#__PURE__*/React.createElement(SectionHeader, null, "\u0645\u0642\u062F\u0651\u0645\u0627\u062A \u0642\u0631\u064A\u0628\u0629 \u0645\u0646\u0643\u0650"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: '0 var(--space-4) var(--space-6)'
    }
  }, list.map(p => /*#__PURE__*/React.createElement(ProviderCard, _extends({
    key: p.id
  }, p, {
    favorite: !!fav[p.id],
    onClick: () => nav('provider', {
      id: p.id
    }),
    onToggleFavorite: () => toggleFav(p.id)
  })))));
}
function ProviderScreen({
  nav,
  provider,
  fav,
  toggleFav
}) {
  const {
    AppBar,
    Avatar,
    RatingStars,
    Icon,
    IconButton,
    ServiceCard,
    ListItem,
    Button,
    Money
  } = DS;
  const [tab, setTab] = React.useState('services');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "",
    raised: true,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
      icon: "ios_share",
      label: "\u0645\u0634\u0627\u0631\u0643\u0629"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "favorite",
      label: "\u0645\u0641\u0636\u0651\u0644\u0629",
      active: !!fav[provider.id],
      onClick: () => toggleFav(provider.id),
      style: {
        color: fav[provider.id] ? 'var(--primary-500)' : 'var(--text-secondary)'
      }
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-4) var(--space-4) var(--space-5)',
      background: 'var(--bg-tint)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: provider.name,
    size: "xl",
    premium: provider.premium
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, provider.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, provider.specialty), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(RatingStars, {
    value: provider.rating,
    count: provider.reviews,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "xs"
  }), provider.area, " \xB7 ", provider.distance)), provider.premium && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      paddingInline: 10,
      height: 24,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--secondary-100)',
      color: 'var(--secondary-700)',
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workspace_premium",
    size: "xs",
    fill: true
  }), "\u0645\u0642\u062F\u0651\u0645\u0629 \u0645\u0645\u064A\u0651\u0632\u0629 \xB7 ", provider.premiumLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      marginBottom: 'var(--space-3)',
      color: 'var(--text-primary)'
    }
  }, "\u0645\u0639\u0631\u0636 \u0627\u0644\u0623\u0639\u0645\u0627\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }
  }, (provider.portfolio || []).map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 130,
      height: 130,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      padding: '0 var(--space-4)',
      marginBottom: 'var(--space-3)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u0644\u062E\u062F\u0645\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: '0 var(--space-4)'
    }
  }, provider.services.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.id
  }, s, {
    onBook: () => nav('service', {
      id: provider.id,
      serviceId: s.id
    })
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      padding: '0 var(--space-4)',
      margin: 'var(--space-5) 0 var(--space-3)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 var(--space-4) var(--space-6)'
    }
  }, provider.reviewsList.length === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)'
    }
  }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0628\u0639\u062F"), provider.reviewsList.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) 0',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--type-body-size)/1.4 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-disabled)'
    }
  }, r.date)), /*#__PURE__*/React.createElement(RatingStars, {
    value: r.rating,
    size: "xs",
    showValue: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, r.text))))), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leadingIcon: "chat_bubble",
    onClick: () => nav('chat-by-provider', {
      providerId: provider.id
    })
  }, "\u0645\u0631\u0627\u0633\u0644\u0629"), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('service', {
      id: provider.id,
      serviceId: provider.services[0].id
    })
  }, "\u0627\u062D\u062C\u0632\u064A \u0627\u0644\u0622\u0646"))));
}
function ServiceScreen({
  nav,
  provider,
  service
}) {
  const {
    AppBar,
    Icon,
    IconButton,
    Money,
    ListItem,
    Button,
    Avatar
  } = DS;
  const [addons, setAddons] = React.useState({});
  const total = service.price + provider.addons.reduce((s, a) => s + (addons[a.id] ? a.price : 0), 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: service.name,
    raised: true,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "favorite",
      label: "\u0645\u0641\u0636\u0651\u0644\u0629"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 200,
      background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-300)',
      overflow: 'hidden'
    }
  }, provider.portfolio && provider.portfolio[0] ? /*#__PURE__*/React.createElement("img", {
    src: provider.portfolio[0],
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "spa",
    size: "xl"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, service.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Money, {
    amount: service.price,
    emphasis: "lg"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: 'var(--text-secondary)',
      font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "schedule",
    size: "sm"
  }), service.duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-lg-weight) var(--type-body-lg-size)/var(--type-body-lg-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, service.desc), provider.addons.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)',
      margin: 'var(--space-5) 0 var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "\u0625\u0636\u0627\u0641\u0627\u062A \u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, provider.addons.map((a, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: a.id,
    divider: i < provider.addons.length - 1,
    leading: /*#__PURE__*/React.createElement("span", {
      onClick: e => {
        e.stopPropagation();
        setAddons(s => ({
          ...s,
          [a.id]: !s[a.id]
        }));
      },
      style: {
        cursor: 'pointer',
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: addons[a.id] ? 'check_box' : 'check_box_outline_blank',
      size: "md",
      fill: !!addons[a.id],
      color: addons[a.id] ? 'var(--primary-500)' : 'var(--text-disabled)'
    })),
    title: a.name,
    trailing: /*#__PURE__*/React.createElement(Money, {
      amount: a.price
    }),
    onClick: () => setAddons(s => ({
      ...s,
      [a.id]: !s[a.id]
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-5)',
      padding: 'var(--space-3)',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: provider.name,
    size: "md",
    premium: provider.premium
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.4 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, provider.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, provider.specialty)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron_left",
    label: "\u0639\u0631\u0636 \u0627\u0644\u0645\u0644\u0641",
    mirror: true,
    onClick: () => nav('provider', {
      id: provider.id
    })
  }))), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement(Money, {
    amount: total,
    emphasis: "lg"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: () => nav('booking', {
      id: provider.id,
      serviceId: service.id,
      total
    })
  }, "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062D\u062C\u0632"))));
}
Object.assign(window, {
  HomeScreen,
  ProviderScreen,
  ServiceScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-discover.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-more.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Additional screens: Notifications, ChatList, Chat, BookingDetail, Rate, Favorites, PaymentMethods, Premium */
const DS_M = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

/* -------- Notifications -------- */
function NotificationsScreen({
  nav,
  notifications
}) {
  const {
    AppBar,
    Icon,
    ListItem,
    EmptyState
  } = DS_M;
  const dot = type => ({
    success: 'var(--success-500)',
    info: 'var(--info-500)',
    warning: 'var(--warning-500)',
    error: 'var(--error-500)'
  })[type] || 'var(--primary-500)';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A",
    raised: true,
    actions: /*#__PURE__*/React.createElement("button", {
      style: {
        border: 'none',
        background: 'transparent',
        color: 'var(--action-primary)',
        font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)',
        cursor: 'pointer',
        padding: '0 12px'
      }
    }, "\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0643\u0644")
  }), notifications.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "notifications_off",
    title: "\u0644\u0627 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0628\u0639\u062F"
  }, "\u0633\u0646\u062E\u0628\u0631\u0643\u0650 \u0647\u0646\u0627 \u0628\u0643\u0644 \u0645\u0627 \u064A\u062E\u0635 \u062D\u062C\u0648\u0632\u0627\u062A\u0643\u0650") : /*#__PURE__*/React.createElement("div", null, notifications.map(n => /*#__PURE__*/React.createElement(ListItem, {
    key: n.id,
    divider: true,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'var(--bg-tint)',
        color: dot(n.type),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: "sm",
      fill: true
    })),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, n.title, n.unread && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--primary-500)'
      }
    })),
    subtitle: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, n.body), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-disabled)',
        font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)'
      }
    }, n.time)),
    style: {
      background: n.unread ? 'var(--bg-tint)' : 'transparent'
    }
  }))));
}

/* -------- Chat list -------- */
function ChatListScreen({
  nav,
  chats
}) {
  const {
    AppBar,
    Avatar,
    Badge,
    EmptyState
  } = DS_M;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0627\u062A"
  }), chats.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "chat_bubble_outline",
    title: "\u0644\u0627 \u0645\u062D\u0627\u062F\u062B\u0627\u062A"
  }, "\u0627\u0628\u062F\u0626\u064A \u0628\u062D\u062C\u0632 \u062E\u062F\u0645\u0629 \u0644\u062A\u0638\u0647\u0631 \u0647\u0646\u0627") : /*#__PURE__*/React.createElement("div", null, chats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => nav('chat', {
      id: c.id
    }),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      width: '100%',
      background: 'transparent',
      border: 'none',
      borderBottom: '1px solid var(--border-default)',
      cursor: 'pointer',
      textAlign: 'start'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: c.image,
    name: c.name,
    size: "md",
    online: c.online
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.4 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: c.unread ? 'var(--action-primary)' : 'var(--text-disabled)'
    }
  }, c.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: c.unread ? 'var(--text-primary)' : 'var(--text-secondary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, c.last), c.unread > 0 && /*#__PURE__*/React.createElement(Badge, {
    count: c.unread
  })))))));
}

/* -------- Chat conversation -------- */
function ChatScreen({
  nav,
  chat
}) {
  const {
    AppBar,
    Avatar,
    Icon,
    IconButton
  } = DS_M;
  const [msgs, setMsgs] = React.useState(chat.messages.length ? chat.messages : [{
    from: 'them',
    text: 'مرحباً 🌸 كيف يمكنني خدمتكِ؟',
    time: 'الآن'
  }]);
  const [draft, setDraft] = React.useState('');
  const send = () => {
    if (!draft.trim()) return;
    setMsgs([...msgs, {
      from: 'me',
      text: draft,
      time: 'الآن'
    }]);
    setDraft('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    raised: true,
    leading: /*#__PURE__*/React.createElement("button", {
      onClick: () => nav('back'),
      style: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        width: 44,
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow_forward",
      size: "md",
      mirror: true
    })),
    title: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: chat.image,
      name: chat.name,
      size: "sm",
      online: chat.online
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-semibold) var(--type-body-size)/1.2 var(--font-base)',
        color: 'var(--text-primary)'
      }
    }, chat.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
        color: chat.online ? 'var(--success-500)' : 'var(--text-secondary)'
      }
    }, chat.online ? 'متصلة الآن' : 'غير متصلة'))),
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "call",
      label: "\u0627\u062A\u0635\u0627\u0644"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 'var(--space-3) var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      overflowY: 'auto',
      background: 'var(--bg-surface)'
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: m.from === 'me' ? 'flex-start' : 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '10px 14px',
      borderRadius: m.from === 'me' ? '16px 16px 6px 16px' : '16px 16px 16px 6px',
      background: m.from === 'me' ? 'var(--action-primary)' : 'var(--bg-canvas)',
      color: m.from === 'me' ? '#fff' : 'var(--text-primary)',
      border: m.from === 'me' ? 'none' : '1px solid var(--border-default)',
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement("div", null, m.text), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) 11px/1 var(--font-base)',
      opacity: 0.7,
      marginTop: 4,
      textAlign: 'end'
    }
  }, m.time))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3) var(--space-3)',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-canvas)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "add_circle",
    label: "\u0625\u0631\u0641\u0627\u0642"
  }), /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    placeholder: "\u0627\u0643\u062A\u0628\u064A \u0631\u0633\u0627\u0644\u0629\u2026",
    onKeyDown: e => e.key === 'Enter' && send(),
    style: {
      flex: 1,
      border: '1px solid var(--border-default)',
      borderRadius: 999,
      outline: 'none',
      padding: '10px 16px',
      background: 'var(--bg-surface)',
      font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "send",
    label: "\u0625\u0631\u0633\u0627\u0644",
    mirror: true,
    variant: "filled",
    onClick: send
  })));
}

/* -------- Booking detail (timeline + actions) -------- */
function BookingDetailScreen({
  nav,
  booking
}) {
  const {
    AppBar,
    Avatar,
    IconButton,
    StatusChip,
    Banner,
    Money,
    Button,
    Icon,
    ListItem
  } = DS_M;
  const steps = [{
    key: 'pending_provider',
    label: 'تأكيد الحجز'
  }, {
    key: 'confirmed',
    label: 'مؤكّد'
  }, {
    key: 'on_the_way',
    label: 'في الطريق'
  }, {
    key: 'in_progress',
    label: 'جارٍ التنفيذ'
  }, {
    key: 'completed',
    label: 'مكتمل'
  }];
  const order = steps.map(s => s.key);
  const idx = Math.max(0, order.indexOf(booking.status));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062D\u062C\u0632",
    raised: true,
    actions: /*#__PURE__*/React.createElement(IconButton, {
      icon: "more_horiz",
      label: "\u0627\u0644\u0645\u0632\u064A\u062F"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    status: booking.status
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0631\u0642\u0645 \u0627\u0644\u062D\u062C\u0632 #", booking.id)), booking.status === 'on_the_way' && /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "directions_car",
    title: "\u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u0641\u064A \u0627\u0644\u0637\u0631\u064A\u0642 \u0625\u0644\u064A\u0643\u0650"
  }, "\u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0645\u062A\u0648\u0642\u0651\u0639 \u062E\u0644\u0627\u0644 \u0661\u0665 \u062F\u0642\u064A\u0642\u0629 \u2014 \u064A\u0645\u0643\u0646\u0643\u0650 \u0645\u062A\u0627\u0628\u0639\u062A\u0647\u0627 \u0623\u0648 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629."), booking.status === 'confirmed' && /*#__PURE__*/React.createElement(Banner, {
    variant: "success",
    icon: "check_circle"
  }, "\u0645\u0642\u062F\u0651\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0629 \u0623\u0643\u0651\u062F\u062A \u0645\u0648\u0639\u062F\u0643\u0650 \u2014 \u0633\u0646\u0630\u0643\u0651\u0631\u0643\u0650 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0639\u062F."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)'
    }
  }, steps.map((s, i) => {
    const done = i <= idx;
    const active = i === idx;
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'flex-start',
        paddingBlock: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: done ? 'var(--primary-500)' : 'var(--neutral-200)',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, done ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: "xs"
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--neutral-400)'
      }
    })), i < steps.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 2,
        flex: 1,
        minHeight: 16,
        background: done && i < idx ? 'var(--primary-500)' : 'var(--neutral-200)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        paddingBottom: 'var(--space-1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: `var(--weight-${active ? 'semibold' : 'medium'}) var(--type-body-size)/1.4 var(--font-base)`,
        color: done ? 'var(--text-primary)' : 'var(--text-disabled)'
      }
    }, s.label), active && /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
        color: 'var(--text-secondary)'
      }
    }, "\u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629")));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: booking.providerImage,
    name: booking.providerName,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, booking.service), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, booking.providerName))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      color: 'var(--text-secondary)',
      font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "event",
    size: "sm"
  }), booking.date, " \xB7 ", booking.time), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      color: 'var(--text-secondary)',
      font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "sm"
  }), booking.address)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /*#__PURE__*/React.createElement(Money, {
    amount: booking.price,
    emphasis: "lg"
  }))), (booking.status === 'confirmed' || booking.status === 'on_the_way') && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      background: '#fff',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "qr_code_2",
    size: 64
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0631\u0645\u0632 \u0627\u0644\u062F\u062E\u0648\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0623\u0638\u0647\u0631\u064A \u0627\u0644\u0631\u0645\u0632 \u0644\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u0639\u0646\u062F \u0648\u0635\u0648\u0644\u0647\u0627 \u0644\u0644\u062A\u062D\u0642\u0651\u0642.")))), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    leadingIcon: "chat_bubble",
    onClick: () => nav('chat-by-provider', {
      providerId: booking.providerId
    })
  }, "\u0645\u0631\u0627\u0633\u0644\u0629"), booking.status === 'completed' ? /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    leadingIcon: "star",
    onClick: () => nav('rate', {
      bookingId: booking.id
    })
  }, "\u062A\u0642\u064A\u064A\u0645") : booking.status.startsWith('cancelled') ? /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "secondary",
    onClick: () => nav('home')
  }, "\u0627\u062D\u062C\u0632\u064A \u0645\u062C\u062F\u062F\u0627\u064B") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      color: 'var(--error-500)'
    },
    onClick: () => nav('cancel-booking', {
      id: booking.id
    })
  }, "\u0625\u0644\u063A\u0627\u0621"), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "secondary",
    leadingIcon: "event_repeat"
  }, "\u0625\u0639\u0627\u062F\u0629 \u062C\u062F\u0648\u0644\u0629")))));
}

/* -------- Rate & review -------- */
function RateScreen({
  nav,
  booking
}) {
  const {
    AppBar,
    Avatar,
    RatingStars,
    TextInput,
    Button,
    Chip
  } = DS_M;
  const [rating, setRating] = React.useState(5);
  const [tags, setTags] = React.useState({
    time: true,
    clean: true
  });
  const [review, setReview] = React.useState('');
  const tagList = [['time', 'الالتزام بالوقت'], ['clean', 'النظافة'], ['pro', 'الاحترافية'], ['friendly', 'اللطف'], ['skill', 'الجودة']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0642\u064A\u0651\u0645\u064A \u0627\u0644\u062E\u062F\u0645\u0629",
    raised: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: booking.providerImage,
    name: booking.providerName,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, booking.providerName), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, booking.service, " \xB7 ", booking.date))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-5)',
      background: 'var(--bg-tint)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0643\u064A\u0641 \u0643\u0627\u0646\u062A \u062A\u062C\u0631\u0628\u062A\u0643\u0650\u061F"), /*#__PURE__*/React.createElement(RatingStars, {
    input: true,
    value: rating,
    size: "md",
    onChange: setRating
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, rating === 5 ? 'ممتاز' : rating === 4 ? 'جيد جداً' : rating === 3 ? 'جيد' : rating === 2 ? 'لا بأس' : 'يحتاج تحسين')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/1.3 var(--font-base)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0645\u0627 \u0627\u0644\u0630\u064A \u0623\u0639\u062C\u0628\u0643\u0650\u061F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, tagList.map(([k, l]) => /*#__PURE__*/React.createElement(Chip, {
    key: k,
    selected: !!tags[k],
    onClick: () => setTags({
      ...tags,
      [k]: !tags[k]
    })
  }, l)))), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0645\u0631\u0627\u062C\u0639\u062A\u0643\u0650 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    value: review,
    onChange: e => setReview(e.target.value),
    multiline: true,
    rows: 3,
    placeholder: "\u0634\u0627\u0631\u0643\u064A \u062A\u062C\u0631\u0628\u062A\u0643\u0650 \u0645\u0639 \u0639\u0645\u064A\u0644\u0627\u062A \u0623\u062E\u0631\u064A\u0627\u062A\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('bookings')
  }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645")));
}

/* -------- Favorites -------- */
function FavoritesScreen({
  nav,
  providers,
  fav,
  toggleFav
}) {
  const {
    AppBar,
    ProviderCard,
    EmptyState
  } = DS_M;
  const list = providers.filter(p => fav[p.id]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0627\u0644\u0645\u0641\u0636\u0651\u0644\u0629"
  }), list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "favorite_border",
    title: "\u0644\u0627 \u0645\u0642\u062F\u0651\u0645\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u0641\u0636\u0651\u0644\u0629",
    cta: "\u062A\u0635\u0641\u0651\u062D\u064A \u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0627\u062A",
    onCta: () => nav('home')
  }, "\u0627\u0636\u063A\u0637\u064A \u0639\u0644\u0649 \u0627\u0644\u0642\u0644\u0628 \u0641\u064A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A \u0644\u0625\u0636\u0627\u0641\u0629 \u0645\u0642\u062F\u0651\u0645\u0627\u062A \u0647\u0646\u0627") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)'
    }
  }, list.map(p => /*#__PURE__*/React.createElement(ProviderCard, _extends({
    key: p.id
  }, p, {
    favorite: true,
    onClick: () => nav('provider', {
      id: p.id
    }),
    onToggleFavorite: () => toggleFav(p.id)
  })))));
}

/* -------- Payment methods -------- */
function PaymentMethodsScreen({
  nav,
  methods
}) {
  const {
    AppBar,
    Icon,
    ListItem,
    Button,
    Banner
  } = DS_M;
  const BrandMark = ({
    m
  }) => {
    const id = (m.brand || m.id || '').toLowerCase();
    if (id.includes('apple')) return /*#__PURE__*/React.createElement(window.ApplePayLogo, {
      height: 16
    });
    if (id.includes('mada')) return /*#__PURE__*/React.createElement(window.MadaLogo, {
      height: 18
    });
    if (id.includes('stc')) return /*#__PURE__*/React.createElement(window.StcPayLogo, {
      height: 18
    });
    if (id.includes('visa')) return /*#__PURE__*/React.createElement(window.VisaLogo, {
      height: 12
    });
    return /*#__PURE__*/React.createElement(Icon, {
      name: "credit_card",
      size: "sm"
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0637\u0631\u0642 \u0627\u0644\u062F\u0641\u0639"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "lock"
  }, "\u0628\u064A\u0627\u0646\u0627\u062A\u0643\u0650 \u0645\u062D\u0641\u0648\u0638\u0629 \u0628\u0623\u0645\u0627\u0646 \u0644\u062F\u0649 \u0645\u0632\u0648\u0651\u062F \u0627\u0644\u062F\u0641\u0639 \u2014 \u0644\u0627 \u064A\u0635\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0644\u0623\u0631\u0642\u0627\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, methods.map((m, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: m.id,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 56,
        height: 36,
        padding: '0 8px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(BrandMark, {
      m: m
    })),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, m.label, m.last4 && /*#__PURE__*/React.createElement("span", {
      className: "ns-ltr",
      style: {
        color: 'var(--text-secondary)',
        font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-latin)'
      }
    }, "\u2022\u2022\u2022\u2022 ", m.last4)),
    subtitle: /*#__PURE__*/React.createElement("span", null, m.sub, m.default && /*#__PURE__*/React.createElement("span", {
      style: {
        marginInlineStart: 8,
        color: 'var(--success-500)',
        font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)'
      }
    }, "\xB7 \u0627\u0641\u062A\u0631\u0627\u0636\u064A")),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "more_horiz",
      size: "sm",
      color: "var(--text-secondary)"
    }),
    divider: i < methods.length - 1
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    leadingIcon: "add"
  }, "\u0625\u0636\u0627\u0641\u0629 \u0628\u0637\u0627\u0642\u0629 \u062C\u062F\u064A\u062F\u0629")));
}

/* -------- Premium subscription -------- */
function PremiumScreen({
  nav,
  premium
}) {
  const {
    AppBar,
    Icon,
    Button,
    Money
  } = DS_M;
  const [plan, setPlan] = React.useState('y');
  const selected = premium.plans.find(p => p.id === plan) || premium.plans[0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'linear-gradient(160deg, var(--primary-600), var(--primary-800))',
      color: '#fff',
      padding: 'var(--space-4) var(--space-4) calc(var(--space-7) + 24px)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav('back'),
    "aria-label": "\u0631\u062C\u0648\u0639",
    style: {
      border: 'none',
      background: 'rgba(255,255,255,0.18)',
      cursor: 'pointer',
      color: '#fff',
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_forward",
    size: "sm",
    mirror: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      paddingInline: 12,
      height: 26,
      borderRadius: 999,
      background: 'var(--secondary-500)',
      color: '#fff',
      font: '600 11px/1 var(--font-latin)',
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workspace_premium",
    size: "xs",
    fill: true
  }), " Home Beauty Premium"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 26px/1.25 var(--font-base)',
      marginTop: 'var(--space-3)'
    }
  }, "\u062A\u062C\u0631\u0628\u0629 \u062A\u062C\u0645\u064A\u0644 \u0644\u0627 \u0645\u062B\u064A\u0644 \u0644\u0647\u0627"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      opacity: 0.92,
      marginTop: 6
    }
  }, "\u0648\u0641\u0651\u0631\u064A \u0661\u0660\u066A \u0639\u0644\u0649 \u0643\u0644 \u062D\u062C\u0632 \u0645\u0639 \u0648\u0635\u0648\u0644 \u062D\u0635\u0631\u064A \u0644\u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0627\u062A.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-4) var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      marginTop: -28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      paddingTop: 14
    }
  }, premium.plans.map(pl => {
    const sel = plan === pl.id;
    return /*#__PURE__*/React.createElement("button", {
      key: pl.id,
      onClick: () => setPlan(pl.id),
      style: {
        flex: 1,
        padding: 'var(--space-4) var(--space-3)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
        border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
        position: 'relative',
        textAlign: 'center',
        boxShadow: sel ? 'var(--elevation-2)' : 'var(--elevation-1)'
      }
    }, pl.featured && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -12,
        insetInline: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        background: 'var(--secondary-500)',
        color: '#fff',
        font: '600 10px/1 var(--font-latin)',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 999,
        letterSpacing: '.08em',
        whiteSpace: 'nowrap'
      }
    }, "\u0627\u0644\u0623\u0643\u062B\u0631 \u062A\u0648\u0641\u064A\u0631\u0627\u064B")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--type-h3-size)/1.2 var(--font-base)',
        color: 'var(--text-primary)'
      }
    }, pl.name), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '10px 0 4px'
      }
    }, /*#__PURE__*/React.createElement(Money, {
      amount: pl.price,
      emphasis: "lg"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
        color: 'var(--text-secondary)'
      }
    }, "/", pl.period), pl.save && /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--success-500)',
        fontWeight: 700,
        fontSize: 12,
        marginTop: 6
      }
    }, pl.save));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--elevation-1)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, premium.perks.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.title,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-tint)',
      color: 'var(--primary-500)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon,
    size: "md",
    fill: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, p.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, p.body)))))), /*#__PURE__*/React.createElement(StickyFooter, null, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    leadingIcon: "workspace_premium",
    onClick: () => nav('back')
  }, "\u0627\u0628\u062F\u0626\u064A \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \xB7 \u062A\u062C\u0631\u0628\u0629 \u0645\u062C\u0627\u0646\u064A\u0629 \u0664 \u0623\u064A\u0627\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) 11px/1.4 var(--font-base)',
      color: 'var(--text-secondary)',
      marginTop: 8,
      textAlign: 'center'
    }
  }, "\u062B\u0645 ", selected.price, " \u0631.\u0633 / ", selected.period === 'شهر' ? 'شهر' : 'سنة', " \u2014 \u064A\u0645\u0643\u0646 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0641\u064A \u0623\u064A \u0648\u0642\u062A.")));
}
Object.assign(window, {
  NotificationsScreen,
  ChatListScreen,
  ChatScreen,
  BookingDetailScreen,
  RateScreen,
  FavoritesScreen,
  PaymentMethodsScreen,
  PremiumScreen,
  AddressesScreen,
  CancelBookingScreen
});

/* -------- Addresses (list + add row) -------- */
function AddressesScreen({
  nav,
  addresses
}) {
  const {
    AppBar,
    ListItem,
    Button,
    Icon,
    Chip
  } = DS_M;
  const [list, setList] = React.useState(addresses);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u0645\u062D\u0641\u0648\u0638\u0629"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, list.map((a, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: a.id,
    divider: i < list.length - 1,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-tint)',
        color: 'var(--primary-500)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "location_on",
      size: "sm",
      fill: true
    })),
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, a.label, a.default && /*#__PURE__*/React.createElement(Chip, {
      size: "sm",
      selected: true
    }, "\u0627\u0641\u062A\u0631\u0627\u0636\u064A")),
    subtitle: a.text,
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "more_horiz",
      size: "sm",
      color: "var(--text-secondary)"
    })
  }))), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-lg)',
      border: '2px dashed var(--border-strong)',
      background: 'var(--bg-surface)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      color: 'var(--action-primary)',
      font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add_location_alt",
    size: "md"
  }), "\u0623\u0636\u064A\u0641\u064A \u0639\u0646\u0648\u0627\u0646\u0627\u064B \u062C\u062F\u064A\u062F\u0627\u064B"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      height: 180,
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(135deg, #e8eef5, #f3e8ed)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 200",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 120 Q 100 80 200 110 T 400 100",
    stroke: "#bcc7d6",
    strokeWidth: "2",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 60 Q 80 40 180 70 T 400 50",
    stroke: "#bcc7d6",
    strokeWidth: "2",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 0 L 130 200 M 240 0 L 250 200",
    stroke: "#dbe3ec",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      insetInlineStart: '50%',
      transform: 'translate(50%, -50%)',
      color: 'var(--primary-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "location_on",
    size: "xl",
    fill: true
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      insetInlineEnd: 12,
      bottom: 12,
      padding: '6px 12px',
      background: 'var(--bg-canvas)',
      borderRadius: 999,
      boxShadow: 'var(--elevation-2)',
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629"))));
}

/* -------- Cancel booking (centered dialog feel) -------- */
function CancelBookingScreen({
  nav,
  booking
}) {
  const {
    AppBar,
    Button,
    Banner,
    Money,
    Icon
  } = DS_M;
  const [reason, setReason] = React.useState(null);
  const reasons = [['conflict', 'تغيّرت خطّتي / تعارض موعد'], ['price', 'السعر'], ['provider', 'أفضّل مقدّمة أخرى'], ['mistake', 'حجزت بالخطأ'], ['other', 'سبب آخر']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    onBack: () => nav('back'),
    title: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062D\u062C\u0632",
    raised: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: 'var(--error-100)',
      color: 'var(--error-500)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: "xl",
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)',
      textAlign: 'center'
    }
  }, "\u0647\u0644 \u062A\u0631\u064A\u062F\u064A\u0646 \u0641\u0639\u0644\u0627\u064B \u0627\u0644\u0625\u0644\u063A\u0627\u0621\u061F"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      maxWidth: 320
    }
  }, booking ? `حجز ${booking.service} مع ${booking.providerName} يوم ${booking.date} الساعة ${booking.time}` : '')), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u062D\u062C\u0632"), /*#__PURE__*/React.createElement(Money, {
    amount: booking ? booking.price : 0
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "\u0642\u064A\u0645\u0629 \u0627\u0644\u0627\u0633\u062A\u0631\u062F\u0627\u062F"), /*#__PURE__*/React.createElement(Money, {
    amount: booking ? Math.round(booking.price * 0.5) : 0,
    tone: "paid"
  })), /*#__PURE__*/React.createElement(Banner, {
    variant: "warning",
    icon: "info"
  }, "\u062D\u062C\u0632\u0643\u0650 \u0636\u0645\u0646 \u0646\u0627\u0641\u0630\u0629 \u0666\u2013\u0662\u0664 \u0633\u0627\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0639\u062F \u2014 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062F\u0627\u062F \u0665\u0660\u066A \u0645\u0646 \u0627\u0644\u0645\u0628\u0644\u063A.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/1.3 var(--font-base)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0633\u0628\u0628 \u0627\u0644\u0625\u0644\u063A\u0627\u0621 (\u064A\u0633\u0627\u0639\u062F\u0646\u0627 \u0641\u064A \u0627\u0644\u062A\u062D\u0633\u064A\u0646)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, reasons.map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setReason(k),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'start',
      background: reason === k ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
      border: `1px solid ${reason === k ? 'var(--primary-300)' : 'var(--border-default)'}`,
      color: 'var(--text-primary)',
      cursor: 'pointer',
      font: 'var(--weight-medium) var(--type-body-size)/1.3 var(--font-base)'
    }
  }, l, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: `2px solid ${reason === k ? 'var(--primary-500)' : 'var(--border-strong)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, reason === k && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--primary-500)'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: () => nav('back')
  }, "\u0627\u0644\u062A\u0631\u0627\u062C\u0639"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    fullWidth: true,
    onClick: () => nav('bookings')
  }, "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0625\u0644\u063A\u0627\u0621"))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-more.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-onboarding.jsx
try { (() => {
/* Onboarding · Role · Auth · Signup screens (Apple, Google, Phone). */
const DS_O = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

/* -------- Brand wordmark, used on Splash & Auth -------- */
function LogoLockup({
  small = false,
  onLight = true
}) {
  const w = small ? 130 : 240;
  return /*#__PURE__*/React.createElement("img", {
    src: window.__BRAND_LOGO,
    alt: "Home Beauty",
    style: {
      width: w,
      height: 'auto',
      display: 'block',
      filter: onLight ? 'none' : 'brightness(0) invert(1)'
    }
  });
}

/* -------- Splash -------- */
function SplashScreen({
  nav
}) {
  React.useEffect(() => {
    const t = setTimeout(() => nav('onboarding'), 1600);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-tint)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -60,
      insetInlineStart: -60,
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(214,72,110,0.18), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: -80,
      insetInlineEnd: -60,
      width: 260,
      height: 260,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,163,106,0.22), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__BRAND_LOGO,
    alt: "Home Beauty",
    style: {
      width: 260,
      height: 'auto',
      display: 'block',
      animation: 'hb-pop 600ms ease-out'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: '3px solid var(--primary-200)',
      borderTopColor: 'var(--primary-500)',
      animation: 'hb-spin 0.8s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)'
    }
  }, "\u062C\u0645\u0627\u0644\u0643\u0650 \u2026 \u0641\u064A \u0628\u064A\u062A\u0643\u0650")), /*#__PURE__*/React.createElement("style", null, `
        @keyframes hb-pop { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes hb-spin { to { transform: rotate(360deg); } }
      `));
}

/* -------- Onboarding (3 pages with dots) -------- */
const ONB = [{
  icon: 'search',
  title: 'اكتشفي مقدّمات قريبة منكِ',
  body: 'استعرضي ملفّات معتمدة، تقييمات حقيقية، وأسعار شفافة من قبل الحجز.'
}, {
  icon: 'event_available',
  title: 'احجزي في الوقت الذي يناسبكِ',
  body: 'مواعيد مرنة، تأكيد فوري، وتذكيرات قبل الموعد.'
}, {
  icon: 'verified_user',
  title: 'الدفع آمن مع نظام الحماية',
  body: 'يُحجز المبلغ ولا يُحوّل للمقدّمة إلا بعد اكتمال الخدمة.'
}];
function OnboardingScreen({
  nav
}) {
  const {
    Icon,
    Button
  } = DS_O;
  const [i, setI] = React.useState(0);
  const page = ONB[i];
  const last = i === ONB.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav('role'),
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--text-secondary)',
      font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)',
      cursor: 'pointer'
    }
  }, "\u062A\u062E\u0637\u0651\u064A")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-5)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 160,
      height: 160,
      borderRadius: '50%',
      background: 'var(--bg-tint)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-500)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: page.icon,
    size: 88,
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)',
      maxWidth: 300
    }
  }, page.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-lg-weight) var(--type-body-lg-size)/var(--type-body-lg-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      maxWidth: 300
    }
  }, page.body)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 'var(--space-5)'
    }
  }, ONB.map((_, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    style: {
      width: idx === i ? 24 : 8,
      height: 8,
      borderRadius: 999,
      background: idx === i ? 'var(--primary-500)' : 'var(--neutral-300)',
      transition: 'all .15s'
    }
  }))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => last ? nav('role') : setI(i + 1)
  }, last ? 'ابدئي' : 'التالي'));
}

/* -------- Role choice -------- */
function RoleChoiceScreen({
  nav
}) {
  const {
    Icon,
    Button
  } = DS_O;
  const [role, setRole] = React.useState('client');
  const card = (key, title, sub, icon) => {
    const sel = role === key;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setRole(key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        width: '100%',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
        border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
        cursor: 'pointer',
        textAlign: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-md)',
        background: sel ? 'var(--primary-500)' : 'var(--neutral-100)',
        color: sel ? '#fff' : 'var(--primary-500)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: "lg",
      fill: sel
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)',
        color: 'var(--text-primary)'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
        color: 'var(--text-secondary)'
      }
    }, sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-strong)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, sel && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: 'var(--primary-500)'
      }
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(LogoLockup, {
    small: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      marginBottom: 'var(--space-3)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643\u0650"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u062E\u062A\u0627\u0631\u064A \u0645\u0627 \u064A\u0646\u0627\u0633\u0628\u0643\u0650 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)'
    }
  }, card('client', 'أنا عميلة', 'أبحث عن خدمات تجميل في المنزل', 'spa'), card('provider', 'أنا مقدّمة خدمة', 'أقدّم خدمات تجميل وأبحث عن عميلات', 'workspace_premium')), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('auth', {
      role
    })
  }, "\u0645\u062A\u0627\u0628\u0639\u0629"));
}

/* -------- Auth (Apple / Google / Phone) -------- */
function AuthScreen({
  nav,
  role
}) {
  const {
    Button,
    Icon
  } = DS_O;
  const isProvider = role === 'provider';
  const goSignup = provider => {
    if (provider === 'phone') return nav('otp', {
      role
    });
    nav(isProvider ? 'provider-setup' : 'client-setup', {
      role,
      via: provider
    });
  };
  const SocialBtn = ({
    onClick,
    bg,
    color,
    border,
    brand,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: '100%',
      height: 54,
      borderRadius: 'var(--radius-md)',
      background: bg,
      color,
      border: border || 'none',
      cursor: 'pointer',
      font: 'var(--weight-semibold) var(--type-body-lg-size)/1 var(--font-base)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '0 var(--space-4)',
      direction: 'ltr'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-lg-size)/1 var(--font-base)'
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav('back'),
    style: {
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      width: 44,
      height: 44,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_forward",
    size: "md",
    mirror: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(LogoLockup, {
    small: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      marginBottom: 'var(--space-5)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, isProvider ? 'انضمي كمقدّمة خدمة' : 'مرحباً بكِ'), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, isProvider ? 'ابدئي العمل واستقبلي حجوزاتكِ خلال دقائق' : 'سجّلي الدخول أو أنشئي حساباً جديداً')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(SocialBtn, {
    onClick: () => goSignup('apple'),
    bg: "#000",
    color: "#fff",
    brand: /*#__PURE__*/React.createElement(window.AppleMark, {
      size: 22,
      color: "#fff"
    }),
    label: "Continue with Apple"
  }), /*#__PURE__*/React.createElement(SocialBtn, {
    onClick: () => goSignup('google'),
    bg: "#fff",
    color: "#1F1F1F",
    border: "1px solid var(--border-strong)",
    brand: /*#__PURE__*/React.createElement(window.GoogleMark, {
      size: 20
    }),
    label: "Continue with Google"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBlock: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0623\u0648"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  })), /*#__PURE__*/React.createElement(Button, {
    leadingIcon: "phone_iphone",
    fullWidth: true,
    onClick: () => goSignup('phone')
  }, "\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0628\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)',
      color: 'var(--text-secondary)',
      paddingBottom: 'var(--space-3)'
    }
  }, "\u0628\u0645\u062A\u0627\u0628\u0639\u062A\u0643\u0650 \u0641\u0625\u0646\u0643\u0650 \u062A\u0648\u0627\u0641\u0642\u064A\u0646 \u0639\u0644\u0649 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--action-primary)',
      fontWeight: 600
    }
  }, "\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645"), " \u0648", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--action-primary)',
      fontWeight: 600
    }
  }, "\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629"), "."));
}

/* -------- OTP -------- */
function OtpScreen({
  nav,
  role
}) {
  const {
    Button,
    Icon
  } = DS_O;
  const [phone, setPhone] = React.useState('5X XXX XXXX');
  const [step, setStep] = React.useState('phone');
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const ok = digits.every(d => d) || step === 'phone';
  const submit = () => {
    if (step === 'phone') return setStep('code');
    nav(role === 'provider' ? 'provider-setup' : 'client-setup', {
      role,
      via: 'phone'
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => step === 'code' ? setStep('phone') : nav('back'),
    style: {
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      width: 44,
      height: 44,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_forward",
    size: "md",
    mirror: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, step === 'phone' ? 'أدخلي رقم جوالك' : 'تحقّق من رمز التفعيل'), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, step === 'phone' ? 'سنرسل لكِ رمز تفعيل برسالة نصية.' : `أرسلنا رمزاً مكوّناً من ٦ أرقام إلى ${phone}`)), step === 'phone' ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-3)',
      border: '1.5px solid var(--action-primary)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 10px',
      background: 'var(--bg-tint)',
      borderRadius: 6,
      font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-latin)'
    }
  }, "\uD83C\uDDF8\uD83C\uDDE6 +966"), /*#__PURE__*/React.createElement("input", {
    className: "ns-ltr",
    dir: "ltr",
    value: phone,
    onChange: e => setPhone(e.target.value),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--weight-medium) var(--type-body-lg-size)/1 var(--font-latin)',
      color: 'var(--text-primary)',
      textAlign: 'start'
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ns-ltr",
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      gap: 'var(--space-2)',
      direction: 'ltr',
      justifyContent: 'center'
    }
  }, digits.map((d, idx) => /*#__PURE__*/React.createElement("input", {
    key: idx,
    value: d,
    maxLength: 1,
    onChange: e => {
      const v = e.target.value.replace(/\D/g, '').slice(-1);
      setDigits(arr => arr.map((x, j) => j === idx ? v : x));
      if (v && idx < 5) document.querySelectorAll('.ns-otp-cell')[idx + 1]?.focus();
    },
    className: "ns-otp-cell",
    style: {
      width: 44,
      height: 56,
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid var(--border-strong)',
      outline: 'none',
      font: '600 22px/1 var(--font-latin)',
      textAlign: 'center',
      background: 'var(--bg-surface-raised)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      textAlign: 'center',
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0644\u0645 \u064A\u0635\u0644\u0643\u0650 \u0627\u0644\u0631\u0645\u0632\u061F ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--action-primary)',
      fontWeight: 600
    }
  }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    disabled: !ok,
    onClick: submit
  }, step === 'phone' ? 'إرسال الرمز' : 'تأكيد'));
}

/* -------- Client signup (single step: name + address optional) -------- */
function ClientSetupScreen({
  nav
}) {
  const {
    Button,
    TextInput,
    Avatar,
    Icon
  } = DS_O;
  const [name, setName] = React.useState('ريم الشمري');
  const [city, setCity] = React.useState('الرياض');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0623\u0643\u0645\u0644\u064A \u0645\u0644\u0641\u0651\u0643"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0628\u0633\u064A\u0637\u0629 \u0644\u0646\u0628\u062F\u0623 \u2014 \u064A\u0645\u0643\u0646\u0643\u0650 \u062A\u0639\u062F\u064A\u0644\u0647\u0627 \u0644\u0627\u062D\u0642\u0627\u064B."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    size: "lg"
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-surface)',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "photo_camera",
    size: "sm"
  }), "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641")), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0644\u0627\u0633\u0645",
    value: name,
    onChange: e => setName(e.target.value),
    leadingIcon: "person"
  }), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0644\u0645\u062F\u064A\u0646\u0629",
    value: city,
    onChange: e => setCity(e.target.value),
    leadingIcon: "location_city"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('home')
  }, "\u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062A\u0637\u0628\u064A\u0642"));
}

/* -------- Provider signup (multi-section in one screen) -------- */
function ProviderSetupScreen({
  nav
}) {
  const {
    Button,
    TextInput,
    Chip,
    Avatar,
    Icon,
    Banner
  } = DS_O;
  const [name, setName] = React.useState('لطيفة العتيبي');
  const [spec, setSpec] = React.useState('makeup');
  const [service, setService] = React.useState('ميك أب سهرة');
  const [price, setPrice] = React.useState('250');
  const [dur, setDur] = React.useState('60');
  const specs = [['makeup', 'ميك أب', 'palette'], ['hair', 'شعر', 'content_cut'], ['nails', 'أظافر', 'back_hand'], ['skin', 'عناية', 'spa'], ['henna', 'حنّاء', 'format_paint']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)',
      gap: 'var(--space-4)',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0623\u0643\u0645\u0644\u064A \u0645\u0644\u0641\u0651 \u0645\u0642\u062F\u0651\u0645\u0629 \u0627\u0644\u062E\u062F\u0645\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0633\u064A\u0638\u0647\u0631 \u0645\u0644\u0641\u0651\u0643 \u0641\u064A \u0627\u0644\u0628\u062D\u062B \u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642 \u0645\u0646 \u0625\u0643\u0645\u0627\u0644\u0647."), /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "bolt"
  }, "\u062A\u0641\u0639\u064A\u0644 \u0641\u0648\u0631\u064A \u0628\u062F\u0648\u0646 \u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0648\u0627\u0641\u0642\u0629 \u2014 \u064A\u0645\u0643\u0646\u0643\u0650 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0632\u064A\u062F \u0644\u0627\u062D\u0642\u0627\u064B."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: name,
    size: "lg"
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-surface)',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "photo_camera",
    size: "sm"
  }), "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641")), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0644\u0627\u0633\u0645",
    value: name,
    onChange: e => setName(e.target.value),
    leadingIcon: "person"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u0644\u062A\u062E\u0635\u0651\u0635"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    }
  }, specs.map(([k, l, ic]) => /*#__PURE__*/React.createElement(Chip, {
    key: k,
    leadingIcon: ic,
    selected: spec === k,
    onClick: () => setSpec(k)
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-label-size)/1 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0623\u0648\u0651\u0644 \u062E\u062F\u0645\u0629 \u0644\u0643\u0650"), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0633\u0645 \u0627\u0644\u062E\u062F\u0645\u0629",
    value: service,
    onChange: e => setService(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0644\u0633\u0639\u0631 (\u0631.\u0633)",
    value: price,
    onChange: e => setPrice(e.target.value),
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(TextInput, {
    label: "\u0627\u0644\u0645\u062F\u0651\u0629 (\u062F\u0642\u064A\u0642\u0629)",
    value: dur,
    onChange: e => setDur(e.target.value),
    style: {
      flex: 1
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)',
      marginBottom: 'var(--space-2)',
      color: 'var(--text-primary)'
    }
  }, "\u0645\u0639\u0631\u0636 \u0623\u0639\u0645\u0627\u0644\u0643\u0650 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontWeight: 400
    }
  }, "(\u0645\u0637\u0644\u0648\u0628 \u0635\u0648\u0631\u0629 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-2)'
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-md)',
      border: '2px dashed var(--border-strong)',
      background: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add_a_photo",
    size: "lg"
  }))))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('provider-tier')
  }, "\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629"));
}

/* -------- Provider tier (visibility package) -------- */
const TIERS = [{
  id: 'free',
  name: 'مجّاناً للبدء',
  sub: 'ظهور أساسي في البحث',
  price: 0,
  fee: '٪١٫٥ من كل حجز',
  perks: ['ظهور أساسي', 'استقبال حجوزات', 'محفظة وسحب']
}, {
  id: 'gold',
  name: 'باقة ذهبية',
  sub: 'أولوية في البحث لمدّة ٥ أيام',
  price: 99,
  fee: '٪١٫٥ من كل حجز',
  perks: ['أولوية في البحث', 'شارة ذهبية', 'إحصائيات مفصّلة'],
  featured: true
}, {
  id: 'platinum',
  name: 'باقة بلاتينية',
  sub: 'أعلى ظهور لمدّة ١٠ أيام',
  price: 199,
  fee: '٪١ من كل حجز',
  perks: ['أعلى ظهور', 'شارة بلاتينية', 'دعم مخصّص', 'بدون عمولة على الخدمات الإضافية']
}];
function ProviderTierScreen({
  nav
}) {
  const {
    Button,
    Icon,
    Money
  } = DS_O;
  const [tier, setTier] = React.useState('gold');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav('back'),
    style: {
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-primary)',
      width: 44,
      height: 44,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow_forward",
    size: "md",
    mirror: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0627\u062E\u062A\u0627\u0631\u064A \u0628\u0627\u0642\u0629 \u0627\u0644\u0638\u0647\u0648\u0631"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0645\u062C\u0627\u0646\u064A \u2014 \u0627\u0644\u0628\u0627\u0642\u0627\u062A \u062A\u0632\u064A\u062F \u0641\u0631\u0635 \u0638\u0647\u0648\u0631\u0643\u0650 \u0641\u064A \u0627\u0644\u0628\u062D\u062B."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, TIERS.map(t => {
    const sel = tier === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTier(t.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'start',
        background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
        border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
        cursor: 'pointer',
        position: 'relative'
      }
    }, t.featured && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -12,
        insetInlineEnd: 12,
        background: 'var(--secondary-500)',
        color: '#fff',
        font: '600 11px/1 var(--font-latin)',
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: 999
      }
    }, "Recommended"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)',
        color: 'var(--text-primary)'
      }
    }, t.name), t.price ? /*#__PURE__*/React.createElement(Money, {
      amount: t.price,
      suffix: "/\u0634\u0647\u0631"
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--success-500)',
        font: 'var(--weight-bold) var(--type-h3-size)/1 var(--font-base)'
      }
    }, "\u0645\u062C\u0627\u0646\u0627\u064B")), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)',
        font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)'
      }
    }, t.sub), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        marginTop: 4
      }
    }, t.perks.map(p => /*#__PURE__*/React.createElement("span", {
      key: p,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
        color: 'var(--text-primary)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: "xs",
      color: "var(--success-500)"
    }), p))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
        color: 'var(--text-secondary)'
      }
    }, "\u0639\u0645\u0648\u0644\u0629: ", t.fee));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: () => nav('p-dashboard')
  }, tier === 'free' ? 'ابدئي مجاناً' : 'الاشتراك والمتابعة'));
}
Object.assign(window, {
  SplashScreen,
  OnboardingScreen,
  RoleChoiceScreen,
  AuthScreen,
  OtpScreen,
  ClientSetupScreen,
  ProviderSetupScreen,
  ProviderTierScreen,
  LogoLockup,
  StickyFooter
});

/* StickyFooter — portals its children to #screen-footer so it stays pinned
   to the bottom of the visible phone, not the bottom of the scrolled content. */
function StickyFooter({
  children,
  padded = true,
  style = {}
}) {
  const target = typeof document !== 'undefined' && document.getElementById('screen-footer');
  if (!target) return null;
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    style: {
      padding: padded ? 'var(--space-3) var(--space-4) var(--space-4)' : 0,
      background: 'var(--bg-canvas)',
      borderTop: '1px solid var(--border-default)',
      boxShadow: '0 -6px 16px rgba(22,18,20,0.05)',
      ...style
    }
  }, children), target);
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/client-app/app-screens-provider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Provider (vendor) side: Dashboard, Inbox, Wallet, Profile + helpers. */
const DS_P = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;
const PROVIDER_BOOKINGS = [{
  id: 'rq1',
  status: 'pending_provider',
  service: 'ميك أب سهرة',
  providerName: 'ريم الشمري',
  providerImage: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=200&q=80',
  date: 'الإثنين ٢٩ يونيو',
  time: '٣:٠٠ م',
  address: 'حي الياسمين، الرياض',
  price: 250,
  scope: 'new'
}, {
  id: 'rq2',
  status: 'pending_provider',
  service: 'مكياج نهاري',
  providerName: 'دانة كمال',
  providerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  date: 'الأربعاء ١ يوليو',
  time: '٥:٠٠ م',
  address: 'حي النرجس، الرياض',
  price: 180,
  scope: 'new'
}, {
  id: 'up1',
  status: 'confirmed',
  service: 'ميك أب عروس',
  providerName: 'هند المالكي',
  providerImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80',
  date: 'السبت ٢٧ يونيو',
  time: '٢:٠٠ م',
  address: 'حي العقيق، الرياض',
  price: 850,
  scope: 'upcoming'
}, {
  id: 'up2',
  status: 'on_the_way',
  service: 'ميك أب سهرة',
  providerName: 'لمى السعدون',
  providerImage: 'https://images.unsplash.com/photo-1546961342-ec8d4e98e92f?w=200&q=80',
  date: 'اليوم',
  time: '٦:٠٠ م',
  address: 'حي الياسمين، الرياض',
  price: 250,
  scope: 'upcoming'
}, {
  id: 'pa1',
  status: 'completed',
  service: 'ميك أب سهرة',
  providerName: 'منى الزهراني',
  providerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  date: '٢٥ يونيو',
  time: '٧:٠٠ م',
  address: 'حي الملقا، الرياض',
  price: 250,
  scope: 'past',
  rating: 5
}, {
  id: 'pa2',
  status: 'completed',
  service: 'مكياج نهاري',
  providerName: 'سارة م.',
  providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  date: '٢٢ يونيو',
  time: '١٠:٠٠ ص',
  address: 'حي النرجس، الرياض',
  price: 180,
  scope: 'past',
  rating: 4
}];
const PROVIDER_TX = [{
  id: 't1',
  kind: 'earning',
  label: 'ميك أب سهرة · منى الزهراني',
  date: '٢٥ يونيو',
  amount: 246,
  fee: 4
}, {
  id: 't2',
  kind: 'earning',
  label: 'مكياج نهاري · سارة م.',
  date: '٢٢ يونيو',
  amount: 177,
  fee: 3
}, {
  id: 't3',
  kind: 'payout',
  label: 'سحب للبنك الأهلي',
  date: '٢٠ يونيو',
  amount: -800
}, {
  id: 't4',
  kind: 'earning',
  label: 'ميك أب عروس · ندى س.',
  date: '١٨ يونيو',
  amount: 836,
  fee: 14
}];

/* -------- Provider header (greeting + availability toggle + premium badge) -------- */
function ProviderHeader({
  available,
  onToggle
}) {
  const {
    Icon
  } = DS_P;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-tint)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/1.2 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0623\u0647\u0644\u0627\u064B \u0644\u0637\u064A\u0641\u0629 \uD83C\uDF38"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/1.5 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0644\u0648\u062D\u0629 \u062A\u062D\u0643\u0645\u0643\u0650 \u0643\u0645\u0642\u062F\u0651\u0645\u0629 \u062E\u062F\u0645\u0629")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      paddingInline: 10,
      height: 24,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--secondary-100)',
      color: 'var(--secondary-700)',
      font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workspace_premium",
    size: "xs",
    fill: true
  }), "\u0630\u0647\u0628\u064A")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      background: 'var(--bg-canvas)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--elevation-1)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: available ? 'var(--success-100)' : 'var(--neutral-100)',
      color: available ? 'var(--success-500)' : 'var(--text-secondary)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle",
    size: "xs",
    fill: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, available ? 'متاحة لاستقبال الحجوزات' : 'غير متاحة حالياً'), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, available ? 'ملفّكِ ظاهر في البحث' : 'لن تستقبلي حجوزات جديدة')), /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    "aria-pressed": available,
    style: {
      width: 48,
      height: 28,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: available ? 'var(--success-500)' : 'var(--neutral-300)',
      position: 'relative',
      transition: 'background .2s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      [available ? 'insetInlineStart' : 'insetInlineEnd']: 2,
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--elevation-1)'
    }
  }))));
}
function StatTile({
  icon,
  label,
  value,
  accent
}) {
  const {
    Icon
  } = DS_P;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 'var(--space-3)',
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--bg-tint)',
      color: accent || 'var(--primary-500)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: "sm",
    fill: true
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--type-h2-size)/1.1 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, label));
}

/* -------- Provider Dashboard -------- */
function ProviderDashboard({
  nav
}) {
  const {
    BookingCard,
    Button,
    Money
  } = DS_P;
  const [avail, setAvail] = React.useState(true);
  const requests = PROVIDER_BOOKINGS.filter(b => b.scope === 'new');
  const today = PROVIDER_BOOKINGS.find(b => b.date === 'اليوم');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ProviderHeader, {
    available: avail,
    onToggle: () => setAvail(!avail)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "event_available",
    label: "\u062D\u062C\u0648\u0632\u0627\u062A \u0642\u0627\u062F\u0645\u0629",
    value: "\u0664"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "payments",
    label: "\u0623\u0631\u0628\u0627\u062D \u0627\u0644\u0623\u0633\u0628\u0648\u0639",
    value: "\u0661\u066C\u0662\u0665\u0669 \u0631.\u0633",
    accent: "var(--success-500)"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "star",
    label: "\u0627\u0644\u062A\u0642\u064A\u064A\u0645",
    value: "\u0664\u066B\u0669",
    accent: "var(--secondary-500)"
  })), requests.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0637\u0644\u0628\u0627\u062A \u062C\u062F\u064A\u062F\u0629"), /*#__PURE__*/React.createElement("button", {
    onClick: () => nav('p-inbox'),
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--action-primary)',
      font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)',
      cursor: 'pointer'
    }
  }, "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644 (", requests.length, ")")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, requests.slice(0, 1).map(b => /*#__PURE__*/React.createElement(BookingCard, _extends({
    key: b.id
  }, b, {
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "\u0631\u0641\u0636"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "\u0642\u0628\u0648\u0644"))
  }))))), today && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement(BookingCard, _extends({}, today, {
    onClick: () => nav('p-inbox')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      background: 'linear-gradient(135deg, var(--secondary-100), var(--primary-50))',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--secondary-700)'
    }
  }, "\u0627\u0631\u0641\u0639\u064A \u0638\u0647\u0648\u0631 \u0645\u0644\u0641\u0651\u0643\u0650"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/1.5 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u062A\u0638\u0647\u0631 \u0645\u0644\u0641\u0651\u0643\u0650 \u0641\u064A \u0623\u0648\u0651\u0644 \u0627\u0644\u0646\u062A\u0627\u0626\u062C \u0644\u0645\u062F\u0651\u0629 \u0665 \u0623\u064A\u0627\u0645.")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => nav('provider-tier')
  }, "\u062A\u0631\u0642\u064A\u0629")))));
}

/* -------- Provider Bookings Inbox -------- */
function ProviderInbox({
  nav
}) {
  const {
    AppBar,
    BookingCard,
    Chip,
    Button,
    EmptyState
  } = DS_P;
  const [tab, setTab] = React.useState('new');
  const list = PROVIDER_BOOKINGS.filter(b => b.scope === tab);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u0627\u0644\u062D\u062C\u0648\u0632\u0627\u062A"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      padding: '0 var(--space-4) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    selected: tab === 'new',
    onClick: () => setTab('new')
  }, "\u062C\u062F\u064A\u062F\u0629"), /*#__PURE__*/React.createElement(Chip, {
    selected: tab === 'upcoming',
    onClick: () => setTab('upcoming')
  }, "\u0642\u0627\u062F\u0645\u0629"), /*#__PURE__*/React.createElement(Chip, {
    selected: tab === 'past',
    onClick: () => setTab('past')
  }, "\u0645\u0646\u062A\u0647\u064A\u0629")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      padding: '0 var(--space-4) var(--space-7)'
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "event_available",
    title: "\u0644\u0627 \u062D\u062C\u0648\u0632\u0627\u062A \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645"
  }) : list.map(b => /*#__PURE__*/React.createElement(BookingCard, _extends({
    key: b.id
  }, b, {
    actions: b.scope === 'new' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "\u0631\u0641\u0636"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "\u0642\u0628\u0648\u0644")) : b.scope === 'upcoming' ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      leadingIcon: "qr_code_scanner"
    }, "\u0645\u0633\u062D \u0627\u0644\u0631\u0645\u0632") : null
  })))));
}

/* -------- Provider Wallet -------- */
function ProviderWallet({
  nav
}) {
  const {
    AppBar,
    Money,
    Button,
    Icon,
    ListItem,
    Banner
  } = DS_P;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u0627\u0644\u0645\u062D\u0641\u0638\u0629"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
      color: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--elevation-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)',
      opacity: 0.85
    }
  }, "\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u062D"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 32px/1.1 var(--font-base)',
      marginTop: 4
    }
  }, "\u0662\u066C\u0664\u0668\u0667 \u0631.\u0633"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)',
      opacity: 0.85,
      marginTop: 6
    }
  }, "+ \u0661\u066C\u0662\u0665\u0669 \u0631.\u0633 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    leadingIcon: "account_balance",
    style: {
      background: 'rgba(255,255,255,.18)',
      backdropFilter: 'blur(6px)'
    }
  }, "\u0633\u062D\u0628 \u0644\u0644\u0628\u0646\u0643"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      color: '#fff',
      border: '1px solid rgba(255,255,255,.4)'
    }
  }, "\u0633\u062C\u0644 \u0627\u0644\u062D\u0631\u0643\u0627\u062A"))), /*#__PURE__*/React.createElement(Banner, {
    variant: "info",
    icon: "info"
  }, "\u064A\u062A\u0645 \u0625\u064A\u062F\u0627\u0639 \u0627\u0644\u0645\u0628\u0644\u063A \u0641\u064A \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0642\u062F\u0651\u0645\u0629 \u062E\u0644\u0627\u0644 \u0661-\u0663 \u0623\u064A\u0627\u0645 \u0639\u0645\u0644 \u0628\u0639\u062F \u0637\u0644\u0628 \u0627\u0644\u0633\u062D\u0628."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "trending_up",
    label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0631\u0628\u0627\u062D",
    value: "\u0663\u066C\u0662\u0662\u0664 \u0631.\u0633",
    accent: "var(--success-500)"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "receipt_long",
    label: "\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u0635\u0651\u0629",
    value: "\u0664\u0668 \u0631.\u0633"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "checklist",
    label: "\u062D\u062C\u0648\u0632\u0627\u062A \u0645\u0643\u062A\u0645\u0644\u0629",
    value: "\u0661\u0667"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0622\u062E\u0631 \u0627\u0644\u062D\u0631\u0643\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, PROVIDER_TX.map((t, i) => /*#__PURE__*/React.createElement(ListItem, {
    key: t.id,
    divider: i < PROVIDER_TX.length - 1,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: t.amount > 0 ? 'var(--success-100)' : 'var(--warning-100)',
        color: t.amount > 0 ? 'var(--success-500)' : 'var(--warning-500)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.amount > 0 ? 'south_west' : 'north_east',
      size: "sm"
    })),
    title: t.label,
    subtitle: /*#__PURE__*/React.createElement("span", null, t.date, t.fee ? ` · عمولة ${t.fee} ر.س` : ''),
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        font: `var(--weight-semibold) var(--type-body-size)/1 var(--font-base)`,
        color: t.amount > 0 ? 'var(--success-500)' : 'var(--text-primary)'
      }
    }, t.amount > 0 ? '+' : '', Math.abs(t.amount), " \u0631.\u0633")
  }))))));
}

/* -------- Provider Profile -------- */
function ProviderProfile({
  nav
}) {
  const {
    AppBar,
    Avatar,
    Button,
    ListItem,
    Icon,
    RatingStars
  } = DS_P;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppBar, {
    title: "\u0645\u0644\u0641\u0651\u064A"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-4)',
      background: 'var(--bg-tint)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    name: "\u0644\u0637\u064A\u0641\u0629 \u0627\u0644\u0639\u062A\u064A\u0628\u064A",
    size: "xl",
    premium: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)',
      color: 'var(--text-primary)'
    }
  }, "\u0644\u0637\u064A\u0641\u0629 \u0627\u0644\u0639\u062A\u064A\u0628\u064A"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)',
      color: 'var(--text-secondary)'
    }
  }, "\u0645\u064A\u0643 \u0623\u0628 \xB7 \u0639\u0646\u0627\u064A\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629"), /*#__PURE__*/React.createElement(RatingStars, {
    value: 4.9,
    count: 214
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    leadingIcon: "edit"
  }, "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0627\u0644\u062E\u062F\u0645\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "palette",
    title: "\u0645\u064A\u0643 \u0623\u0628 \u0633\u0647\u0631\u0629",
    subtitle: "\u0662\u0665\u0660 \u0631.\u0633 \xB7 \u0666\u0660 \u062F\u0642\u064A\u0642\u0629",
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: "sm",
      color: "var(--text-secondary)"
    }),
    divider: true
  }), /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "favorite",
    title: "\u0645\u064A\u0643 \u0623\u0628 \u0639\u0631\u0648\u0633",
    subtitle: "\u0668\u0665\u0660 \u0631.\u0633 \xB7 \u0661\u0668\u0660 \u062F\u0642\u064A\u0642\u0629",
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: "sm",
      color: "var(--text-secondary)"
    }),
    divider: true
  }), /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "add",
    title: "\u0625\u0636\u0627\u0641\u0629 \u062E\u062F\u0645\u0629 \u062C\u062F\u064A\u062F\u0629",
    chevron: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)',
      color: 'var(--text-primary)',
      marginBottom: 'var(--space-2)'
    }
  }, "\u0645\u0639\u0631\u0636 \u0627\u0644\u0623\u0639\u0645\u0627\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-2)'
    }
  }, ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80', 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&q=80', 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&q=80'].map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--bg-tint)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '1 / 1',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-surface)',
      border: '2px dashed var(--border-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "add_a_photo",
    size: "lg"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface-raised)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "schedule",
    title: "\u0633\u0627\u0639\u0627\u062A \u0627\u0644\u0639\u0645\u0644",
    subtitle: "\u0627\u0644\u0633\u0628\u062A \u2013 \u0627\u0644\u062E\u0645\u064A\u0633 \xB7 \u0661\u0660 \u0635 \u2013 \u0661\u0660 \u0645",
    chevron: true
  }), /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "account_balance",
    title: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0633\u062D\u0628",
    subtitle: "\u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0623\u0647\u0644\u064A \u2022 IBAN \u2022\u2022\u2022\u2022 \u0664\u0661\u0662\u0663",
    chevron: true,
    divider: true
  }), /*#__PURE__*/React.createElement(ListItem, {
    leadingIcon: "workspace_premium",
    title: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0638\u0647\u0648\u0631",
    subtitle: "\u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u2014 \u062A\u0646\u062A\u0647\u064A \u0628\u0639\u062F \u0663 \u0623\u064A\u0627\u0645",
    chevron: true,
    onClick: () => nav('provider-tier')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    leadingIcon: "swap_horiz",
    onClick: () => nav('switch-to-client')
  }, "\u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0644\u0644\u0648\u0636\u0639 \u0627\u0644\u0639\u0645\u064A\u0644\u0629")));
}
Object.assign(window, {
  ProviderDashboard,
  ProviderInbox,
  ProviderWallet,
  ProviderProfile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/client-app/app-screens-provider.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Fab = __ds_scope.Fab;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.BookingCard = __ds_scope.BookingCard;

__ds_ns.ListItem = __ds_scope.ListItem;

__ds_ns.ProviderCard = __ds_scope.ProviderCard;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Money = __ds_scope.Money;

__ds_ns.RatingStars = __ds_scope.RatingStars;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.AppBar = __ds_scope.AppBar;

__ds_ns.BottomNavBar = __ds_scope.BottomNavBar;

})();
