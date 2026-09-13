/* Discovery screens: Home, Provider Profile, Service Detail */
const DS = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

function Hero({ children }) {
  return <div style={{ background: 'var(--bg-tint)', padding: 'var(--space-4) var(--space-4) var(--space-5)' }}>{children}</div>;
}

function SectionHeader({ children, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-4)', marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
      <span style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)' }}>{children}</span>
      {action && <button onClick={onAction} style={{ border: 'none', background: 'transparent', color: 'var(--action-primary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)', cursor: 'pointer' }}>{action}</button>}
    </div>
  );
}

function HomeScreen({ nav, data, fav, toggleFav }) {
  const { AppBar, SearchBar, Chip, ProviderCard, Icon, IconButton, Badge } = DS;
  const [spec, setSpec] = React.useState(null);
  const list = data.providers;
  return (
    <div>
      <Hero>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <Icon name="location_on" size="sm" fill color="var(--primary-500)" />
            <span style={{ font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-base)' }}>{data.area}</span>
            <Icon name="expand_more" size="sm" color="var(--text-secondary)" />
          </button>
          <Badge count={3}><IconButton icon="notifications" label="الإشعارات" onClick={() => nav('notifications')} /></Badge>
        </div>
        <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)', marginBottom: 4 }}>أهلاً ريم 🌸</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>ابحثي عن مقدّمة الخدمة المثالية لكِ</div>
        <SearchBar value="" onChange={() => {}} placeholder="ابحثي عن خدمة أو مقدّمة" onFilter={() => {}} />
      </Hero>

      <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', padding: 'var(--space-4)', scrollbarWidth: 'none' }}>
        {data.specialties.map((s) => (
          <button key={s.key} onClick={() => setSpec(spec === s.key ? null : s.key)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0, width: 68 }}>
            <span style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: spec === s.key ? 'var(--primary-500)' : 'var(--bg-tint)', color: spec === s.key ? '#fff' : 'var(--primary-500)', transition: 'all .15s' }}>
              <Icon name={s.icon} size="lg" fill={spec === s.key} />
            </span>
            <span style={{ font: 'var(--weight-medium) var(--type-caption-size)/1.2 var(--font-base)', color: 'var(--text-primary)', textAlign: 'center' }}>{s.label}</span>
          </button>
        ))}
      </div>

      <SectionHeader>مقدّمات قريبة منكِ</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 var(--space-4) var(--space-6)' }}>
        {list.map((p) => (
          <ProviderCard key={p.id} {...p} favorite={!!fav[p.id]}
            onClick={() => nav('provider', { id: p.id })}
            onToggleFavorite={() => toggleFav(p.id)} />
        ))}
      </div>
    </div>
  );
}

function ProviderScreen({ nav, provider, fav, toggleFav }) {
  const { AppBar, Avatar, RatingStars, Icon, IconButton, ServiceCard, ListItem, Button, Money } = DS;
  const [tab, setTab] = React.useState('services');
  return (
    <div style={{ paddingBottom: 'var(--space-4)' }}>
      <AppBar onBack={() => nav('back')} title="" raised
        actions={<>
          <IconButton icon="ios_share" label="مشاركة" />
          <IconButton icon="favorite" label="مفضّلة" active={!!fav[provider.id]} onClick={() => toggleFav(provider.id)} style={{ color: fav[provider.id] ? 'var(--primary-500)' : 'var(--text-secondary)' }} />
        </>} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-4) var(--space-5)', background: 'var(--bg-tint)' }}>
        <Avatar name={provider.name} size="xl" premium={provider.premium} />
        <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>{provider.name}</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{provider.specialty}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <RatingStars value={provider.rating} count={provider.reviews} size="sm" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>
            <Icon name="location_on" size="xs" />{provider.area} · {provider.distance}
          </span>
        </div>
        {provider.premium && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, paddingInline: 10, height: 24, borderRadius: 'var(--radius-sm)', background: 'var(--secondary-100)', color: 'var(--secondary-700)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)' }}>
            <Icon name="workspace_premium" size="xs" fill />مقدّمة مميّزة · {provider.premiumLabel}
          </span>
        )}
      </div>

      {/* Portfolio */}
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>معرض الأعمال</div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {(provider.portfolio || []).map((src, i) => (
            <div key={i} style={{ width: 130, height: 130, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', padding: '0 var(--space-4)', marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>الخدمات</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: '0 var(--space-4)' }}>
        {provider.services.map((s) => (
          <ServiceCard key={s.id} {...s} onBook={() => nav('service', { id: provider.id, serviceId: s.id })} />
        ))}
      </div>

      <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', padding: '0 var(--space-4)', margin: 'var(--space-5) 0 var(--space-3)', color: 'var(--text-primary)' }}>التقييمات</div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0 var(--space-4) var(--space-6)' }}>
        {provider.reviewsList.length === 0 && <span style={{ color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)' }}>لا توجد تقييمات بعد</span>}
        {provider.reviewsList.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-default)' }}>
            <Avatar name={r.name} size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: 'var(--weight-medium) var(--type-body-size)/1.4 var(--font-base)', color: 'var(--text-primary)' }}>{r.name}</span>
                <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-disabled)' }}>{r.date}</span>
              </div>
              <RatingStars value={r.rating} size="xs" showValue={false} />
              <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', marginTop: 4 }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer */}
      <StickyFooter>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="secondary" leadingIcon="chat_bubble" onClick={() => nav('chat-by-provider', { providerId: provider.id })}>مراسلة</Button>
          <Button fullWidth onClick={() => nav('service', { id: provider.id, serviceId: provider.services[0].id })}>احجزي الآن</Button>
        </div>
      </StickyFooter>
    </div>
  );
}

function ServiceScreen({ nav, provider, service }) {
  const { AppBar, Icon, IconButton, Money, ListItem, Button, Avatar } = DS;
  const [addons, setAddons] = React.useState({});
  const total = service.price + provider.addons.reduce((s, a) => s + (addons[a.id] ? a.price : 0), 0);
  return (
    <div style={{ paddingBottom: 'var(--space-4)' }}>
      <AppBar onBack={() => nav('back')} title={service.name} raised actions={<IconButton icon="favorite" label="مفضّلة" />} />
      <div style={{ height: 200, background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-300)', overflow: 'hidden' }}>
        {provider.portfolio && provider.portfolio[0]
          ? <img src={provider.portfolio[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
          : <Icon name="spa" size="xl" />}
      </div>
      <div style={{ padding: 'var(--space-4)' }}>
        <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{service.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
          <Money amount={service.price} emphasis="lg" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/1 var(--font-base)' }}>
            <Icon name="schedule" size="sm" />{service.duration}
          </span>
        </div>
        <div style={{ font: 'var(--type-body-lg-weight) var(--type-body-lg-size)/var(--type-body-lg-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{service.desc}</div>

        {provider.addons.length > 0 && <>
          <div style={{ font: 'var(--type-h3-weight) var(--type-h3-size)/var(--type-h3-lh) var(--font-base)', margin: 'var(--space-5) 0 var(--space-2)', color: 'var(--text-primary)' }}>إضافات اختيارية</div>
          <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {provider.addons.map((a, i) => (
              <ListItem key={a.id} divider={i < provider.addons.length - 1}
                leading={<span onClick={(e) => { e.stopPropagation(); setAddons((s) => ({ ...s, [a.id]: !s[a.id] })); }} style={{ cursor: 'pointer', display: 'inline-flex' }}><Icon name={addons[a.id] ? 'check_box' : 'check_box_outline_blank'} size="md" fill={!!addons[a.id]} color={addons[a.id] ? 'var(--primary-500)' : 'var(--text-disabled)'} /></span>}
                title={a.name} trailing={<Money amount={a.price} />}
                onClick={() => setAddons((s) => ({ ...s, [a.id]: !s[a.id] }))} />
            ))}
          </div>
        </>}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-5)', padding: 'var(--space-3)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
          <Avatar name={provider.name} size="md" premium={provider.premium} />
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--weight-semibold) var(--type-body-size)/1.4 var(--font-base)', color: 'var(--text-primary)' }}>{provider.name}</div>
            <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1.4 var(--font-base)', color: 'var(--text-secondary)' }}>{provider.specialty}</div>
          </div>
          <IconButton icon="chevron_left" label="عرض الملف" mirror onClick={() => nav('provider', { id: provider.id })} />
        </div>
      </div>

      <StickyFooter>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>الإجمالي</div>
            <Money amount={total} emphasis="lg" />
          </div>
          <Button onClick={() => nav('booking', { id: provider.id, serviceId: service.id, total })}>متابعة الحجز</Button>
        </div>
      </StickyFooter>
    </div>
  );
}

Object.assign(window, { HomeScreen, ProviderScreen, ServiceScreen });
