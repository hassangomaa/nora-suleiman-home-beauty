# عرض فني مبدئي — منصة خدمات التجميل المنزلية

**العميلة:** الأستاذة نورا سليمان  
**رقم الوثيقة:** `SLT-PRO-2026-051` · **الإصدار:** v1.0 · **تاريخ الإصدار:** ١٨ يونيو ٢٠٢٦  
**الاجتماع:** ١٧ يونيو ٢٠٢٦

## الملخص

منصة رقمية تربط العميلات بمقدّمات خدمات التجميل العاملات من المنزل (ميك أب أرتست وغيرهن) — جمهور نسائي، السعودية أولًا.

| البند | القيمة |
|-------|--------|
| **الاستثمار (MVP)** | 3,000 دولار أمريكي |
| **المدة** | 35 يوم عمل (بعد اعتماد SRS) |
| **الدفع** | ١٬٥٠٠ عند البدء · ٧٠٠ للجوال والتكاملات · ٨٠٠ عند الاكتمال |

## النطاق الرئيسي

- تطبيق جوال + ويب + لوحة تحكم
- تسجيل فوري لمقدّمات الخدمة + OTP عبر الجوال
- حجز، دفع، محادثة، QR، إشعارات التطبيق
- إعدادات عمولة وباقات ظهور من لوحة الإدارة

## الملفات الرسمية

| الملف | الوصف |
|-------|--------|
| [`nora-suleiman-home-beauty-proposal-ar.pdf`](nora-suleiman-home-beauty-proposal-ar.pdf) | PDF للإرسال |
| [`nora-suleiman-home-beauty-proposal-ar.docx`](nora-suleiman-home-beauty-proposal-ar.docx) | Word |
| [`MEETING-NOTES-AR.md`](MEETING-NOTES-AR.md) | محضر الاجتماع |

المصدر البرمجي: [`scripts/slt_docgen/clients/nora_suleiman_home_beauty.py`](../../../../scripts/slt_docgen/clients/nora_suleiman_home_beauty.py)

```bash
. .venv-docs/bin/activate
python scripts/build_client_offer.py nora-suleiman-home-beauty --pdf
```
