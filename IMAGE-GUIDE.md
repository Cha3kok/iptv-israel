# صور المقالات – أدلة إنشاء الصور عبر AI

## كيفية إنشاء صور المدونة

جميع المقالات في `content/posts/` تحتوي على حقل `imagePrompt` مع موجه إنشاء صورة AI محسّن. اتبع هذه الخطوات:

---

## 1️⃣ **مقالة IPTV ישראל**

### الموجه (Prompt):
```
A modern Israeli living room at night with a 65-inch 4K OLED TV mounted on wall, 
displaying vibrant IPTV Israel channel grid interface with Hebrew text, 
remote control in hand, green and blue glowing UI, tech-forward atmosphere, 
cinematic lighting, photorealistic, 16:9 --ar 16:9 --v 6 --q 2
```

### أداة الإنشاء:
- **Midjourney:** بالموجه أعلاه مباشرة
- **DALL-E:** الموجه أعلاه
- **Stable Diffusion:** مع نفس الموجه

### الخطوات:
1. افتح **Midjourney** أو **DALL-E**
2. انسخ الموجه
3. أضفت `/imagine` (Midjourney) أو اضغط Generate (DALL-E)
4. انتظر ~ 30-60 ثانية
5. حمّل الصورة
6. احفظها بـ: `/images/posts/iptv-israel.jpg`

---

## 2️⃣ **مقالة مدريך IPTV للمبتدئين**

### الموجه:
```
Step-by-step IPTV setup guide visual tutorial, person holding smartphone and 
remote control, multiple devices (TV, tablet, laptop) displaying IPTV channels 
interface, Hebrew text labels showing setup steps, modern tech environment, 
bright lighting, instructional style, 16:9 --ar 16:9 --v 6
```

### احفظها بـ: `/images/posts/iptv-guide-beginners.jpg`

---

## صيغ الصور المدعومة

- `JPG` (الأفضل للويب، حجم أصغر)
- `PNG` (شفافية إذا لزم الأمر)
- `WebP` (أسرع تحميل)

---

## الخصائص المهمة

✅ **يجب أن تكون كل صورة:**
- **عريضة:** 16:9 (أفقية)
- **عالية الجودة:** 1200×675 بكسل أو أعلى
- **مُحسّنة:** مضغوطة للويب (< 200 KB)
- **بصرية:** جذابة من أول نظرة

---

## أين تحفظ الصور

```
public/
└── images/
    └── posts/
        ├── iptv-israel.jpg
        ├── iptv-guide-beginners.jpg
        ├── m3u-israel-2026.jpg
        └── ... (صور المقالات الأخرى)
```

---

## المقالات القادمة - المواجهات المستقبلية

مع كل مقالة جديدة كل يوم، ستحتاج إلى صور جديدة:

| # | المقالة | الموجه المقترح |
|---|---------|-----------|
| 3 | iptv-israel-free | Israeli IPTV free options, affordable TV streaming, comparison chart, modern living room |
| 4 | m3u-file-israel | M3U playlist file format, technical diagram, code editor, streaming protocol visualization |
| 5 | best-iptv-player | IPTV player apps comparison, mobile devices, TV interface, features showcase |

---

## تأتيب المقالة مع الصورة

في frontmatter:
```markdown
---
coverImage: "/images/posts/iptv-israel.jpg"
coverAlt: "وصف بديل في العبرية أو الإنجليزية"
imagePrompt: "[الموجه الكامل]"
---
```

**الصورة ستظهر في:**
- صفحة المدونة الرئيسية (Featured Post)
- بطاقة المقالة
- أعلى صفحة المقالة الكاملة
- مشاركة Social Media (Open Graph)

---

## نصائح للحصول على أفضل النتائج

1. **كن محدداً:** بدلاً من "صورة تلفزيون"، قل "65-inch OLED TV with Hebrew UI at night"
2. **أضف السياق:** "Israeli living room", "tech environment", "instructional style"
3. **حدد الألوان:** "green and blue glowing", "cinematic lighting"
4. **اطلب الجودة:** أضف `--v 6 --q 2` (Midjourney) أو `HD` (DALL-E)

---

## للتذكر

✅ **كل مقالة = صورة واحدة**  
✅ **الصور تحسّن SEO ومعدل التحويل**  
✅ **استخدم نفس "الأسلوب" عبر المقالات لتناسق بصري**

---

**تم! الآن يمكنك البدء في إنشاء الصور! 🎨**
