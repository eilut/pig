# إعداد Cloudflare Tunnel للنشر المحلي

هذا الدليل يشرح كيفية استخدام Cloudflare Tunnel لجعل مشروعك متاحاً للعام بدون استضافة خارجية.

## ما هو Cloudflare Tunnel؟

Cloudflare Tunnel (يعرف سابقاً بـ Argo Tunnel) هو خدمة مجانية من Cloudflare تتيح لك:
- نشر مشروعك محلياً برابط عام دون فتح منافذ
- تشفير تلقائي باستخدام SSL
- حماية من هجمات DDoS
- رابط ثابت إذا كان لديك نطاق خاص
- وصول آمن من أي مكان

## المتطلبات

- حساب Cloudflare (مجاني)
- نطاق (اختياري - يمكن استخدام نطاق مجاني من Cloudflare)
- جهاز يعمل بالإنترنت (حيث يوجد مشروعك)
- Docker و Docker Compose

## الخطوة 1: إنشاء حساب Cloudflare

1. سجل في [cloudflare.com](https://dash.cloudflare.com/sign-up)
2. بعد التسجيل، ستحصل على نطاق مجاني أو يمكنك ربط نطاقك الخاص

## الخطوة 2: إعداد النطاق

### إذا كان لديك نطاق خاص:

1. في لوحة تحكم Cloudflare، اختر "Add a site"
2. أدخل نطاقك (مثلاً: `yourdomain.com`)
3. اتبع الخطوات لتحديث سجلات DNS
4. انتظر حتى يتم تفعيل النطاق (قد يستغرق 24 ساعة)

### إذا كنت تريد نطاق مجاني:

1. في لوحة تحكم Cloudflare، اختر "Zero Trust"
2. انتقل إلى "Networks" ثم "Tunnels"
3. يمكنك استخدام النطاق المجاني من Cloudflare عند إنشاء النفق

## الخطوة 3: تثبيت cloudflared

```bash
# على Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# على macOS
brew install cloudflared

# على Windows
# حمل من: https://github.com/cloudflare/cloudflared/releases
```

## الخطوة 4: تسجيل الدخول والمصادقة

```bash
# تسجيل الدخول
cloudflared tunnel login

# سيفتح المتصفح تلقائياً
# اختر النطاق الذي تريد استخدامه
# ثم يمنحك رمز المصادقة
```

## الخطوة 5: إنشاء النفق

```bash
# إنشاء نفق جديد
cloudflared tunnel create pige-tunnel

# سيظهر لك معلومات النفق:
# - Tunnel ID
# - Account Tag
# احفظ هذه المعلومات
```

## الخطوة 6: إعداد تكوين النفق

### الخيار 1: استخدام Docker Compose (موصى به)

أنشئ ملف `config.yml`:

```yaml
ingress:
  - hostname: yourdomain.com
    service: http://frontend:80
  - hostname: api.yourdomain.com
    service: http://backend:3000
  - service: http_status:404
```

أضف خدمة cloudflared إلى `docker-compose.yml`:

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=your_tunnel_token_here
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
```

### الخيار 2: التشغيل المباشر

```bash
# تشغيل النفق
cloudflared tunnel --config config.yml run pige-tunnel
```

## الخطوة 7: إعداد DNS

من لوحة تحكم Cloudflare:

1. انتقل إلى `Zero Trust` > `Networks` > `Tunnels`
2. اختر النفق الذي أنشأته
3. انقر على `Configure`
4. أضف Public Hostnames:
   - Domain: `yourdomain.com`
   - Service: `http://localhost:80` (للواجهة الأمامية)
   - يمكنك إضافة نطاق فرعي للـ API: `api.yourdomain.com` -> `http://localhost:3000`

## الخطوة 8: تشغيل المشروع

```bash
# تأكد من تشغيل Docker Compose
docker-compose up -d

# أو مع Cloudflare Tunnel
docker-compose -f docker-compose.cloudflare.yml up -d
```

## الخطوة 9: الاختبار

افتح المتصفح واذهب إلى:
- `https://yourdomain.com` للواجهة الأمامية
- `https://api.yourdomain.com` للـ API

## إعداد بدون نطاق خاص

إذا لم يكن لديك نطاق خاص، يمكنك استخدام نطاق Cloudflare المجاني:

```bash
# بعد تسجيل الدخول
cloudflared tunnel create pige-tunnel

# سيحصل على رابط مثل:
# https://pige-tunnel.your-account.cloudflareaccess.com
```

## تكوين متقدم

### حماية بواسطة Access (اختياري)

يمكنك إضافة طبقة حماية للوصول:

1. من لوحة تحكم Cloudflare، انتقل إلى `Zero Trust` > `Access` > `Applications`
2. أضف تطبيق جديد
3. اربطه بنطاقك
4. أضف قواعد الوصول (مثلاً: البريد الإلكتروني المحدد فقط)

### تقييد الجغرافيا

1. من لوحة تحكم Cloudflare، انتقل إلى `Zero Trust` > `Access` > `Applications`
2. اختر تطبيقك
3. أضف قاعدة جغرافية

## المراقبة

من لوحة تحكم Cloudflare، يمكنك:
- مشاهدة عدد الزوار
- مراقبة حركة المرور
- عرض السجلات
- تحليل الأمان

## استكشاف الأخطاء

### النفق لا يعمل

```bash
# التحقق من حالة النفق
cloudflared tunnel info pige-tunnel

# عرض السجلات
cloudflared tunnel --config config.yml run pige-tunnel --loglevel debug
```

### مشاكل في الاتصال

- تأكد من تشغيل Docker Compose
- تحقق من أن النفق يعمل
- تأكد من تكوين DNS الصحيح

### الشهادات

Cloudflare يوفر شهادات SSL تلقائياً، لا حاجة لتكوين يدوي.

## المزايا

- **مجاني بالكامل** - لا توجد تكاليف للاستخدام الأساسي
- **آمن** - تشفير تلقائي وحماية من DDoS
- **سهل** - لا حاجة لفتح منافذ أو إعداد NAT
- **ثابت** - رابط ثابت (إذا كان لديك نطاق)
- **مرن** - يمكن إخفاء الـ API أو حمايته

## ملاحظات

- يجب أن يكون جهازك متصلاً بالإنترنت دائماً
- سرعة الاتصال تعتمد على اتصال الإنترنت المحلي
- مناسب للمشاريع الصغيرة والمتوسطة
- يمكن دمجه مع استضافة خارجية إذا لزم الأمر

## المراجع

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [cloudflared GitHub](https://github.com/cloudflare/cloudflared)
