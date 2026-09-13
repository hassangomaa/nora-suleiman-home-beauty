Display primitives: `Avatar` (image + initials/glyph fallback, online dot, gold premium ring), `RatingStars` (gold, display or 1–5 input), `Money` (SAR price with Arabic-Indic digits).

```jsx
<Avatar name="لطيفة العتيبي" size="lg" premium online />
<RatingStars value={4.5} count={128} />
<RatingStars input value={rating} onChange={setRating} size="md" />
<Money amount={250} emphasis="lg" suffix="/الخدمة" />
<Money amount={250} was={300} />
```

`Money` bidi-isolates the numeric run; `tone="held"` pairs with escrow notes.
