/* Booking flow screens: BookingCreate, ReviewPay, Confirmation */
const DS_B = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

function BookingCreateScreen({ nav, provider, service, addresses, slotsData, days, total }) {
  const { AppBar, ListItem, Icon, Button, Chip, Banner } = DS_B;
  const [addr, setAddr] = React.useState(addresses[0].id);
  const [day, setDay] = React.useState(1);
  const [slot, setSlot] = React.useState('٣:٠٠ م');
  const ok = addr && slot;

  const slotGrid = (group, list, labelKey) => (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <div style={{ font: 'var(--type-overline-weight) var(--type-overline-size)/1 var(--font-base)', letterSpacing: '.06em', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{labelKey}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
        {list.map((t) => {
          const sel = slot === t;
          return (
            <button key={t} onClick={() => setSlot(t)}
              style={{ height: 40, borderRadius: 'var(--radius-sm)', border: `1px solid ${sel ? 'var(--primary-300)' : 'var(--border-default)'}`,
                background: sel ? 'var(--bg-tint)' : 'var(--bg-surface)', color: sel ? 'var(--primary-700)' : 'var(--text-primary)',
                font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)', cursor: 'pointer' }}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 'var(--space-4)' }}>
      <AppBar onBack={() => nav('back')} title="احجزي موعدك" raised />
      <div style={{ padding: 'var(--space-4)' }}>
        {/* Address */}
        <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>العنوان</div>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-5)' }}>
          {addresses.map((a, i) => (
            <ListItem key={a.id}
              leading={<span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${addr === a.id ? 'var(--primary-500)' : 'var(--border-strong)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {addr === a.id && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary-500)' }} />}
              </span>}
              title={a.label} subtitle={a.text} divider={i < addresses.length}
              onClick={() => setAddr(a.id)} />
          ))}
          <ListItem leadingIcon="add_location_alt" title="أضيفي عنواناً جديداً" chevron onClick={() => {}} />
        </div>

        {/* Date */}
        <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>التاريخ</div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 'var(--space-5)' }}>
          {days.map((d, i) => {
            const sel = day === i;
            return (
              <button key={i} onClick={() => setDay(i)}
                style={{ flexShrink: 0, width: 64, height: 76, borderRadius: 'var(--radius-md)', border: `1px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
                  background: sel ? 'var(--primary-500)' : 'var(--bg-surface-raised)', color: sel ? '#fff' : 'var(--text-primary)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, cursor: 'pointer' }}>
                <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', opacity: 0.85 }}>{d.d}</span>
                <span style={{ font: 'var(--weight-bold) 22px/1 var(--font-base)' }}>{d.n}</span>
              </button>
            );
          })}
        </div>

        {/* Time */}
        <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>الوقت</div>
        {slotGrid('morning', slotsData.morning, 'الصباح')}
        {slotGrid('afternoon', slotsData.afternoon, 'الظهر')}
        {slotGrid('evening', slotsData.evening, 'المساء')}

        <Banner variant="info" icon="info" style={{ marginTop: 'var(--space-4)' }}>
          المدة الإجمالية {service.duration} — تظهر فقط المواعيد المتاحة للمدّة الكاملة.
        </Banner>
      </div>

      <StickyFooter>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>{days[day].d} {days[day].n}</div>
            <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.2 var(--font-base)', color: 'var(--text-primary)' }}>الساعة {slot}</div>
          </div>
          <Button disabled={!ok} onClick={() => nav('review', { id: provider.id, serviceId: service.id, total, day: days[day], slot, addr })}>متابعة</Button>
        </div>
      </StickyFooter>
    </div>
  );
}

function ReviewPayScreen({ nav, provider, service, total, day, slot, addrText }) {
  const { AppBar, Avatar, Icon, Money, Banner, Button, ListItem } = DS_B;
  const [method, setMethod] = React.useState('mada');
  const [paying, setPaying] = React.useState(false);
  const travel = 15;
  const grand = total + travel;

  const methods = [
    { id: 'mada', label: 'مدى', sub: '•••• ٤٢١٨', icon: 'credit_card' },
    { id: 'apple', label: 'Apple Pay', sub: 'iPhone', icon: 'apple' },
    { id: 'stc', label: 'STC Pay', sub: 'محفظة', icon: 'account_balance_wallet' },
    { id: 'add', label: 'إضافة بطاقة', sub: 'مدى / Visa / Mastercard', icon: 'add' },
  ];

  const pay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); nav('confirmed', { id: provider.id, serviceId: service.id, total: grand, day, slot, addrText }); }, 1200);
  };

  return (
    <div style={{ paddingBottom: 'var(--space-4)' }}>
      <AppBar onBack={() => nav('back')} title="مراجعة ودفع" raised />
      <div style={{ padding: 'var(--space-4)' }}>
        {/* Summary */}
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={provider.name} size="md" premium={provider.premium} />
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)' }}>{service.name}</div>
              <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{provider.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Icon name="event" size="sm" />{day.d} {day.n} يونيو · {slot}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Icon name="location_on" size="sm" />{addrText}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Icon name="schedule" size="sm" />{service.duration}</div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)' }}>تفاصيل السعر</div>
          {[['الخدمة', total - travel - (total - service.price - travel)], ['إضافات', total - service.price], ['رسوم الانتقال', travel]].filter(r => r[1] > 0).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{k}</span><Money amount={v} />
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)' }}>الإجمالي</span>
            <Money amount={grand} emphasis="lg" />
          </div>
        </div>

        {/* Payment method */}
        <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)', margin: 'var(--space-5) 0 var(--space-2)' }}>طريقة الدفع</div>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {methods.map((m, i) => (
            <ListItem key={m.id} divider={i < methods.length - 1}
              leading={<Icon name={m.icon} size="sm" color={method === m.id ? 'var(--primary-500)' : 'var(--text-secondary)'} />}
              title={m.label} subtitle={m.sub}
              trailing={<span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${method === m.id ? 'var(--primary-500)' : 'var(--border-strong)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {method === m.id && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary-500)' }} />}
              </span>}
              onClick={() => setMethod(m.id)} />
          ))}
        </div>

        <Banner variant="warning" icon="lock" style={{ marginTop: 'var(--space-4)' }} title="سيُحجز المبلغ ولن يُخصم">يتم تحويل المبلغ للمقدّمة بعد اكتمال الخدمة فقط (نظام الحماية).</Banner>
        <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/var(--type-caption-lh) var(--font-base)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)', textAlign: 'center' }}>
          سياسة الإلغاء: استرداد كامل قبل قبول المقدّمة أو قبل ٢٤ ساعة · ٥٠٪ قبل ٦–٢٤ ساعة · لا استرداد قبل أقل من ٦ ساعات.
        </div>
      </div>

      <StickyFooter>
        <Button fullWidth loading={paying} leadingIcon="lock" onClick={pay}>ادفعي وأكّدي الحجز · {grand} ر.س</Button>
      </StickyFooter>
    </div>
  );
}

function ConfirmationScreen({ nav, provider, service, total, day, slot, addrText }) {
  const { AppBar, Icon, StatusChip, Banner, Money, Button, Avatar } = DS_B;
  return (
    <div style={{ paddingBottom: 24 }}>
      <AppBar title="تأكيد الحجز" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-7) var(--space-5)', background: 'var(--bg-tint)' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-500)', boxShadow: 'var(--elevation-3)' }}>
          <Icon name="check_circle" size={64} fill />
        </div>
        <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)', textAlign: 'center' }}>تم حجز موعدك</div>
        <StatusChip status="pending_provider" label="بانتظار تأكيد المقدّمة" />
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
          سنذكّرك قبل الموعد بـ٢٤ ساعة وقبل ساعتين، وستصلك إشعارات بحالة الحجز.
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Avatar name={provider.name} size="md" premium={provider.premium} />
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--weight-semibold) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', color: 'var(--text-primary)' }}>{service.name}</div>
              <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{provider.name}</div>
            </div>
            <Money amount={total} />
          </div>
          <div style={{ height: 1, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Icon name="event" size="sm" />{day.d} {day.n} يونيو · {slot}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Icon name="location_on" size="sm" />{addrText}</div>
          </div>
        </div>

        <Banner variant="info" icon="qr_code" title="رمز الدخول" style={{ marginTop: 'var(--space-4)' }}>
          سيظهر رمز QR للمقدّمة عند وصولها — تأكيد دخول آمن.
        </Banner>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" fullWidth onClick={() => nav('home')}>الرئيسية</Button>
          <Button fullWidth onClick={() => nav('bookings')}>عرض الحجز</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BookingCreateScreen, ReviewPayScreen, ConfirmationScreen });
