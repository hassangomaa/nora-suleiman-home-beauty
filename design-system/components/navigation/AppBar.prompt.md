Navigation chrome: `AppBar` (top header with back/title/actions, raises on scroll) and `BottomNavBar` (client/provider tabs — active tab fills its icon and tints the label rose).

```jsx
<AppBar title="تفاصيل الحجز" onBack={goBack}
  actions={<IconButton icon="more_horiz" label="المزيد" />} />

<BottomNavBar active="discover" onChange={setTab} tabs={[
  { key: 'discover', icon: 'search', label: 'استكشفي' },
  { key: 'bookings', icon: 'event', label: 'حجوزاتي' },
  { key: 'chat', icon: 'chat_bubble', label: 'المحادثات', badge: 2 },
  { key: 'profile', icon: 'person', label: 'حسابي' },
]} />
```

Back chevron mirrors in RTL; tab order reverses with reading direction automatically.
