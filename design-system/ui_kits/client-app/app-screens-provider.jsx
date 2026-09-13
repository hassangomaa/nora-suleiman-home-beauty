/* Provider (vendor) side: Dashboard, Inbox, Wallet, Profile + helpers. */
const DS_P = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

const PROVIDER_BOOKINGS = [
  { id: 'rq1', status: 'pending_provider', service: 'ميك أب سهرة', providerName: 'ريم الشمري', providerImage: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=200&q=80', date: 'الإثنين ٢٩ يونيو', time: '٣:٠٠ م', address: 'حي الياسمين، الرياض', price: 250, scope: 'new' },
  { id: 'rq2', status: 'pending_provider', service: 'مكياج نهاري', providerName: 'دانة كمال',    providerImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', date: 'الأربعاء ١ يوليو', time: '٥:٠٠ م', address: 'حي النرجس، الرياض', price: 180, scope: 'new' },
  { id: 'up1', status: 'confirmed',        service: 'ميك أب عروس',  providerName: 'هند المالكي',  providerImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80', date: 'السبت ٢٧ يونيو', time: '٢:٠٠ م', address: 'حي العقيق، الرياض', price: 850, scope: 'upcoming' },
  { id: 'up2', status: 'on_the_way',       service: 'ميك أب سهرة',  providerName: 'لمى السعدون', providerImage: 'https://images.unsplash.com/photo-1546961342-ec8d4e98e92f?w=200&q=80', date: 'اليوم',         time: '٦:٠٠ م', address: 'حي الياسمين، الرياض', price: 250, scope: 'upcoming' },
  { id: 'pa1', status: 'completed',        service: 'ميك أب سهرة',  providerName: 'منى الزهراني', providerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', date: '٢٥ يونيو',      time: '٧:٠٠ م', address: 'حي الملقا، الرياض',  price: 250, scope: 'past', rating: 5 },
  { id: 'pa2', status: 'completed',        service: 'مكياج نهاري',  providerName: 'سارة م.',      providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', date: '٢٢ يونيو',      time: '١٠:٠٠ ص', address: 'حي النرجس، الرياض', price: 180, scope: 'past', rating: 4 },
];

const PROVIDER_TX = [
  { id: 't1', kind: 'earning', label: 'ميك أب سهرة · منى الزهراني', date: '٢٥ يونيو', amount: 246, fee: 4 },
  { id: 't2', kind: 'earning', label: 'مكياج نهاري · سارة م.',      date: '٢٢ يونيو', amount: 177, fee: 3 },
  { id: 't3', kind: 'payout',  label: 'سحب للبنك الأهلي',           date: '٢٠ يونيو', amount: -800 },
  { id: 't4', kind: 'earning', label: 'ميك أب عروس · ندى س.',        date: '١٨ يونيو', amount: 836, fee: 14 },
];

/* -------- Provider header (greeting + availability toggle + premium badge) -------- */
function ProviderHeader({ available, onToggle }) {
  const { Icon } = DS_P;
  return (
    <div style={{ background: 'var(--bg-tint)', padding: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/1.2 var(--font-base)', color: 'var(--text-primary)' }}>أهلاً لطيفة 🌸</div>
          <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/1.5 var(--font-base)', color: 'var(--text-secondary)' }}>لوحة تحكمكِ كمقدّمة خدمة</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, paddingInline: 10, height: 24, borderRadius: 'var(--radius-sm)', background: 'var(--secondary-100)', color: 'var(--secondary-700)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)' }}>
          <Icon name="workspace_premium" size="xs" fill />ذهبي
        </span>
      </div>
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--elevation-1)' }}>
        <span style={{ width: 36, height: 36, borderRadius: '50%', background: available ? 'var(--success-100)' : 'var(--neutral-100)', color: available ? 'var(--success-500)' : 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="circle" size="xs" fill /></span>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{available ? 'متاحة لاستقبال الحجوزات' : 'غير متاحة حالياً'}</div>
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{available ? 'ملفّكِ ظاهر في البحث' : 'لن تستقبلي حجوزات جديدة'}</div>
        </div>
        <button onClick={onToggle} aria-pressed={available} style={{ width: 48, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: available ? 'var(--success-500)' : 'var(--neutral-300)', position: 'relative', transition: 'background .2s' }}>
          <span style={{ position: 'absolute', top: 2, [available ? 'insetInlineStart' : 'insetInlineEnd']: 2, width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: 'var(--elevation-1)' }} />
        </button>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, accent }) {
  const { Icon } = DS_P;
  return (
    <div style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-tint)', color: accent || 'var(--primary-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size="sm" fill /></span>
      <span style={{ font: 'var(--weight-bold) var(--type-h2-size)/1.1 var(--font-base)', color: 'var(--text-primary)' }}>{value}</span>
      <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

/* -------- Provider Dashboard -------- */
function ProviderDashboard({ nav }) {
  const { BookingCard, Button, Money } = DS_P;
  const [avail, setAvail] = React.useState(true);
  const requests = PROVIDER_BOOKINGS.filter((b) => b.scope === 'new');
  const today = PROVIDER_BOOKINGS.find((b) => b.date === 'اليوم');
  return (
    <div>
      <ProviderHeader available={avail} onToggle={() => setAvail(!avail)} />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <StatTile icon="event_available" label="حجوزات قادمة" value="٤" />
          <StatTile icon="payments"        label="أرباح الأسبوع" value="١٬٢٥٩ ر.س" accent="var(--success-500)" />
          <StatTile icon="star"            label="التقييم" value="٤٫٩" accent="var(--secondary-500)" />
        </div>

        {requests.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>طلبات جديدة</span>
              <button onClick={() => nav('p-inbox')} style={{ border: 'none', background: 'transparent', color: 'var(--action-primary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)', cursor: 'pointer' }}>عرض الكل ({requests.length})</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {requests.slice(0, 1).map((b) => (
                <BookingCard key={b.id} {...b}
                  actions={<><Button size="sm" variant="ghost">رفض</Button><Button size="sm">قبول</Button></>} />
              ))}
            </div>
          </div>
        )}

        {today && (
          <div>
            <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>اليوم</div>
            <BookingCard {...today} onClick={() => nav('p-inbox')} />
          </div>
        )}

        <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, var(--secondary-100), var(--primary-50))', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--secondary-700)' }}>ارفعي ظهور ملفّكِ</div>
              <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/1.5 var(--font-base)', color: 'var(--text-secondary)' }}>الباقة الذهبية تظهر ملفّكِ في أوّل النتائج لمدّة ٥ أيام.</div>
            </div>
            <Button size="sm" onClick={() => nav('provider-tier')}>ترقية</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- Provider Bookings Inbox -------- */
function ProviderInbox({ nav }) {
  const { AppBar, BookingCard, Chip, Button, EmptyState } = DS_P;
  const [tab, setTab] = React.useState('new');
  const list = PROVIDER_BOOKINGS.filter((b) => b.scope === tab);
  return (
    <div>
      <AppBar title="الحجوزات" />
      <div style={{ display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-4) var(--space-4)' }}>
        <Chip selected={tab === 'new'}      onClick={() => setTab('new')}>جديدة</Chip>
        <Chip selected={tab === 'upcoming'} onClick={() => setTab('upcoming')}>قادمة</Chip>
        <Chip selected={tab === 'past'}     onClick={() => setTab('past')}>منتهية</Chip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 var(--space-4) var(--space-7)' }}>
        {list.length === 0 ? <EmptyState icon="event_available" title="لا حجوزات في هذا القسم" /> : list.map((b) => (
          <BookingCard key={b.id} {...b}
            actions={
              b.scope === 'new' ? <><Button size="sm" variant="ghost">رفض</Button><Button size="sm">قبول</Button></> :
              b.scope === 'upcoming' ? <Button size="sm" variant="secondary" leadingIcon="qr_code_scanner">مسح الرمز</Button> :
              null
            } />
        ))}
      </div>
    </div>
  );
}

/* -------- Provider Wallet -------- */
function ProviderWallet({ nav }) {
  const { AppBar, Money, Button, Icon, ListItem, Banner } = DS_P;
  return (
    <div>
      <AppBar title="المحفظة" />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Balance hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', color: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--elevation-2)' }}>
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', opacity: 0.85 }}>الرصيد المتاح</div>
          <div style={{ font: '700 32px/1.1 var(--font-base)', marginTop: 4 }}>٢٬٤٨٧ ر.س</div>
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', opacity: 0.85, marginTop: 6 }}>+ ١٬٢٥٩ ر.س هذا الأسبوع</div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
            <Button leadingIcon="account_balance" style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(6px)' }}>سحب للبنك</Button>
            <Button variant="ghost" style={{ color: '#fff', border: '1px solid rgba(255,255,255,.4)' }}>سجل الحركات</Button>
          </div>
        </div>

        <Banner variant="info" icon="info">يتم إيداع المبلغ في حساب المقدّمة خلال ١-٣ أيام عمل بعد طلب السحب.</Banner>

        <div>
          <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>هذا الشهر</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <StatTile icon="trending_up" label="إجمالي الأرباح" value="٣٬٢٢٤ ر.س" accent="var(--success-500)" />
            <StatTile icon="receipt_long" label="عمولة المنصّة" value="٤٨ ر.س" />
            <StatTile icon="checklist"   label="حجوزات مكتملة" value="١٧" />
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>آخر الحركات</div>
          <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {PROVIDER_TX.map((t, i) => (
              <ListItem key={t.id} divider={i < PROVIDER_TX.length - 1}
                leading={<span style={{ width: 36, height: 36, borderRadius: '50%', background: t.amount > 0 ? 'var(--success-100)' : 'var(--warning-100)', color: t.amount > 0 ? 'var(--success-500)' : 'var(--warning-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={t.amount > 0 ? 'south_west' : 'north_east'} size="sm" /></span>}
                title={t.label} subtitle={<span>{t.date}{t.fee ? ` · عمولة ${t.fee} ر.س` : ''}</span>}
                trailing={<span style={{ font: `var(--weight-semibold) var(--type-body-size)/1 var(--font-base)`, color: t.amount > 0 ? 'var(--success-500)' : 'var(--text-primary)' }}>{t.amount > 0 ? '+' : ''}{Math.abs(t.amount)} ر.س</span>} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- Provider Profile -------- */
function ProviderProfile({ nav }) {
  const { AppBar, Avatar, Button, ListItem, Icon, RatingStars } = DS_P;
  return (
    <div>
      <AppBar title="ملفّي" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4)', background: 'var(--bg-tint)' }}>
        <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" name="لطيفة العتيبي" size="xl" premium />
        <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)' }}>لطيفة العتيبي</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>ميك أب · عناية بالبشرة</div>
        <RatingStars value={4.9} count={214} />
        <Button variant="ghost" size="sm" leadingIcon="edit">تعديل الملف</Button>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>الخدمات</div>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <ListItem leadingIcon="palette" title="ميك أب سهرة" subtitle="٢٥٠ ر.س · ٦٠ دقيقة" trailing={<Icon name="edit" size="sm" color="var(--text-secondary)" />} divider />
          <ListItem leadingIcon="favorite" title="ميك أب عروس" subtitle="٨٥٠ ر.س · ١٨٠ دقيقة" trailing={<Icon name="edit" size="sm" color="var(--text-secondary)" />} divider />
          <ListItem leadingIcon="add" title="إضافة خدمة جديدة" chevron />
        </div>
      </div>

      <div style={{ padding: '0 var(--space-4)' }}>
        <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>معرض الأعمال</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          {['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80','https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80','https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&q=80','https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&q=80'].map((src, i) => (
            <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-tint)' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          ))}
          <div style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '2px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Icon name="add_a_photo" size="lg" /></div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <ListItem leadingIcon="schedule" title="ساعات العمل" subtitle="السبت – الخميس · ١٠ ص – ١٠ م" chevron />
          <ListItem leadingIcon="account_balance" title="بيانات السحب" subtitle="البنك الأهلي • IBAN •••• ٤١٢٣" chevron divider />
          <ListItem leadingIcon="workspace_premium" title="باقة الظهور" subtitle="الذهبية — تنتهي بعد ٣ أيام" chevron onClick={() => nav('provider-tier')} />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        <Button variant="secondary" fullWidth leadingIcon="swap_horiz" onClick={() => nav('switch-to-client')}>التحويل للوضع العميلة</Button>
      </div>
    </div>
  );
}

Object.assign(window, { ProviderDashboard, ProviderInbox, ProviderWallet, ProviderProfile });
