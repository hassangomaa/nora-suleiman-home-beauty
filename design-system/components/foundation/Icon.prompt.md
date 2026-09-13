Brand icon — a Material Symbols Rounded glyph rendered by ligature name; outline by default, filled for active states.

```jsx
<Icon name="favorite" />
<Icon name="favorite" fill color="var(--primary-500)" />
<Icon name="chevron_left" mirror size="sm" />
```

Use `fill` for active/selected states (e.g. active nav, favorited heart). Use `mirror` for direction-dependent glyphs (back/forward chevrons, chat send) so they flip in RTL. Sizes: `xs` 16, `sm` 20, `md` 24, `lg` 32, `xl` 48, or any number.
