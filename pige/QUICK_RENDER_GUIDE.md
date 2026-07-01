# دليل سريع لـ Render - ابدأ الآن

## الخطوة 1: إنشاء قاعدة البيانات (1 دقيقة)

1. في Render، اضغط **"New +"** > **"PostgreSQL"**
2. الاسم: `pig-db`
3. الـ Database: `pig`
4. Region: اختر الأقرب (مثلاً: Oregon)
5. Plan: **Free**
6. اضغط **"Create Database"**
7. **انسخ الـ Internal Database URL** من قسم Connections

## الخطوة 2: إنشاء Web Service (2 دقيقة)

1. اضغط **"New +"** > **"Web Service"**
2. اربط مستودع `pig` من GitHub
3. الإعدادات:
   - Name: `pig-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm run start`

## الخطوة 3: إضافة متغيرات البيئة (3 دقائق)

في قسم Environment Variables، أضف هذه القيم:

```
NODE_ENV = production
PORT = 3000
DATABASE_URL = <الرابط الذي نسخته من الخطوة 1>
JWT_SECRET = pig-secret-key-2024-change-this
FRONTEND_URL = https://eilut.github.io/pig/
DB_NAME = pig
DB_USER = pig_user
DB_PASSWORD = <كلمة المرور من DATABASE_URL>
DB_HOST = <العنوان من DATABASE_URL>
DB_PORT = 5432
```

## الخطوة 4: إنشاء الخدمة

1. اضغط **"Create Web Service"**
2. انتظر 5-10 دقائق حتى يكتمل النشر
3. عندما تصبح الحالة **"Live"**، انسخ الرابط:
   - `https://pig-backend.onrender.com`

## الخطوة 5: تحديث Frontend

في مشروعك المحلي، نفذ:

```bash
echo "VITE_API_BASE_URL=https://pig-backend.onrender.com" > frontend/.env
git add frontend/.env
git commit -m "Update API URL for Render"
git push
```

## الخطوة 6: تفعيل GitHub Pages

1. اذهب إلى: [github.com/eilut/pig/settings/pages](https://github.com/eilut/pig/settings/pages)
2. Source: اختر **"GitHub Actions"**
3. احفظ التغييرات

## النتيجة النهائية

- **Frontend**: `https://eilut.github.io/pig/`
- **Backend**: `https://pig-backend.onrender.com`
- **Health Check**: `https://pig-backend.onrender.com/health`

## إذا واجهت مشاكل

- تحقق من Logs في Render
- تأكد من DATABASE_URL صحيح
- تحقق من JWT_SECRET ليس فارغاً

---

**الملفات الجاهزة للنسخ:**
- متغيرات البيئة: `RENDER_ENV_VARS.txt`
- الدليل المفصل: `RENDER_SETUP.md`
