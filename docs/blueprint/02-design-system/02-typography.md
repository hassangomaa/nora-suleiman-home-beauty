# Design System — Typography

> **Canonical.** Arabic-first. All sizes in `sp`/`pt` logical units. The JSON block is the source for `@app/ui-tokens`.

## 1. Font families

| Script | Family | Weights bundled | Notes |
|---|---|---|---|
| Arabic (primary) | **Tajawal** | 400, 500, 700 | Clean, modern, excellent RTL legibility. Default UI font for `ar-SA`. |
| Latin / numerals | **Inter** | 400, 500, 600, 700 | Used for `en` locale and Latin-script content. |
| Numerals policy | Use **Arabic-Indic** (٠١٢٣) in `ar` locale for prices/dates via locale formatting; Western digits in `en`. |

- Bundle fonts with the app (Expo `useFonts`) — do not rely on system fonts (Arabic rendering varies).
- Line height tuned for Arabic: never below **1.5×** font size for body to avoid diacritic clipping.

## 2. Type scale

| Token | Size | Line height | Weight | Use |
|---|:--:|:--:|:--:|---|
| `display` | 28 | 40 | 700 | Splash/marketing hero only |
| `h1` | 24 | 34 | 700 | Screen titles |
| `h2` | 20 | 30 | 700 | Section headers |
| `h3` | 18 | 28 | 600/500 | Card titles, sub-sections |
| `body-lg` | 16 | 26 | 400 | Primary reading text, inputs |
| `body` | 14 | 22 | 400 | Default body, list items |
| `label` | 14 | 20 | 500 | Buttons, form labels |
| `caption` | 12 | 18 | 400 | Helper text, timestamps, metadata |
| `overline` | 11 | 16 | 600 | Tags/eyebrows, UPPERCASE (Latin only) |

> The generic template's blue/email values are intentionally **not** used; this scale and the [rose palette](01-colors.md) supersede them for this beauty-brand product.

## 3. Usage rules

- One `h1` per screen (the screen title).
- Buttons use `label` (14/500). Never use `body` weight on primary CTAs.
- Prices: `h3` weight 700 with currency in `caption` next to it (e.g. **٢٥٠** ر.س).
- Truncate provider names/titles to one line with ellipsis; never wrap to 3+ lines in cards.
- RTL: text-align follows locale (`right` for ar, `left` for en). Use logical alignment (`start`/`end`), not hardcoded left/right. See [spacing-layout](03-spacing-layout.md).
- Minimum body size is `caption` (12) — never render readable text smaller.

## 4. Accessibility

- Support OS Dynamic Type / font scaling up to **130%** without layout breakage (test `h1`, body, buttons).
- Maintain AA contrast per [colors §6](01-colors.md).
- Don't rely on weight alone to signal importance for screen readers — use semantic roles/labels.

## 5. Token JSON (source of truth)

```json
{
  "font": {
    "family": { "arabic": "Tajawal", "latin": "Inter" },
    "weight": { "regular": 400, "medium": 500, "semibold": 600, "bold": 700 }
  },
  "type": {
    "display":  { "size": 28, "lineHeight": 40, "weight": 700 },
    "h1":       { "size": 24, "lineHeight": 34, "weight": 700 },
    "h2":       { "size": 20, "lineHeight": 30, "weight": 700 },
    "h3":       { "size": 18, "lineHeight": 28, "weight": 600 },
    "bodyLg":   { "size": 16, "lineHeight": 26, "weight": 400 },
    "body":     { "size": 14, "lineHeight": 22, "weight": 400 },
    "label":    { "size": 14, "lineHeight": 20, "weight": 500 },
    "caption":  { "size": 12, "lineHeight": 18, "weight": 400 },
    "overline": { "size": 11, "lineHeight": 16, "weight": 600 }
  }
}
```
