# كيفية استخراج DB_PASSWORD و DB_HOST من DATABASE_URL

## ما هو DATABASE_URL؟

DATABASE_URL هو رابط الاتصال بقاعدة البيانات الذي ستحصل عليه من Render بعد إنشاء قاعدة البيانات PostgreSQL.

## تنسيق DATABASE_URL:

```
postgres://username:password@host:port/database
```

## مثال حقيقي:

إذا كان DATABASE_URL الخاص بك هو:
```
postgres://pig_user:AbCdEf123456@pig-db.compute-1.amazonaws.com:5432/pig
```

## كيفية استخراج القيم:

### 1. DB_PASSWORD (كلمة المرور)
كل ما بين `:` و `@` بعد اسم المستخدم:
- في المثال: `AbCdEf123456`

### 2. DB_HOST (العنوان)
كل ما بين `@` و `:5432`:
- في المثال: `pig-db.compute-1.amazonaws.com`

### 3. DB_USER (اسم المستخدم)
كل ما بين `://` و `:`:
- في المثال: `pig_user`

### 4. DB_PORT (المنفذ)
الرقم بعد `:` قبل `/`:
- في المثال: `5432`

### 5. DB_NAME (اسم قاعدة البيانات)
كل ما بعد آخر `/`:
- في المثال: `pig`

## مثال عملي:

### DATABASE_URL من Render:
```
postgres://pig_user:xK9mP2vN4qR7@pig-db-postgres.compute-1.amazonaws.com:5432/pig
```

### القيم المستخرجة:
- **DB_USER**: `pig_user`
- **DB_PASSWORD**: `xK9mP2vN4qR7`
- **DB_HOST**: `pig-db-postgres.compute-1.amazonaws.com`
- **DB_PORT**: `5432`
- **DB_NAME**: `pig`

## خطوات للحصول على DATABASE_URL:

1. في Render Dashboard، اذهب إلى قاعدة البيانات PostgreSQL
2. انزل إلى قسم **"Connections"**
3. انسخ **"Internal Database URL"**
4. هذا هو DATABASE_URL الخاص بك

## طريقة سريعة للاستخراج:

يمكنك استخدام هذه الطريقة:

1. انسخ DATABASE_URL
2. الصقه في متصفح أو محرر نصوص
3. استخدم هذا المخطط:

```
postgres://[DB_USER]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]
```

4. قارن ونسخ القيم المناسبة

## مثال تحديثي لملف render.env:

بعد الحصول على DATABASE_URL من Render، عدّل الملف كالتالي:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://pig_user:xK9mP2vN4qR7@pig-db-postgres.compute-1.amazonaws.com:5432/pig
JWT_SECRET=pig-super-secret-jwt-key-2024
FRONTEND_URL=https://eilut.github.io/pig/
DB_NAME=pig
DB_USER=pig_user
DB_PASSWORD=xK9mP2vN4qR7
DB_HOST=pig-db-postgres.compute-1.amazonaws.com
DB_PORT=5432
```

## ملاحظة مهمة:

DATABASE_URL يحتوي على كل المعلومات التي تحتاجها، لذا:
- استخرج DB_PASSWORD و DB_HOST منه
- أو يمكنك استخدام DATABASE_URL مباشرة إذا كان Backend يدعمه
- في حالتنا، نحتاج القيم المنفصلة لأن الكود يستخدمها بشكل منفصل

---

## الأسئلة الشائعة:

### س: أين أجد DATABASE_URL؟
ج: في Render Dashboard → قاعدة البيانات → قسم Connections → Internal Database URL

### س: هل يمكنني استخدام DATABASE_URL مباشرة؟
ج: نعم، إذا عدّلت الكود لاستخدامه. لكن حالياً الكود يستخدم القيم المنفصلة.

### س: ماذا إذا نسيت DATABASE_URL؟
ج: يمكنك دائماً العودة إلى Render Dashboard ونسخه مرة أخرى.

### س: هل يجب علي حفظ DATABASE_URL؟
ج: نهم، احفظه في مكان آمن، لكن Render يحتفظ به دائماً في Dashboard.
