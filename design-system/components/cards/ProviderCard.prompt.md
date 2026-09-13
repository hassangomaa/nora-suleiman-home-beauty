Marketplace cards: `ProviderCard` (discovery), `ServiceCard` (service + price + book), `BookingCard` (status-colored booking), `ListItem` (generic row).

```jsx
<ProviderCard name="لطيفة العتيبي" specialty="ميك أب · عناية بالبشرة" rating={4.8} reviews={128}
  distance="٢٫٣ كم" premium favorite onClick={open} onToggleFavorite={fav} />
<ServiceCard name="ميك أب سهرة" description="إطلالة كاملة تدوم طوال المناسبة" price={250} duration="٦٠ دقيقة" onBook={book} />
<BookingCard status="confirmed" service="ميك أب سهرة" providerName="لطيفة العتيبي"
  date="٢٩ يونيو ٢٠٢٦" time="٣:٠٠ م" address="حي الياسمين، الرياض" price={250} />
<ListItem leadingIcon="location_on" title="المنزل" subtitle="حي الياسمين، الرياض" chevron onClick={edit} />
```

All cards: `radius/lg`, `elevation/1`, 16px padding, one composed tap target. Premium uses gold ring + badge.
