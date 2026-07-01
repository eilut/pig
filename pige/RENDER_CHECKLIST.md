# قائمة تحقق لـ Render - ماذا تفعل بالضبط

## أنت الآن في Render.com بعد تسجيل الدخول

### ✅ الخطوة 1: إنشاء قاعدة البيانات
1. اضغط على زر **"New +"** في أعلى اليسار
2. اختر **"PostgreSQL"**
3. املأ:
   - Name: `pig-db`
   - Database: `pig`
   - Region: Oregon (أو الأقرب لموقعك)
   - Plan: Free
4. اضغط **"Create Database"**
5. انتظر حتى تكتمل (دقيقة واحدة)
6. **مهم جداً**: انسخ الـ Internal Database URL من قسم Connections
   - سيبدو مثل: `postgres://pig_user:xxx@xxx.compute-1.amazonaws.com:5432/pig`

### ✅ الخطوة 2: إنشاء Web Service
1. اضغط على زر **"New +"** في أعلى اليسار
2. اختر **"Web Service"**
3. ابحث عن مستودع `pig` واضغط **"Connect"**
4. املأ الإعدادات:
   - Name: `pig-backend`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm run start`
5. انزل لأسفل لمتغيرات البيئة

### ✅ الخطوة 3: إضافة متغيرات البيئة
أضف هذه المتغيرات واحداً تلو الآخر:

1. **NODE_ENV** = `production`
2. **PORT** = `3000`
3. **DATABASE_URL** = الصق الرابط الذي نسخته من الخطوة 1
4. **JWT_SECRET** = `pig-secret-key-2024-change-this` (أو أي سلسلة طويلة)
5. **FRONTEND_URL** = `https://eilut.github.io/pig/`
6. **DB_NAME** = `pig`
7. **DB_USER** = `pig_user`
8. **DB_PASSWORD** = كلمة المرور من DATABASE_URL (ما بين : و @)
9. **DB_HOST** = العنوان من DATABASE_URL (ما بين @ و :5432)
10. **DB_PORT** = `5432`

### ✅ الخطوة 4: إنشاء الخدمة
1. اضغط **"Create Web Service"**
2. انتظر حتى يكتمل البناء والنشر (5-10 دقائق)
3. راقب الحالة:
   - Build in progress → Deploying → Live
4. عندما تصبح **"Live"**، انسخ الرابط من أعلى الصفحة
   - سيكون مثل: `https://pig-backend.onrender.com`

### ✅ الخطوة 5: تحديث المشروع المحلي
عد إلى المشروع المحلي ونفذ:

```bash
echo "VITE_API_BASE_URL=https://pig-backend.onrender.com" > frontend/.env
git add frontend/.env
git commit -m "Update API URL for Render"
git push
```

### ✅ الخطوة 6: تفعيل GitHub Pages
1. اذهب إلى: [github.com/eilut/pig/settings/pages](https://github.com/eilut/pig/settings/pages)
2. في قسم "Build and deployment":
   - Source: اختر **"GitHub Actions"**
3. احفظ التغييرات

---

## النتيجة النهائية

بعد إكمال كل الخطوات:

- **Frontend**: `https://eilut.github.io/pig/`
- **Backend**: `https://pig-backend.onrender.com`
- **Health Check**: `https://pig-backend.onrender.com/health`

---

## ملاحظات مهمة

- **DATABASE_URL**: تأكد من نسخه كاملاً من قاعدة البيانات
- **JWT_SECRET**: استخدم سلسلة طويلة وآمنة
- **FRONTEND_URL**: يجب أن يطابق رابط GitHub Pages بالضبط
- **Sleep Mode**: الخدمة قد تنام بعد 15 دقيقة، هذا طبيعي في الخطة المجانية

---

## إذا واجهت مشاكل

### Build فشل:
- تحقق من Logs في Render
- تأكد من package.json صحيح

### Database connection failed:
- تحقق من DATABASE_URL
- تأكد أن قاعدة البيانات تعمل

### CORS errors:
- تأكد من FRONTEND_URL صحيح
- تحقق من إعدادات CORS في Backend

---

## الخطوات التالية بعد النجاح

1. اختبر الـ Backend: افتح `https://pig-backend.onrender.com/health`
2. اختبر الـ Frontend: افتح `https://eilut.github.io/pig/`
3. إعداد UptimeRobot لمنع النوم (اختياري)

---

**الملفات المساعدة:**
- `QUICK_RENDER_GUIDE.md` - دليل سريع
- `RENDER_SETUP.md` - دليل مفصل
- `RENDER_ENV_VARS.txt` - متغيرات البيئة جاهزة للنسخ
