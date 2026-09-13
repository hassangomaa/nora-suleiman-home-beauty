/* Mock data for the Home Beauty client app UI kit. */
window.NSData = {
  area: 'حي الياسمين، الرياض',
  specialties: [
    { key: 'makeup', label: 'ميك أب', icon: 'palette' },
    { key: 'hair', label: 'شعر', icon: 'content_cut' },
    { key: 'nails', label: 'أظافر', icon: 'back_hand' },
    { key: 'skin', label: 'عناية بالبشرة', icon: 'spa' },
    { key: 'henna', label: 'حنّاء', icon: 'format_paint' },
    { key: 'bridal', label: 'عرايس', icon: 'face_retouching_natural' },
  ],
  // Real photography from Unsplash (CDN hot-link). Falls back to initials/gradient if a URL 404s.
  providers: [
    {
      id: 'p1', name: 'لطيفة العتيبي', specialty: 'ميك أب · عناية بالبشرة',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80',
        'https://images.unsplash.com/photo-1522335789203-aaa2f6ee3eaf?w=500&q=80',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80',
        'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=500&q=80',
      ],
      rating: 4.9, reviews: 214, distance: '٢٫٣ كم', premium: true, premiumLabel: 'ذهبي',
      area: 'حي الياسمين', bio: 'خبيرة تجميل معتمدة بخبرة ٨ سنوات في مكياج السهرات والعرايس. أستخدم منتجات عالمية تدوم طوال المناسبة.',
      services: [
        { id: 's1', name: 'ميك أب سهرة', desc: 'إطلالة كاملة تدوم طوال المناسبة بأجود المنتجات العالمية', price: 250, duration: '٦٠ دقيقة', durationMin: 60 },
        { id: 's2', name: 'ميك أب عروس', desc: 'باقة العروس الكاملة: مكياج، تسريحة، وبروفة قبل اليوم', price: 850, duration: '١٨٠ دقيقة', durationMin: 180 },
        { id: 's3', name: 'مكياج ناعم نهاري', desc: 'لمسة طبيعية مناسبة للدوام والمناسبات النهارية', price: 180, duration: '٤٥ دقيقة', durationMin: 45 },
      ],
      addons: [
        { id: 'a1', name: 'تركيب رموش', price: 60 },
        { id: 'a2', name: 'تسريحة شعر', price: 120 },
      ],
      reviewsList: [
        { name: 'ريم ا.', rating: 5, text: 'احترافية عالية والنتيجة فاقت توقعاتي، التزمت بالموعد تماماً.', date: 'قبل ٣ أيام' },
        { name: 'سارة م.', rating: 5, text: 'مكياج راقٍ ودام طوال الحفلة، أنصح فيها بشدة.', date: 'قبل أسبوع' },
        { name: 'هند ع.', rating: 4, text: 'جميل جداً، بس تأخرت شوي عن الموعد.', date: 'قبل أسبوعين' },
      ],
    },
    {
      id: 'p2', name: 'سارة المطيري', specialty: 'تصفيف وقص الشعر',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',
        'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&q=80',
        'https://images.unsplash.com/photo-1554519515-242161756769?w=500&q=80',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80',
      ],
      rating: 4.7, reviews: 96, distance: '٣٫١ كم', premium: false, area: 'حي النرجس',
      bio: 'مصففة شعر متخصصة في القصات العصرية والتسريحات.',
      services: [
        { id: 's4', name: 'قص وتصفيف', desc: 'قص احترافي مع تصفيف يناسب شكل وجهك', price: 180, duration: '٥٠ دقيقة', durationMin: 50 },
        { id: 's5', name: 'سشوار وتمويج', desc: 'تسريحة سشوار مع تمويج ناعم', price: 120, duration: '٤٠ دقيقة', durationMin: 40 },
      ],
      addons: [{ id: 'a3', name: 'حمام كريم', price: 90 }],
      reviewsList: [
        { name: 'نوف ل.', rating: 5, text: 'قصة رائعة وذوق عالٍ.', date: 'قبل ٥ أيام' },
        { name: 'دانة ك.', rating: 4, text: 'النتيجة حلوة والتعامل لطيف.', date: 'قبل ١٠ أيام' },
      ],
    },
    {
      id: 'p3', name: 'منى الزهراني', specialty: 'العناية بالأظافر',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80',
        'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=500&q=80',
        'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=500&q=80',
        'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&q=80',
      ],
      rating: 4.8, reviews: 143, distance: '١٫٨ كم', premium: true, premiumLabel: 'بلاتيني', area: 'حي الملقا',
      bio: 'فنية أظافر معتمدة، تركيب وتصميم بأحدث التقنيات.',
      services: [
        { id: 's6', name: 'مانيكير وباديكير', desc: 'عناية كاملة باليدين والقدمين مع طلاء', price: 160, duration: '٧٠ دقيقة', durationMin: 70 },
        { id: 's7', name: 'تركيب أظافر جل', desc: 'تركيب وتصميم أظافر جل يدوم لأسابيع', price: 220, duration: '٩٠ دقيقة', durationMin: 90 },
      ],
      addons: [{ id: 'a4', name: 'رسم فني', price: 50 }],
      reviewsList: [
        { name: 'لمى س.', rating: 5, text: 'إبداع حقيقي، الأظافر صارت تحفة!', date: 'قبل يومين' },
      ],
    },
    {
      id: 'p4', name: 'أمل القحطاني', specialty: 'حنّاء ونقش',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
      portfolio: [
        'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=500&q=80',
        'https://images.unsplash.com/photo-1610228291167-19fbc6c2c2a3?w=500&q=80',
        'https://images.unsplash.com/photo-1610198327830-f2e3fb1e8b71?w=500&q=80',
        'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=500&q=80',
      ],
      rating: 4.6, reviews: 58, distance: '٤٫٢ كم', premium: false, area: 'حي العقيق', unavailable: true,
      bio: 'نقّاشة حنّاء بخبرة في النقش الخليجي والهندي.',
      services: [
        { id: 's8', name: 'نقش حنّاء كامل', desc: 'نقش لليدين والقدمين بتصاميم مميزة', price: 200, duration: '٩٠ دقيقة', durationMin: 90 },
      ],
      addons: [],
      reviewsList: [],
    },
  ],
  bookings: [
    { id: 'b1', status: 'confirmed', service: 'ميك أب سهرة', providerName: 'لطيفة العتيبي', providerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', date: '٢٩ يونيو ٢٠٢٦', time: '٣:٠٠ م', address: 'حي الياسمين، الرياض', price: 250, scope: 'upcoming', providerId: 'p1', serviceId: 's1' },
    { id: 'b2', status: 'on_the_way', service: 'مانيكير وباديكير', providerName: 'منى الزهراني', providerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', date: 'اليوم', time: '٥:٣٠ م', address: 'حي الياسمين، الرياض', price: 160, scope: 'upcoming', providerId: 'p3', serviceId: 's6' },
    { id: 'b3', status: 'completed', service: 'قص وتصفيف', providerName: 'سارة المطيري', providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', date: '١٠ يونيو ٢٠٢٦', time: '١:٠٠ م', address: 'حي الياسمين، الرياض', price: 180, scope: 'past', providerId: 'p2', serviceId: 's4' },
    { id: 'b4', status: 'cancelled_by_client', service: 'سشوار وتمويج', providerName: 'سارة المطيري', providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', date: '٢ يونيو ٢٠٢٦', time: '١١:٠٠ ص', address: 'حي الياسمين، الرياض', price: 120, scope: 'past', providerId: 'p2', serviceId: 's5' },
  ],
  notifications: [
    { id: 'n1', type: 'success', icon: 'check_circle', title: 'تم تأكيد حجزكِ', body: 'لطيفة العتيبي أكّدت موعد ميك أب السهرة يوم الإثنين ٢٩ يونيو ٣:٠٠ م', time: 'قبل ٥ دقائق', unread: true },
    { id: 'n2', type: 'info', icon: 'directions_car', title: 'المقدّمة في الطريق', body: 'منى الزهراني في طريقها إليكِ — تصل خلال ١٥ دقيقة', time: 'قبل ١٢ دقيقة', unread: true },
    { id: 'n3', type: 'warning', icon: 'event_repeat', title: 'تذكير: حجزكِ غداً', body: 'سيبدأ موعدكِ مع لطيفة العتيبي خلال ٢٤ ساعة', time: 'قبل ساعة', unread: true },
    { id: 'n4', type: 'info', icon: 'star', title: 'لا تنسي تقييم زيارتكِ الأخيرة', body: 'كيف كانت تجربتكِ مع سارة المطيري؟', time: 'قبل يومين', unread: false },
    { id: 'n5', type: 'success', icon: 'card_giftcard', title: 'خصم ١٥٪ على أوّل حجز عرايس', body: 'سارية حتى ٣٠ يونيو', time: 'قبل ٣ أيام', unread: false },
  ],
  chats: [
    { id: 'c1', providerId: 'p1', name: 'لطيفة العتيبي', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', last: 'تمام، سأصل عند الساعة ٣:٠٠ م كما هو مجدول 💕', time: '٢:٤٠ م', unread: 2, online: true,
      messages: [
        { from: 'me', text: 'السلام عليكم، حجزت معكِ ميك أب لسهرة الإثنين', time: '٢:٢١ م' },
        { from: 'them', text: 'وعليكم السلام أهلاً وسهلاً، نوّرتِ. كل شي جاهز للموعد.', time: '٢:٣٥ م' },
        { from: 'me', text: 'تمام، أحب الستايل الناعم — هل تحتاجين أي شي إضافي؟', time: '٢:٣٧ م' },
        { from: 'them', text: 'تمام، سأصل عند الساعة ٣:٠٠ م كما هو مجدول 💕', time: '٢:٤٠ م' },
      ],
    },
    { id: 'c2', providerId: 'p3', name: 'منى الزهراني', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', last: 'أنا في الطريق — وصلت لحي الياسمين تقريباً', time: '٥:١٥ م', unread: 0, online: true, messages: [] },
    { id: 'c3', providerId: 'p2', name: 'سارة المطيري', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', last: 'شكراً لكِ على التقييم 🌸', time: 'أمس', unread: 0, online: false, messages: [] },
  ],
  premium: {
    plans: [
      { id: 'm', name: 'شهري', price: 49, period: 'شهر', save: null },
      { id: 'y', name: 'سنوي', price: 399, period: 'سنة', save: 'وفّري ٣٢٪', featured: true },
    ],
    perks: [
      { icon: 'local_offer', title: 'خصم ١٠٪ على كل حجز', body: 'بدون حد أدنى، يطبّق تلقائياً قبل الدفع.' },
      { icon: 'verified', title: 'مقدّمات معتمدة فقط', body: 'وصول حصري لأفضل المقدّمات المميّزات.' },
      { icon: 'priority_high', title: 'أولوية في الحجز', body: 'فرص حجز في أوقات الذروة قبل الجميع.' },
      { icon: 'redeem', title: 'كاش باك ٥٪', body: 'يُعاد للمحفظة بعد كل حجز مكتمل.' },
      { icon: 'support_agent', title: 'دعم مخصّص ٢٤/٧', body: 'فريق متخصّص لأعضاء بريميوم.' },
    ],
  },
  paymentMethods: [
    { id: 'pm1', label: 'مدى', sub: 'البنك الأهلي السعودي', last4: '٤٢١٨', icon: 'credit_card', brand: 'mada', default: true },
    { id: 'pm2', label: 'Apple Pay', sub: 'iPhone — وجه ID', last4: '', icon: 'apple', brand: 'apple' },
    { id: 'pm3', label: 'STC Pay', sub: 'محفظة', last4: '٧٧٦٦', icon: 'account_balance_wallet', brand: 'stcpay' },
  ],
  slots: {
    morning: ['٩:٠٠ ص', '١٠:٠٠ ص', '١١:٠٠ ص'],
    afternoon: ['١:٠٠ م', '٢:٠٠ م', '٣:٠٠ م', '٤:٠٠ م'],
    evening: ['٦:٠٠ م', '٧:٠٠ م', '٨:٠٠ م'],
  },
  days: [
    { d: 'الأحد', n: '٢٨' }, { d: 'الإثنين', n: '٢٩' }, { d: 'الثلاثاء', n: '٣٠' },
    { d: 'الأربعاء', n: '١' }, { d: 'الخميس', n: '٢' }, { d: 'الجمعة', n: '٣' }, { d: 'السبت', n: '٤' },
  ],
  addresses: [
    { id: 'ad1', label: 'المنزل', text: 'حي الياسمين، شارع الأمير، الرياض', default: true },
    { id: 'ad2', label: 'العمل', text: 'حي العليا، برج المملكة، الرياض', default: false },
  ],
};
