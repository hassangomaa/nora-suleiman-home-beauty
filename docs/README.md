# منصة خدمات التجميل المنزلية — حزمة وثائق العميل

> **الحالة:** عميل محتمل — عرض مبدئي (غير مؤكد)

| | |
|---|---|
| **العميلة** | الأستاذة نورا سليمان — المملكة العربية السعودية |
| **القطاع** | منصة خدمات تجميل منزلية — عاملات مستقلات |
| **الاجتماع** | ١٧ يونيو ٢٠٢٦ |
| **رقم الوثيقة** | `SLT-PRO-2026-051` · الإصدار v1.0 |
| **العرض (MVP)** | 3,000 دولار · 35 يوم عمل (بعد اعتماد SRS) |
| **المرجع التقني** | [Cash Salon](../../../v1/projects/implemented/cache-salon/README.md) |

---

## الوثائق

| الملف | الوصف | اللغة |
|---|---|:---:|
| [`MEETING-NOTES-AR.md`](MEETING-NOTES-AR.md) | محضر اجتماع الاكتشاف وتحليل المتطلبات | ع |
| [`GAP-ANALYSIS-AR.md`](GAP-ANALYSIS-AR.md) | **تحليل الفجوة** — متطلبات العميلة (١٠ أنظمة) مقابل النطاق الحالي | ع |
| [`PROPOSAL-AR.md`](PROPOSAL-AR.md) | ملخص العرض الفني | ع |
| [`PROPOSAL-EN.md`](PROPOSAL-EN.md) | Proposal summary | EN |
| [`blueprint/`](blueprint/README.md) | **مخطط بناء التطبيق** — مرجع تقني كامل (معمارية · نظام تصميم · تدفقات · شاشات · API · خطة) لتنفيذ التطبيق عبر Claude Projects | EN/ع |

### الملفات الجاهزة للإرسال

| الملف | الصيغة |
|---|---|
| [`nora-suleiman-home-beauty-proposal-ar.pdf`](nora-suleiman-home-beauty-proposal-ar.pdf) · [`.docx`](nora-suleiman-home-beauty-proposal-ar.docx) | عربي (RTL) |
| [`nora-suleiman-home-beauty-proposal-en.pdf`](nora-suleiman-home-beauty-proposal-en.pdf) · [`.docx`](nora-suleiman-home-beauty-proposal-en.docx) | English |

---

## حالة المتطلبات (ملخّص تحليل الفجوة)

مقارنة الأنظمة العشرة المطلوبة من العميلة بالنطاق الموثّق في العرض — التفصيل الكامل في [`GAP-ANALYSIS-AR.md`](GAP-ANALYSIS-AR.md).

| # | النظام | الحالة |
|:-:|---|:--:|
| 1 | الحسابات والصلاحيات | ✅ مغطّى |
| 2 | نظام الخدمات | 🟡 جزئي — مدّة الخدمة مفقودة |
| 3 | نظام الحجز | 🟡 جزئي — الإلغاء وإعادة الجدولة فجوة |
| 4 | الموقع الجغرافي | 🟡 جزئي — تتبّع الوصول الحيّ فجوة |
| 5 | نظام الدفع | 🟡 جزئي — صرف أرباح مقدّمات الخدمة فجوة |
| 6 | التقييمات | 🟡 جزئي — يحتاج إدراجًا صريحًا في النطاق |
| 7 | الإشعارات | 🟡 جزئي — التذكير والعروض فجوة |
| 8 | التواصل | 🟡 جزئي — الدعم الفني والوسائط فجوة |
| 9 | لوحة التحكم | 🟡 جزئي — إدارة الشكاوى فجوة |
| 10 | الأمان | 🟡 جزئي — التشفير يُنَصّ عليه في SRS |

**أهم الفجوات للحسم قبل SRS:** إلغاء/إعادة جدولة الحجز · صرف أرباح مقدّمات الخدمة · تذكير المواعيد والإشعارات الترويجية · إدارة الشكاوى.

---

## إعادة توليد ملفات العرض

```bash
. .venv-docs/bin/activate
python scripts/build_client_offer.py nora-suleiman-home-beauty --pdf
```

المصدر البرمجي: [`scripts/slt_docgen/clients/nora_suleiman_home_beauty.py`](../../../../scripts/slt_docgen/clients/nora_suleiman_home_beauty.py)

> سرّي — خاص بالعميل. لا يُعاد توزيعه دون موافقة Smart Lead Tech.
