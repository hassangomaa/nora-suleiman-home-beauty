Form & query inputs: `TextInput` (labelled field, helper/error states), `SearchBar` (rounded query with lens + filter), `Chip` (assist / filter / removable pill).

```jsx
<TextInput label="رقم الجوال" leadingIcon="phone" value={v} onChange={set} error="أدخلي رقم جوال سعودي صحيح" />
<SearchBar value={q} onChange={setQ} onFilter={openFilters} filterActive />
<Chip leadingIcon="palette" selected onClick={toggle}>ميك أب</Chip>
<Chip removable onRemove={drop}>الرياض</Chip>
```

`TextInput` uses `body-lg` (16px) to prevent iOS zoom. Filter chips tint to rose when `selected`.
