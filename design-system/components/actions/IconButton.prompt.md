Icon-only and floating action controls. `IconButton` carries a 44pt hit area and a required `label`; `Fab` is the bottom-anchored primary action.

```jsx
<IconButton icon="favorite" label="إضافة للمفضّلة" active />
<IconButton icon="arrow_forward" label="رجوع" mirror variant="tonal" />
<Fab icon="add" label="أضيفي خدمة" extended />
```

`active` fills the glyph and sets `aria-pressed`. Use `mirror` for back/forward chevrons.
