# Design System — Colors

> **Canonical tokens.** Do not hardcode hex values in components; consume the named tokens. The JSON block at the end is the machine-readable source for `@app/ui-tokens`.

## 1. Brand rationale

A refined, feminine beauty brand — warm rose as the primary, muted gold as the luxury accent, on soft warm-neutral surfaces. Avoids the generic "tech blue". Fully supports light and dark modes and AA contrast for text.

## 2. Brand palette

### Primary — Rose (`primary`)

| Token | HEX | Use |
|---|---|---|
| `primary/50` | `#FCF2F6` | Tint backgrounds, selected rows |
| `primary/100` | `#F9E1EC` | Chips, subtle fills |
| `primary/200` | `#F2BFD5` | Hover tint |
| `primary/300` | `#E892B6` | Borders on tinted surfaces |
| `primary/400` | `#DD6A98` | Secondary emphasis |
| `primary/500` | `#D6486E` | **Primary brand — default buttons, active icons** |
| `primary/600` | `#BE3A5E` | Pressed state |
| `primary/700` | `#9C2F4D` | High-emphasis text on light |
| `primary/800` | `#7A263D` | — |
| `primary/900` | `#561B2B` | — |

### Secondary — Gold (`secondary`)

| Token | HEX | Use |
|---|---|---|
| `secondary/100` | `#F6EEDD` | Premium badge bg (Gold package) |
| `secondary/300` | `#E2C893` | Borders/dividers on premium |
| `secondary/500` | `#C9A36A` | **Accent — premium, ratings stars, highlights** |
| `secondary/700` | `#9A7A45` | Premium text |

## 3. Semantic colors

| Token | HEX | Use |
|---|---|---|
| `success/500` | `#2FB380` | Confirmed booking, paid, payout success |
| `success/100` | `#E2F5EE` | Success banner bg |
| `warning/500` | `#F4A23B` | Pending, reschedule requested, low balance |
| `warning/100` | `#FDF0DE` | Warning banner bg |
| `error/500` | `#E5484D` | Errors, cancelled, refund failed |
| `error/100` | `#FBE4E5` | Error banner bg |
| `info/500` | `#4C8DF6` | Info, "on the way", neutral notifications |
| `info/100` | `#E5EEFD` | Info banner bg |

### Booking status colors (use semantic tokens above)

| Status | Token |
|---|---|
| `pending` | `warning/500` |
| `confirmed` | `info/500` |
| `on_the_way` | `info/500` |
| `in_progress` | `primary/500` |
| `completed` | `success/500` |
| `cancelled` | `error/500` |
| `reschedule_requested` | `warning/500` |

## 4. Neutrals

| Token | HEX |
|---|---|
| `neutral/0` | `#FFFFFF` |
| `neutral/50` | `#FAF7F8` |
| `neutral/100` | `#F3EEF0` |
| `neutral/200` | `#E6DFE2` |
| `neutral/300` | `#D2C8CC` |
| `neutral/400` | `#A89BA1` |
| `neutral/500` | `#7C6F75` |
| `neutral/600` | `#5C5258` |
| `neutral/700` | `#403A3D` |
| `neutral/800` | `#272326` |
| `neutral/900` | `#161214` |

## 5. Theme mapping (light / dark)

| Semantic role | Light | Dark |
|---|---|---|
| `bg/canvas` | `neutral/0` | `neutral/900` |
| `bg/surface` | `neutral/50` | `neutral/800` |
| `bg/surface-raised` | `neutral/0` | `neutral/700` |
| `bg/tint` | `primary/50` | `primary/900` |
| `border/default` | `neutral/200` | `neutral/700` |
| `border/strong` | `neutral/300` | `neutral/600` |
| `text/primary` | `neutral/900` (`#111827` legacy-safe → `#161214`) | `neutral/50` |
| `text/secondary` | `neutral/500` | `neutral/300` |
| `text/disabled` | `neutral/400` | `neutral/500` |
| `text/on-primary` | `neutral/0` | `neutral/0` |
| `action/primary` | `primary/500` | `primary/400` |
| `action/primary-pressed` | `primary/600` | `primary/500` |
| `focus/ring` | `primary/400` | `primary/300` |

## 6. Contrast rules

- Body text on its background must meet **WCAG AA (≥4.5:1)**; large text/icons ≥3:1.
- `text/on-primary` (`#FFFFFF`) on `primary/500` (`#D6486E`) passes AA for large text and UI; use `primary/600`+ behind small white text.
- Never convey state by color alone — pair with icon/label (see [components](04-components.md) status chips).

## 7. Token JSON (source of truth)

```json
{
  "color": {
    "primary": {"50":"#FCF2F6","100":"#F9E1EC","200":"#F2BFD5","300":"#E892B6","400":"#DD6A98","500":"#D6486E","600":"#BE3A5E","700":"#9C2F4D","800":"#7A263D","900":"#561B2B"},
    "secondary": {"100":"#F6EEDD","300":"#E2C893","500":"#C9A36A","700":"#9A7A45"},
    "success": {"100":"#E2F5EE","500":"#2FB380"},
    "warning": {"100":"#FDF0DE","500":"#F4A23B"},
    "error": {"100":"#FBE4E5","500":"#E5484D"},
    "info": {"100":"#E5EEFD","500":"#4C8DF6"},
    "neutral": {"0":"#FFFFFF","50":"#FAF7F8","100":"#F3EEF0","200":"#E6DFE2","300":"#D2C8CC","400":"#A89BA1","500":"#7C6F75","600":"#5C5258","700":"#403A3D","800":"#272326","900":"#161214"}
  },
  "theme": {
    "light": {"bg.canvas":"#FFFFFF","bg.surface":"#FAF7F8","bg.surfaceRaised":"#FFFFFF","bg.tint":"#FCF2F6","border.default":"#E6DFE2","border.strong":"#D2C8CC","text.primary":"#161214","text.secondary":"#7C6F75","text.disabled":"#A89BA1","text.onPrimary":"#FFFFFF","action.primary":"#D6486E","action.primaryPressed":"#BE3A5E","focus.ring":"#DD6A98"},
    "dark": {"bg.canvas":"#161214","bg.surface":"#272326","bg.surfaceRaised":"#403A3D","bg.tint":"#561B2B","border.default":"#403A3D","border.strong":"#5C5258","text.primary":"#FAF7F8","text.secondary":"#D2C8CC","text.disabled":"#7C6F75","text.onPrimary":"#FFFFFF","action.primary":"#DD6A98","action.primaryPressed":"#D6486E","focus.ring":"#E892B6"}
  }
}
```
