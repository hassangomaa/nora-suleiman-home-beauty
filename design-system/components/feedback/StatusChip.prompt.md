Feedback & state components: `Badge` (count/dot), `StatusChip` (booking status, icon mandatory), `Banner` (inline success/warning/error/info), `Skeleton` (shimmer loader), `EmptyState` (zero-result).

```jsx
<Badge count={3}><IconButton icon="notifications" label="الإشعارات" /></Badge>
<StatusChip status="on_the_way" />
<Banner variant="success" title="تم الدفع بنجاح">سيتم تأكيد حجزك قريباً</Banner>
<Skeleton height={120} radius="var(--radius-lg)" />
<EmptyState icon="event_busy" title="لا حجوزات قادمة" cta="تصفّحي الخدمات" onCta={go}>ابدئي بحجز خدمتك الأولى</EmptyState>
```

Every status uses an icon as well as color (never color alone).
