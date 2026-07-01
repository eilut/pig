# نشر المشروع على GitHub Pages + خدمة مجانية

هذا الدليل يشرح كيفية نشر Frontend على GitHub Pages و Backend على خدمة مجانية (Render أو Railway).

## الخطة

- **Frontend**: GitHub Pages (مجاني بالكامل)
- **Backend**: Render أو Railway (خطة مجانية متاحة)
- **Database**: قاعدة بيانات مجانية من نفس الخدمة

## الخطوة 1: إعداد المشروع على GitHub

### إنشاء المستودع

```bash
# إذا لم يكن لديك مستودع
git init
git add .
git commit -m "Initial commit"

# إنشاء مستودع جديد على GitHub
# ثم ربطه
git remote add origin https://github.com/your-username/pige.git
git branch -M main
git push -u origin main
```

## الخطوة 2: إعداد Frontend لـ GitHub Pages

### تحديث vite.config.js

GitHub Pages يتطلب تحديث تكوين Vite للعمل مع مسارات الفرع:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pige/', // استبدل pige باسم المستودع الخاص بك
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

### بناء المشروع

```bash
cd frontend
npm run build
```

### إنشاء مجلد للنشر

```bash
# في مجلد المشروع الرئيسي
mkdir -p docs
cp -r frontend/dist/* docs/
```

### إضافة workflow لـ GitHub Actions

أنشئ ملف `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build
        run: cd frontend && npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### تفعيل GitHub Pages

1. اذهب إلى مستودع GitHub
2. Settings > Pages
3. Source: GitHub Actions
4. احفظ التغييرات

## الخطوة 3: نشر Backend على Render (مجاني)

### إنشاء حساب Render

1. سجل في [render.com](https://render.com)
2. استخدم حساب GitHub للربط

### إعداد Web Service

1. اضغط "New +" > "Web Service"
2. اربط مستودع GitHub الخاص بك
3. الإعدادات:
   - **Name**: pige-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `3000`
     - `DB_HOST`: (سيتم إنشاؤه تلقائياً مع قاعدة البيانات)
     - `DB_PORT`: `3306`
     - `DB_USER`: (من قاعدة البيانات)
     - `DB_PASSWORD`: (من قاعدة البيانات)
     - `DB_NAME`: `pige`
     - `JWT_SECRET`: (أنشئ سلسلة عشوائية قوية)

### إنشاء قاعدة بيانات PostgreSQL (مجاني)

1. اضغط "New +" > "PostgreSQL"
2. الإعدادات:
   - **Name**: pige-db
   - **Database**: `pige`
   - **User**: (سيتم إنشاؤه تلقائياً)
3. بعد الإنشاء، انسخ:
   - Database URL
   - Database Name
   - User
   - Password

### تحديث Backend لاستخدام PostgreSQL

بما أن Render يوفر PostgreSQL مجاناً، يفضل تحويل المشروع من MySQL إلى PostgreSQL:

```bash
cd backend
npm install pg
```

أضف ملف `src/db.js` جديد:

```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default pool;
```

### ربط قاعدة البيانات بالـ Backend

1. في Render، اذهب إلى Web Service
2. Settings > Environment Variables
3. أضف `DATABASE_URL` بالقيمة من قاعدة البيانات
4. أضف متغيرات البيانات الأخرى

### الحصول على رابط الـ API

بعد النشر، ستحصل على رابط مثل:
`https://pige-backend.onrender.com`

## الخطوة 4: تحديث Frontend للاتصال بالـ API

### تحديث .env في Frontend

```bash
cd frontend
echo "VITE_API_BASE_URL=https://pige-backend.onrender.com" > .env
```

### تحديث الكود للتعامل مع CORS

في Backend، أضف دعم CORS:

```javascript
import cors from 'cors';
app.use(cors({
  origin: ['https://your-username.github.io', 'http://localhost:5173'],
  credentials: true
}));
```

## الخطوة 5: إعادة نشر Frontend

```bash
git add .
git commit -m "Add GitHub Pages workflow and update API URL"
git push
```

GitHub Actions سينشر تلقائياً Frontend.

## الخطوة 6: الوصول إلى التطبيق

- **Frontend**: `https://your-username.github.io/pige/`
- **Backend API**: `https://pige-backend.onrender.com`

## البديل: Railway بدلاً من Render

### إنشاء حساب Railway

1. سجل في [railway.app](https://railway.app)
2. اربط حساب GitHub

### إعداد المشروع

1. اضغط "New Project" > "Deploy from GitHub repo"
2. اختر مستودعك
3. Railway سيكتشف تلقائياً الخدمات

### إضافة قاعدة بيانات

1. اضغط "+" في المشروع
2. اختر "Database" > "MySQL" (أو PostgreSQL)
3. سيتم إنشاؤها تلقائياً

### الحصول على متغيرات البيئة

1. اذهب إلى قاعدة البيانات
2. انسخ متغيرات الاتصال
3. أضفها إلى خدمة Backend

### الحصول على رابط الـ API

الرابط سيكون مثل:
`https://pige-backend-production.up.railway.app`

## ملاحظات مهمة

### قيود الخطة المجانية

- **Render**: Sleep بعد 15 دقيقة عدم نشاط، يستغرق ~30 ثانية للاستيقاظ
- **Railway**: Sleep بعد 30 دقيقة عدم نشاط
- **GitHub Pages**: غير محدود (static فقط)

### تجنب Sleep

لمنع الخدمة من النوم:
- استخدم خدمات مثل UptimeRobot (مجاني) لإرسال طلبات كل 5 دقائق
- أو استخدم خطة مدفوعة (تبدأ من $7/شهر)

### قواعد البيانات

- **Render PostgreSQL**: مجاني حتى 90 يوم
- **Railway MySQL**: $5/شهر (ليس مجاني)
- الأفضل استخدام PostgreSQL المجاني على Render

## خطوات إضافية

### إضافة Health Check

في Backend، أضف endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### إعداد Auto-refresh

استخدم خدمة مثل UptimeRobot:
1. سجل في [uptimerobot.com](https://uptimerobot.com)
2. أضف Monitor
3. URL: `https://pige-backend.onrender.com/health`
4. Interval: 5 minutes

## الاستكشاف

### المشاكل الشائعة

1. **CORS Errors**: تأكد من إضافة رابط GitHub Pages في CORS
2. **Database Connection**: تحقق من متغيرات البيئة
3. **Build Failures**: تحقق من سجلات GitHub Actions
4. **Sleeping Service**: استخدم UptimeRobot

### السجلات

- **GitHub Pages**: Actions tab في GitHub
- **Render**: Logs tab في خدمة Web Service
- **Railway**: Logs tab في كل خدمة

## التكلفة

- **GitHub Pages**: مجاني
- **Render Web Service**: مجاني (مع قيود)
- **Render PostgreSQL**: مجاني (90 يوم)
- **Railway**: $5/شهر لقاعدة البيانات

## المراجع

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
