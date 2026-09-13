/* Additional screens: Notifications, ChatList, Chat, BookingDetail, Rate, Favorites, PaymentMethods, Premium */
const DS_M = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

/* -------- Notifications -------- */
function NotificationsScreen({ nav, notifications }) {
  const { AppBar, Icon, ListItem, EmptyState } = DS_M;
  const dot = (type) => ({
    success: 'var(--success-500)', info: 'var(--info-500)', warning: 'var(--warning-500)', error: 'var(--error-500)',
  })[type] || 'var(--primary-500)';
  return (
    <div>
      <AppBar onBack={() => nav('back')} title="الإشعارات" raised
        actions={<button style={{ border: 'none', background: 'transparent', color: 'var(--action-primary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)', cursor: 'pointer', padding: '0 12px' }}>قراءة الكل</button>} />
      {notifications.length === 0 ? (
        <EmptyState icon="notifications_off" title="لا إشعارات بعد">سنخبركِ هنا بكل ما يخص حجوزاتكِ</EmptyState>
      ) : (
        <div>
          {notifications.map((n) => (
            <ListItem key={n.id} divider
              leading={<span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-tint)', color: dot(n.type), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={n.icon} size="sm" fill /></span>}
              title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{n.title}{n.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)' }} />}</span>}
              subtitle={<span><span style={{ color: 'var(--text-secondary)' }}>{n.body}</span><br /><span style={{ color: 'var(--text-disabled)', font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)' }}>{n.time}</span></span>}
              style={{ background: n.unread ? 'var(--bg-tint)' : 'transparent' }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Chat list -------- */
function ChatListScreen({ nav, chats }) {
  const { AppBar, Avatar, Badge, EmptyState } = DS_M;
  return (
    <div>
      <AppBar title="المحادثات" />
      {chats.length === 0 ? <EmptyState icon="chat_bubble_outline" title="لا محادثات">ابدئي بحجز خدمة لتظهر هنا</EmptyState> : (
        <div>
          {chats.map((c) => (
            <button key={c.id} onClick={() => nav('chat', { id: c.id })} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)', width: '100%',
              background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-default)', cursor: 'pointer', textAlign: 'start',
            }}>
              <Avatar src={c.image} name={c.name} size="md" online={c.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.4 var(--font-base)', color: 'var(--text-primary)' }}>{c.name}</span>
                  <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: c.unread ? 'var(--action-primary)' : 'var(--text-disabled)' }}>{c.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
                  <span style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: c.unread ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</span>
                  {c.unread > 0 && <Badge count={c.unread} />}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Chat conversation -------- */
function ChatScreen({ nav, chat }) {
  const { AppBar, Avatar, Icon, IconButton } = DS_M;
  const [msgs, setMsgs] = React.useState(chat.messages.length ? chat.messages : [
    { from: 'them', text: 'مرحباً 🌸 كيف يمكنني خدمتكِ؟', time: 'الآن' },
  ]);
  const [draft, setDraft] = React.useState('');
  const send = () => { if (!draft.trim()) return; setMsgs([...msgs, { from: 'me', text: draft, time: 'الآن' }]); setDraft(''); };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar onBack={() => nav('back')} raised
        leading={<button onClick={() => nav('back')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrow_forward" size="md" mirror /></button>}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Avatar src={chat.image} name={chat.name} size="sm" online={chat.online} />
            <div>
              <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.2 var(--font-base)', color: 'var(--text-primary)' }}>{chat.name}</div>
              <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: chat.online ? 'var(--success-500)' : 'var(--text-secondary)' }}>{chat.online ? 'متصلة الآن' : 'غير متصلة'}</div>
            </div>
          </div>
        }
        actions={<IconButton icon="call" label="اتصال" />} />

      <div style={{ flex: 1, padding: 'var(--space-3) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflowY: 'auto', background: 'var(--bg-surface)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-start' : 'flex-end' }}>
            <div style={{
              maxWidth: '78%', padding: '10px 14px',
              borderRadius: m.from === 'me' ? '16px 16px 6px 16px' : '16px 16px 16px 6px',
              background: m.from === 'me' ? 'var(--action-primary)' : 'var(--bg-canvas)',
              color: m.from === 'me' ? '#fff' : 'var(--text-primary)',
              border: m.from === 'me' ? 'none' : '1px solid var(--border-default)',
              font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)',
            }}>
              <div>{m.text}</div>
              <div style={{ font: 'var(--type-caption-weight) 11px/1 var(--font-base)', opacity: 0.7, marginTop: 4, textAlign: 'end' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-3)', borderTop: '1px solid var(--border-default)', background: 'var(--bg-canvas)' }}>
        <IconButton icon="add_circle" label="إرفاق" />
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="اكتبي رسالة…" onKeyDown={(e) => e.key === 'Enter' && send()}
          style={{ flex: 1, border: '1px solid var(--border-default)', borderRadius: 999, outline: 'none', padding: '10px 16px', background: 'var(--bg-surface)', font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-base)', color: 'var(--text-primary)' }} />
        <IconButton icon="send" label="إرسال" mirror variant="filled" onClick={send} />
      </div>
    </div>
  );
}

/* -------- Booking detail (timeline + actions) -------- */
function BookingDetailScreen({ nav, booking }) {
  const { AppBar, Avatar, IconButton, StatusChip, Banner, Money, Button, Icon, ListItem } = DS_M;
  const steps = [
    { key: 'pending_provider', label: 'تأكيد الحجز' },
    { key: 'confirmed', label: 'مؤكّد' },
    { key: 'on_the_way', label: 'في الطريق' },
    { key: 'in_progress', label: 'جارٍ التنفيذ' },
    { key: 'completed', label: 'مكتمل' },
  ];
  const order = steps.map((s) => s.key);
  const idx = Math.max(0, order.indexOf(booking.status));
  return (
    <div style={{ paddingBottom: 'var(--space-4)' }}>
      <AppBar onBack={() => nav('back')} title="تفاصيل الحجز" raised
        actions={<IconButton icon="more_horiz" label="المزيد" />} />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusChip status={booking.status} />
          <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>رقم الحجز #{booking.id}</span>
        </div>
        {booking.status === 'on_the_way' && <Banner variant="info" icon="directions_car" title="المقدّمة في الطريق إليكِ">الوصول المتوقّع خلال ١٥ دقيقة — يمكنكِ متابعتها أو إرسال رسالة.</Banner>}
        {booking.status === 'confirmed' && <Banner variant="success" icon="check_circle">مقدّمة الخدمة أكّدت موعدكِ — سنذكّركِ قبل الموعد.</Banner>}

        {/* Timeline */}
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          {steps.map((s, i) => {
            const done = i <= idx; const active = i === idx;
            return (
              <div key={s.key} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', paddingBlock: 'var(--space-2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: done ? 'var(--primary-500)' : 'var(--neutral-200)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    {done ? <Icon name="check" size="xs" /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neutral-400)' }} />}
                  </span>
                  {i < steps.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 16, background: done && i < idx ? 'var(--primary-500)' : 'var(--neutral-200)' }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 'var(--space-1)' }}>
                  <div style={{ font: `var(--weight-${active ? 'semibold' : 'medium'}) var(--type-body-size)/1.4 var(--font-base)`, color: done ? 'var(--text-primary)' : 'var(--text-disabled)' }}>{s.label}</div>
                  {active && <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>الحالة الحالية</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar src={booking.providerImage} name={booking.providerName} size="md" />
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{booking.service}</div>
              <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{booking.providerName}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)' }}><Icon name="event" size="sm" />{booking.date} · {booking.time}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)' }}><Icon name="location_on" size="sm" />{booking.address}</div>
          </div>
          <div style={{ height: 1, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--text-secondary)' }}>الإجمالي</span>
            <Money amount={booking.price} emphasis="lg" />
          </div>
        </div>

        {/* QR */}
        {(booking.status === 'confirmed' || booking.status === 'on_the_way') && (
          <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 80, height: 80, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
              <Icon name="qr_code_2" size={64} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>رمز الدخول</div>
              <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>أظهري الرمز للمقدّمة عند وصولها للتحقّق.</div>
            </div>
          </div>
        )}
      </div>

      <StickyFooter>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" leadingIcon="chat_bubble" onClick={() => nav('chat-by-provider', { providerId: booking.providerId })}>مراسلة</Button>
          {booking.status === 'completed'
            ? <Button fullWidth leadingIcon="star" onClick={() => nav('rate', { bookingId: booking.id })}>تقييم</Button>
            : booking.status.startsWith('cancelled')
              ? <Button fullWidth variant="secondary" onClick={() => nav('home')}>احجزي مجدداً</Button>
              : <>
                  <Button variant="ghost" style={{ color: 'var(--error-500)' }} onClick={() => nav('cancel-booking', { id: booking.id })}>إلغاء</Button>
                  <Button fullWidth variant="secondary" leadingIcon="event_repeat">إعادة جدولة</Button>
                </>}
        </div>
      </StickyFooter>
    </div>
  );
}

/* -------- Rate & review -------- */
function RateScreen({ nav, booking }) {
  const { AppBar, Avatar, RatingStars, TextInput, Button, Chip } = DS_M;
  const [rating, setRating] = React.useState(5);
  const [tags, setTags] = React.useState({ time: true, clean: true });
  const [review, setReview] = React.useState('');
  const tagList = [['time','الالتزام بالوقت'],['clean','النظافة'],['pro','الاحترافية'],['friendly','اللطف'],['skill','الجودة']];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar onBack={() => nav('back')} title="قيّمي الخدمة" raised />
      <div style={{ flex: 1, padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar src={booking.providerImage} name={booking.providerName} size="md" />
          <div>
            <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{booking.providerName}</div>
            <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{booking.service} · {booking.date}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-5)', background: 'var(--bg-tint)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>كيف كانت تجربتكِ؟</div>
          <RatingStars input value={rating} size="md" onChange={setRating} />
          <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>
            {rating === 5 ? 'ممتاز' : rating === 4 ? 'جيد جداً' : rating === 3 ? 'جيد' : rating === 2 ? 'لا بأس' : 'يحتاج تحسين'}
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--weight-medium) var(--type-label-size)/1.3 var(--font-base)', marginBottom: 'var(--space-2)' }}>ما الذي أعجبكِ؟</div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {tagList.map(([k, l]) => <Chip key={k} selected={!!tags[k]} onClick={() => setTags({ ...tags, [k]: !tags[k] })}>{l}</Chip>)}
          </div>
        </div>

        <TextInput label="مراجعتكِ (اختياري)" value={review} onChange={(e) => setReview(e.target.value)} multiline rows={3} placeholder="شاركي تجربتكِ مع عميلات أخريات…" />
      </div>
      <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-default)' }}>
        <Button fullWidth onClick={() => nav('bookings')}>إرسال التقييم</Button>
      </div>
    </div>
  );
}

/* -------- Favorites -------- */
function FavoritesScreen({ nav, providers, fav, toggleFav }) {
  const { AppBar, ProviderCard, EmptyState } = DS_M;
  const list = providers.filter((p) => fav[p.id]);
  return (
    <div>
      <AppBar onBack={() => nav('back')} title="المفضّلة" />
      {list.length === 0 ? <EmptyState icon="favorite_border" title="لا مقدّمات في المفضّلة" cta="تصفّحي المقدّمات" onCta={() => nav('home')}>اضغطي على القلب في الملف الشخصي لإضافة مقدّمات هنا</EmptyState> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-4)' }}>
          {list.map((p) => (
            <ProviderCard key={p.id} {...p} favorite
              onClick={() => nav('provider', { id: p.id })}
              onToggleFavorite={() => toggleFav(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Payment methods -------- */
function PaymentMethodsScreen({ nav, methods }) {
  const { AppBar, Icon, ListItem, Button, Banner } = DS_M;
  const BrandMark = ({ m }) => {
    const id = (m.brand || m.id || '').toLowerCase();
    if (id.includes('apple')) return <window.ApplePayLogo height={16} />;
    if (id.includes('mada'))  return <window.MadaLogo  height={18} />;
    if (id.includes('stc'))   return <window.StcPayLogo height={18} />;
    if (id.includes('visa'))  return <window.VisaLogo  height={12} />;
    return <Icon name="credit_card" size="sm" />;
  };
  return (
    <div>
      <AppBar onBack={() => nav('back')} title="طرق الدفع" />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Banner variant="info" icon="lock">بياناتكِ محفوظة بأمان لدى مزوّد الدفع — لا يصل التطبيق لأرقام البطاقات.</Banner>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {methods.map((m, i) => (
            <ListItem key={m.id}
              leading={<span style={{ width: 56, height: 36, padding: '0 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}><BrandMark m={m} /></span>}
              title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{m.label}{m.last4 && <span className="ns-ltr" style={{ color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-latin)' }}>•••• {m.last4}</span>}</span>}
              subtitle={<span>{m.sub}{m.default && <span style={{ marginInlineStart: 8, color: 'var(--success-500)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)' }}>· افتراضي</span>}</span>}
              trailing={<Icon name="more_horiz" size="sm" color="var(--text-secondary)" />}
              divider={i < methods.length - 1} />
          ))}
        </div>
        <Button variant="secondary" fullWidth leadingIcon="add">إضافة بطاقة جديدة</Button>
      </div>
    </div>
  );
}

/* -------- Premium subscription -------- */
function PremiumScreen({ nav, premium }) {
  const { AppBar, Icon, Button, Money } = DS_M;
  const [plan, setPlan] = React.useState('y');
  const selected = premium.plans.find((p) => p.id === plan) || premium.plans[0];
  return (
    <div>
      {/* Hero header */}
      <div style={{ position: 'relative', background: 'linear-gradient(160deg, var(--primary-600), var(--primary-800))', color: '#fff', padding: 'var(--space-4) var(--space-4) calc(var(--space-7) + 24px)' }}>
        <button onClick={() => nav('back')} aria-label="رجوع" style={{ border: 'none', background: 'rgba(255,255,255,0.18)', cursor: 'pointer', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <Icon name="arrow_forward" size="sm" mirror />
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingInline: 12, height: 26, borderRadius: 999, background: 'var(--secondary-500)', color: '#fff', font: '600 11px/1 var(--font-latin)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          <Icon name="workspace_premium" size="xs" fill /> Home Beauty Premium
        </div>
        <div style={{ font: '700 26px/1.25 var(--font-base)', marginTop: 'var(--space-3)' }}>تجربة تجميل لا مثيل لها</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', opacity: 0.92, marginTop: 6 }}>وفّري ١٠٪ على كل حجز مع وصول حصري لأفضل المقدّمات.</div>
      </div>

      <div style={{ padding: '0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: -28 }}>
        {/* Plans */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 14 }}>
          {premium.plans.map((pl) => {
            const sel = plan === pl.id;
            return (
              <button key={pl.id} onClick={() => setPlan(pl.id)} style={{
                flex: 1, padding: 'var(--space-4) var(--space-3)', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
                border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
                position: 'relative', textAlign: 'center', boxShadow: sel ? 'var(--elevation-2)' : 'var(--elevation-1)',
              }}>
                {pl.featured && (
                  <span style={{
                    position: 'absolute', top: -12, insetInline: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none',
                  }}>
                    <span style={{
                      background: 'var(--secondary-500)', color: '#fff',
                      font: '600 10px/1 var(--font-latin)', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 999, letterSpacing: '.08em', whiteSpace: 'nowrap',
                    }}>الأكثر توفيراً</span>
                  </span>
                )}
                <div style={{ font: 'var(--weight-bold) var(--type-h3-size)/1.2 var(--font-base)', color: 'var(--text-primary)' }}>{pl.name}</div>
                <div style={{ margin: '10px 0 4px' }}><Money amount={pl.price} emphasis="lg" /></div>
                <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>/{pl.period}</div>
                {pl.save && <div style={{ color: 'var(--success-500)', fontWeight: 700, fontSize: 12, marginTop: 6 }}>{pl.save}</div>}
              </button>
            );
          })}
        </div>

        {/* Perks */}
        <div style={{ background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-1)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {premium.perks.map((p) => (
            <div key={p.title} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
              <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-tint)', color: 'var(--primary-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={p.icon} size="md" fill /></span>
              <div>
                <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{p.title}</div>
                <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)', color: 'var(--text-secondary)' }}>{p.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyFooter>
        <Button fullWidth leadingIcon="workspace_premium" onClick={() => nav('back')}>
          ابدئي بريميوم · تجربة مجانية ٤ أيام
        </Button>
        <div style={{ font: 'var(--type-caption-weight) 11px/1.4 var(--font-base)', color: 'var(--text-secondary)', marginTop: 8, textAlign: 'center' }}>
          ثم {selected.price} ر.س / {selected.period === 'شهر' ? 'شهر' : 'سنة'} — يمكن الإلغاء في أي وقت.
        </div>
      </StickyFooter>
    </div>
  );
}

Object.assign(window, { NotificationsScreen, ChatListScreen, ChatScreen, BookingDetailScreen, RateScreen, FavoritesScreen, PaymentMethodsScreen, PremiumScreen, AddressesScreen, CancelBookingScreen });

/* -------- Addresses (list + add row) -------- */
function AddressesScreen({ nav, addresses }) {
  const { AppBar, ListItem, Button, Icon, Chip } = DS_M;
  const [list, setList] = React.useState(addresses);
  return (
    <div>
      <AppBar onBack={() => nav('back')} title="العناوين المحفوظة" />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {list.map((a, i) => (
            <ListItem key={a.id} divider={i < list.length - 1}
              leading={<span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--bg-tint)', color: 'var(--primary-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="location_on" size="sm" fill /></span>}
              title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{a.label}{a.default && <Chip size="sm" selected>افتراضي</Chip>}</span>}
              subtitle={a.text}
              trailing={<Icon name="more_horiz" size="sm" color="var(--text-secondary)" />} />
          ))}
        </div>

        <button style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-strong)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', color: 'var(--action-primary)', font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-base)' }}>
          <Icon name="add_location_alt" size="md" />أضيفي عنواناً جديداً
        </button>

        <div style={{ marginTop: 'var(--space-2)', height: 180, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #e8eef5, #f3e8ed)', position: 'relative', overflow: 'hidden' }}>
          {/* Faux map */}
          <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
            <path d="M0 120 Q 100 80 200 110 T 400 100" stroke="#bcc7d6" strokeWidth="2" fill="none" />
            <path d="M0 60 Q 80 40 180 70 T 400 50" stroke="#bcc7d6" strokeWidth="2" fill="none" />
            <path d="M120 0 L 130 200 M 240 0 L 250 200" stroke="#dbe3ec" strokeWidth="1" />
          </svg>
          <span style={{ position: 'absolute', top: '50%', insetInlineStart: '50%', transform: 'translate(50%, -50%)', color: 'var(--primary-500)' }}>
            <Icon name="location_on" size="xl" fill />
          </span>
          <span style={{ position: 'absolute', insetInlineEnd: 12, bottom: 12, padding: '6px 12px', background: 'var(--bg-canvas)', borderRadius: 999, boxShadow: 'var(--elevation-2)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-primary)' }}>تحديد الموقع على الخريطة</span>
        </div>
      </div>
    </div>
  );
}

/* -------- Cancel booking (centered dialog feel) -------- */
function CancelBookingScreen({ nav, booking }) {
  const { AppBar, Button, Banner, Money, Icon } = DS_M;
  const [reason, setReason] = React.useState(null);
  const reasons = [
    ['conflict', 'تغيّرت خطّتي / تعارض موعد'],
    ['price', 'السعر'],
    ['provider', 'أفضّل مقدّمة أخرى'],
    ['mistake', 'حجزت بالخطأ'],
    ['other', 'سبب آخر'],
  ];
  return (
    <div>
      <AppBar onBack={() => nav('back')} title="إلغاء الحجز" raised />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--error-100)', color: 'var(--error-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="warning" size="xl" fill /></span>
          <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)', textAlign: 'center' }}>هل تريدين فعلاً الإلغاء؟</div>
          <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 320 }}>{booking ? `حجز ${booking.service} مع ${booking.providerName} يوم ${booking.date} الساعة ${booking.time}` : ''}</div>
        </div>

        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>إجمالي الحجز</span>
            <Money amount={booking ? booking.price : 0} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>قيمة الاسترداد</span>
            <Money amount={booking ? Math.round(booking.price * 0.5) : 0} tone="paid" />
          </div>
          <Banner variant="warning" icon="info">حجزكِ ضمن نافذة ٦–٢٤ ساعة قبل الموعد — يتم استرداد ٥٠٪ من المبلغ.</Banner>
        </div>

        <div>
          <div style={{ font: 'var(--weight-medium) var(--type-label-size)/1.3 var(--font-base)', marginBottom: 'var(--space-2)' }}>سبب الإلغاء (يساعدنا في التحسين)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {reasons.map(([k, l]) => (
              <button key={k} onClick={() => setReason(k)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'start',
                background: reason === k ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
                border: `1px solid ${reason === k ? 'var(--primary-300)' : 'var(--border-default)'}`,
                color: 'var(--text-primary)', cursor: 'pointer', font: 'var(--weight-medium) var(--type-body-size)/1.3 var(--font-base)',
              }}>
                {l}
                <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${reason === k ? 'var(--primary-500)' : 'var(--border-strong)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {reason === k && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary-500)' }} />}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" fullWidth onClick={() => nav('back')}>التراجع</Button>
          <Button variant="destructive" fullWidth onClick={() => nav('bookings')}>تأكيد الإلغاء</Button>
        </div>
      </div>
    </div>
  );
}
