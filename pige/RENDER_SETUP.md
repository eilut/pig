# دليل إعداد Render - خطوة بخطوة

هذا الدليل سيساعدك في نشر Backend على Render بالخطوات التفصيلية.

## المتطلبات
- حساب GitHub (لديك بالفعل)
- حساب Render (مجاني)

---

## الخطوة 1: إنشاء حساب Render

1. اذهب إلى [render.com](https://render.com)
2. اضغط "Sign Up"
3. اختر "Sign up with GitHub"
4. سجل الدخول بحساب GitHub الخاص بك (`eilut`)
5. إذا طلب، وافق على منح Render الصلاحيات

---

## الخطوة 2: إنشاء قاعدة البيانات (أولاً)

### إنشاء PostgreSQL Database

1. بعد تسجيل الدخول، اضغط **"New +"** في اليسار العلوي
2. اختر **"PostgreSQL"**
3. املأ النموذج:
   - **Name**: `pig-db`
   - **Database**: `pig`
   - **User**: `pig_user` (سيتم توليده تلقائياً)
   - **Region**: اختر الأقرب لموقعك (مثلاً: Oregon)
   - **Plan**: اختر **Free** (Free PostgreSQL)
4. اضغط **"Create Database"**

### الحصول على بيانات الاتصال

بعد إنشاء قاعدة البيانات:

1. انتظر حتى يكتمل الإنشاء (يستغرق دقيقة)
2. في صفحة قاعدة البيانات، انزل إلى قسم **"Connections"**
3. انسخ الـ **Internal Database URL** (سيبدو مثل: `postgres://pig_user:xxx@xxx.compute-1.amazonaws.com:5432/pig`)
4. احفظ هذا الرابط في مكان آمن

---

## الخطوة 3: إنشاء Web Service للـ Backend

### إنشاء الخدمة

1. اضغط **"New +"** في اليسار العلوي
2. اختر **"Web Service"**
3. سيظهر لك قائمة المستودعات من GitHub
4. ابحث عن **`pig`** واضغط **"Connect"**

### إعدادات الخدمة

في صفحة إعدادات Web Service:

#### معلومات أساسية:
- **Name**: `pig-backend`
- **Region**: نفس المنطقة التي اخترتها لقاعدة البيانات
- **Branch**: `main`

#### إعدادات البناء:
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run start`

#### متغيرات البيئة (Environment Variables):

انزل إلى قسم **"Environment"** وأضف المتغيرات التالية:

1. **NODE_ENV**:
   - Key: `NODE_ENV`
   - Value: `production`

2. **PORT**:
   - Key: `PORT`
   - Value: `3000`

3. **DATABASE_URL**:
   - Key: `DATABASE_URL`
   - Value: الصق الـ Internal Database URL من الخطوة 2
   - (مثال: `postgres://pig_user:xxx@xxx.compute-1.amazonaws.com:5432/pig`)

4. **JWT_SECRET**:
   - Key: `JWT_SECRET`
   - Value: أنشئ سلسلة عشوائية طويلة وآمنة
   - يمكنك استخدام: `openssl rand -base64 32` لإنشاء واحدة
   - أو استخدم هذا المثال: `your-super-secret-jwt-key-change-this-in-production-12345`

5. **FRONTEND_URL**:
   - Key: `FRONTEND_URL`
   - Value: `https://eilut.github.io/pig/`

6. **DB_NAME**:
   - Key: `DB_NAME`
   - Value: `pig`

7. **DB_USER**:
   - Key: `DB_USER`
   - Value: `pig_user`

8. **DB_PASSWORD**:
   - Key: `DB_PASSWORD`
   - Value: (كلمة المرور من قاعدة البيانات، جزء من DATABASE_URL)

9. **DB_HOST**:
   - Key: `DB_HOST`
   - Value: (العنوان من DATABASE_URL، بعد @ وقبل :5432)

10. **DB_PORT**:
    - Key: `DB_PORT`
    - Value: `5432`

### إضافة ملف .env

في قسم **"Advanced"**:

1. اضغط **"Add File"**
2. اسم الملف: `.env`
3. المحتوى (انسخ هذا):

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<your_database_url_here>
JWT_SECRET=<your_jwt_secret_here>
FRONTEND_URL=https://eilut.github.io/pig/
DB_NAME=pig
DB_USER=pig_user
DB_PASSWORD=<your_db_password>
DB_HOST=<your_db_host>
DB_PORT=5432
```

### إنشاء الخدمة

1. تأكد من ملء جميع الحقول المطلوبة
2. اضغط **"Create Web Service"**
3. انتظر حتى يكتمل البناء والنشر (قد يستغرق 5-10 دقائق)

---

## الخطوة 4: مراقبة النشر

### التحقق من الحالة

1. في صفحة Web Service، راقب الحالة:
   - **Build in progress** - جاري البناء
   - **Deploying** - جاري النشر
   - **Live** - ✅ نجح النشر

### عرض السجلات

1. اضغط على **"Logs"** في اليسار
2. إذا كان هناك أخطاء، ستظهر هنا
3. البحث عن "Server running on port 3000" يعني النجاح

### الحصول على رابط الـ API

عندما تصبح الحالة **"Live"**:

1. في أعلى الصفحة، ستجد رابط مثل:
   - `https://pig-backend.onrender.com`
2. هذا هو رابط Backend الخاص بك
3. انسخ هذا الرابط

---

## الخطوة 5: تحديث Frontend

### تعديل متغيرات البيئة

في مشروعك المحلي:

1. افتح `frontend/.env`
2. أو أنشئه إذا لم يكن موجوداً
3. أضف:

```env
VITE_API_BASE_URL=https://pig-backend.onrender.com
```

### رفع التحديث

```bash
git add frontend/.env
git commit -m "Update API URL for Render deployment"
git push
```

### التحقق من GitHub Pages

بعد الـ push:

1. اذهب إلى [github.com/eilut/pig/actions](https://github.com/eilut/pig/actions)
2. سترى workflow جديد يعمل
3. انتظر حتى يكتمل
4. بعد النجاح، اذهب إلى [github.com/eilut/pig/settings/pages](https://github.com/eilut/pig/settings/pages)
5. ستجد رابط Frontend: `https://eilut.github.io/pig/`

---

## الخطوة 6: اختبار التطبيق

### اختبار Backend

افتح المتصفح واذهب إلى:
- `https://pig-backend.onrender.com/health`

يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### اختبار Frontend

افتح المتصفح واذهب إلى:
- `https://eilut.github.io/pig/`

يجب أن يظهر موقع التسجيل.

---

## استكشاف الأخطاء

### المشكلة: Build فشل

**الحل:**
1. اذهب إلى Logs في Render
2. ابحث عن رسالة الخطأ
3. المشاكل الشائعة:
   - أخطاء في package.json
   - مشاكل في dependencies
   - أخطاء في البناء

### المشكلة: Database connection failed

**الحل:**
1. تحقق من DATABASE_URL
2. تأكد من أن قاعدة البيانات تعمل
3. تحقق من متغيرات البيئة

### المشكلة: CORS errors

**الحل:**
1. تأكد من إضافة FRONTEND_URL في متغيرات البيئة
2. تحقق من إعدادات CORS في Backend

### المشكلة: Service sleeping

**الحل:**
1. هذا طبيعي في الخطة المجانية
2. استخدم UptimeRobot لإبقائها مستيقظة
3. أو اترق للخطة المدفوعة

---

## الحفاظ على الخدمة نشطة

### إعداد UptimeRobot (مجاني)

1. سجل في [uptimerobot.com](https://uptimerobot.com)
2. اضغط "Add New Monitor"
3. الإعدادات:
   - **Monitor Type**: HTTPS
   - **URL**: `https://pig-backend.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
4. اضغط "Create Monitor"

هذا سيمنع الخدمة من النوم.

---

## التكلفة

- **Render Web Service**: مجاني (مع قيود)
- **Render PostgreSQL**: مجاني (90 يوم، ثم $7/شهر)
- **UptimeRobot**: مجاني
- **GitHub Pages**: مجاني
- **المجموع**: $0 للـ 90 يوم الأول

---

## ملخص الروابط النهائية

بعد نجاح كل شيء:

- **Frontend**: `https://eilut.github.io/pig/`
- **Backend API**: `https://pig-backend.onrender.com`
- **Health Check**: `https://pig-backend.onrender.com/health`
- **Render Dashboard**: [render.com/dashboard](https://render.com/dashboard)
- **GitHub Repo**: [github.com/eilut/pig](https://github.com/eilut/pig)

---

## الدعم

إذا واجهت مشاكل:
1. تحقق من Logs في Render
2. تحقق من GitHub Actions logs
3. راجع هذا الدليل
4. تأكد من متغيرات البيئة صحيحة

---

## الخطوات السريعة للنسخ واللصق

### متغيرات البيئة للنسخ:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<paste_your_database_url_here>
JWT_SECRET=<paste_your_jwt_secret_here>
FRONTEND_URL=https://eilut.github.io/pig/
DB_NAME=pig
DB_USER=pig_user
DB_PASSWORD=<paste_your_db_password>
DB_HOST=<paste_your_db_host>
DB_PORT=5432
```

### تحديث Frontend:

```bash
echo "VITE_API_BASE_URL=https://pig-backend.onrender.com" > frontend/.env
git add frontend/.env
git commit -m "Update API URL"
git push
```

---

هل تحتاج مساعدة في أي خطوة محددة؟
