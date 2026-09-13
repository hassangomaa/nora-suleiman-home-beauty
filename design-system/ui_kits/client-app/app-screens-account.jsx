/* Account screens: Bookings list, Profile */
const DS_A = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

function BookingsScreen({ nav, bookings }) {
  const { AppBar, BookingCard, EmptyState, Button, Chip } = DS_A;
  const [tab, setTab] = React.useState('upcoming');
  const list = bookings.filter((b) => b.scope === tab);
  return (
    <div>
      <AppBar title="حجوزاتي" raised={false} />
      <div style={{ display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-4) var(--space-4)' }}>
        <Chip selected={tab === 'upcoming'} onClick={() => setTab('upcoming')}>القادمة</Chip>
        <Chip selected={tab === 'past'} onClick={() => setTab('past')}>السابقة</Chip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 var(--space-4) var(--space-7)' }}>
        {list.length === 0 ? (
          <EmptyState icon={tab === 'upcoming' ? 'event_busy' : 'history'}
            title={tab === 'upcoming' ? 'لا حجوزات قادمة' : 'لا حجوزات سابقة'}
            cta={tab === 'upcoming' ? 'تصفّحي الخدمات' : undefined}
            onCta={() => nav('home')}>
            {tab === 'upcoming' ? 'ابدئي بحجز خدمتك الأولى' : 'حجوزاتك المكتملة ستظهر هنا'}
          </EmptyState>
        ) : list.map((b) => (
          <BookingCard key={b.id} {...b}
            onClick={() => nav('booking-detail', { id: b.id })}
            actions={
              b.status === 'completed' ? <Button size="sm" onClick={(e) => { e.stopPropagation && e.stopPropagation(); nav('rate', { bookingId: b.id }); }}>تقييم</Button> :
              b.status === 'confirmed' || b.status === 'on_the_way' ? <>
                <Button size="sm" variant="ghost">إلغاء</Button>
                <Button size="sm" variant="secondary">إعادة جدولة</Button>
              </> : null
            } />
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ nav }) {
  const { AppBar, Avatar, Button, ListItem, Icon } = DS_A;
  return (
    <div>
      <AppBar title="حسابي" raised={false} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4) var(--space-5)' }}>
        <Avatar name="ريم الشمري" size="xl" />
        <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)' }}>ريم الشمري</div>
        <span className="ns-ltr" style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>+966 5X XXX XXXX</span>
        <Button variant="ghost" size="sm" leadingIcon="edit">تعديل الملف</Button>
      </div>

      <div style={{ background: 'var(--bg-surface-raised)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        {[
          ['location_on', 'العناوين المحفوظة', '٢ عناوين', 'addresses'],
          ['credit_card', 'طرق الدفع', 'مدى •••• ٤٢١٨', 'payment-methods'],
          ['favorite', 'المفضّلة', '٣ مقدّمات', 'favorites'],
          ['notifications', 'الإشعارات', 'مفعّلة', 'notifications'],
          ['chat_bubble', 'المحادثات', '', 'chats'],
          ['help', 'الدعم والمساعدة', '', 'support'],
          ['settings', 'الإعدادات', '', 'settings'],
        ].map((row, i, arr) => (
          <ListItem key={row[1]} leadingIcon={row[0]} title={row[1]}
            trailing={row[2] && <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>{row[2]}</span>}
            chevron divider={i < arr.length - 1} onClick={() => nav(row[3])} />
        ))}
      </div>

      <div style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', color: '#fff', margin: 'var(--space-4)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }} onClick={() => nav('premium')}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--secondary-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="workspace_premium" size="md" fill /></span>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--weight-bold) var(--type-h3-size)/1.2 var(--font-base)' }}>انضمي لبريميوم</div>
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', opacity: 0.9 }}>خصم ١٠٪ على كل حجز + كاش باك ٥٪</div>
        </div>
        <Icon name="chevron_left" size="sm" mirror />
      </div>

      <div style={{ background: 'var(--bg-surface-raised)', borderBottom: '1px solid var(--border-default)' }}>
        <ListItem leading={<span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--secondary-100)', color: 'var(--secondary-700)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="store" size="sm" fill /></span>}
          title="كوني مقدّمة خدمة" subtitle="ابدئي العمل واستقبلي حجوزاتك" chevron onClick={() => nav('provider-setup', { role: 'provider', via: 'phone' })} />
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        <Button variant="ghost" fullWidth leadingIcon="logout" style={{ color: 'var(--error-500)' }}>تسجيل الخروج</Button>
      </div>
    </div>
  );
}

Object.assign(window, { BookingsScreen, ProfileScreen });
