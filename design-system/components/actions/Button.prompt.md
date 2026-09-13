Primary action control — rose-filled by default, with secondary, ghost, and destructive variants.

```jsx
<Button onClick={book}>احجزي الآن</Button>
<Button variant="secondary" leadingIcon="chat_bubble">مراسلة</Button>
<Button variant="destructive">إلغاء الحجز</Button>
<Button loading fullWidth>جارٍ الدفع…</Button>
```

Sizes: `sm` 36 / `md` 44 / `lg` 48 (default CTA). Use `lg` for sticky footer CTAs, `secondary` for the paired non-primary action. Buttons use `label` type (14/500) — never body weight.
