/* Onboarding · Role · Auth · Signup screens (Apple, Google, Phone). */
const DS_O = window.NoraSuleimanHomeBeautyDesignSystem_5b646a;

/* -------- Brand wordmark, used on Splash & Auth -------- */
function LogoLockup({ small = false, onLight = true }) {
  const w = small ? 130 : 240;
  return (
    <img src={window.__BRAND_LOGO} alt="Home Beauty"
      style={{ width: w, height: 'auto', display: 'block', filter: onLight ? 'none' : 'brightness(0) invert(1)' }} />
  );
}

/* -------- Splash -------- */
function SplashScreen({ nav }) {
  React.useEffect(() => { const t = setTimeout(() => nav('onboarding'), 1600); return () => clearTimeout(t); }, []);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tint)', position: 'relative', overflow: 'hidden' }}>
      {/* Soft decorative blobs */}
      <span style={{ position: 'absolute', top: -60, insetInlineStart: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(214,72,110,0.18), transparent 70%)' }} />
      <span style={{ position: 'absolute', bottom: -80, insetInlineEnd: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,163,106,0.22), transparent 70%)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)' }}>
        <img src={window.__BRAND_LOGO} alt="Home Beauty" style={{ width: 260, height: 'auto', display: 'block', animation: 'hb-pop 600ms ease-out' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '3px solid var(--primary-200)', borderTopColor: 'var(--primary-500)',
          animation: 'hb-spin 0.8s linear infinite',
        }} />
        <span style={{ color: 'var(--text-secondary)', font: 'var(--weight-medium) var(--type-caption-size)/1 var(--font-base)' }}>جمالكِ … في بيتكِ</span>
      </div>
      <style>{`
        @keyframes hb-pop { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes hb-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* -------- Onboarding (3 pages with dots) -------- */
const ONB = [
  { icon: 'search', title: 'اكتشفي مقدّمات قريبة منكِ', body: 'استعرضي ملفّات معتمدة، تقييمات حقيقية، وأسعار شفافة من قبل الحجز.' },
  { icon: 'event_available', title: 'احجزي في الوقت الذي يناسبكِ', body: 'مواعيد مرنة، تأكيد فوري، وتذكيرات قبل الموعد.' },
  { icon: 'verified_user', title: 'الدفع آمن مع نظام الحماية', body: 'يُحجز المبلغ ولا يُحوّل للمقدّمة إلا بعد اكتمال الخدمة.' },
];
function OnboardingScreen({ nav }) {
  const { Icon, Button } = DS_O;
  const [i, setI] = React.useState(0);
  const page = ONB[i];
  const last = i === ONB.length - 1;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => nav('role')} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)', cursor: 'pointer' }}>تخطّي</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)', textAlign: 'center' }}>
        <div style={{ width: 160, height: 160, borderRadius: '50%', background: 'var(--bg-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-500)' }}>
          <Icon name={page.icon} size={88} fill />
        </div>
        <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)', maxWidth: 300 }}>{page.title}</div>
        <div style={{ font: 'var(--type-body-lg-weight) var(--type-body-lg-size)/var(--type-body-lg-lh) var(--font-base)', color: 'var(--text-secondary)', maxWidth: 300 }}>{page.body}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 'var(--space-5)' }}>
        {ONB.map((_, idx) => (
          <span key={idx} style={{ width: idx === i ? 24 : 8, height: 8, borderRadius: 999, background: idx === i ? 'var(--primary-500)' : 'var(--neutral-300)', transition: 'all .15s' }} />
        ))}
      </div>
      <Button fullWidth onClick={() => last ? nav('role') : setI(i + 1)}>{last ? 'ابدئي' : 'التالي'}</Button>
    </div>
  );
}

/* -------- Role choice -------- */
function RoleChoiceScreen({ nav }) {
  const { Icon, Button } = DS_O;
  const [role, setRole] = React.useState('client');
  const card = (key, title, sub, icon) => {
    const sel = role === key;
    return (
      <button onClick={() => setRole(key)} style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%',
        padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
        background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
        border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
        cursor: 'pointer', textAlign: 'start',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: sel ? 'var(--primary-500)' : 'var(--neutral-100)', color: sel ? '#fff' : 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size="lg" fill={sel} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>{sub}</div>
        </div>
        <span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-strong)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {sel && <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary-500)' }} />}
        </span>
      </button>
    );
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        <LogoLockup small />
      </div>
      <div style={{ marginTop: 'var(--space-7)', marginBottom: 'var(--space-3)', textAlign: 'center' }}>
        <div style={{ font: 'var(--type-h2-weight) var(--type-h2-size)/var(--type-h2-lh) var(--font-base)', color: 'var(--text-primary)' }}>مرحباً بكِ</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>اختاري ما يناسبكِ للمتابعة</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        {card('client', 'أنا عميلة', 'أبحث عن خدمات تجميل في المنزل', 'spa')}
        {card('provider', 'أنا مقدّمة خدمة', 'أقدّم خدمات تجميل وأبحث عن عميلات', 'workspace_premium')}
      </div>
      <div style={{ flex: 1 }} />
      <Button fullWidth onClick={() => nav('auth', { role })}>متابعة</Button>
    </div>
  );
}

/* -------- Auth (Apple / Google / Phone) -------- */
function AuthScreen({ nav, role }) {
  const { Button, Icon } = DS_O;
  const isProvider = role === 'provider';
  const goSignup = (provider) => {
    if (provider === 'phone') return nav('otp', { role });
    nav(isProvider ? 'provider-setup' : 'client-setup', { role, via: provider });
  };

  const SocialBtn = ({ onClick, bg, color, border, brand, label }) => (
    <button onClick={onClick} style={{
      width: '100%', height: 54, borderRadius: 'var(--radius-md)',
      background: bg, color, border: border || 'none', cursor: 'pointer',
      font: 'var(--weight-semibold) var(--type-body-lg-size)/1 var(--font-base)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 var(--space-4)',
      direction: 'ltr',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{brand}</span>
      <span style={{ font: 'var(--weight-semibold) var(--type-body-lg-size)/1 var(--font-base)' }}>{label}</span>
    </button>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
      <button onClick={() => nav('back')} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="arrow_forward" size="md" mirror />
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'var(--space-3)' }}>
        <LogoLockup small />
      </div>
      <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-5)', textAlign: 'center' }}>
        <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>{isProvider ? 'انضمي كمقدّمة خدمة' : 'مرحباً بكِ'}</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', marginTop: 6 }}>{isProvider ? 'ابدئي العمل واستقبلي حجوزاتكِ خلال دقائق' : 'سجّلي الدخول أو أنشئي حساباً جديداً'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <SocialBtn onClick={() => goSignup('apple')}  bg="#000" color="#fff" brand={<window.AppleMark size={22} color="#fff" />} label="Continue with Apple" />
        <SocialBtn onClick={() => goSignup('google')} bg="#fff" color="#1F1F1F" border="1px solid var(--border-strong)" brand={<window.GoogleMark size={20} />} label="Continue with Google" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlock: 'var(--space-2)' }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>أو</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </div>
        <Button leadingIcon="phone_iphone" fullWidth onClick={() => goSignup('phone')}>المتابعة برقم الجوال</Button>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', font: 'var(--type-caption-weight) var(--type-caption-size)/1.5 var(--font-base)', color: 'var(--text-secondary)', paddingBottom: 'var(--space-3)' }}>
        بمتابعتكِ فإنكِ توافقين على <span style={{ color: 'var(--action-primary)', fontWeight: 600 }}>شروط الاستخدام</span> و<span style={{ color: 'var(--action-primary)', fontWeight: 600 }}>سياسة الخصوصية</span>.
      </div>
    </div>
  );
}

/* -------- OTP -------- */
function OtpScreen({ nav, role }) {
  const { Button, Icon } = DS_O;
  const [phone, setPhone] = React.useState('5X XXX XXXX');
  const [step, setStep] = React.useState('phone');
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const ok = digits.every((d) => d) || step === 'phone';

  const submit = () => {
    if (step === 'phone') return setStep('code');
    nav(role === 'provider' ? 'provider-setup' : 'client-setup', { role, via: 'phone' });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)' }}>
      <button onClick={() => step === 'code' ? setStep('phone') : nav('back')} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="arrow_forward" size="md" mirror />
      </button>
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>{step === 'phone' ? 'أدخلي رقم جوالك' : 'تحقّق من رمز التفعيل'}</div>
        <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)', marginTop: 6 }}>{step === 'phone' ? 'سنرسل لكِ رمز تفعيل برسالة نصية.' : `أرسلنا رمزاً مكوّناً من ٦ أرقام إلى ${phone}`}</div>
      </div>

      {step === 'phone' ? (
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', border: '1.5px solid var(--action-primary)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'var(--bg-tint)', borderRadius: 6, font: 'var(--weight-medium) var(--type-body-size)/1 var(--font-latin)' }}>🇸🇦 +966</span>
          <input className="ns-ltr" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'var(--weight-medium) var(--type-body-lg-size)/1 var(--font-latin)', color: 'var(--text-primary)', textAlign: 'start' }} />
        </div>
      ) : (
        <>
          <div className="ns-ltr" style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)', direction: 'ltr', justifyContent: 'center' }}>
            {digits.map((d, idx) => (
              <input key={idx} value={d} maxLength={1}
                onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(-1); setDigits((arr) => arr.map((x, j) => j === idx ? v : x)); if (v && idx < 5) document.querySelectorAll('.ns-otp-cell')[idx + 1]?.focus(); }}
                className="ns-otp-cell"
                style={{ width: 44, height: 56, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-strong)', outline: 'none', font: '600 22px/1 var(--font-latin)', textAlign: 'center', background: 'var(--bg-surface-raised)' }} />
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'center', font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>
            لم يصلكِ الرمز؟ <span style={{ color: 'var(--action-primary)', fontWeight: 600 }}>إعادة الإرسال</span>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
      <Button fullWidth disabled={!ok} onClick={submit}>{step === 'phone' ? 'إرسال الرمز' : 'تأكيد'}</Button>
    </div>
  );
}

/* -------- Client signup (single step: name + address optional) -------- */
function ClientSetupScreen({ nav }) {
  const { Button, TextInput, Avatar, Icon } = DS_O;
  const [name, setName] = React.useState('ريم الشمري');
  const [city, setCity] = React.useState('الرياض');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
      <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>أكملي ملفّك</div>
      <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>معلومات بسيطة لنبدأ — يمكنكِ تعديلها لاحقاً.</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Avatar name={name} size="lg" />
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-primary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)' }}>
          <Icon name="photo_camera" size="sm" />صورة الملف
        </button>
      </div>

      <TextInput label="الاسم" value={name} onChange={(e) => setName(e.target.value)} leadingIcon="person" />
      <TextInput label="المدينة" value={city} onChange={(e) => setCity(e.target.value)} leadingIcon="location_city" />

      <div style={{ flex: 1 }} />
      <Button fullWidth onClick={() => nav('home')}>الدخول للتطبيق</Button>
    </div>
  );
}

/* -------- Provider signup (multi-section in one screen) -------- */
function ProviderSetupScreen({ nav }) {
  const { Button, TextInput, Chip, Avatar, Icon, Banner } = DS_O;
  const [name, setName] = React.useState('لطيفة العتيبي');
  const [spec, setSpec] = React.useState('makeup');
  const [service, setService] = React.useState('ميك أب سهرة');
  const [price, setPrice] = React.useState('250');
  const [dur, setDur] = React.useState('60');
  const specs = [['makeup','ميك أب','palette'],['hair','شعر','content_cut'],['nails','أظافر','back_hand'],['skin','عناية','spa'],['henna','حنّاء','format_paint']];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)', gap: 'var(--space-4)', overflowY: 'auto' }}>
      <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>أكملي ملفّ مقدّمة الخدمة</div>
      <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>سيظهر ملفّك في البحث خلال دقائق من إكماله.</div>

      <Banner variant="info" icon="bolt">تفعيل فوري بدون انتظار موافقة — يمكنكِ إضافة المزيد لاحقاً.</Banner>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Avatar name={name} size="lg" />
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-primary)', font: 'var(--weight-medium) var(--type-label-size)/1 var(--font-base)' }}>
          <Icon name="photo_camera" size="sm" />صورة الملف
        </button>
      </div>

      <TextInput label="الاسم" value={name} onChange={(e) => setName(e.target.value)} leadingIcon="person" />

      <div>
        <div style={{ font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>التخصّص</div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {specs.map(([k, l, ic]) => <Chip key={k} leadingIcon={ic} selected={spec === k} onClick={() => setSpec(k)}>{l}</Chip>)}
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ font: 'var(--weight-semibold) var(--type-label-size)/1 var(--font-base)', color: 'var(--text-primary)' }}>أوّل خدمة لكِ</div>
        <TextInput label="اسم الخدمة" value={service} onChange={(e) => setService(e.target.value)} />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <TextInput label="السعر (ر.س)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ flex: 1 }} />
          <TextInput label="المدّة (دقيقة)" value={dur} onChange={(e) => setDur(e.target.value)} style={{ flex: 1 }} />
        </div>
      </div>

      <div>
        <div style={{ font: 'var(--weight-medium) var(--type-label-size)/var(--type-label-lh) var(--font-base)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>معرض أعمالكِ <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(مطلوب صورة على الأقل)</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-strong)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <Icon name="add_a_photo" size="lg" />
            </div>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={() => nav('provider-tier')}>المتابعة</Button>
    </div>
  );
}

/* -------- Provider tier (visibility package) -------- */
const TIERS = [
  { id: 'free',     name: 'مجّاناً للبدء', sub: 'ظهور أساسي في البحث', price: 0, fee: '٪١٫٥ من كل حجز', perks: ['ظهور أساسي', 'استقبال حجوزات', 'محفظة وسحب'] },
  { id: 'gold',     name: 'باقة ذهبية',    sub: 'أولوية في البحث لمدّة ٥ أيام', price: 99, fee: '٪١٫٥ من كل حجز', perks: ['أولوية في البحث', 'شارة ذهبية', 'إحصائيات مفصّلة'], featured: true },
  { id: 'platinum', name: 'باقة بلاتينية', sub: 'أعلى ظهور لمدّة ١٠ أيام', price: 199, fee: '٪١ من كل حجز',  perks: ['أعلى ظهور', 'شارة بلاتينية', 'دعم مخصّص', 'بدون عمولة على الخدمات الإضافية'] },
];
function ProviderTierScreen({ nav }) {
  const { Button, Icon, Money } = DS_O;
  const [tier, setTier] = React.useState('gold');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
      <button onClick={() => nav('back')} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)', width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="arrow_forward" size="md" mirror />
      </button>
      <div style={{ font: 'var(--type-h1-weight) var(--type-h1-size)/var(--type-h1-lh) var(--font-base)', color: 'var(--text-primary)' }}>اختاري باقة الظهور</div>
      <div style={{ font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-secondary)' }}>الانضمام مجاني — الباقات تزيد فرص ظهوركِ في البحث.</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {TIERS.map((t) => {
          const sel = tier === t.id;
          return (
            <button key={t.id} onClick={() => setTier(t.id)} style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
              padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', textAlign: 'start',
              background: sel ? 'var(--bg-tint)' : 'var(--bg-surface-raised)',
              border: `2px solid ${sel ? 'var(--primary-500)' : 'var(--border-default)'}`,
              cursor: 'pointer', position: 'relative',
            }}>
              {t.featured && <span style={{ position: 'absolute', top: -12, insetInlineEnd: 12, background: 'var(--secondary-500)', color: '#fff', font: '600 11px/1 var(--font-latin)', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999 }}>Recommended</span>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ font: 'var(--weight-bold) var(--type-h3-size)/1.3 var(--font-base)', color: 'var(--text-primary)' }}>{t.name}</span>
                {t.price ? <Money amount={t.price} suffix="/شهر" /> : <span style={{ color: 'var(--success-500)', font: 'var(--weight-bold) var(--type-h3-size)/1 var(--font-base)' }}>مجاناً</span>}
              </div>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)' }}>{t.sub}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                {t.perks.map((p) => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-body-weight) var(--type-body-size)/var(--type-body-lh) var(--font-base)', color: 'var(--text-primary)' }}>
                    <Icon name="check" size="xs" color="var(--success-500)" />{p}
                  </span>
                ))}
              </div>
              <span style={{ font: 'var(--type-caption-weight) var(--type-caption-size)/1 var(--font-base)', color: 'var(--text-secondary)' }}>عمولة: {t.fee}</span>
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <Button fullWidth onClick={() => nav('p-dashboard')}>{tier === 'free' ? 'ابدئي مجاناً' : 'الاشتراك والمتابعة'}</Button>
    </div>
  );
}

Object.assign(window, { SplashScreen, OnboardingScreen, RoleChoiceScreen, AuthScreen, OtpScreen, ClientSetupScreen, ProviderSetupScreen, ProviderTierScreen, LogoLockup, StickyFooter });

/* StickyFooter — portals its children to #screen-footer so it stays pinned
   to the bottom of the visible phone, not the bottom of the scrolled content. */
function StickyFooter({ children, padded = true, style = {} }) {
  const target = (typeof document !== 'undefined') && document.getElementById('screen-footer');
  if (!target) return null;
  return ReactDOM.createPortal(
    <div style={{
      padding: padded ? 'var(--space-3) var(--space-4) var(--space-4)' : 0,
      background: 'var(--bg-canvas)', borderTop: '1px solid var(--border-default)',
      boxShadow: '0 -6px 16px rgba(22,18,20,0.05)',
      ...style,
    }}>{children}</div>,
    target
  );
}
